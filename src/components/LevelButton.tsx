import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LevelButtonProps {
  id: number;
  isActive: boolean;
  isUnlocked: boolean;
  onPress: () => void;
}

export const LevelButton: React.FC<LevelButtonProps> = ({ id, isActive, isUnlocked, onPress }) => {
  if (!isUnlocked) {
    return (
      <View style={[styles.button, styles.locked]}>
        <Text style={styles.lockedText}>Lvl {id}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
      <LinearGradient
        colors={isActive ? ['#8b5cf6', '#581ca6'] : ['#1f153a', '#171030']}
        style={[styles.button, isActive && styles.activeBorder]}
      >
        <Text style={isActive ? styles.activeText : styles.unlockedText}>Lvl {id}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginVertical: 6,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 65,
  },
  activeBorder: {
    borderWidth: 1.5,
    borderColor: '#00ccff',
  },
  locked: {
    marginHorizontal: 4,
    marginVertical: 6,
    backgroundColor: '#0a0515',
    borderWidth: 1,
    borderColor: '#2d2055',
    opacity: 0.4,
  },
  activeText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 12,
  },
  unlockedText: {
    color: '#a37ee6',
    fontWeight: '700',
    fontSize: 12,
  },
  lockedText: {
    color: '#444',
    fontWeight: '600',
    fontSize: 12,
  },
});
export default LevelButton;
