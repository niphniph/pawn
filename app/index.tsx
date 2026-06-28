import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { levels } from '../src/data/levels';
import { getValidMoves, getBestComputerMove } from '../src/logic/movement';
import { checkPlayerWin, checkComputerWin } from '../src/logic/winCheck';
import { calculateScore } from '../src/logic/scoring';
import {
  getBestScore,
  saveBestScore,
  getUnlockedLevel,
  saveUnlockedLevel,
} from '../src/storage/scores';

import HUD from '../src/components/HUD';
import GameBoard from '../src/components/GameBoard';
import GameModal from '../src/components/GameModal';
import LevelButton from '../src/components/LevelButton';
import { Position, Wall } from '../src/types/game';

export default function GameScreen() {
  // Game states
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'won'>('start');
  const [gameOverReason, setGameOverReason] = useState<'time' | 'no_moves' | 'opponent_escaped' | null>(null);
  const [activeTurn, setActiveTurn] = useState<'player' | 'computer'>('player');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameMoves, setGameMoves] = useState<number>(0);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shakeTrigger, setShakeTrigger] = useState<number>(0);
  const [undoHistory, setUndoHistory] = useState<{ pink: Position; cyan: Position; walls: Wall[] }[]>([]);
  const [isTimeAttack, setIsTimeAttack] = useState<boolean>(true);
  
  // Storage stats
  const [bestScore, setBestScore] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);

  // Active level data
  const activeLevel = useMemo(() => {
    return levels.find((l) => l.id === currentLevelId) || levels[0];
  }, [currentLevelId]);

  // Ball positions state
  const [ballPositions, setBallPositions] = useState<{ pink: Position; cyan: Position }>({
    pink: { x: activeLevel.pinkStart.x, y: activeLevel.pinkStart.y },
    cyan: { x: activeLevel.cyanStart.x, y: activeLevel.cyanStart.y },
  });

  // Use refs to read latest values in the delayed computer-turn effect
  const ballPositionsRef = useRef(ballPositions);
  const wallsRef = useRef(walls);
  const activeLevelRef = useRef(activeLevel);

  useEffect(() => {
    ballPositionsRef.current = ballPositions;
  }, [ballPositions]);

  useEffect(() => {
    wallsRef.current = walls;
  }, [walls]);

  useEffect(() => {
    activeLevelRef.current = activeLevel;
  }, [activeLevel]);

  // Load unlocked level and best score from AsyncStorage on mount / level change
  useEffect(() => {
    const loadProgress = async () => {
      const unlocked = await getUnlockedLevel();
      setUnlockedLevel(unlocked);
      
      const best = await getBestScore(currentLevelId);
      setBestScore(best);
    };
    
    loadProgress();
    
    // Reset board for the selected level
    setBallPositions({
      pink: { ...activeLevel.pinkStart },
      cyan: { ...activeLevel.cyanStart },
    });
    setWalls([]);
    setUndoHistory([]);
    setGameMoves(0);
    setTimeLeft(activeLevel.timeLimit || 60);
    setGameState('start');
    setGameOverReason(null);
    setActiveTurn('player');
  }, [currentLevelId, activeLevel]);

  // Timer loop for time attack countdown
  useEffect(() => {
    let timer: any;
    if (gameState === 'playing' && timeLeft > 0 && isTimeAttack) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing' && isTimeAttack) {
      setGameOverReason('time');
      setGameState('gameover');
    }
    
    return () => clearInterval(timer);
  }, [gameState, timeLeft, isTimeAttack]);

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
    const score = calculateScore(timeLeft, gameMoves + 1);
    setCurrentScore(score);
    
    const saveStats = async () => {
      if (score > bestScore) {
        setBestScore(score);
        await saveBestScore(currentLevelId, score);
      }
      
      // Unlock next level
      if (currentLevelId === unlockedLevel && currentLevelId < 10) {
        const nextLvl = currentLevelId + 1;
        setUnlockedLevel(nextLvl);
        await saveUnlockedLevel(nextLvl);
      }
    };
    
    saveStats();
  };

  // Primary action button in modal (Start run, retry level, next level)
  const handlePrimaryModalAction = () => {
    if (gameState === 'start') {
      setGameState('playing');
      setTimeLeft(activeLevel.timeLimit || 60);
      setActiveTurn('player');
    } else if (gameState === 'gameover') {
      handleResetLevel();
    } else if (gameState === 'won') {
      if (currentLevelId < 10) {
        setCurrentLevelId((prev) => prev + 1);
      } else {
        handleResetLevel();
      }
    }
  };

  const handleResetLevel = () => {
    setBallPositions({
      pink: { ...activeLevel.pinkStart },
      cyan: { ...activeLevel.cyanStart },
    });
    setWalls([]);
    setUndoHistory([]);
    setGameMoves(0);
    setTimeLeft(activeLevel.timeLimit || 60);
    setGameOverReason(null);
    setActiveTurn('player');
    setGameState('playing');
  };

  const handleUndo = () => {
    // Only allow undo if it's the player's turn to act
    if (undoHistory.length === 0 || gameState !== 'playing' || activeTurn !== 'player') return;
    const prevHistory = [...undoHistory];
    const lastState = prevHistory.pop()!;
    setBallPositions({ pink: lastState.pink, cyan: lastState.cyan });
    setWalls(lastState.walls);
    setUndoHistory(prevHistory);
    setGameMoves((m) => Math.max(0, m - 1));
  };

  const handleToggleTimeAttack = () => {
    setIsTimeAttack((prev) => !prev);
  };

  // Human player movement execution
  const movePlayer = (target: Position) => {
    const cyanPos = ballPositions.cyan;
    const pinkPos = ballPositions.pink;
    const gridSz = activeLevel.gridSize || 9;

    // Record undo state (save current configurations)
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

    setBallPositions((prev) => ({
      ...prev,
      cyan: target,
    }));
    setWalls(updatedWalls);
    setGameMoves((m) => m + 1);

    // Check player win condition (reached bottom row)
    if (checkPlayerWin(target, gridSz)) {
      handleGameWon();
      return;
    }

    // Check if computer is now trapped (no moves left)
    const computerValidMoves = getValidMoves(pinkPos, target, updatedWalls, gridSz);
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
    const gridSz = activeLevelRef.current.gridSize || 9;
    const currentWalls = wallsRef.current;

    const bestMove = getBestComputerMove(pinkPos, cyanPos, currentWalls, gridSz);

    if (bestMove) {
      const newWall: Wall = { from: { ...pinkPos }, to: { ...bestMove } };
      const updatedWalls = [...currentWalls, newWall];

      setBallPositions((prev) => ({
        ...prev,
        pink: bestMove,
      }));
      setWalls(updatedWalls);

      // Check if computer reached row 0 (top row)
      if (checkComputerWin(bestMove)) {
        setGameOverReason('opponent_escaped');
        setGameState('gameover');
        return;
      }

      // Check if player is now trapped (no moves left)
      const playerValidMoves = getValidMoves(cyanPos, bestMove, updatedWalls, gridSz);
      if (playerValidMoves.length === 0) {
        setGameOverReason('no_moves');
        setGameState('gameover');
        return;
      }

      // Return control to player
      setActiveTurn('player');
    } else {
      // Computer has no moves left - Player wins!
      handleGameWon();
    }
  };

  const handleCellPress = (x: number, y: number) => {
    console.log("cell pressed", { x, y });
    if (gameState !== 'playing' || activeTurn !== 'player') {
      console.log("move rejected: not player turn or game not playing");
      return;
    }

    const cyanPos = ballPositions.cyan;
    console.log("player position", cyanPos);

    const gridSz = activeLevel.gridSize || 9;
    const validMoves = getValidMoves(cyanPos, ballPositions.pink, walls, gridSz);
    console.log("valid moves", validMoves);

    // Check if the pressed cell is in the valid moves list
    const isValid = validMoves.some((m) => m.x === x && m.y === y);

    if (isValid) {
      console.log("move accepted");
      movePlayer({ x, y });
    } else {
      console.log("move rejected");
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

    const gridSz = activeLevel.gridSize || 9;
    const validMoves = getValidMoves(cyanPos, ballPositions.pink, walls, gridSz);
    const isValid = validMoves.some((m) => m.x === nextX && m.y === nextY);

    if (isValid) {
      movePlayer({ x: nextX, y: nextY });
    } else {
      setShakeTrigger((prev) => prev + 1);
    }
  };

  return (
    <LinearGradient colors={['#090416', '#160b2b']} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PAWN GAMBIT</Text>
          <Text style={styles.subtitle}>NEON GRID PUZZLE</Text>
        </View>

        {/* HUD Stats */}
        <HUD
          levelNumber={activeLevel.id}
          levelName={activeLevel.name}
          moves={gameMoves}
          par={activeLevel.par}
          timeLeft={timeLeft}
          bestScore={bestScore}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted((prev) => !prev)}
          onUndo={handleUndo}
          canUndo={undoHistory.length > 0 && activeTurn === 'player'}
          onReset={handleResetLevel}
          isTimeAttack={isTimeAttack}
          onToggleTimeAttack={handleToggleTimeAttack}
          activeTurn={activeTurn}
        />

        {/* Main Board */}
        <View style={styles.boardWrapper}>
          <GameBoard
            level={activeLevel}
            walls={walls}
            ballPositions={ballPositions}
            selectedBall="cyan"
            onCellPress={handleCellPress}
            onMove={handleMove}
            shakeTrigger={shakeTrigger}
          />
        </View>

        {/* Horizontal Level Selection */}
        <View style={styles.selectorWrapper}>
          <Text style={styles.selectorTitle}>CHOOSE LEVEL</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.levelList}
          >
            {levels.map((lvl) => (
              <LevelButton
                key={lvl.id}
                id={lvl.id}
                isActive={currentLevelId === lvl.id}
                isUnlocked={lvl.id <= unlockedLevel}
                onPress={() => setCurrentLevelId(lvl.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Modals overlay */}
        <GameModal
          visible={gameState !== 'playing'}
          status={gameState === 'playing' ? 'start' : gameState}
          levelName={activeLevel.name}
          levelNumber={activeLevel.id}
          moves={gameMoves}
          par={activeLevel.par}
          timeLeft={activeLevel.timeLimit || 60}
          score={currentScore}
          bestScore={bestScore}
          onPrimaryAction={handlePrimaryModalAction}
          onSecondaryAction={gameState === 'won' ? handleResetLevel : undefined}
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
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginVertical: 12,
  },
  title: {
    color: '#00ccff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2.5,
    textShadowColor: 'rgba(0, 204, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    color: '#ff00cc',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 2,
    textShadowColor: 'rgba(255, 0, 204, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  boardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  selectorWrapper: {
    width: '100%',
    marginVertical: 12,
  },
  selectorTitle: {
    color: '#a37ee6',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    paddingLeft: 6,
    marginBottom: 4,
  },
  levelList: {
    paddingHorizontal: 4,
  },
});
