import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HUDProps {
  levelNumber: number;
  levelName: string;
  moves: number;
  par: number;
  timeLeft: number;
  bestScore: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onReset: () => void;
  isTimeAttack: boolean;
  onToggleTimeAttack: () => void;
  activeTurn: 'player' | 'computer';
}

export const HUD: React.FC<HUDProps> = ({
  levelNumber,
  levelName,
  moves,
  par,
  timeLeft,
  bestScore,
  isMuted,
  onToggleMute,
  onUndo,
  canUndo,
  onReset,
  isTimeAttack,
  onToggleTimeAttack,
  activeTurn,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Section: Title & Best Score */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.levelLabel}>LEVEL {levelNumber}</Text>
          <Text style={styles.levelName} numberOfLines={1}>
            {levelName}
          </Text>
        </View>
        <View style={styles.bestContainer}>
          <Text style={styles.bestLabel}>BEST SCORE</Text>
          <Text style={styles.bestValue}>{bestScore > 0 ? bestScore : '---'}</Text>
        </View>
      </View>

      {/* Middle Section: Turn Indicator */}
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

      {/* Bottom Section: Stats & Controls */}
      <View style={styles.bottomRow}>
        {/* Moves */}
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>MOVES</Text>
          <Text style={styles.statValue}>
            {moves} <Text style={styles.statSub}>/ Par {par}</Text>
          </Text>
        </View>

        {/* Timer (Time Attack button) */}
        <TouchableOpacity
          onPress={onToggleTimeAttack}
          style={styles.statBox}
          activeOpacity={0.7}
        >
          <Text style={styles.statLabel}>
            {isTimeAttack ? 'TIME LEFT (ON)' : 'TIME ATTACK (OFF)'}
          </Text>
          <Text
            style={[
              styles.statValue,
              isTimeAttack && timeLeft <= 10 && styles.lowTime,
              !isTimeAttack && styles.disabledTime,
            ]}
          >
            {isTimeAttack ? `${timeLeft}s` : 'DISABLED'}
          </Text>
        </TouchableOpacity>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Mute button */}
          <TouchableOpacity onPress={onToggleMute} style={styles.controlBtn}>
            <Text style={styles.iconText}>{isMuted ? '🔇' : '🔊'}</Text>
          </TouchableOpacity>
          {/* Undo button */}
          <TouchableOpacity
            onPress={onUndo}
            disabled={!canUndo}
            style={[styles.controlBtn, !canUndo && styles.disabledBtn]}
          >
            <Text style={styles.iconText}>⎌</Text>
          </TouchableOpacity>
          {/* Restart button */}
          <TouchableOpacity onPress={onReset} style={styles.controlBtn}>
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
    backgroundColor: 'rgba(31, 21, 58, 0.75)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#34225d',
    padding: 14,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52, 34, 93, 0.2)',
    paddingBottom: 6,
    marginBottom: 6,
  },
  levelLabel: {
    color: '#8b5cf6',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  levelName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    maxWidth: 200,
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
    fontSize: 15,
    fontWeight: '900',
  },
  turnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 6,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52, 34, 93, 0.2)',
  },
  turnLabel: {
    color: '#a37ee6',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  turnBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
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
  },
  computerTurnText: {
    color: '#ff00cc',
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
    fontSize: 15,
    fontWeight: '800',
  },
  statSub: {
    fontSize: 10,
    color: '#555577',
    fontWeight: '600',
  },
  lowTime: {
    color: '#ef4444',
  },
  disabledTime: {
    color: '#555577',
  },
  controls: {
    flexDirection: 'row',
    gap: 6,
  },
  controlBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1f153a',
    borderWidth: 1,
    borderColor: '#34225d',
    alignItems: 'center',
    justifyContent: 'center',
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
