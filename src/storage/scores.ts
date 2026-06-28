import AsyncStorage from '@react-native-async-storage/async-storage';

const BEST_SCORE_KEY = 'pawn_gambit_time_attack_best_score';

/**
 * Retrieves the persisted best score.
 */
export const getBestScore = async (): Promise<number> => {
  try {
    const val = await AsyncStorage.getItem(BEST_SCORE_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch (e) {
    console.error('Failed to get best score', e);
    return 0;
  }
};

/**
 * Saves a new best score.
 */
export const saveBestScore = async (score: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(BEST_SCORE_KEY, score.toString());
  } catch (e) {
    console.error('Failed to save best score', e);
  }
};

/**
 * Clears score storage.
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(BEST_SCORE_KEY);
  } catch (e) {
    console.error('Failed to clear AsyncStorage', e);
  }
};
