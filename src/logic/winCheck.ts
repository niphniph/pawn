import { Position } from '../types/game';

/**
 * Checks if the cyan player has reached the bottom target row.
 */
export const checkPlayerWin = (cyan: Position, gridSize: number): boolean => {
  return cyan.y === gridSize - 1;
};

/**
 * Checks if the pink computer opponent has reached the top target row.
 */
export const checkComputerWin = (pink: Position): boolean => {
  return pink.y === 0;
};
