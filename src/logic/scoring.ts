/**
 * Calculates the score for Time Attack mode.
 * score = remainingTime * 100 - moves * 5
 * Minimum score is 0.
 */
export const calculateScore = (timeLeft: number, moves: number): number => {
  const score = timeLeft * 100 - moves * 5;
  return Math.max(0, score);
};
