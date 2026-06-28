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
  const isTopRow = y === 0;
  const isBottomRow = y === gridSize - 1;

  let colors: [string, string, ...string[]] = ['#302060', '#25174c'];
  let borderColor = '#1c103a';

  if (isTopRow) {
    // Glossy Cyan blocks
    colors = ['#3cd4ff', '#0084ff'];
    borderColor = '#0059b3';
  } else if (isBottomRow) {
    // Glossy Pink blocks
    colors = ['#ff6cd3', '#cc0094'];
    borderColor = '#8a0064';
  }

  // Margin calculation to keep spacing even
  const cellMargin = 2;
  const innerSize = cellSize - cellMargin * 2;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.container,
        {
          width: innerSize,
          height: innerSize,
          margin: cellMargin,
          borderColor: isSelected ? '#ffffff' : borderColor,
          borderWidth: isSelected ? 2 : 1,
          borderRadius: 8,
          backgroundColor: '#12082b',
        },
        isSelected && styles.selectedShadow,
      ]}
    >
      <LinearGradient colors={colors} style={styles.cell}>
        {/* White Glossy Specular Bubble in top-left */}
        {(isTopRow || isBottomRow) && (
          <View style={styles.specularHighlight} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 1.5,
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
    borderRadius: 7,
    position: 'relative',
  },
  specularHighlight: {
    position: 'absolute',
    top: 3.5,
    left: 3.5,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    opacity: 0.85,
  },
});
export default Cell;
