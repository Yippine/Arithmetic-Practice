import { Operation, Difficulty, Problem } from '../types';

interface DifficultyConfig {
  minValue: number;
  maxValue: number;
  allowDecimals: boolean;
  allowNegative: boolean;
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  beginner: {
    minValue: 1,
    maxValue: 10,
    allowDecimals: false,
    allowNegative: false,
  },
  intermediate: {
    minValue: 1,
    maxValue: 100,
    allowDecimals: false,
    allowNegative: true,
  },
  advanced: {
    minValue: 1,
    maxValue: 1000,
    allowDecimals: true,
    allowNegative: true,
  },
};

export class ProblemGenerator {
  private static getRandomNumber(min: number, max: number, allowDecimals: boolean): number {
    const random = Math.random() * (max - min) + min;
    return allowDecimals ? Math.round(random * 10) / 10 : Math.floor(random);
  }

  private static generateAddition(difficulty: Difficulty): Problem {
    const config = DIFFICULTY_CONFIGS[difficulty];
    const operand1 = this.getRandomNumber(config.minValue, config.maxValue, config.allowDecimals);
    const operand2 = this.getRandomNumber(config.minValue, config.maxValue, config.allowDecimals);
    
    return {
      id: crypto.randomUUID(),
      operand1,
      operand2,
      operation: 'addition',
      correctAnswer: Math.round((operand1 + operand2) * 10) / 10,
    };
  }

  private static generateSubtraction(difficulty: Difficulty): Problem {
    const config = DIFFICULTY_CONFIGS[difficulty];
    let operand1 = this.getRandomNumber(config.minValue, config.maxValue, config.allowDecimals);
    let operand2 = this.getRandomNumber(config.minValue, config.maxValue, config.allowDecimals);
    
    if (!config.allowNegative && operand2 > operand1) {
      [operand1, operand2] = [operand2, operand1];
    }
    
    return {
      id: crypto.randomUUID(),
      operand1,
      operand2,
      operation: 'subtraction',
      correctAnswer: Math.round((operand1 - operand2) * 10) / 10,
    };
  }

  private static generateMultiplication(difficulty: Difficulty): Problem {
    const config = DIFFICULTY_CONFIGS[difficulty];
    const maxForMultiplication = difficulty === 'beginner' ? 12 : 
                                difficulty === 'intermediate' ? 25 : 50;
    
    const operand1 = this.getRandomNumber(config.minValue, maxForMultiplication, false);
    const operand2 = this.getRandomNumber(config.minValue, maxForMultiplication, false);
    
    return {
      id: crypto.randomUUID(),
      operand1,
      operand2,
      operation: 'multiplication',
      correctAnswer: operand1 * operand2,
    };
  }

  private static generateDivision(difficulty: Difficulty): Problem {
    const maxForDivision = difficulty === 'beginner' ? 12 : 
                          difficulty === 'intermediate' ? 25 : 50;
    
    const divisor = this.getRandomNumber(2, maxForDivision, false);
    const quotient = this.getRandomNumber(1, maxForDivision, false);
    const dividend = divisor * quotient;
    
    return {
      id: crypto.randomUUID(),
      operand1: dividend,
      operand2: divisor,
      operation: 'division',
      correctAnswer: quotient,
    };
  }

  static generateProblem(operation: Operation, difficulty: Difficulty): Problem {
    switch (operation) {
      case 'addition':
        return this.generateAddition(difficulty);
      case 'subtraction':
        return this.generateSubtraction(difficulty);
      case 'multiplication':
        return this.generateMultiplication(difficulty);
      case 'division':
        return this.generateDivision(difficulty);
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  static generateProblems(
    operations: Operation[],
    difficulty: Difficulty,
    count: number
  ): Problem[] {
    const problems: Problem[] = [];
    
    for (let i = 0; i < count; i++) {
      const operation = operations[Math.floor(Math.random() * operations.length)];
      problems.push(this.generateProblem(operation, difficulty));
    }
    
    return problems;
  }

  static validateAnswer(problem: Problem, userAnswer: number): boolean {
    if (problem.operation === 'division') {
      return Math.abs(userAnswer - problem.correctAnswer) < 0.01;
    }
    return userAnswer === problem.correctAnswer;
  }
}