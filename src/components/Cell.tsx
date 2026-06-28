import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CellProps {
  x: number;
  y: number;
  isSelected: boolean;
  onPress: () => void;
  cellSize: number;
  gridSize?: number;
}

export const Cell: React.FC<CellProps> = ({ x, y, isSelected, onPress, cellSize, gridSize = 9 }) => {
  const isTopTarget = y === 0;
  const isBottomTarget = y === gridSize - 1;

  let colors: [string, string, ...string[]] = ['#251c47', '#171030'];
  let borderColor = '#2d2055';

  if (isTopTarget) {
    colors = ['#38bdf8', '#0284c7']; // Blue/Cyan
    borderColor = '#7dd3fc';
  } else if (isBottomTarget) {
    colors = ['#f472b6', '#be185d']; // Pink
    borderColor = '#fbcfe8';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.container,
        {
          width: cellSize,
          height: cellSize,
          borderColor: isSelected ? '#ffffff' : borderColor,
          borderWidth: isSelected ? 2 : 1,
          borderRadius: 6,
          backgroundColor: '#171030',
        },
        isSelected && styles.selectedShadow,
      ]}
    >
      <LinearGradient colors={colors} style={styles.cell}>
        {/* Glossy Specular Highlight */}
        {(isTopTarget || isBottomTarget) && (
          <View style={styles.specularHighlight} />
        )}
        {/* Target Ring Dot (small indicator) */}
        {(isTopTarget || isBottomTarget) && (
          <View style={styles.dot} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  selectedShadow: {
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ scale: 0.95 }],
  },
  cell: {
    flex: 1,
    borderRadius: 5,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specularHighlight: {
    position: 'absolute',
    top: 2,
    left: 4,
    right: 4,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 999,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    position: 'absolute',
    top: 3,
    left: 3,
  },
});
export default Cell;
