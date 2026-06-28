import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HUDProps {
  moves: number;
  timeLeft: number;
  bestScore: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onReset: () => void;
  activeTurn: 'player' | 'computer';
}

export const HUD: React.FC<HUDProps> = ({
  moves,
  timeLeft,
  bestScore,
  isMuted,
  onToggleMute,
  onUndo,
  canUndo,
  onReset,
  activeTurn,
}) => {
  return (
    <View style={styles.container}>
      {/* Title & Active Turn Dot */}
      <View style={styles.leftSection}>
        <View
          style={[
            styles.turnDot,
            activeTurn === 'player' ? styles.playerDot : styles.computerDot,
          ]}
        />
        <Text style={styles.title}>PAWN GAMBIT</Text>
      </View>

      {/* Compressed Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>MOVES</Text>
          <Text style={styles.statValue}>{moves}</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TIME</Text>
          <Text style={[styles.statValue, timeLeft <= 10 && styles.lowTime]}>
            {timeLeft}s
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>BEST</Text>
          <Text style={styles.bestValue}>{bestScore}</Text>
        </View>
      </View>

      {/* Small Compact Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={onToggleMute} style={styles.controlBtn} activeOpacity={0.7}>
          <Text style={styles.iconText}>{isMuted ? '🔇' : '🔊'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onUndo}
          disabled={!canUndo}
          style={[styles.controlBtn, !canUndo && styles.disabledBtn]}
          activeOpacity={0.7}
        >
          <Text style={styles.iconText}>⎌</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onReset} style={styles.controlBtn} activeOpacity={0.7}>
          <Text style={styles.iconText}>⟲</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 52,
    backgroundColor: 'rgba(25, 12, 52, 0.95)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#30185c',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  turnDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  playerDot: {
    backgroundColor: '#00ccff',
    shadowColor: '#00ccff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  computerDot: {
    backgroundColor: '#ff00cc',
    shadowColor: '#ff00cc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  title: {
    color: '#a855f7',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#8b5cf6',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  bestValue: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '800',
  },
  lowTime: {
    color: '#ef4444',
  },
  controls: {
    flexDirection: 'row',
    gap: 6,
  },
  controlBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#1b0c33',
    borderWidth: 1,
    borderColor: '#30185c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBtn: {
    opacity: 0.35,
  },
  iconText: {
    color: '#ffffff',
    fontSize: 11,
    textAlign: 'center',
  },
});
export default HUD;
