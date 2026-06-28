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
 * Strategic AI move picker for the computer opponent (pink ball).
 * Aims to reach row 0 (top row target area).
 */
export const getBestComputerMove = (
  pinkPos: Position,
  cyanPos: Position,
  walls: Wall[],
  gridSize: number = 9
): Position | null => {
  const validMoves = getValidMoves(pinkPos, cyanPos, walls, gridSize);
  if (validMoves.length === 0) return null;

  const scoredMoves = validMoves.map(move => {
    // If it reaches y === 0, it's a winning move
    if (move.y === 0) {
      return { move, score: 10000 };
    }

    // Simulate placing a wall behind this move
    const tempWall: Wall = { from: pinkPos, to: move };
    const simulatedWalls = [...walls, tempWall];

    // Check valid moves from the candidate position
    const nextMoves = getValidMoves(move, cyanPos, simulatedWalls, gridSize);

    // If nextMoves is empty, this move traps the computer! Avoid.
    if (nextMoves.length === 0) {
      return { move, score: -1000 };
    }

    // Heuristic: prefer smaller y, plus mobility bonus
    const distanceScore = (gridSize - move.y) * 20;
    const mobilityScore = nextMoves.length * 2;

    const score = distanceScore + mobilityScore;
    return { move, score };
  });

  scoredMoves.sort((a, b) => b.score - a.score);
  return scoredMoves[0].move;
};
