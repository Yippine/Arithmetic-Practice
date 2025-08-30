export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Mode = 'practice' | 'timed' | 'custom';

export interface Problem {
  id: string;
  operand1: number;
  operand2: number;
  operation: Operation;
  correctAnswer: number;
  userAnswer?: number;
  timeSpent?: number;
  isCorrect?: boolean;
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
  sessions: GameSession[];
}

export interface GameSettings {
  difficulty: Difficulty;
  operations: Operation[];
  mode: Mode;
  timeLimit?: number;
  problemCount: number;
  soundEnabled: boolean;
  showHints: boolean;
}