import { Problem, ChallengeMode, Difficulty } from '../types';

const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  beginner: 10,
  intermediate: 20,
  advanced: 30,
};

const SPEED_THRESHOLDS = {
  beginner: { fast: 3, veryFast: 1.5 },
  intermediate: { fast: 5, veryFast: 3 },
  advanced: { fast: 8, veryFast: 5 },
};

export class ScoringManager {
  static calculateProblemScore(
    problem: Problem, 
    challengeMode?: ChallengeMode,
    currentStreak: number = 0
  ): { basePoints: number; bonusPoints: number; totalPoints: number } {
    if (!problem.isCorrect) {
      return { basePoints: 0, bonusPoints: 0, totalPoints: 0 };
    }

    const difficulty = problem.difficulty || 'beginner';
    const basePoints = DIFFICULTY_POINTS[difficulty];
    let bonusPoints = 0;

    // Speed bonus
    if (challengeMode === 'speed' && problem.timeSpent) {
      const thresholds = SPEED_THRESHOLDS[difficulty];
      if (problem.timeSpent <= thresholds.veryFast) {
        bonusPoints += basePoints * 1.0; // 100% bonus for very fast
      } else if (problem.timeSpent <= thresholds.fast) {
        bonusPoints += basePoints * 0.5; // 50% bonus for fast
      }
    }

    // Streak bonus
    if (challengeMode === 'streak' && currentStreak > 0) {
      const streakMultiplier = Math.min(currentStreak * 0.1, 2.0); // Max 200% bonus
      bonusPoints += basePoints * streakMultiplier;
    }

    // Accuracy bonus (for accuracy challenge mode)
    if (challengeMode === 'accuracy') {
      // Accuracy challenge gives bonus for first-try correctness
      bonusPoints += basePoints * 0.3; // 30% bonus for being correct
    }

    const totalPoints = basePoints + bonusPoints;
    return { basePoints, bonusPoints, totalPoints };
  }

  static calculateStreakBonus(streak: number): number {
    if (streak < 3) return 0;
    if (streak < 5) return 50;
    if (streak < 10) return 100;
    if (streak < 20) return 200;
    return 500;
  }

  static getSpeedRating(timeSpent: number, difficulty: Difficulty): 'slow' | 'normal' | 'fast' | 'veryfast' {
    const thresholds = SPEED_THRESHOLDS[difficulty];
    if (timeSpent <= thresholds.veryFast) return 'veryfast';
    if (timeSpent <= thresholds.fast) return 'fast';
    if (timeSpent <= thresholds.fast * 2) return 'normal';
    return 'slow';
  }
}