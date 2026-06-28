import { Position, Wall } from '../types/game';
import { hasWallBetween } from './wallLogic';

/**
 * Finds all valid adjacent moves from a position, checking boundaries, other ball, and walls.
 */
export const getValidMoves = (
  pos: Position,
  otherPos: Position,
  walls: Wall[],
  gridSize: number = 9
): Position[] => {
  const directions = [
    { x: 0, y: -1 }, // Up
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }, // Left
    { x: 1, y: 0 },  // Right
  ];

  const validMoves: Position[] = [];

  for (const dir of directions) {
    const nextX = pos.x + dir.x;
    const nextY = pos.y + dir.y;

    // Check bounds
    if (nextX < 0 || nextX >= gridSize || nextY < 0 || nextY >= gridSize) {
      continue;
    }

    // Check overlap with the other ball
    if (nextX === otherPos.x && nextY === otherPos.y) {
      continue;
    }

    const nextPos = { x: nextX, y: nextY };

    // Check if there is a wall between current position and target position
    if (!hasWallBetween(pos, nextPos, walls)) {
      validMoves.push(nextPos);
    }
  }

  return validMoves;
};

/**
 * Checks if the cyan player has reached the bottom target row.
 */
export const checkPlayerWin = (cyan: Position, gridSize: number = 9): boolean => {
  return cyan.y === gridSize - 1;
};

/**
 * Checks if the pink computer opponent has reached the top target row.
 */
export const checkComputerWin = (pink: Position): boolean => {
  return pink.y === 0;
};
