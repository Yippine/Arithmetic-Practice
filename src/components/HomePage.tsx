import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, BarChart, Plus, Minus, X, Divide } from 'lucide-react';
import { Operation, Difficulty, Mode, GameSettings } from '../types';

interface HomePageProps {
  gameSettings: GameSettings;
  onStartGame: (settings: GameSettings) => void;
  onShowStats: () => void;
  onShowSettings: () => void;
}

const OPERATION_CONFIG = {
  addition: { icon: Plus, label: 'Addition', color: 'text-green-400' },
  subtraction: { icon: Minus, label: 'Subtraction', color: 'text-blue-400' },
  multiplication: { icon: X, label: 'Multiplication', color: 'text-purple-400' },
  division: { icon: Divide, label: 'Division', color: 'text-orange-400' },
};

const DIFFICULTY_CONFIG = {
  beginner: { label: 'Beginner', desc: '1-10, whole numbers' },
  intermediate: { label: 'Intermediate', desc: '1-100, includes negatives' },
  advanced: { label: 'Advanced', desc: '1-1000, decimals & negatives' },
};

export const HomePage: React.FC<HomePageProps> = ({
  gameSettings,
  onStartGame,
  onShowStats,
  onShowSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>(gameSettings);

  const toggleOperation = (operation: Operation) => {
    const newOperations = localSettings.operations.includes(operation)
      ? localSettings.operations.filter(op => op !== operation)
      : [...localSettings.operations, operation];
    
    if (newOperations.length > 0) {
      setLocalSettings({ ...localSettings, operations: newOperations });
    }
  };

  const handleStartGame = () => {
    if (localSettings.operations.length === 0) return;
    onStartGame(localSettings);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold text-white mb-4">
          Arithmetic Practice
        </h1>
        <p className="text-xl text-blue-200">
          Master your math skills with personalized practice sessions
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Start</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-3">
                  Select Operations
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(OPERATION_CONFIG) as Operation[]).map((operation) => {
                    const config = OPERATION_CONFIG[operation];
                    const Icon = config.icon;
                    const isSelected = localSettings.operations.includes(operation);
                    
                    return (
                      <button
                        key={operation}
                        onClick={() => toggleOperation(operation)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          isSelected
                            ? 'bg-white/20 border-white/40 text-white'
                            : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <Icon size={24} className={`mx-auto mb-2 ${config.color}`} />
                        <div className="font-medium">{config.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-200 mb-3">
                  Difficulty Level
                </label>
                <div className="space-y-2">
                  {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((difficulty) => {
                    const config = DIFFICULTY_CONFIG[difficulty];
                    
                    return (
                      <label
                        key={difficulty}
                        className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="difficulty"
                          value={difficulty}
                          checked={localSettings.difficulty === difficulty}
                          onChange={(e) => setLocalSettings({
                            ...localSettings,
                            difficulty: e.target.value as Difficulty
                          })}
                          className="mr-3 text-primary-600"
                        />
                        <div>
                          <div className="font-medium text-white">{config.label}</div>
                          <div className="text-sm text-blue-300">{config.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Number of Problems
                  </label>
                  <select
                    value={localSettings.problemCount}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      problemCount: parseInt(e.target.value)
                    })}
                    className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20"
                  >
                    <option value={5}>5 Problems</option>
                    <option value={10}>10 Problems</option>
                    <option value={15}>15 Problems</option>
                    <option value={20}>20 Problems</option>
                    <option value={30}>30 Problems</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Mode
                  </label>
                  <select
                    value={localSettings.mode}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      mode: e.target.value as Mode
                    })}
                    className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20"
                  >
                    <option value="practice">Practice</option>
                    <option value="timed">Timed (5 min)</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                disabled={localSettings.operations.length === 0}
                className="w-full btn-primary text-xl py-4 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={24} />
                Start Practice
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={onShowStats}
                className="w-full btn-secondary flex items-center gap-3 justify-center"
              >
                <BarChart size={20} />
                View Statistics
              </button>
              <button
                onClick={onShowSettings}
                className="w-full btn-secondary flex items-center gap-3 justify-center"
              >
                <Settings size={20} />
                Settings
              </button>
            </div>
          </div>

          <div className="glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Tips</h3>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li>• Start with easier problems to build confidence</li>
              <li>• Focus on accuracy before speed</li>
              <li>• Practice regularly for best results</li>
              <li>• Review your mistakes to improve</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};