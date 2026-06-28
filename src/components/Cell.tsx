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

  let colors: [string, string, ...string[]] = ['#20123a', '#120824'];
  let borderColor = '#2c1852';

  if (isTopTarget) {
    // Pink's target row (top)
    colors = ['#ffaede', '#ff00cc', '#99007a'];
    borderColor = '#ff66d9';
  } else if (isBottomTarget) {
    // Cyan's target row (bottom)
    colors = ['#9de2ff', '#00ccff', '#007a99'];
    borderColor = '#66d9ff';
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
          borderRadius: 8,
          backgroundColor: '#0c051a',
        },
        isSelected && styles.selectedShadow,
      ]}
    >
      <LinearGradient colors={colors} style={styles.cell}>
        {/* Glossy Specular Highlight for Target Cells */}
        {(isTopTarget || isBottomTarget) && (
          <View style={styles.specularHighlight} />
        )}
        {/* Small center indicator dot for targets */}
        {(isTopTarget || isBottomTarget) && (
          <View style={styles.dot} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 1.5,
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
    transform: [{ scale: 0.96 }],
  },
  cell: {
    flex: 1,
    borderRadius: 7,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specularHighlight: {
    position: 'absolute',
    top: 1.5,
    left: 3,
    right: 3,
    height: '25%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 999,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
export default Cell;
