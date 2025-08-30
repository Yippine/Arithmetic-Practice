import React from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Home, Clock } from 'lucide-react';

interface GameHeaderProps {
  score: number;
  problemNumber: number;
  totalProblems: number;
  timeRemaining?: number;
  isPaused: boolean;
  currentStreak?: number;
  onPause: () => void;
  onResume: () => void;
  onHome: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = React.memo(({
  score,
  problemNumber,
  totalProblems,
  timeRemaining,
  isPaused,
  currentStreak,
  onPause,
  onResume,
  onHome,
}) => {
  const progress = (problemNumber / totalProblems) * 100;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mb-8"
    >
      <div className="glass-effect rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onHome}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Go to home"
            >
              <Home size={24} />
            </button>
            
            <div className="text-white">
              <div className="text-sm text-blue-200">Score</div>
              <div className="text-2xl font-bold">{score}</div>
            </div>
            
            {currentStreak !== undefined && currentStreak > 0 && (
              <div className="text-white">
                <div className="text-sm text-blue-200">Streak</div>
                <div className="text-xl font-bold text-yellow-400 flex items-center gap-1">
                  🔥 {currentStreak}
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-white">
            <div className="text-sm text-blue-200">Problem</div>
            <div className="text-2xl font-bold">
              {problemNumber} / {totalProblems}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {timeRemaining !== undefined && (
              <div className="text-white text-center">
                <div className="text-sm text-blue-200 flex items-center gap-1">
                  <Clock size={16} />
                  Time
                </div>
                <div className={`text-2xl font-bold transition-colors ${
                  timeRemaining <= 10 ? 'text-red-500 animate-pulse' : 
                  timeRemaining <= 30 ? 'text-orange-400' : 'text-white'
                }`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
            )}
            
            <button
              onClick={isPaused ? onResume : onPause}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
              aria-label={isPaused ? 'Resume game' : 'Pause game'}
            >
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
            </button>
          </div>
        </div>

        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.header>
  );
});