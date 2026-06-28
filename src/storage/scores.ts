import AsyncStorage from '@react-native-async-storage/async-storage';

const BEST_SCORE_KEY_PREFIX = 'pawn_gambit_best_score_lvl_';
const UNLOCKED_LEVEL_KEY = 'pawn_gambit_unlocked_level';

/**
 * Retrieves the persisted best score for a specific level.
 */
export const getBestScore = async (levelId: number): Promise<number> => {
  try {
    const val = await AsyncStorage.getItem(`${BEST_SCORE_KEY_PREFIX}${levelId}`);
    return val ? parseInt(val, 10) : 0;
  } catch (e) {
    console.error('Failed to get best score', e);
    return 0;
  }
};

/**
 * Saves a new best score for a specific level.
 */
export const saveBestScore = async (levelId: number, score: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(`${BEST_SCORE_KEY_PREFIX}${levelId}`, score.toString());
  } catch (e) {
    console.error('Failed to save best score', e);
  }
};

/**
 * Retrieves the maximum unlocked level index.
 */
export const getUnlockedLevel = async (): Promise<number> => {
  try {
    const val = await AsyncStorage.getItem(UNLOCKED_LEVEL_KEY);
    return val ? parseInt(val, 10) : 1;
  } catch (e) {
    console.error('Failed to get unlocked level', e);
    return 1;
  }
};

/**
 * Persists the maximum unlocked level index.
 */
export const saveUnlockedLevel = async (levelId: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(UNLOCKED_LEVEL_KEY, levelId.toString());
  } catch (e) {
    console.error('Failed to save unlocked level', e);
  }
};
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.error('Failed to clear AsyncStorage', e);
  }
};
