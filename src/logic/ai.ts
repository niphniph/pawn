import { Position, Wall } from '../types/game';
import { getValidMoves } from './movement';

const runBFS = (
  start: Position,
  otherPos: Position,
  walls: Wall[],
  gridSize: number,
  targetRow: number
): { distanceToTarget: number; reachableCount: number } => {
  const queue: { pos: Position; dist: number }[] = [{ pos: start, dist: 0 }];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  let distanceToTarget = Infinity;
  let reachableCount = 0;

  while (queue.length > 0) {
    const { pos, dist } = queue.shift()!;
    reachableCount++;

    if (pos.y === targetRow && dist < distanceToTarget) {
      distanceToTarget = dist;
    }

    const nextMoves = getValidMoves(pos, otherPos, walls, gridSize);
    for (const move of nextMoves) {
      const key = `${move.x},${move.y}`;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ pos: move, dist: dist + 1 });
      }
    }
  }

  return { distanceToTarget, reachableCount };
};

/**
 * Strategic AI move picker for the computer opponent (pink ball).
 * Evaluates candidates using BFS paths and space partition counts.
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
    // 1. Immediate win detection
    if (move.y === 0) {
      return { move, score: 100000 };
    }

    // Simulate placing a wall behind this move
    const simulatedWall: Wall = { from: pinkPos, to: move };
    const simulatedWalls = [...walls, simulatedWall];

    // Run BFS for Pink starting from 'move' to target row y = 0
    const pinkBFS = runBFS(move, cyanPos, simulatedWalls, gridSize, 0);

    // If Pink cannot reach row 0, avoid trapping itself
    if (pinkBFS.distanceToTarget === Infinity) {
      return { move, score: -50000 };
    }

    // Run BFS for Cyan starting from 'cyanPos' to target row y = gridSize - 1
    const cyanBFS = runBFS(cyanPos, move, simulatedWalls, gridSize, gridSize - 1);

    // Heuristics
    const distanceScore = (gridSize - move.y) * 40;
    const pathScore = (gridSize * 2 - pinkBFS.distanceToTarget) * 30;
    const selfSpaceScore = pinkBFS.reachableCount * 10;
    const playerBlockScore = (gridSize * gridSize - cyanBFS.reachableCount) * 15;

    const score = distanceScore + pathScore + selfSpaceScore + playerBlockScore;
    return { move, score };
  });

  scoredMoves.sort((a, b) => b.score - a.score);
  return scoredMoves[0].move;
};
