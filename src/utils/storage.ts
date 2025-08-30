import { UserStats, GameSession, GameSettings } from '../types';

const STORAGE_KEYS = {
  USER_STATS: 'arithmetic_practice_user_stats',
  GAME_SETTINGS: 'arithmetic_practice_game_settings',
  SESSIONS: 'arithmetic_practice_sessions',
} as const;

export class StorageManager {
  static getUserStats(): UserStats {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
      if (!stored) return this.getDefaultUserStats();
      
      return JSON.parse(stored) as UserStats;
    } catch (error) {
      console.error('Error loading user stats:', error);
      return this.getDefaultUserStats();
    }
  }

  static saveUserStats(stats: UserStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  }

  static getGameSettings(): GameSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GAME_SETTINGS);
      if (!stored) return this.getDefaultGameSettings();
      
      return JSON.parse(stored) as GameSettings;
    } catch (error) {
      console.error('Error loading game settings:', error);
      return this.getDefaultGameSettings();
    }
  }

  static saveGameSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving game settings:', error);
    }
  }

  static saveSession(session: GameSession): void {
    try {
      const sessions = this.getSessions();
      sessions.unshift(session);
      
      if (sessions.length > 100) {
        sessions.splice(100);
      }
      
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  static getSessions(): GameSession[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return stored ? JSON.parse(stored) as GameSession[] : [];
    } catch (error) {
      console.error('Error loading sessions:', error);
      return [];
    }
  }

  static clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  private static getDefaultUserStats(): UserStats {
    return {
      totalProblems: 0,
      correctAnswers: 0,
      totalTime: 0,
      streakCurrent: 0,
      streakBest: 0,
      operationStats: {
        addition: { attempted: 0, correct: 0, averageTime: 0 },
        subtraction: { attempted: 0, correct: 0, averageTime: 0 },
        multiplication: { attempted: 0, correct: 0, averageTime: 0 },
        division: { attempted: 0, correct: 0, averageTime: 0 },
      },
      difficultyStats: {
        beginner: { attempted: 0, correct: 0, averageTime: 0 },
        intermediate: { attempted: 0, correct: 0, averageTime: 0 },
        advanced: { attempted: 0, correct: 0, averageTime: 0 },
      },
      modeRecords: {
        practice: null,
        timed: null,
        custom: null,
      },
      sessions: [],
    };
  }

  private static getDefaultGameSettings(): GameSettings {
    return {
      difficulty: 'beginner',
      operations: ['addition', 'subtraction'],
      mode: 'practice',
      timeLimit: 300, // 5 minutes default
      problemCount: 10,
      soundEnabled: true,
      showHints: true,
      numberDisplayMode: 'decimal',
      customModeSettings: {
        difficulty: 'beginner',
        numberSettings: {
          digits: 2,
          allowNegatives: false,
          includeNonIntegers: false,
        },
        speedBonusEnabled: true,
        streakBonusEnabled: true,
      },
    };
  }
}