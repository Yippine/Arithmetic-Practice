export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Mode = 'practice' | 'timed' | 'custom';

export type ChallengeMode = 'speed' | 'streak' | 'accuracy';

export interface CustomRange {
  min: number;
  max: number;
}

export interface NumberSettings {
  digits: number; // 1-9 digits
  allowNegatives: boolean;
  includeNonIntegers: boolean; // Include problems with decimal/fraction answers
}

export interface CustomModeSettings {
  difficulty: Difficulty;
  numberSettings: NumberSettings;
  customRanges?: {
    operand1?: CustomRange;
    operand2?: CustomRange;
  };
  challengeMode?: ChallengeMode;
  speedBonusEnabled: boolean;
  streakBonusEnabled: boolean;
}

export interface Problem {
  id: string;
  operand1: number;
  operand2: number;
  operation: Operation;
  correctAnswer: number;
  userAnswer?: number;
  timeSpent?: number;
  isCorrect?: boolean;
  basePoints?: number;
  bonusPoints?: number;
  difficulty?: Difficulty;
}

export interface GameSession {
  id: string;
  mode: Mode;
  difficulty: Difficulty;
  operations: Operation[];
  problems: Problem[];
  startTime: number;
  endTime?: number;
  score: number;
  accuracy: number;
  averageTime: number;
}

export interface ModeRecord {
  bestTime: number;
  bestScore: number;
  bestAccuracy: number;
  sessionId: string;
  achievedAt: number;
}

export interface UserStats {
  totalProblems: number;
  correctAnswers: number;
  totalTime: number;
  streakCurrent: number;
  streakBest: number;
  operationStats: Record<Operation, {
    attempted: number;
    correct: number;
    averageTime: number;
  }>;
  difficultyStats: Record<Difficulty, {
    attempted: number;
    correct: number;
    averageTime: number;
  }>;
  modeRecords: Record<Mode, ModeRecord | null>;
  sessions: GameSession[];
}

export type NumberDisplayMode = 'decimal' | 'fraction';

export interface GameSettings {
  difficulty: Difficulty;
  operations: Operation[];
  mode: Mode;
  timeLimit?: number;
  problemCount: number;
  soundEnabled: boolean;
  showHints: boolean;
  numberDisplayMode: NumberDisplayMode;
  customModeSettings?: CustomModeSettings;
}