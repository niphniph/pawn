import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface WallProps {
  x: number;
  y: number;
  dir: 'h' | 'v';
  cellSize: number;
}

export const Wall: React.FC<WallProps> = ({ x, y, dir, cellSize }) => {
  const isHorizontal = dir === 'h';
  
  const thickness = 10;
  const offset = thickness / 2;

  // Spring pop entry animation on creation
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  const style = isHorizontal
    ? {
        left: x * cellSize + 2,
        top: y * cellSize - offset,
        width: cellSize - 4,
        height: thickness,
        borderRadius: thickness / 2,
      }
    : {
        left: x * cellSize - offset,
        top: y * cellSize + 2,
        width: thickness,
        height: cellSize - 4,
        borderRadius: thickness / 2,
      };

  return (
    <Animated.View 
      style={[
        styles.container, 
        style, 
        { transform: [{ scale: scaleAnim }] }
      ]} 
      pointerEvents="none"
    >
      <LinearGradient
        colors={['#fff4a3', '#fbbf24', '#d97706']}
        start={isHorizontal ? { x: 0, y: 0 } : { x: 0, y: 0 }}
        end={isHorizontal ? { x: 0, y: 1 } : { x: 1, y: 0 }}
        style={styles.gradient}
      >
        {/* Glossy highlight line running down the center of the capsule */}
        <View style={[styles.highlight, isHorizontal ? styles.horizHighlight : styles.vertHighlight]} />
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 15,
    overflow: 'hidden',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#b45309',
  },
  gradient: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    opacity: 0.85,
    borderRadius: 999,
  },
  horizHighlight: {
    top: 2,
    left: 4,
    right: 4,
    height: 1.8,
  },
  vertHighlight: {
    left: 2,
    top: 4,
    bottom: 4,
    width: 1.8,
  },
});
export default Wall;
