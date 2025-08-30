import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Problem, Operation } from '../types';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useSound } from '../hooks/useSound';
import { ScoringManager } from '../utils/scoring';

interface ProblemDisplayProps {
  problem: Problem;
  onSubmit: (answer: number) => void;
  onNext: () => void;
  isCorrect?: boolean;
  showResult: boolean;
  soundEnabled?: boolean;
  className?: string;
}

const OPERATION_SYMBOLS: Record<Operation, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
};

export const ProblemDisplay: React.FC<ProblemDisplayProps> = React.memo(({
  problem,
  onSubmit,
  onNext,
  isCorrect,
  showResult,
  soundEnabled = true,
  className = '',
}) => {
  const [userInput, setUserInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playCorrectSound, playIncorrectSound } = useSound({ enabled: soundEnabled });

  useEffect(() => {
    setUserInput('');
    setIsSubmitted(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [problem.id]);

  useEffect(() => {
    if (showResult && isCorrect !== undefined) {
      if (isCorrect) {
        playCorrectSound();
      } else {
        playIncorrectSound();
      }
    }
  }, [showResult, isCorrect, playCorrectSound, playIncorrectSound]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitted || !userInput.trim()) return;

    const answer = parseFloat(userInput);
    if (isNaN(answer)) return;

    setIsSubmitted(true);
    onSubmit(answer);
  };

  const handleNext = () => {
    onNext();
    // Ensure focus after next is called
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 50);
  };

  const handleKeyboardSubmit = () => {
    if (!showResult && userInput.trim() && !isSubmitted) {
      const answer = parseFloat(userInput);
      if (!isNaN(answer)) {
        setIsSubmitted(true);
        onSubmit(answer);
      }
    }
  };

  useKeyboardShortcuts({
    onEnter: showResult ? handleNext : handleKeyboardSubmit,
    onSpace: showResult ? handleNext : undefined,
  });

  const formatNumber = (num: number): string => {
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  const getDynamicTextSize = (): string => {
    const maxLength = Math.max(
      formatNumber(problem.operand1).length,
      formatNumber(problem.operand2).length
    );
    
    if (maxLength <= 2) return 'text-6xl';
    if (maxLength <= 4) return 'text-5xl';
    if (maxLength <= 6) return 'text-4xl';
    if (maxLength <= 8) return 'text-3xl';
    return 'text-2xl';
  };

  return (
    <div className={`w-full max-w-lg mx-auto ${className}`}>
      <motion.div
        key={problem.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-effect rounded-2xl p-8 text-center"
      >
        <div 
          className={`${getDynamicTextSize()} font-bold text-white mb-8 space-x-4`}
          role="math"
          aria-label={`${formatNumber(problem.operand1)} ${problem.operation} ${formatNumber(problem.operand2)} equals`}
        >
          <span>{formatNumber(problem.operand1)}</span>
          <span className="text-blue-200">
            {OPERATION_SYMBOLS[problem.operation]}
          </span>
          <span>{formatNumber(problem.operand2)}</span>
          <span className="text-blue-200">=</span>
        </div>

        {!showResult ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              ref={inputRef}
              type="number"
              step="0.1"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your answer"
              className="number-input"
              disabled={isSubmitted}
              autoFocus
              aria-label="Enter your answer for the math problem"
              aria-describedby="problem-equation"
            />
            <button
              type="submit"
              disabled={!userInput.trim() || isSubmitted}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitted ? 'Checking...' : 'Submit'}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-4xl font-bold">
              {formatNumber(problem.correctAnswer)}
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`text-2xl font-semibold ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </motion.div>

            {/* Challenge mode feedback */}
            {isCorrect && problem.timeSpent && problem.difficulty && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-1"
              >
                {problem.bonusPoints && problem.bonusPoints > 0 && (
                  <div className="text-yellow-400 font-medium">
                    ⭐ Bonus: +{problem.bonusPoints} points
                  </div>
                )}
                
                {problem.timeSpent && (
                  <div className="text-sm text-blue-200">
                    Time: {problem.timeSpent.toFixed(1)}s {' '}
                    {(() => {
                      const speedRating = ScoringManager.getSpeedRating(problem.timeSpent, problem.difficulty);
                      const speedEmoji = {
                        'veryfast': '🚀',
                        'fast': '⚡',
                        'normal': '👍',
                        'slow': '🐌'
                      };
                      return speedEmoji[speedRating];
                    })()}
                  </div>
                )}
              </motion.div>
            )}

            {!isCorrect && problem.userAnswer !== undefined && (
              <div className="text-lg text-blue-200">
                Your answer: {formatNumber(problem.userAnswer)}
              </div>
            )}

            <button
              onClick={handleNext}
              className="btn-primary w-full"
              autoFocus
            >
              Next Problem
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
});