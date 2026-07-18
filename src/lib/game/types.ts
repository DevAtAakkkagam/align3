export type Player = 0 | 1;

/** Board variant. Not just a skin: the two ancient games win differently. */
export type Variant = 'roman' | 'tamil';

export type Phase = 'placement' | 'movement' | 'won';

/**
 * Point indices: 0–7 walk the outer ring clockwise starting at the
 * top-left corner position (square layout), 8 is the center.
 */
export type PointIndex = number;

export interface GameState {
  variant: Variant;
  /** Occupancy of the 9 points; null = empty. */
  board: (Player | null)[];
  turn: Player;
  phase: Phase;
  /** Stones placed so far, per player. */
  placed: [number, number];
  winner: Player | null;
  /** The mill that won, as 3 point indices. */
  winLine: PointIndex[] | null;
}
