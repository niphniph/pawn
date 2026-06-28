import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import Cell from './Cell';
import Wall from './Wall';
import Ball from './Ball';
import { BallPositions, Wall as WallType } from '../types/game';

interface GameBoardProps {
  walls: WallType[];
  ballPositions: BallPositions;
  activeTurn: 'player' | 'computer';
  onCellPress: (x: number, y: number) => void;
  onMove: (dir: 'up' | 'down' | 'left' | 'right') => void;
  shakeTrigger: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  walls,
  ballPositions,
  activeTurn,
  onCellPress,
  onMove,
  shakeTrigger,
}) => {
  const gridSize = 9;

  // Dynamic layout calculations
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  
  // Maximize board size to fill the screen width on mobile
  const maxBoardSize = 390;
  const boardSize = Math.min(screenWidth - 20, maxBoardSize);

  // Math to extract cell sizes:
  // boardOuter has borderWidth: 10, padding: 6.
  // boardInner has borderWidth: 2, padding: 4.
  // Total border + padding reduction = (10*2 + 6*2) + (2*2 + 4*2) = 32 + 12 = 44
  const innerUsableSize = boardSize - 44;
  const cellSize = innerUsableSize / gridSize;

  // Animations
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pinkPosAnim = useRef(new Animated.ValueXY({ x: 4 * cellSize, y: 8 * cellSize })).current;
  const cyanPosAnim = useRef(new Animated.ValueXY({ x: 4 * cellSize, y: 0 * cellSize })).current;

  // Sync pink computer ball position
  useEffect(() => {
    Animated.spring(pinkPosAnim, {
      toValue: { x: ballPositions.pink.x * cellSize, y: ballPositions.pink.y * cellSize },
      useNativeDriver: true,
      damping: 14,
      stiffness: 110,
    }).start();
  }, [ballPositions.pink.x, ballPositions.pink.y, cellSize]);

  // Sync cyan player ball position
  useEffect(() => {
    Animated.spring(cyanPosAnim, {
      toValue: { x: ballPositions.cyan.x * cellSize, y: ballPositions.cyan.y * cellSize },
      useNativeDriver: true,
      damping: 14,
      stiffness: 110,
    }).start();
  }, [ballPositions.cyan.x, ballPositions.cyan.y, cellSize]);

  // Invalid move shake animation
  useEffect(() => {
    if (shakeTrigger > 0) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 5, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -5, duration: 45, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 45, useNativeDriver: true }),
      ]).start();
    }
  }, [shakeTrigger]);

  // Touch Swipe coordinates tracking
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: any) => {
    const touch = e.nativeEvent;
    touchStartRef.current = { x: touch.pageX, y: touch.pageY };
  };

  const handleTouchEnd = (e: any) => {
    if (!touchStartRef.current) return;
    const touch = e.nativeEvent;
    const dx = touch.pageX - touchStartRef.current.x;
    const dy = touch.pageY - touchStartRef.current.y;
    touchStartRef.current = null;

    const threshold = 35;
    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      if (Math.abs(dx) > Math.abs(dy)) {
        onMove(dx > 0 ? 'right' : 'left');
      } else {
        onMove(dy > 0 ? 'down' : 'up');
      }
    }
  };

  const cells = Array.from({ length: gridSize * gridSize }, (_, i) => ({
    x: i % gridSize,
    y: Math.floor(i / gridSize),
  }));

  return (
    <Animated.View
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={[
        styles.boardOuter,
        {
          width: boardSize,
          height: boardSize,
          transform: [{ translateX: shakeAnim }],
        },
      ]}
    >
      <View style={styles.boardInner}>
        {/* Grid Cells */}
        <View style={styles.grid}>
          {cells.map((cell) => {
            const isPinkCell = ballPositions.pink.x === cell.x && ballPositions.pink.y === cell.y;
            const isCyanCell = ballPositions.cyan.x === cell.x && ballPositions.cyan.y === cell.y;
            
            return (
              <Cell
                key={`${cell.x}-${cell.y}`}
                x={cell.x}
                y={cell.y}
                isSelected={!!(isPinkCell || isCyanCell)}
                onPress={() => onCellPress(cell.x, cell.y)}
                cellSize={cellSize}
                gridSize={gridSize}
              />
            );
          })}
        </View>

        {/* Walls */}
        {walls.map((wall, idx) => {
          const isHorizontal = wall.to.y !== wall.from.y;
          const dir = isHorizontal ? 'h' : 'v';
          const x = isHorizontal ? wall.from.x : Math.max(wall.from.x, wall.to.x);
          const y = isHorizontal ? Math.max(wall.from.y, wall.to.y) : wall.from.y;

          return (
            <Wall
              key={idx}
              x={x}
              y={y}
              dir={dir}
              cellSize={cellSize}
            />
          );
        })}

        {/* Balls Overlay */}
        <Ball
          color="pink"
          isSelected={activeTurn === 'computer'}
          cellSize={cellSize}
          positionAnim={pinkPosAnim}
        />
        <Ball
          color="cyan"
          isSelected={activeTurn === 'player'}
          cellSize={cellSize}
          positionAnim={cyanPosAnim}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  boardOuter: {
    backgroundColor: '#4d1ab3', // Saturated purple frame
    borderWidth: 10,
    borderColor: '#6024db', // Glowing purple border outline
    borderRadius: 32, // Large rounded outer corners
    padding: 6,
    shadowColor: '#100326',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardInner: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0c051a', // Deep dark board background
    borderRadius: 20, // Rounded inner corners
    borderWidth: 2,
    borderColor: '#30145c',
    position: 'relative',
    overflow: 'hidden',
    padding: 4,
  },
  grid: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignContent: 'flex-start',
  },
});
export default GameBoard;
