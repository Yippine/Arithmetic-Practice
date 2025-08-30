import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Clock, TrendingUp, Home, RotateCcw } from 'lucide-react';
import { GameSession } from '../types';

interface GameResultsProps {
  session: GameSession;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const GameResults: React.FC<GameResultsProps> = ({
  session,
  onPlayAgain,
  onHome,
}) => {
  const completedProblems = session.problems.filter(p => p.userAnswer !== undefined);
  const correctProblems = completedProblems.filter(p => p.isCorrect);
  
  const getScoreColor = (accuracy: number): string => {
    if (accuracy >= 90) return 'text-green-400';
    if (accuracy >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (accuracy: number): string => {
    if (accuracy >= 95) return 'Outstanding! 🌟';
    if (accuracy >= 85) return 'Excellent work! 🎉';
    if (accuracy >= 75) return 'Good job! 👍';
    if (accuracy >= 60) return 'Keep practicing! 💪';
    return 'Don\'t give up! 🚀';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="glass-effect rounded-2xl p-8 text-center text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-6"
        >
          <Trophy size={64} className="mx-auto text-yellow-400 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Game Complete!</h1>
          <p className={`text-xl ${getScoreColor(session.accuracy)}`}>
            {getScoreMessage(session.accuracy)}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-lg p-4"
          >
            <Target className="mx-auto mb-2 text-blue-300" size={24} />
            <div className="text-2xl font-bold">{session.score}</div>
            <div className="text-sm text-blue-200">Score</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-lg p-4"
          >
            <TrendingUp className="mx-auto mb-2 text-green-300" size={24} />
            <div className="text-2xl font-bold">{session.accuracy.toFixed(1)}%</div>
            <div className="text-sm text-blue-200">Accuracy</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect rounded-lg p-4"
          >
            <Clock className="mx-auto mb-2 text-purple-300" size={24} />
            <div className="text-2xl font-bold">{session.averageTime.toFixed(1)}s</div>
            <div className="text-sm text-blue-200">Avg Time</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-effect rounded-lg p-4"
          >
            <Trophy className="mx-auto mb-2 text-yellow-300" size={24} />
            <div className="text-2xl font-bold">
              {correctProblems.length}/{completedProblems.length}
            </div>
            <div className="text-sm text-blue-200">Correct</div>
          </motion.div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Problem Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
            {session.problems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className={`glass-effect rounded-lg p-3 text-left ${
                  problem.isCorrect ? 'border-l-4 border-green-400' : 
                  problem.userAnswer !== undefined ? 'border-l-4 border-red-400' : 
                  'border-l-4 border-gray-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {problem.operand1} {problem.operation === 'addition' ? '+' : 
                     problem.operation === 'subtraction' ? '−' : 
                     problem.operation === 'multiplication' ? '×' : '÷'} {problem.operand2}
                  </span>
                  <span className={`font-bold ${
                    problem.isCorrect ? 'text-green-400' : 
                    problem.userAnswer !== undefined ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {problem.isCorrect ? '✓' : problem.userAnswer !== undefined ? '✗' : '−'}
                  </span>
                </div>
                <div className="text-sm text-blue-200 mt-1">
                  Answer: {problem.correctAnswer} 
                  {problem.userAnswer !== undefined && !problem.isCorrect && 
                    ` (Your: ${problem.userAnswer})`
                  }
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-4 justify-center"
        >
          <button
            onClick={onPlayAgain}
            className="btn-primary flex items-center gap-2"
          >
            <RotateCcw size={20} />
            Play Again
          </button>
          <button
            onClick={onHome}
            className="btn-secondary flex items-center gap-2"
          >
            <Home size={20} />
            Home
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};