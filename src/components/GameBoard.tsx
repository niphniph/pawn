import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import Cell from './Cell';
import Barrier from './Barrier';
import Ball from './Ball';
import { Level, BallPositions, Wall } from '../types/game';

interface GameBoardProps {
  level: Level;
  walls: Wall[];
  ballPositions: BallPositions;
  selectedBall: 'pink' | 'cyan' | null;
  onCellPress: (x: number, y: number) => void;
  onMove: (dir: 'up' | 'down' | 'left' | 'right') => void;
  shakeTrigger: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  walls,
  ballPositions,
  selectedBall,
  onCellPress,
  onMove,
  shakeTrigger,
}) => {
  const gridSize = level.gridSize || 9;

  // Screen size math
  const screenWidth = Dimensions.get('window').width;
  const boardPadding = 12;
  const maxBoardSize = 360;
  const boardSize = Math.min(screenWidth - 32, maxBoardSize);
  const cellSize = (boardSize - boardPadding * 2) / gridSize;

  // Animations
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pinkPosAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const cyanPosAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Sync pink ball position with animation
  useEffect(() => {
    Animated.spring(pinkPosAnim, {
      toValue: { x: ballPositions.pink.x * cellSize, y: ballPositions.pink.y * cellSize },
      useNativeDriver: true,
      damping: 12,
      stiffness: 100,
    }).start();
  }, [ballPositions.pink.x, ballPositions.pink.y, cellSize]);

  // Sync cyan ball position with animation
  useEffect(() => {
    Animated.spring(cyanPosAnim, {
      toValue: { x: ballPositions.cyan.x * cellSize, y: ballPositions.cyan.y * cellSize },
      useNativeDriver: true,
      damping: 12,
      stiffness: 100,
    }).start();
  }, [ballPositions.cyan.x, ballPositions.cyan.y, cellSize]);

  // Trigger shake animation
  useEffect(() => {
    if (shakeTrigger > 0) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 5, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -5, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]).start();
    }
  }, [shakeTrigger]);

  // Direct touch tracking to avoid capturing Cell clicks
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

    const threshold = 30; // Minimum distance in pixels to count as a swipe
    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        onMove(dx > 0 ? 'right' : 'left');
      } else {
        // Vertical swipe
        onMove(dy > 0 ? 'down' : 'up');
      }
    }
  };

  // Cells array (gridSize x gridSize)
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
        {/* Cells Grid */}
        <View style={styles.grid}>
          {cells.map((cell) => {
            const isPinkSelected = selectedBall === 'pink' && ballPositions.pink.x === cell.x && ballPositions.pink.y === cell.y;
            const isCyanSelected = selectedBall === 'cyan' && ballPositions.cyan.x === cell.x && ballPositions.cyan.y === cell.y;
            
            return (
              <Cell
                key={`${cell.x}-${cell.y}`}
                x={cell.x}
                y={cell.y}
                isSelected={!!(isPinkSelected || isCyanSelected)}
                onPress={() => onCellPress(cell.x, cell.y)}
                cellSize={cellSize}
                gridSize={gridSize}
              />
            );
          })}
        </View>

        {/* Barriers (Mapped from Wall Edges) */}
        {walls.map((wall, idx) => {
          const isHorizontal = wall.to.y !== wall.from.y;
          const dir = isHorizontal ? 'h' : 'v';
          const x = isHorizontal ? wall.from.x : Math.max(wall.from.x, wall.to.x);
          const y = isHorizontal ? Math.max(wall.from.y, wall.to.y) : wall.from.y;

          return (
            <Barrier
              key={idx}
              x={x}
              y={y}
              dir={dir}
              length={1}
              cellSize={cellSize}
            />
          );
        })}

        {/* Balls Overlay */}
        <Ball
          color="pink"
          isSelected={selectedBall === 'pink'}
          cellSize={cellSize}
          positionAnim={pinkPosAnim}
        />
        <Ball
          color="cyan"
          isSelected={selectedBall === 'cyan'}
          cellSize={cellSize}
          positionAnim={cyanPosAnim}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  boardOuter: {
    backgroundColor: '#3a1d74',
    borderWidth: 8,
    borderColor: '#581ca6',
    borderRadius: 24,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardInner: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#090416',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#34225d',
    position: 'relative',
    overflow: 'hidden',
  },
  grid: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignContent: 'flex-start',
  },
});
export default GameBoard;
