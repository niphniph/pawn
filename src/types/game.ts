export interface Position {
  x: number;
  y: number;
}

export interface Barrier {
  x: number;
  y: number;
  dir: 'h' | 'v';
  length: number;
}

export interface Wall {
  from: Position;
  to: Position;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  pinkStart: Position;
  cyanStart: Position;
  barriers: Barrier[]; // Legacy support if needed
  par: number;
  gridSize?: number;
  timeLimit?: number;
}

export type GameStatus = 'start' | 'playing' | 'gameover' | 'won';

export interface BallPositions {
  pink: Position;
  cyan: Position;
}
