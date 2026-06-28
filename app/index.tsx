import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { getValidMoves, checkPlayerWin, checkComputerWin } from '../src/logic/movement';
import { getBestComputerMove } from '../src/logic/ai';
import { calculateScore } from '../src/logic/scoring';
import { getBestScore, saveBestScore } from '../src/storage/scores';

import HUD from '../src/components/HUD';
import GameBoard from '../src/components/GameBoard';
import GameModal from '../src/components/GameModal';
import { Position, Wall } from '../src/types/game';

export default function GameScreen() {
  // Game states
  const [gameState, setGameState] = useState<'playing' | 'gameover' | 'won'>('playing');
  const [gameOverReason, setGameOverReason] = useState<'time' | 'no_moves' | 'opponent_escaped' | null>(null);
  const [activeTurn, setActiveTurn] = useState<'player' | 'computer'>('player');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameMoves, setGameMoves] = useState<number>(0);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shakeTrigger, setShakeTrigger] = useState<number>(0);
  const [undoHistory, setUndoHistory] = useState<{ pink: Position; cyan: Position; walls: Wall[] }[]>([]);
  
  // Storage stats
  const [bestScore, setBestScore] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);

  // Ball positions starting state
  // Cyan (player) starts top edge middle column (x: 4, y: 0)
  // Pink (computer) starts bottom edge middle column (x: 4, y: 8)
  const [ballPositions, setBallPositions] = useState<{ pink: Position; cyan: Position }>({
    pink: { x: 4, y: 8 },
    cyan: { x: 4, y: 0 },
  });

  // Refs to access the latest state in async/delayed contexts
  const ballPositionsRef = useRef(ballPositions);
  const wallsRef = useRef(walls);

  useEffect(() => {
    ballPositionsRef.current = ballPositions;
  }, [ballPositions]);

  useEffect(() => {
    wallsRef.current = walls;
  }, [walls]);

  // Load best score on mount
  useEffect(() => {
    const loadScore = async () => {
      const best = await getBestScore();
      setBestScore(best);
    };
    loadScore();
  }, []);

  // Timer loop for time attack
  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameOverReason('time');
      setGameState('gameover');
    }
    
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Keyboard controls listener (Arrow keys and WASD keys)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.addEventListener) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (gameState !== 'playing' || activeTurn !== 'player') return;

        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          handleMove('up');
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          handleMove('down');
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          handleMove('left');
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          handleMove('right');
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [gameState, activeTurn, ballPositions, walls]);

  // Computer AI delayed turn coordinator
  useEffect(() => {
    let delayTimer: any;
    if (gameState === 'playing' && activeTurn === 'computer') {
      delayTimer = setTimeout(() => {
        moveComputer();
      }, 400);
    }
    return () => clearTimeout(delayTimer);
  }, [activeTurn, gameState]);

  // Game Won handler
  const handleGameWon = () => {
    setGameState('won');
    const finalScore = calculateScore(timeLeft, gameMoves);
    setCurrentScore(finalScore);
    
    const saveStats = async () => {
      if (finalScore > bestScore) {
        setBestScore(finalScore);
        await saveBestScore(finalScore);
      }
    };
    saveStats();
  };

  // Full reset for restart/retry actions
  const handleReset = () => {
    setBallPositions({
      pink: { x: 4, y: 8 },
      cyan: { x: 4, y: 0 },
    });
    setWalls([]);
    setUndoHistory([]);
    setGameMoves(0);
    setTimeLeft(60);
    setGameOverReason(null);
    setActiveTurn('player');
    setGameState('playing');
  };

  const handleUndo = () => {
    if (undoHistory.length === 0 || gameState !== 'playing' || activeTurn !== 'player') return;
    const prevHistory = [...undoHistory];
    const lastState = prevHistory.pop()!;
    setBallPositions({ pink: lastState.pink, cyan: lastState.cyan });
    setWalls(lastState.walls);
    setUndoHistory(prevHistory);
    setGameMoves((m) => Math.max(0, m - 1));
  };

  // Human player movement execution
  const movePlayer = (target: Position) => {
    const cyanPos = ballPositions.cyan;
    const pinkPos = ballPositions.pink;

    // Record undo state
    setUndoHistory((prev) => [
      ...prev,
      {
        pink: { ...pinkPos },
        cyan: { ...cyanPos },
        walls: [...walls],
      },
    ]);

    // Build wall edge segment behind player's move
    const newWall: Wall = { from: { ...cyanPos }, to: { ...target } };
    const updatedWalls = [...walls, newWall];
    console.log("moving...");
    console.log("wall added", newWall);

    setBallPositions((prev) => ({
      ...prev,
      cyan: target,
    }));
    setWalls(updatedWalls);
    setGameMoves((m) => m + 1);

    // Check player win condition (reached bottom row, index 8)
    if (checkPlayerWin(target, 9)) {
      handleGameWon();
      return;
    }

    // Check if computer is now trapped (no moves left)
    const computerValidMoves = getValidMoves(pinkPos, target, updatedWalls, 9);
    if (computerValidMoves.length === 0) {
      handleGameWon();
      return;
    }

    // Switch turn to computer
    setActiveTurn('computer');
  };

  // Computer AI movement execution
  const moveComputer = () => {
    const pinkPos = ballPositionsRef.current.pink;
    const cyanPos = ballPositionsRef.current.cyan;
    const currentWalls = wallsRef.current;

    console.log("AI turn");
    const bestMove = getBestComputerMove(pinkPos, cyanPos, currentWalls, 9);

    if (bestMove) {
      const newWall: Wall = { from: { ...pinkPos }, to: { ...bestMove } };
      const updatedWalls = [...currentWalls, newWall];

      setBallPositions((prev) => ({
        ...prev,
        pink: bestMove,
      }));
      setWalls(updatedWalls);

      // Check if computer reached top row (index 0)
      if (checkComputerWin(bestMove)) {
        setGameOverReason('opponent_escaped');
        setGameState('gameover');
        return;
      }

      // Check if player is now trapped (no moves left)
      const playerValidMoves = getValidMoves(cyanPos, bestMove, updatedWalls, 9);
      if (playerValidMoves.length === 0) {
        setGameOverReason('no_moves');
        setGameState('gameover');
        return;
      }

      // Return control to player
      setActiveTurn('player');
    } else {
      // Computer has no moves left - Player wins
      handleGameWon();
    }
  };

  const handleCellPress = (x: number, y: number) => {
    console.log("clicked cell", { x, y });
    if (gameState !== 'playing' || activeTurn !== 'player') {
      console.log("Click ignored", { gameState, activeTurn });
      return;
    }

    const cyanPos = ballPositions.cyan;
    console.log("current position", cyanPos);
    const validMoves = getValidMoves(cyanPos, ballPositions.pink, walls, 9);
    console.log("valid moves", validMoves);
    const isValid = validMoves.some((m) => m.x === x && m.y === y);

    if (isValid) {
      movePlayer({ x, y });
    } else {
      console.log("Invalid move target", { x, y });
      setShakeTrigger((prev) => prev + 1);
    }
  };

  const handleMove = (dir: 'up' | 'down' | 'left' | 'right') => {
    if (gameState !== 'playing' || activeTurn !== 'player') return;

    const cyanPos = ballPositions.cyan;
    let nextX = cyanPos.x;
    let nextY = cyanPos.y;

    if (dir === 'left') nextX -= 1;
    if (dir === 'right') nextX += 1;
    if (dir === 'up') nextY -= 1;
    if (dir === 'down') nextY += 1;

    const validMoves = getValidMoves(cyanPos, ballPositions.pink, walls, 9);
    const isValid = validMoves.some((m) => m.x === nextX && m.y === nextY);

    if (isValid) {
      movePlayer({ x: nextX, y: nextY });
    } else {
      setShakeTrigger((prev) => prev + 1);
    }
  };

  return (
    <LinearGradient colors={['#250f4a', '#0c021f']} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Sleek top HUD */}
        <HUD
          moves={gameMoves}
          timeLeft={timeLeft}
          bestScore={bestScore}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted((prev) => !prev)}
          onUndo={handleUndo}
          canUndo={undoHistory.length > 0 && activeTurn === 'player'}
          onReset={handleReset}
          activeTurn={activeTurn}
        />

        {/* Maximized Game Board */}
        <View style={styles.boardWrapper}>
          <GameBoard
            walls={walls}
            ballPositions={ballPositions}
            activeTurn={activeTurn}
            onCellPress={handleCellPress}
            onMove={handleMove}
            shakeTrigger={shakeTrigger}
          />
        </View>

        {/* Overlays */}
        <GameModal
          visible={gameState !== 'playing'}
          status={gameState === 'playing' ? 'gameover' : gameState}
          moves={gameMoves}
          timeLeft={timeLeft}
          score={currentScore}
          bestScore={bestScore}
          onRestart={handleReset}
          gameOverReason={gameOverReason}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  boardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
