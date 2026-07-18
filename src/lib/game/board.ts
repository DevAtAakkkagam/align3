import type { PointIndex, Variant } from './types';

export const CENTER: PointIndex = 8;
export const POINTS: PointIndex[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Both boards share the same movement graph: every ring point connects to
 * its two ring neighbours and to the center.
 */
export function adjacent(a: PointIndex, b: PointIndex): boolean {
  if (a === b) return false;
  if (a === CENTER || b === CENTER) return true;
  const d = Math.abs(a - b);
  return d === 1 || d === 7;
}

export function neighbors(p: PointIndex): PointIndex[] {
  if (p === CENTER) return [0, 1, 2, 3, 4, 5, 6, 7];
  return [(p + 1) % 8, (p + 7) % 8, CENTER];
}

const DIAMETERS: PointIndex[][] = [
  [0, 8, 4],
  [1, 8, 5],
  [2, 8, 6],
  [3, 8, 7],
];

/**
 * The wheel's rim is a drawn line too: any 3 consecutive rim points align.
 * Kept in ring order so the win line can be traced as an arc.
 */
const RIM_ARCS: PointIndex[][] = Array.from({ length: 8 }, (_, i) => [
  i,
  (i + 1) % 8,
  (i + 2) % 8,
]);

/** Diameters (spokes) plus every rim arc. */
const ROMAN_MILLS: PointIndex[][] = [...DIAMETERS, ...RIM_ARCS];

/**
 * The 8 straight lines of the 3×3 grid: diameters plus the 4
 * corner-edge-corner rows. Edge-corner-edge triples are bent, not lines.
 */
const TAMIL_MILLS: PointIndex[][] = [
  ...DIAMETERS,
  [0, 1, 2],
  [2, 3, 4],
  [4, 5, 6],
  [6, 7, 0],
];

export function mills(variant: Variant): PointIndex[][] {
  return variant === 'roman' ? ROMAN_MILLS : TAMIL_MILLS;
}
