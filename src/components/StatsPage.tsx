import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Target, Clock, Zap, Trophy, AlertCircle } from 'lucide-react';
import { UserStats } from '../types';
import { AnalyticsManager } from '../utils/analytics';

interface StatsPageProps {
  stats: UserStats;
  onBack: () => void;
}

export const StatsPage: React.FC<StatsPageProps> = ({ stats, onBack }) => {
  const insights = AnalyticsManager.getPerformanceInsights(stats);
  const overallAccuracy = stats.totalProblems > 0 ? (stats.correctAnswers / stats.totalProblems) * 100 : 0;
  const averageTime = stats.totalProblems > 0 ? stats.totalTime / stats.totalProblems : 0;

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(0);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
        <h1 className="text-4xl font-bold text-white">Your Statistics</h1>
        <p className="text-blue-200">Track your progress and identify areas for improvement</p>
      </motion.div>

      {stats.totalProblems === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-12 text-center"
        >
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Statistics Yet</h2>
          <p className="text-blue-200">Complete some practice sessions to see your progress!</p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div className="glass-effect rounded-xl p-6 text-center">
              <Target className="mx-auto mb-3 text-blue-400" size={32} />
              <div className="text-3xl font-bold text-white">{stats.totalProblems}</div>
              <div className="text-blue-200">Problems Solved</div>
            </div>

            <div className="glass-effect rounded-xl p-6 text-center">
              <TrendingUp className="mx-auto mb-3 text-green-400" size={32} />
              <div className="text-3xl font-bold text-white">{overallAccuracy.toFixed(1)}%</div>
              <div className="text-blue-200">Overall Accuracy</div>
            </div>

            <div className="glass-effect rounded-xl p-6 text-center">
              <Clock className="mx-auto mb-3 text-purple-400" size={32} />
              <div className="text-3xl font-bold text-white">{formatTime(averageTime)}</div>
              <div className="text-blue-200">Average Time</div>
            </div>

            <div className="glass-effect rounded-xl p-6 text-center">
              <Zap className="mx-auto mb-3 text-yellow-400" size={32} />
              <div className="text-3xl font-bold text-white">{stats.streakBest}</div>
              <div className="text-blue-200">Best Streak</div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Target className="text-blue-400" size={24} />
                Performance by Operation
              </h3>
              <div className="space-y-4">
                {Object.entries(stats.operationStats).map(([operation, stat]) => {
                  if (stat.attempted === 0) return null;
                  const accuracy = (stat.correct / stat.attempted) * 100;
                  
                  return (
                    <div key={operation} className="bg-white/5 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-white capitalize">
                          {operation}
                        </span>
                        <span className={`font-bold ${
                          accuracy >= 80 ? 'text-green-400' : 
                          accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {accuracy.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-blue-200 mb-2">
                        <span>{stat.correct}/{stat.attempted} correct</span>
                        <span>Avg: {formatTime(stat.averageTime)}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            accuracy >= 80 ? 'bg-green-400' : 
                            accuracy >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="text-yellow-400" size={24} />
                Performance by Difficulty
              </h3>
              <div className="space-y-4">
                {Object.entries(stats.difficultyStats).map(([difficulty, stat]) => {
                  if (stat.attempted === 0) return null;
                  const accuracy = (stat.correct / stat.attempted) * 100;
                  
                  return (
                    <div key={difficulty} className="bg-white/5 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-white capitalize">
                          {difficulty}
                        </span>
                        <span className={`font-bold ${
                          accuracy >= 80 ? 'text-green-400' : 
                          accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {accuracy.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-blue-200 mb-2">
                        <span>{stat.correct}/{stat.attempted} correct</span>
                        <span>Avg: {formatTime(stat.averageTime)}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            accuracy >= 80 ? 'bg-green-400' : 
                            accuracy >= 60 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {insights.improvementAreas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertCircle className="text-orange-400" size={24} />
                Improvement Suggestions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.improvementAreas.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4 border-l-4 border-orange-400"
                  >
                    <p className="text-white">{suggestion}</p>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + insights.improvementAreas.length * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 border-l-4 border-blue-400"
                >
                  <p className="text-white">
                    Try {insights.recommendedDifficulty} difficulty level for optimal challenge
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};