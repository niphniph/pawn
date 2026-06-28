import { Level } from '../types/game';

export const levels: Level[] = [
  {
    id: 1,
    name: "The Duel",
    description: "Face your opponent on the standard 9x9 arena. Every step you take blocks the path behind you.",
    pinkStart: { x: 4, y: 8 },
    cyanStart: { x: 4, y: 0 },
    par: 10,
    gridSize: 9,
    timeLimit: 60,
    barriers: []
  },
  {
    id: 2,
    name: "Tight Clash",
    description: "A 9x9 duel with a tighter par. Make every move count to block the opponent's escape.",
    pinkStart: { x: 4, y: 8 },
    cyanStart: { x: 4, y: 0 },
    par: 8,
    gridSize: 9,
    timeLimit: 45,
    barriers: []
  },
  {
    id: 3,
    name: "Grand Duel",
    description: "Standard 9x9 grid with more time. Plan ahead to box the computer AI into a corner.",
    pinkStart: { x: 4, y: 8 },
    cyanStart: { x: 4, y: 0 },
    par: 12,
    gridSize: 9,
    timeLimit: 75,
    barriers: []
  },
  {
    id: 4,
    name: "Speed Run",
    description: "A fast-paced duel. Move quickly and build walls to trap the computer AI.",
    pinkStart: { x: 4, y: 8 },
    cyanStart: { x: 4, y: 0 },
    par: 11,
    gridSize: 9,
    timeLimit: 40,
    barriers: []
  },
  {
    id: 5,
    name: "Blitz Duel",
    description: "Standard 9x9 layout but with a rapid 30-second time limit. Move fast or run out of time!",
    pinkStart: { x: 4, y: 8 },
    cyanStart: { x: 4, y: 0 },
    par: 10,
    gridSize: 9,
    timeLimit: 30,
    barriers: []
  },
  {
    id: 6,
    name: "Precision Battle",
    description: "Every wall must be placed perfectly. Trap the computer AI or race to the goal.",
    pinkStart: { x: 4, y: 8 },
    cyanStart: { x: 4, y: 0 },
    par: 9,
    gridSize: 9,
    timeLimit: 45,
    barriers: []
  },
  {
    id: 7,
    name: "Decisive Steps",
    description: "A standard duel where one misstep will let the AI slide past you to the top.",
    pinkStart: { x: 4, y: 8 },
    cyanStart: { x: 4, y: 0 },
    par: 11,
    gridSize: 9,
    timeLimit: 50,
    barriers: []
  },
  {
    id: 8,
    name: "Pressure Cooker",
    description: "A low time limit duel on the 9x9 board. Keep your focus under pressure.",
    pinkStart: { x: 4, y: 8 },
    cyanStart: { x: 4, y: 0 },
    par: 10,
    gridSize: 9,
    timeLimit: 35,
    barriers: []
  },
  {
    id: 9,
    name: "Endgame",
    description: "A high-par duel. Navigate the board and block the opponent's vertical advance.",
    pinkStart: { x: 4, y: 8 },
    cyanStart: { x: 4, y: 0 },
    par: 14,
    gridSize: 9,
    timeLimit: 60,
    barriers: []
  },
  {
    id: 10,
    name: "Pawn Gambit Ultimate",
    description: "The final showdown. Standard 9x9 duel. Face the ultimate AI test to secure victory.",
    pinkStart: { x: 4, y: 8 },
    cyanStart: { x: 4, y: 0 },
    par: 12,
    gridSize: 9,
    timeLimit: 60,
    barriers: []
  }
];
