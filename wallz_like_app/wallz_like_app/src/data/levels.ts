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

export interface Level {
  id: number;
  name: string;
  description: string;
  pinkStart: Position;
  cyanStart: Position;
  barriers: Barrier[];
  par: number;
}

export const levels: Level[] = [
  {
    id: 1,
    name: "The Pocket",
    description: "Navigate the pocket opening to release the Pink ball, then guide both to their matching zones.",
    pinkStart: { x: 2, y: 3 },
    cyanStart: { x: 3, y: 5 },
    par: 12,
    barriers: [
      // Horizontal lines (length 2)
      { x: 2, y: 2, dir: 'h', length: 2 },
      { x: 4, y: 3, dir: 'h', length: 2 },
      { x: 4, y: 4, dir: 'h', length: 2 },
      { x: 3, y: 8, dir: 'h', length: 2 },
      // Vertical lines
      { x: 2, y: 2, dir: 'v', length: 2 },
      { x: 3, y: 2, dir: 'v', length: 2 },
      { x: 3, y: 5, dir: 'v', length: 3 },
      { x: 4, y: 6, dir: 'v', length: 2 },
    ]
  },
  {
    id: 2,
    name: "Zig Zag Corridor",
    description: "Symmetrical horizontal corridors block direct paths. Guide your pawns through the winding passages.",
    pinkStart: { x: 0, y: 4 },
    cyanStart: { x: 8, y: 4 },
    par: 28,
    barriers: [
      // Horizontal corridors
      { x: 0, y: 2, dir: 'h', length: 7 },
      { x: 2, y: 4, dir: 'h', length: 7 },
      { x: 0, y: 6, dir: 'h', length: 7 },
      // Vertical barriers in the middle
      { x: 4, y: 2, dir: 'v', length: 2 },
      { x: 5, y: 4, dir: 'v', length: 2 },
    ]
  },
  {
    id: 3,
    name: "Split Decisions",
    description: "Both pawns start in the center but must navigate to opposite edges using the side gates.",
    pinkStart: { x: 4, y: 3 },
    cyanStart: { x: 4, y: 5 },
    par: 22,
    barriers: [
      // Middle horizontal divider with open sides
      { x: 1, y: 4, dir: 'h', length: 7 },
      // Top and bottom horizontal gates
      { x: 0, y: 2, dir: 'h', length: 4 },
      { x: 5, y: 2, dir: 'h', length: 4 },
      { x: 0, y: 6, dir: 'h', length: 4 },
      { x: 5, y: 6, dir: 'h', length: 4 },
      // Long vertical columns
      { x: 3, y: 2, dir: 'v', length: 5 },
      { x: 6, y: 2, dir: 'v', length: 5 },
    ]
  },
  {
    id: 4,
    name: "The Crossroad",
    description: "A narrow vertical channel separates the two halves. Use the side pockets to let the other pawn pass.",
    pinkStart: { x: 1, y: 2 },
    cyanStart: { x: 7, y: 6 },
    par: 32,
    barriers: [
      // Horizontal dividers at row 4
      { x: 0, y: 4, dir: 'h', length: 4 },
      { x: 5, y: 4, dir: 'h', length: 4 },
      // Vertical channel borders with gaps (pockets)
      { x: 4, y: 2, dir: 'v', length: 1 },
      { x: 4, y: 4, dir: 'v', length: 3 }, // Gap at row 3
      { x: 5, y: 2, dir: 'v', length: 3 }, // Gap at row 5
      { x: 5, y: 6, dir: 'v', length: 1 },
    ]
  },
  {
    id: 5,
    name: "Gambit Maze",
    description: "The ultimate challenge. Thread both pawns carefully through a tightly woven maze of obstacles.",
    pinkStart: { x: 0, y: 7 },
    cyanStart: { x: 8, y: 1 },
    par: 40,
    barriers: [
      // Horizontal maze walls
      { x: 0, y: 2, dir: 'h', length: 6 },
      { x: 3, y: 4, dir: 'h', length: 6 },
      { x: 0, y: 6, dir: 'h', length: 6 },
      // Vertical maze walls
      { x: 2, y: 0, dir: 'v', length: 4 },
      { x: 7, y: 4, dir: 'v', length: 4 },
      { x: 4, y: 2, dir: 'v', length: 5 },
      { x: 5, y: 2, dir: 'v', length: 5 },
    ]
  }
];
