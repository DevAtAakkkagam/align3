import { adjacent, mills, neighbors, POINTS } from './board';
import type { GameState, Player, PointIndex, Variant } from './types';

export const STONES_PER_PLAYER = 3;

export function newGame(variant: Variant): GameState {
  return {
    variant,
    board: Array(9).fill(null),
    turn: 0,
    phase: 'placement',
    placed: [0, 0],
    winner: null,
    winLine: null,
  };
}

export function findWin(
  board: (Player | null)[],
  variant: Variant,
  player: Player,
): PointIndex[] | null {
  for (const line of mills(variant)) {
    if (line.every((p) => board[p] === player)) return line;
  }
  return null;
}

/** Points where the current player may legally put a stone this turn. */
export function legalTargets(state: GameState, from?: PointIndex): PointIndex[] {
  if (state.phase === 'won') return [];
  if (state.phase === 'placement') {
    return POINTS.filter((p) => state.board[p] === null);
  }
  if (from === undefined || state.board[from] !== state.turn) return [];
  return neighbors(from).filter((p) => state.board[p] === null);
}

/** Placement-phase action. Returns the next state, or null if illegal. */
export function place(state: GameState, point: PointIndex): GameState | null {
  if (state.phase !== 'placement') return null;
  if (state.board[point] !== null) return null;

  const board = state.board.slice();
  board[point] = state.turn;
  const placed: [number, number] = [...state.placed];
  placed[state.turn] += 1;

  return settle({ ...state, board, placed });
}

/** Movement-phase action. Returns the next state, or null if illegal. */
export function move(
  state: GameState,
  from: PointIndex,
  to: PointIndex,
): GameState | null {
  if (state.phase !== 'movement') return null;
  if (state.board[from] !== state.turn) return null;
  if (state.board[to] !== null) return null;
  if (!adjacent(from, to)) return null;

  const board = state.board.slice();
  board[from] = null;
  board[to] = state.turn;

  return settle({ ...state, board });
}

/** Check for a win, then advance turn/phase. */
function settle(state: GameState): GameState {
  const winLine = findWin(state.board, state.variant, state.turn);
  if (winLine) {
    return { ...state, phase: 'won', winner: state.turn, winLine };
  }
  const bothPlaced = state.placed.every((n) => n >= STONES_PER_PLAYER);
  return {
    ...state,
    phase: bothPlaced ? 'movement' : 'placement',
    turn: state.turn === 0 ? 1 : 0,
  };
}
