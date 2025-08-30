import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Problem, GameSession, UserStats, GameSettings } from '../types';
import { ProblemGenerator } from '../utils/problemGenerator';
import { StorageManager } from '../utils/storage';
import { AnalyticsManager } from '../utils/analytics';
import { ScoringManager } from '../utils/scoring';

interface GameState {
  currentSession: GameSession | null;
  currentProblemIndex: number;
  currentStreak: number;
  userStats: UserStats;
  gameSettings: GameSettings;
  isPlaying: boolean;
  isPaused: boolean;
  timeRemaining: number | null;
  problemStartTime: number | null;
  
  startGame: (settings?: Partial<GameSettings>) => void;
  submitAnswer: (answer: number) => void;
  nextProblem: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetStats: () => void;
  loadData: () => void;
}

export const useGameStore = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    currentSession: null,
    currentProblemIndex: 0,
    currentStreak: 0,
    userStats: StorageManager.getUserStats(),
    gameSettings: StorageManager.getGameSettings(),
    isPlaying: false,
    isPaused: false,
    timeRemaining: null,
    problemStartTime: null,

    startGame: (settings = {}) => {
      const currentSettings = { ...get().gameSettings, ...settings };
      const problems = ProblemGenerator.generateProblems(
        currentSettings.operations,
        currentSettings.difficulty,
        currentSettings.problemCount,
        currentSettings.mode === 'custom' ? currentSettings.customModeSettings : undefined
      );

      const session: GameSession = {
        id: crypto.randomUUID(),
        mode: currentSettings.mode,
        difficulty: currentSettings.difficulty,
        operations: currentSettings.operations,
        problems,
        startTime: Date.now(),
        score: 0,
        accuracy: 0,
        averageTime: 0,
      };

      const timeRemaining = currentSettings.mode === 'timed' 
        ? (currentSettings.timeLimit || 300) // Default to 5 minutes if no timeLimit set
        : null;

      set({
        currentSession: session,
        currentProblemIndex: 0,
        currentStreak: 0,
        isPlaying: true,
        isPaused: false,
        timeRemaining,
        problemStartTime: Date.now(),
        gameSettings: currentSettings,
      });

      StorageManager.saveGameSettings(currentSettings);
    },

    submitAnswer: (answer: number) => {
      const state = get();
      if (!state.currentSession || !state.isPlaying || state.isPaused) return;

      const currentProblem = state.currentSession.problems[state.currentProblemIndex];
      if (!currentProblem || currentProblem.userAnswer !== undefined) return;

      const timeSpent = state.problemStartTime 
        ? (Date.now() - state.problemStartTime) / 1000 
        : 0;
      
      const isCorrect = ProblemGenerator.validateAnswer(currentProblem, answer);
      
      // Calculate scoring for custom mode
      const challengeMode = state.gameSettings.mode === 'custom' 
        ? state.gameSettings.customModeSettings?.challengeMode 
        : undefined;
      
      const scoring = ScoringManager.calculateProblemScore(
        { ...currentProblem, isCorrect, timeSpent },
        challengeMode,
        state.currentStreak
      );
      
      const updatedProblem: Problem = {
        ...currentProblem,
        userAnswer: answer,
        timeSpent,
        isCorrect,
        basePoints: scoring.basePoints,
        bonusPoints: scoring.bonusPoints,
      };

      const updatedProblems = [...state.currentSession.problems];
      updatedProblems[state.currentProblemIndex] = updatedProblem;

      // Update streak
      const newStreak = isCorrect ? state.currentStreak + 1 : 0;
      
      // Update session score
      const currentScore = state.currentSession.score || 0;
      const newScore = currentScore + scoring.totalPoints;

      const updatedSession: GameSession = {
        ...state.currentSession,
        problems: updatedProblems,
        score: newScore,
      };

      set({
        currentSession: updatedSession,
        currentStreak: newStreak,
        problemStartTime: Date.now(),
      });
    },

    nextProblem: () => {
      const state = get();
      if (!state.currentSession) return;

      const nextIndex = state.currentProblemIndex + 1;
      
      if (nextIndex >= state.currentSession.problems.length) {
        get().endGame();
        return;
      }

      set({
        currentProblemIndex: nextIndex,
        problemStartTime: Date.now(),
      });
    },

    pauseGame: () => {
      set({ isPaused: true });
    },

    resumeGame: () => {
      set({ 
        isPaused: false,
        problemStartTime: Date.now(),
      });
    },

    endGame: () => {
      const state = get();
      if (!state.currentSession) return;

      const endTime = Date.now();
      const sessionStats = AnalyticsManager.calculateSessionStats(state.currentSession);
      
      const finalSession: GameSession = {
        ...state.currentSession,
        endTime,
        ...sessionStats,
      };

      const updatedStats = AnalyticsManager.updateUserStats(state.userStats, finalSession);
      
      StorageManager.saveUserStats(updatedStats);
      StorageManager.saveSession(finalSession);

      set({
        currentSession: finalSession,
        userStats: updatedStats,
        isPlaying: false,
        isPaused: false,
        timeRemaining: null,
        problemStartTime: null,
      });
    },

    updateSettings: (settings: Partial<GameSettings>) => {
      const updatedSettings = { ...get().gameSettings, ...settings };
      set({ gameSettings: updatedSettings });
      StorageManager.saveGameSettings(updatedSettings);
    },

    resetStats: () => {
      StorageManager.clearAllData();
      set({
        userStats: StorageManager.getUserStats(),
        gameSettings: StorageManager.getGameSettings(),
        currentSession: null,
        currentProblemIndex: 0,
        currentStreak: 0,
        isPlaying: false,
        isPaused: false,
      });
    },

    loadData: () => {
      set({
        userStats: StorageManager.getUserStats(),
        gameSettings: StorageManager.getGameSettings(),
      });
    },
  }))
);