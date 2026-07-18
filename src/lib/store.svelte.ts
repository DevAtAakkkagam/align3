import { legalTargets, move, newGame, place } from './game/rules';
import type { GameState, Player, PointIndex, Variant } from './game/types';

export interface Stone {
  id: number;
  player: Player;
  /** Hand slot 0–2, where the stone rests before placement. */
  slot: number;
  /** Board point once placed, null while in hand. */
  at: PointIndex | null;
}

const VARIANT_KEY = 'align3:variant';

function loadVariant(): Variant {
  try {
    const v = localStorage.getItem(VARIANT_KEY);
    if (v === 'roman' || v === 'tamil') return v;
  } catch {
    // storage unavailable (private mode etc.)
  }
  return 'roman';
}

function freshStones(): Stone[] {
  return Array.from({ length: 6 }, (_, id) => ({
    id,
    player: (id < 3 ? 0 : 1) as Player,
    slot: id % 3,
    at: null,
  }));
}

class Game {
  variant = $state<Variant>(loadVariant());
  state = $state<GameState>(newGame(this.variant));
  stones = $state<Stone[]>(freshStones());
  /** Stone selected via tap (tap-tap fallback). */
  selected = $state<number | null>(null);
  /** Stone currently being dragged. */
  dragging = $state<number | null>(null);

  get turn(): Player {
    return this.state.turn;
  }

  /** The stone id highlighting legal targets right now, if any. */
  get activeStone(): number | null {
    return this.dragging ?? this.selected;
  }

  /** Points that should glow for the active (dragged/selected) stone. */
  targets = $derived.by((): PointIndex[] => {
    const id = this.activeStone;
    if (id === null) return [];
    const stone = this.stones[id];
    if (stone.player !== this.state.turn) return [];
    if (this.state.phase === 'placement') {
      return stone.at === null ? legalTargets(this.state) : [];
    }
    if (this.state.phase === 'movement' && stone.at !== null) {
      return legalTargets(this.state, stone.at);
    }
    return [];
  });

  /** Can this stone be picked up by the current player right now? */
  canGrab(id: number): boolean {
    const stone = this.stones[id];
    if (this.state.phase === 'won' || stone.player !== this.state.turn) return false;
    if (this.state.phase === 'placement') return stone.at === null;
    return stone.at !== null && legalTargets(this.state, stone.at).length > 0;
  }

  /** Drop a stone on a point. Returns false when illegal (caller bounces back). */
  drop(id: number, point: PointIndex): boolean {
    const stone = this.stones[id];
    let next: GameState | null = null;
    if (this.state.phase === 'placement' && stone.at === null) {
      next = place(this.state, point);
    } else if (this.state.phase === 'movement' && stone.at !== null) {
      next = move(this.state, stone.at, point);
    }
    if (!next || stone.player !== this.state.turn) return false;
    this.state = next;
    stone.at = point;
    this.selected = null;
    return true;
  }

  /** Tap-tap fallback: tap a point with a stone selected (or during placement). */
  tapPoint(point: PointIndex): void {
    if (this.state.phase === 'placement') {
      const id =
        this.activeStone ??
        this.stones.find((s) => s.player === this.state.turn && s.at === null)?.id;
      if (id !== undefined && id !== null) this.drop(id, point);
      return;
    }
    if (this.selected !== null) this.drop(this.selected, point);
  }

  toggleSelect(id: number): void {
    this.selected = this.selected === id ? null : this.canGrab(id) ? id : null;
  }

  reset(): void {
    this.state = newGame(this.variant);
    this.stones = freshStones();
    this.selected = null;
    this.dragging = null;
  }

  setVariant(v: Variant): void {
    if (v === this.variant) return;
    this.variant = v;
    try {
      localStorage.setItem(VARIANT_KEY, v);
    } catch {
      // storage unavailable
    }
    this.reset();
  }

  /** A round is underway (worth confirming before discarding). */
  get inProgress(): boolean {
    return this.state.phase !== 'won' && this.state.placed.some((n) => n > 0);
  }
}

export const game = new Game();
