import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions, PanResponder } from 'react-native';
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

  // Calculate clean integer cell sizes to prevent rounding errors:
  // We want boardSize <= screenWidth - 20.
  // boardSize = 9 * cellSize + 44 (including borders/padding).
  // 9 * cellSize <= screenWidth - 64.
  const computedCellSize = Math.floor((screenWidth - 64) / gridSize);
  
  // Set cell size constraints (minimum 32px, maximum 38px) to keep it well proportioned
  const cellSize = Math.max(32, Math.min(computedCellSize, 38));
  
  const gridContainerSize = gridSize * cellSize;
  const innerBoardSize = gridContainerSize + 12; // padding 4 + border 2 on each side
  const outerBoardSize = innerBoardSize + 28;   // padding 6 + border 8 on each side

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

  // Shake animation on blocked moves
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

  // PanResponder to handle swiping cooperatively with button taps
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Claim responder status only if the user dragged/swiped more than 15 pixels
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 15 || Math.abs(dy) > 15;
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;
        const threshold = 30;
        if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
          if (Math.abs(dx) > Math.abs(dy)) {
            onMove(dx > 0 ? 'right' : 'left');
          } else {
            onMove(dy > 0 ? 'down' : 'up');
          }
        }
      },
    })
  ).current;

  const rows = Array.from({ length: gridSize }, (_, y) => y);
  const cols = Array.from({ length: gridSize }, (_, x) => x);

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.boardOuter,
        {
          width: outerBoardSize,
          height: outerBoardSize,
          transform: [{ translateX: shakeAnim }],
        },
      ]}
    >
      <View style={[styles.boardInner, { width: innerBoardSize, height: innerBoardSize }]}>
        {/* Padding-free aligner container */}
        <View style={[styles.gridContainer, { width: gridContainerSize, height: gridContainerSize }]}>
          {/* Explicit Row-by-Row Cell Grid to prevent any wrapping bugs */}
          {rows.map((y) => (
            <View key={y} style={styles.row}>
              {cols.map((x) => {
                const isPinkCell = ballPositions.pink.x === x && ballPositions.pink.y === y;
                const isCyanCell = ballPositions.cyan.x === x && ballPositions.cyan.y === y;
                
                return (
                  <Cell
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    isSelected={!!(isPinkCell || isCyanCell)}
                    onPress={() => onCellPress(x, y)}
                    cellSize={cellSize}
                    gridSize={gridSize}
                  />
                );
              })}
            </View>
          ))}

          {/* Walls overlay inside gridContainer bounds */}
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

          {/* Balls overlay inside gridContainer bounds */}
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
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  boardOuter: {
    backgroundColor: '#4d1ab3', // Vibrant purple frame
    borderWidth: 8,
    borderColor: '#6024db', // Outline purple border
    borderRadius: 28,
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
    backgroundColor: '#0c051a', // Deep dark board background
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#30145c',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  gridContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default GameBoard;
