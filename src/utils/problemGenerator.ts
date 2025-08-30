import { Operation, Difficulty, Problem, CustomModeSettings } from '../types';

interface DifficultyConfig {
  minValue: number;
  maxValue: number;
  includeNonIntegers: boolean;
  allowNegative: boolean;
}

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  beginner: {
    minValue: 1,
    maxValue: 10,
    includeNonIntegers: false,
    allowNegative: false,
  },
  intermediate: {
    minValue: 1,
    maxValue: 100,
    includeNonIntegers: false,
    allowNegative: true,
  },
  advanced: {
    minValue: 1,
    maxValue: 1000,
    includeNonIntegers: true,
    allowNegative: true,
  },
};

export class ProblemGenerator {
  private static getRandomNumber(min: number, max: number, includeNonIntegers: boolean): number {
    const random = Math.random() * (max - min) + min;
    return includeNonIntegers ? Math.round(random * 10) / 10 : Math.floor(random);
  }

  private static getDigitRange(digits: number): { min: number; max: number } {
    if (digits === 1) {
      return { min: 1, max: 9 };
    }
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return { min, max };
  }

  private static getEffectiveConfig(
    difficulty: Difficulty, 
    customSettings?: CustomModeSettings
  ): DifficultyConfig {
    const baseConfig = DIFFICULTY_CONFIGS[difficulty];
    
    if (!customSettings) return baseConfig;

    // Use digit-based ranges if specified in custom settings, but consider difficulty
    if (customSettings.numberSettings?.digits) {
      const digitRange = this.getDigitRange(customSettings.numberSettings.digits);
      
      // Adjust range based on difficulty level even with custom digits
      let effectiveMin = digitRange.min;
      let effectiveMax = digitRange.max;
      
      if (difficulty === 'beginner') {
        // For beginner, limit to smaller range even with larger digits
        effectiveMax = Math.min(effectiveMax, Math.max(50, Math.pow(10, Math.min(customSettings.numberSettings.digits, 2))));
      } else if (difficulty === 'intermediate') {
        // For intermediate, use moderate range
        effectiveMax = Math.min(effectiveMax, Math.max(500, Math.pow(10, Math.min(customSettings.numberSettings.digits, 3))));
      }
      // Advanced uses full range
      
      return {
        minValue: customSettings.customRanges?.operand1?.min ?? effectiveMin,
        maxValue: customSettings.customRanges?.operand1?.max ?? effectiveMax,
        includeNonIntegers: customSettings.numberSettings.includeNonIntegers && baseConfig.includeNonIntegers,
        allowNegative: customSettings.numberSettings.allowNegatives && baseConfig.allowNegative,
      };
    }

    return {
      minValue: customSettings.customRanges?.operand1?.min ?? baseConfig.minValue,
      maxValue: customSettings.customRanges?.operand1?.max ?? baseConfig.maxValue,
      includeNonIntegers: customSettings.numberSettings?.includeNonIntegers ?? baseConfig.includeNonIntegers,
      allowNegative: customSettings.numberSettings?.allowNegatives ?? baseConfig.allowNegative,
    };
  }

  private static generateAddition(difficulty: Difficulty, customSettings?: CustomModeSettings): Problem {
    const config = this.getEffectiveConfig(difficulty, customSettings);
    const operand1 = this.getRandomNumber(config.minValue, config.maxValue, config.includeNonIntegers);
    const operand2 = this.getRandomNumber(config.minValue, config.maxValue, config.includeNonIntegers);
    
    return {
      id: crypto.randomUUID(),
      operand1,
      operand2,
      operation: 'addition',
      correctAnswer: Math.round((operand1 + operand2) * 10) / 10,
      difficulty,
    };
  }

  private static generateSubtraction(difficulty: Difficulty, customSettings?: CustomModeSettings): Problem {
    const config = this.getEffectiveConfig(difficulty, customSettings);
    let operand1 = this.getRandomNumber(config.minValue, config.maxValue, config.includeNonIntegers);
    let operand2 = this.getRandomNumber(config.minValue, config.maxValue, config.includeNonIntegers);
    
    if (!config.allowNegative && operand2 > operand1) {
      [operand1, operand2] = [operand2, operand1];
    }
    
    return {
      id: crypto.randomUUID(),
      operand1,
      operand2,
      operation: 'subtraction',
      correctAnswer: Math.round((operand1 - operand2) * 10) / 10,
      difficulty,
    };
  }

  private static generateMultiplication(difficulty: Difficulty, customSettings?: CustomModeSettings): Problem {
    const config = this.getEffectiveConfig(difficulty, customSettings);
    
    // For custom mode with high digits, limit multiplication to avoid overflow
    let maxForMultiplication = difficulty === 'beginner' ? 12 : 
                              difficulty === 'intermediate' ? 25 : 50;
    
    if (customSettings?.numberSettings?.digits && customSettings.numberSettings.digits > 3) {
      // Limit multiplication for high digit numbers to keep results manageable
      maxForMultiplication = Math.min(maxForMultiplication, Math.pow(10, Math.min(4, customSettings.numberSettings.digits - 1)));
    }
    
    const maxValue = customSettings?.customRanges?.operand1?.max ?? maxForMultiplication;
    const operand1 = this.getRandomNumber(config.minValue, Math.min(maxValue, maxForMultiplication), false);
    const operand2 = this.getRandomNumber(config.minValue, Math.min(maxValue, maxForMultiplication), false);
    
    return {
      id: crypto.randomUUID(),
      operand1,
      operand2,
      operation: 'multiplication',
      correctAnswer: operand1 * operand2,
      difficulty,
    };
  }

  private static generateDivision(difficulty: Difficulty, customSettings?: CustomModeSettings): Problem {
    let maxForDivision = difficulty === 'beginner' ? 12 : 
                        difficulty === 'intermediate' ? 25 : 50;
    
    if (customSettings?.numberSettings?.digits && customSettings.numberSettings.digits > 3) {
      // Limit division for high digit numbers to keep results manageable
      maxForDivision = Math.min(maxForDivision, Math.pow(10, Math.min(3, customSettings.numberSettings.digits - 1)));
    }
    
    const maxValue = customSettings?.customRanges?.operand1?.max ?? maxForDivision;
    const divisor = this.getRandomNumber(2, Math.min(maxValue, maxForDivision), false);
    const quotient = this.getRandomNumber(1, Math.min(maxValue, maxForDivision), false);
    const dividend = divisor * quotient;
    
    return {
      id: crypto.randomUUID(),
      operand1: dividend,
      operand2: divisor,
      operation: 'division',
      correctAnswer: quotient,
      difficulty,
    };
  }

  static generateProblem(operation: Operation, difficulty: Difficulty, customSettings?: CustomModeSettings): Problem {
    switch (operation) {
      case 'addition':
        return this.generateAddition(difficulty, customSettings);
      case 'subtraction':
        return this.generateSubtraction(difficulty, customSettings);
      case 'multiplication':
        return this.generateMultiplication(difficulty, customSettings);
      case 'division':
        return this.generateDivision(difficulty, customSettings);
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  static generateProblems(
    operations: Operation[],
    difficulty: Difficulty,
    count: number,
    customSettings?: CustomModeSettings
  ): Problem[] {
    const problems: Problem[] = [];
    
    for (let i = 0; i < count; i++) {
      const operation = operations[Math.floor(Math.random() * operations.length)];
      
      // For custom mode, use custom difficulty setting
      const effectiveDifficulty = customSettings?.difficulty || difficulty;
      
      problems.push(this.generateProblem(operation, effectiveDifficulty, customSettings));
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