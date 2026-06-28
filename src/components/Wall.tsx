import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WallProps {
  x: number;
  y: number;
  dir: 'h' | 'v';
  cellSize: number;
}

export const Wall: React.FC<WallProps> = ({ x, y, dir, cellSize }) => {
  const isHorizontal = dir === 'h';
  
  const thickness = 6;
  const offset = thickness / 2;

  const style = isHorizontal
    ? {
        left: x * cellSize + 1,
        top: y * cellSize - offset,
        width: cellSize - 2,
        height: thickness,
        borderRadius: thickness / 2,
      }
    : {
        left: x * cellSize - offset,
        top: y * cellSize + 1,
        width: thickness,
        height: cellSize - 2,
        borderRadius: thickness / 2,
      };

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      <LinearGradient
        colors={['#ffe066', '#f59e0b', '#b45309']}
        start={isHorizontal ? { x: 0, y: 0 } : { x: 0, y: 0 }}
        end={isHorizontal ? { x: 0, y: 1 } : { x: 1, y: 0 }}
        style={styles.gradient}
      >
        {/* Specular Highlight for 3D capsule look */}
        <View style={[styles.highlight, isHorizontal ? styles.horizHighlight : styles.vertHighlight]} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    overflow: 'hidden',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#ffe066',
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 999,
  },
  horizHighlight: {
    top: 1,
    left: 4,
    right: 4,
    height: 1.5,
  },
  vertHighlight: {
    left: 1,
    top: 4,
    bottom: 4,
    width: 1.5,
  },
});
export default Wall;
