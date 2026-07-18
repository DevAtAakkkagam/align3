import type { Player, PointIndex, Variant } from './game/types';
import { POINTS } from './game/board';

/** Portrait stage. Board in the middle, stone hands near each player's edge. */
export const VIEW = { w: 100, h: 150, cx: 50, cy: 75 } as const;

/** Circle ring radius / square half-extent. */
export const RING_R = 30;
const SQUARE_H = 27;

/** Ring index → 3×3 grid column/row offsets (square layout). */
const GRID: [number, number][] = [
  [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0],
];

export interface Pos {
  x: number;
  y: number;
}

export function pointPos(i: PointIndex, variant: Variant): Pos {
  if (i === 8) return { x: VIEW.cx, y: VIEW.cy };
  if (variant === 'tamil') {
    const [c, r] = GRID[i];
    return { x: VIEW.cx + c * SQUARE_H, y: VIEW.cy + r * SQUARE_H };
  }
  // Circle: index 1 (top-mid equivalent) sits at the top; 45° per step.
  const angle = ((-135 + i * 45) * Math.PI) / 180;
  return {
    x: VIEW.cx + RING_R * Math.cos(angle),
    y: VIEW.cy + RING_R * Math.sin(angle),
  };
}

/** Unplaced stones rest in the owner's hand strip, facing that player. */
export function handPos(player: Player, slot: number): Pos {
  const dx = (slot - 1) * 16;
  return player === 0
    ? { x: VIEW.cx + dx, y: 139 }
    : { x: VIEW.cx - dx, y: 11 };
}

export function nearestPoint(
  x: number,
  y: number,
  variant: Variant,
  maxDist: number,
): PointIndex | null {
  let best: PointIndex | null = null;
  let bestD = maxDist * maxDist;
  for (const p of POINTS) {
    const pos = pointPos(p, variant);
    const d = (pos.x - x) ** 2 + (pos.y - y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = p;
    }
  }
  return best;
}
