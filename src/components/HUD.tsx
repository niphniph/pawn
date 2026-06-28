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
      {/* Top Row: Modes & Best Score */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.modeLabel}>MODE</Text>
          <Text style={styles.modeValue}>TIME ATTACK</Text>
        </View>
        <View style={styles.bestContainer}>
          <Text style={styles.bestLabel}>BEST SCORE</Text>
          <Text style={styles.bestValue}>{bestScore > 0 ? bestScore : '0'}</Text>
        </View>
      </View>

      {/* Middle Row: Active Turn Badge */}
      <View style={styles.turnRow}>
        <Text style={styles.turnLabel}>ACTIVE TURN</Text>
        <View
          style={[
            styles.turnBadge,
            activeTurn === 'player' ? styles.playerTurnBadge : styles.computerTurnBadge,
          ]}
        >
          <Text
            style={[
              styles.turnBadgeText,
              activeTurn === 'player' ? styles.playerTurnText : styles.computerTurnText,
            ]}
          >
            {activeTurn === 'player' ? 'YOUR TURN' : 'COMPUTER TURN'}
          </Text>
        </View>
      </View>

      {/* Bottom Row: Stats and Game Actions */}
      <View style={styles.bottomRow}>
        {/* Moves Stats */}
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>MOVES</Text>
          <Text style={styles.statValue}>{moves}</Text>
        </View>

        {/* Timer Countdown */}
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TIME LEFT</Text>
          <Text style={[styles.statValue, timeLeft <= 10 && styles.lowTime]}>
            {timeLeft}s
          </Text>
        </View>

        {/* Buttons Controls */}
        <View style={styles.controls}>
          {/* Mute Button */}
          <TouchableOpacity onPress={onToggleMute} style={styles.controlBtn} activeOpacity={0.7}>
            <Text style={styles.iconText}>{isMuted ? '🔇' : '🔊'}</Text>
          </TouchableOpacity>

          {/* Undo Button */}
          <TouchableOpacity
            onPress={onUndo}
            disabled={!canUndo}
            style={[styles.controlBtn, !canUndo && styles.disabledBtn]}
            activeOpacity={0.7}
          >
            <Text style={styles.iconText}>⎌</Text>
          </TouchableOpacity>

          {/* Reset Button */}
          <TouchableOpacity onPress={onReset} style={styles.controlBtn} activeOpacity={0.7}>
            <Text style={styles.iconText}>⟲</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(31, 21, 58, 0.8)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#3a1d74',
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(58, 29, 116, 0.4)',
    paddingBottom: 6,
    marginBottom: 6,
  },
  modeLabel: {
    color: '#8b5cf6',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  modeValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  bestContainer: {
    alignItems: 'flex-end',
  },
  bestLabel: {
    color: '#fbbf24',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  bestValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    textShadowColor: 'rgba(251, 191, 36, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  turnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(58, 29, 116, 0.4)',
  },
  turnLabel: {
    color: '#a37ee6',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  turnBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  playerTurnBadge: {
    backgroundColor: 'rgba(0, 204, 255, 0.1)',
    borderColor: '#00ccff',
  },
  computerTurnBadge: {
    backgroundColor: 'rgba(255, 0, 204, 0.1)',
    borderColor: '#ff00cc',
  },
  turnBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  playerTurnText: {
    color: '#00ccff',
    textShadowColor: 'rgba(0, 204, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  computerTurnText: {
    color: '#ff00cc',
    textShadowColor: 'rgba(255, 0, 204, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    color: '#a37ee6',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  lowTime: {
    color: '#ef4444',
    textShadowColor: 'rgba(239, 68, 68, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#20123a',
    borderWidth: 1.5,
    borderColor: '#3a1d74',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  iconText: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
});
export default HUD;
