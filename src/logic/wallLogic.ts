import { Position, Wall } from '../types/game';

/**
 * Checks if a wall exists between two adjacent cells.
 */
export const hasWallBetween = (from: Position, to: Position, walls: Wall[]): boolean => {
  return walls.some(
    w =>
      (w.from.x === from.x && w.from.y === from.y && w.to.x === to.x && w.to.y === to.y) ||
      (w.from.x === to.x && w.from.y === to.y && w.to.x === from.x && w.to.y === from.y)
  );
};
