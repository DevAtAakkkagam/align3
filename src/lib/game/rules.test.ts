import { describe, expect, it } from 'vitest';
import { adjacent, mills, neighbors } from './board';
import { legalTargets, move, newGame, place } from './rules';
import type { GameState, PointIndex } from './types';

/** Apply a sequence of placements, asserting each is legal. */
function placeAll(state: GameState, points: PointIndex[]): GameState {
  for (const p of points) {
    const next = place(state, p);
    expect(next, `placing at ${p}`).not.toBeNull();
    state = next!;
  }
  return state;
}

describe('board graph', () => {
  it('ring points connect to two neighbours and center', () => {
    expect(neighbors(0).sort()).toEqual([1, 7, 8]);
    expect(neighbors(5).sort()).toEqual([4, 6, 8]);
  });

  it('center connects to all ring points', () => {
    expect(neighbors(8)).toHaveLength(8);
  });

  it('opposite ring points are not adjacent', () => {
    expect(adjacent(0, 4)).toBe(false);
    expect(adjacent(1, 3)).toBe(false);
  });

  it('roman variant has 12 mills: 4 diameters + 8 rim arcs', () => {
    const m = mills('roman');
    expect(m).toHaveLength(12);
    expect(m.filter((line) => line.includes(8))).toHaveLength(4);
  });

  it('tamil variant has 8 mills', () => {
    expect(mills('tamil')).toHaveLength(8);
  });
});

describe('placement phase', () => {
  it('alternates turns and fills points', () => {
    let s = newGame('roman');
    expect(s.turn).toBe(0);
    s = place(s, 0)!;
    expect(s.board[0]).toBe(0);
    expect(s.turn).toBe(1);
  });

  it('rejects occupied points', () => {
    const s = place(newGame('roman'), 0)!;
    expect(place(s, 0)).toBeNull();
  });

  it('enters movement phase after all 6 stones are placed', () => {
    // Avoid any mill in either variant.
    const s = placeAll(newGame('tamil'), [0, 1, 3, 4, 6, 7]);
    expect(s.phase).toBe('movement');
  });

  it('a player can win during placement', () => {
    // P0: 1, 8, 5 (middle column diameter). P1: 0, 2.
    const s = placeAll(newGame('roman'), [1, 0, 8, 2, 5]);
    expect(s.phase).toBe('won');
    expect(s.winner).toBe(0);
    expect(s.winLine!.sort()).toEqual([1, 5, 8]);
  });
});

describe('movement phase', () => {
  function movementStart(variant: 'roman' | 'tamil'): GameState {
    return placeAll(newGame(variant), [0, 1, 3, 4, 6, 7]);
  }

  it('rejects moving from an empty or opponent point', () => {
    const s = movementStart('roman'); // P0's turn again
    expect(move(s, 2, 8)).toBeNull(); // empty source
    expect(move(s, 1, 2)).toBeNull(); // opponent's stone
  });

  it('rejects non-adjacent and occupied destinations', () => {
    const s = movementStart('roman');
    expect(move(s, 0, 4)).toBeNull(); // not adjacent
    expect(move(s, 0, 1)).toBeNull(); // occupied
  });

  it('moves along the graph and alternates turns', () => {
    const s = movementStart('roman');
    const next = move(s, 0, 8)!; // P0 corner to center
    expect(next.board[8]).toBe(0);
    expect(next.board[0]).toBeNull();
    expect(next.turn).toBe(1);
  });

  it('legalTargets lists adjacent empty points for a piece', () => {
    const s = movementStart('roman'); // occupied: 0,1,3,4,6,7
    expect(legalTargets(s, 0).sort()).toEqual([8]);
  });
});

describe('variant win rules', () => {
  it('a corner-edge-corner ring triple wins on both boards', () => {
    // P0 places 0, 1, 2: top row of the square / a rim arc of the wheel.
    for (const variant of ['roman', 'tamil'] as const) {
      const s = placeAll(newGame(variant), [0, 4, 1, 5, 2]);
      expect(s.winner, variant).toBe(0);
      expect(s.winLine!.slice().sort()).toEqual([0, 1, 2]);
    }
  });

  it('an edge-corner-edge triple wins on the roman rim but not the tamil square', () => {
    // P0 places 1, 2, 3: consecutive on the rim, but bent on the square.
    const roman = placeAll(newGame('roman'), [1, 5, 2, 6, 3]);
    expect(roman.winner).toBe(0);
    expect(roman.winLine!.slice().sort()).toEqual([1, 2, 3]);

    const tamil = placeAll(newGame('tamil'), [1, 5, 2, 6, 3]);
    expect(tamil.phase).toBe('placement');
    expect(tamil.winner).toBeNull();
  });

  it('a diameter wins on both boards', () => {
    for (const variant of ['roman', 'tamil'] as const) {
      const s = placeAll(newGame(variant), [0, 1, 8, 2, 4]);
      expect(s.winner, variant).toBe(0);
      expect(s.winLine!.sort()).toEqual([0, 4, 8]);
    }
  });

  it('a mill formed by movement wins', () => {
    // Movement start: P0 on 0,3,6 / P1 on 1,4,7 — no mills (roman needs center).
    let s = placeAll(newGame('roman'), [0, 1, 3, 4, 6, 7]);
    expect(s.phase).toBe('movement');
    // P0: 0 -> 8 gives 8,3? no line. Build toward diameter 3-8-7: P0 has 3 and... 7 is P1's.
    // Diameter 0-8-4: P0 has 0 only. Use 3 and 6? not a line. Take 2 moves.
    s = move(s, 0, 8)!; // P0 center. P0: 8,3,6
    s = move(s, 1, 0)!; // P1 shuffles. P1: 0,4,7
    s = move(s, 3, 2)!; // P0: 8,2,6 — diameter 2-8-6 complete!
    expect(s.phase).toBe('won');
    expect(s.winner).toBe(0);
    expect(s.winLine!.sort()).toEqual([2, 6, 8]);
  });
});
