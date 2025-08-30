import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Problem, GameSession, UserStats, GameSettings } from '../types';
import { ProblemGenerator } from '../utils/problemGenerator';
import { StorageManager } from '../utils/storage';
import { AnalyticsManager } from '../utils/analytics';

interface GameState {
  currentSession: GameSession | null;
  currentProblemIndex: number;
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
        currentSettings.problemCount
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

      set({
        currentSession: session,
        currentProblemIndex: 0,
        isPlaying: true,
        isPaused: false,
        timeRemaining: currentSettings.timeLimit || null,
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
      
      const updatedProblem: Problem = {
        ...currentProblem,
        userAnswer: answer,
        timeSpent,
        isCorrect,
      };

      const updatedProblems = [...state.currentSession.problems];
      updatedProblems[state.currentProblemIndex] = updatedProblem;

      const updatedSession: GameSession = {
        ...state.currentSession,
        problems: updatedProblems,
      };

      set({
        currentSession: updatedSession,
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