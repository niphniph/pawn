import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GameModalProps {
  visible: boolean;
  status: 'start' | 'gameover' | 'won';
  levelName: string;
  levelNumber: number;
  moves: number;
  par: number;
  timeLeft: number;
  score: number;
  bestScore: number;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
  gameOverReason?: 'time' | 'no_moves' | 'opponent_escaped' | null;
}

export const GameModal: React.FC<GameModalProps> = ({
  visible,
  status,
  levelName,
  levelNumber,
  moves,
  par,
  timeLeft,
  score,
  bestScore,
  onPrimaryAction,
  onSecondaryAction,
  gameOverReason = 'time',
}) => {
  // Compute custom gameover text based on reason
  let badgeText = "TIME'S UP!";
  let mainTitle = "RUN FAILED";
  let descText = "You ran out of time! Try again to solve the maze.";

  if (gameOverReason === 'no_moves') {
    badgeText = "TRAPPED!";
    mainTitle = "NO MOVES LEFT";
    descText = "You have no valid moves remaining. Plan your moves carefully to avoid boxing yourself in!";
  } else if (gameOverReason === 'opponent_escaped') {
    badgeText = "DEFEATED!";
    mainTitle = "OPPONENT ESCAPED";
    descText = "The Pink computer opponent reached the top row target first! Try to block their path next time.";
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient
          colors={['#2a114f', '#190739']}
          style={styles.modalContainer}
        >
          {status === 'start' && (
            <View style={styles.content}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badge}>PAWN GAMBIT DUEL</Text>
              </View>
              <Text style={styles.title}>LEVEL {levelNumber}</Text>
              <Text style={styles.subtitleText}>{levelName}</Text>
              <Text style={styles.description}>
                Control the Cyan player ball. Reach the bottom row first to win! Pink is the computer opponent aiming for the top row. Every step builds a yellow wall behind the moved ball. Trap the opponent or race to your goal!
              </Text>
              <Text style={styles.timerText}>TIME LIMIT: {timeLeft} SECONDS</Text>
              <TouchableOpacity onPress={onPrimaryAction} style={styles.primaryBtn} activeOpacity={0.8}>
                <LinearGradient colors={['#00ccff', '#0088cc']} style={styles.btnGradient}>
                  <Text style={styles.btnText}>START DUEL</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {status === 'gameover' && (
            <View style={styles.content}>
              <View style={[styles.badgeContainer, styles.dangerBadge]}>
                <Text style={[styles.badge, styles.dangerBadgeText]}>{badgeText}</Text>
              </View>
              <Text style={styles.title}>{mainTitle}</Text>
              <Text style={styles.description}>{descText}</Text>
              <TouchableOpacity onPress={onPrimaryAction} style={styles.primaryBtn} activeOpacity={0.8}>
                <LinearGradient colors={['#ef4444', '#b91c1c']} style={styles.btnGradient}>
                  <Text style={styles.btnText}>RETRY DUEL</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {status === 'won' && (
            <View style={styles.content}>
              <View style={[styles.badgeContainer, styles.successBadge]}>
                <Text style={[styles.badge, styles.successBadgeText]}>VICTORY!</Text>
              </View>
              <Text style={styles.title}>{levelName}</Text>
              
              <View style={styles.statsCard}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Moves Taken:</Text>
                  <Text style={styles.statValue}>{moves} (Par: {par})</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Time Left:</Text>
                  <Text style={styles.statValue}>{timeLeft}s</Text>
                </View>
                <View style={[styles.statRow, styles.scoreRow]}>
                  <Text style={styles.scoreLabel}>SCORE:</Text>
                  <Text style={styles.scoreValue}>{score}</Text>
                </View>
              </View>

              <View style={styles.btnRow}>
                {onSecondaryAction && (
                  <TouchableOpacity onPress={onSecondaryAction} style={styles.secondaryBtn} activeOpacity={0.8}>
                    <Text style={styles.secondaryBtnText}>REPLAY</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onPrimaryAction} style={onSecondaryAction ? styles.halfBtn : styles.primaryBtn} activeOpacity={0.8}>
                  <LinearGradient colors={['#00ccff', '#0088cc']} style={styles.btnGradient}>
                    <Text style={styles.btnText}>
                      {levelNumber < 10 ? 'NEXT LEVEL' : 'RESTART'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#6b21a8',
    padding: 24,
    shadowColor: '#6b21a8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  badgeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 204, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 204, 255, 0.3)',
    marginBottom: 16,
  },
  badge: {
    color: '#00ccff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  dangerBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  dangerBadgeText: {
    color: '#ef4444',
  },
  successBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  successBadgeText: {
    color: '#10b981',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitleText: {
    color: '#a37ee6',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    color: '#a37ee6',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  timerText: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 24,
    letterSpacing: 1,
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
  statsCard: {
    width: '100%',
    backgroundColor: 'rgba(31, 21, 58, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34225d',
    padding: 14,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  statLabel: {
    color: '#a37ee6',
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  scoreRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(52, 34, 93, 0.3)',
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
  btnRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  halfBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
  },
  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#34225d',
    backgroundColor: '#1f153a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: '#a37ee6',
    fontWeight: '800',
    fontSize: 13,
  },
});
export default GameModal;
