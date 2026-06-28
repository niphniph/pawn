import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GameModalProps {
  visible: boolean;
  status: 'gameover' | 'won';
  moves: number;
  timeLeft: number;
  score: number;
  bestScore: number;
  onRestart: () => void;
  gameOverReason?: 'time' | 'no_moves' | 'opponent_escaped' | null;
}

export const GameModal: React.FC<GameModalProps> = ({
  visible,
  status,
  moves,
  timeLeft,
  score,
  bestScore,
  onRestart,
  gameOverReason = 'time',
}) => {
  // Custom headers and descriptions based on gameover reasons
  let badgeText = "TIME'S UP!";
  let mainTitle = "GAME OVER";
  let descText = "You ran out of time! Race faster next time.";

  if (gameOverReason === 'no_moves') {
    badgeText = "TRAPPED!";
    mainTitle = "GAME OVER";
    descText = "You have no valid moves remaining. Plan ahead to avoid trapping yourself!";
  } else if (gameOverReason === 'opponent_escaped') {
    badgeText = "DEFEATED!";
    mainTitle = "GAME OVER";
    descText = "The computer opponent reached the target row first! Use your moves to block their path.";
  }

  const isWon = status === 'won';

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient
          colors={['#251249', '#0d041e']}
          style={[
            styles.modalContainer,
            { borderColor: isWon ? '#00ccff' : '#ef4444' }
          ]}
        >
          {isWon ? (
            <View style={styles.content}>
              <View style={[styles.badgeContainer, styles.successBadge]}>
                <Text style={[styles.badge, styles.successBadgeText]}>VICTORY!</Text>
              </View>
              <Text style={styles.title}>LEVEL COMPLETE</Text>
              <Text style={styles.description}>
                You reached the bottom row and outmaneuvered the computer!
              </Text>
              
              <View style={styles.statsCard}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Moves Taken:</Text>
                  <Text style={styles.statValue}>{moves}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Time Remaining:</Text>
                  <Text style={styles.statValue}>{timeLeft}s</Text>
                </View>
                <View style={[styles.statRow, styles.scoreRow]}>
                  <Text style={styles.scoreLabel}>SCORE:</Text>
                  <Text style={styles.scoreValue}>{score}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Best Score:</Text>
                  <Text style={styles.bestValue}>{bestScore}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={onRestart} style={styles.primaryBtn} activeOpacity={0.8}>
                <LinearGradient colors={['#00ccff', '#0077b3']} style={styles.btnGradient}>
                  <Text style={styles.btnText}>PLAY AGAIN</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.content}>
              <View style={[styles.badgeContainer, styles.dangerBadge]}>
                <Text style={[styles.badge, styles.dangerBadgeText]}>{badgeText}</Text>
              </View>
              <Text style={styles.title}>{mainTitle}</Text>
              <Text style={styles.description}>{descText}</Text>
              
              <View style={styles.statsCard}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Moves Made:</Text>
                  <Text style={styles.statValue}>{moves}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Time Left:</Text>
                  <Text style={styles.statValue}>{timeLeft}s</Text>
                </View>
              </View>

              <TouchableOpacity onPress={onRestart} style={styles.primaryBtn} activeOpacity={0.8}>
                <LinearGradient colors={['#ef4444', '#991b1b']} style={styles.btnGradient}>
                  <Text style={styles.btnText}>TRY AGAIN</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 2, 12, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    borderWidth: 2,
    padding: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  badgeContainer: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  badge: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  dangerBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  dangerBadgeText: {
    color: '#ef4444',
  },
  successBadge: {
    backgroundColor: 'rgba(0, 204, 255, 0.15)',
    borderColor: 'rgba(0, 204, 255, 0.4)',
  },
  successBadgeText: {
    color: '#00ccff',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    color: '#a37ee6',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statsCard: {
    width: '100%',
    backgroundColor: 'rgba(16, 9, 36, 0.6)',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#30185c',
    padding: 16,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  statLabel: {
    color: '#a37ee6',
    fontSize: 13,
    fontWeight: '600',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  bestValue: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: '800',
  },
  scoreRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(48, 24, 92, 0.4)',
    marginTop: 8,
    paddingTop: 8,
  },
  scoreLabel: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '900',
  },
  scoreValue: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: '900',
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
  },
  btnGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
});
export default GameModal;
