export interface Position {
  x: number;
  y: number;
}

export interface Wall {
  from: Position;
  to: Position;
}

export type GameStatus = 'playing' | 'gameover' | 'won';

export interface BallPositions {
  pink: Position;
  cyan: Position;
}
