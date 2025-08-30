import { Problem, UserStats, GameSession, Operation, Difficulty, ModeRecord } from '../types';

export class AnalyticsManager {
  static calculateSessionStats(session: GameSession): {
    score: number;
    accuracy: number;
    averageTime: number;
    totalTime: number;
  } {
    const completedProblems = session.problems.filter(p => p.userAnswer !== undefined);
    const correctProblems = completedProblems.filter(p => p.isCorrect);
    
    const totalTime = completedProblems.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    const averageTime = completedProblems.length > 0 ? totalTime / completedProblems.length : 0;
    const accuracy = completedProblems.length > 0 ? (correctProblems.length / completedProblems.length) * 100 : 0;
    const score = Math.round(accuracy * completedProblems.length / 10);

    return {
      score,
      accuracy: Math.round(accuracy * 100) / 100,
      averageTime: Math.round(averageTime * 100) / 100,
      totalTime: Math.round(totalTime * 100) / 100,
    };
  }

  static updateUserStats(stats: UserStats, session: GameSession): UserStats {
    const sessionStats = this.calculateSessionStats(session);
    const completedProblems = session.problems.filter(p => p.userAnswer !== undefined);
    const correctProblems = completedProblems.filter(p => p.isCorrect);

    const newStats: UserStats = {
      ...stats,
      totalProblems: stats.totalProblems + completedProblems.length,
      correctAnswers: stats.correctAnswers + correctProblems.length,
      totalTime: stats.totalTime + sessionStats.totalTime,
      sessions: [session, ...stats.sessions.slice(0, 99)],
    };

    newStats.streakCurrent = this.calculateCurrentStreak(session.problems);
    newStats.streakBest = Math.max(stats.streakBest, newStats.streakCurrent);

    newStats.operationStats = this.updateOperationStats(stats.operationStats, completedProblems);
    newStats.difficultyStats = this.updateDifficultyStats(stats.difficultyStats, session.difficulty, completedProblems);
    newStats.modeRecords = this.updateModeRecords(stats.modeRecords, session, sessionStats);

    return newStats;
  }

  private static calculateCurrentStreak(problems: Problem[]): number {
    let streak = 0;
    for (let i = problems.length - 1; i >= 0; i--) {
      const problem = problems[i];
      if (problem.userAnswer === undefined) continue;
      if (problem.isCorrect) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  private static updateOperationStats(
    currentStats: UserStats['operationStats'],
    problems: Problem[]
  ): UserStats['operationStats'] {
    const newStats = { ...currentStats };

    problems.forEach(problem => {
      const operation = problem.operation;
      const stats = newStats[operation];
      
      const newAttempted = stats.attempted + 1;
      const newCorrect = stats.correct + (problem.isCorrect ? 1 : 0);
      const newTotalTime = stats.averageTime * stats.attempted + (problem.timeSpent || 0);
      const newAverageTime = newTotalTime / newAttempted;

      newStats[operation] = {
        attempted: newAttempted,
        correct: newCorrect,
        averageTime: Math.round(newAverageTime * 100) / 100,
      };
    });

    return newStats;
  }

  private static updateDifficultyStats(
    currentStats: UserStats['difficultyStats'],
    difficulty: Difficulty,
    problems: Problem[]
  ): UserStats['difficultyStats'] {
    const newStats = { ...currentStats };
    const stats = newStats[difficulty];
    
    const correctCount = problems.filter(p => p.isCorrect).length;
    const totalTime = problems.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    
    const newAttempted = stats.attempted + problems.length;
    const newCorrect = stats.correct + correctCount;
    const newTotalTime = stats.averageTime * stats.attempted + totalTime;
    const newAverageTime = newAttempted > 0 ? newTotalTime / newAttempted : 0;

    newStats[difficulty] = {
      attempted: newAttempted,
      correct: newCorrect,
      averageTime: Math.round(newAverageTime * 100) / 100,
    };

    return newStats;
  }

  private static updateModeRecords(
    currentRecords: UserStats['modeRecords'], 
    session: GameSession,
    sessionStats: { score: number; accuracy: number; averageTime: number; totalTime: number }
  ): UserStats['modeRecords'] {
    const newRecords = { ...currentRecords };
    const currentRecord = newRecords[session.mode];
    
    const sessionTime = session.endTime && session.startTime 
      ? (session.endTime - session.startTime) / 1000 
      : sessionStats.totalTime;

    // Check if this session sets a new record
    const isNewRecord = !currentRecord || 
      sessionStats.score > currentRecord.bestScore ||
      (sessionStats.score === currentRecord.bestScore && sessionStats.accuracy > currentRecord.bestAccuracy) ||
      (sessionStats.score === currentRecord.bestScore && sessionStats.accuracy === currentRecord.bestAccuracy && sessionTime < currentRecord.bestTime);

    if (isNewRecord) {
      newRecords[session.mode] = {
        bestTime: sessionTime,
        bestScore: sessionStats.score,
        bestAccuracy: sessionStats.accuracy,
        sessionId: session.id,
        achievedAt: Date.now(),
      };
    }

    return newRecords;
  }

  static isNewRecord(
    currentRecord: ModeRecord | null,
    sessionStats: { score: number; accuracy: number; totalTime: number }
  ): boolean {
    if (!currentRecord) return true;
    
    return sessionStats.score > currentRecord.bestScore ||
      (sessionStats.score === currentRecord.bestScore && sessionStats.accuracy > currentRecord.bestAccuracy) ||
      (sessionStats.score === currentRecord.bestScore && 
       sessionStats.accuracy === currentRecord.bestAccuracy && 
       sessionStats.totalTime < currentRecord.bestTime);
  }

  static getPerformanceInsights(stats: UserStats): {
    weakestOperation: Operation | null;
    strongestOperation: Operation | null;
    recommendedDifficulty: Difficulty;
    improvementAreas: string[];
  } {
    const operationAccuracies = Object.entries(stats.operationStats).map(([op, stat]) => ({
      operation: op as Operation,
      accuracy: stat.attempted > 0 ? (stat.correct / stat.attempted) * 100 : 0,
      attempted: stat.attempted,
    }));

    const attemptedOperations = operationAccuracies.filter(op => op.attempted > 0);
    
    const weakestOperation = attemptedOperations.length > 0 
      ? attemptedOperations.reduce((min, op) => op.accuracy < min.accuracy ? op : min).operation 
      : null;
    
    const strongestOperation = attemptedOperations.length > 0
      ? attemptedOperations.reduce((max, op) => op.accuracy > max.accuracy ? op : max).operation
      : null;

    const overallAccuracy = stats.totalProblems > 0 ? (stats.correctAnswers / stats.totalProblems) * 100 : 0;
    
    let recommendedDifficulty: Difficulty = 'beginner';
    if (overallAccuracy > 90 && stats.totalProblems > 50) {
      recommendedDifficulty = 'advanced';
    } else if (overallAccuracy > 75 && stats.totalProblems > 20) {
      recommendedDifficulty = 'intermediate';
    }

    const improvementAreas: string[] = [];
    if (overallAccuracy < 70) {
      improvementAreas.push('Focus on accuracy over speed');
    }
    if (stats.totalTime / stats.totalProblems > 10) {
      improvementAreas.push('Practice for faster problem solving');
    }
    if (weakestOperation) {
      improvementAreas.push(`Practice more ${weakestOperation} problems`);
    }

    return {
      weakestOperation,
      strongestOperation,
      recommendedDifficulty,
      improvementAreas,
    };
  }
}