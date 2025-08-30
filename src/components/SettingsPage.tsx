import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, HelpCircle, RotateCcw } from 'lucide-react';
import { GameSettings as GameSettingsType, NumberDisplayMode } from '../types';
import { useGameStore } from '../store/gameStore';

interface SettingsPageProps {
  onBack: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const { gameSettings, updateSettings, resetStats } = useGameStore();
  const [localSettings, setLocalSettings] = useState<GameSettingsType>(gameSettings);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = () => {
    updateSettings(localSettings);
    onBack();
  };

  const handleReset = () => {
    resetStats();
    setShowResetConfirm(false);
    onBack();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6"
      >
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-lg hover:bg-white/20 transition-colors text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-bold text-white">Settings</h2>
        </div>

        <div className="space-y-8">
          {/* Game Settings */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Game Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  {localSettings.soundEnabled ? (
                    <Volume2 size={24} className="text-blue-300" />
                  ) : (
                    <VolumeX size={24} className="text-gray-400" />
                  )}
                  <div>
                    <div className="font-medium text-white">Sound Effects</div>
                    <div className="text-sm text-blue-200">Play sounds for correct/incorrect answers</div>
                  </div>
                </div>
                <button
                  onClick={() => setLocalSettings({
                    ...localSettings,
                    soundEnabled: !localSettings.soundEnabled
                  })}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                    localSettings.soundEnabled ? 'bg-primary-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      localSettings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <HelpCircle size={24} className="text-blue-300" />
                  <div>
                    <div className="font-medium text-white">Show Hints</div>
                    <div className="text-sm text-blue-200">Display helpful hints during problems</div>
                  </div>
                </div>
                <button
                  onClick={() => setLocalSettings({
                    ...localSettings,
                    showHints: !localSettings.showHints
                  })}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                    localSettings.showHints ? 'bg-primary-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      localSettings.showHints ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Number Display Mode */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🔢</div>
                  <div>
                    <div className="font-medium text-white">Number Display</div>
                    <div className="text-sm text-blue-200">How to display non-integer answers</div>
                  </div>
                </div>
                <select
                  value={localSettings.numberDisplayMode}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    numberDisplayMode: e.target.value as NumberDisplayMode
                  })}
                  className="p-2 pr-8 rounded-lg bg-white/10 text-white border border-white/20 min-w-[140px]"
                >
                  <option value="decimal">Decimals (0.5)</option>
                  <option value="fraction">Fractions (1/2)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-200">
              <div className="flex justify-between">
                <span>Submit Answer:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Enter</kbd>
              </div>
              <div className="flex justify-between">
                <span>Next Problem:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Enter</kbd>
              </div>
              <div className="flex justify-between">
                <span>Pause/Resume:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Space</kbd>
              </div>
              <div className="flex justify-between">
                <span>Continue:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Space</kbd>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Data Management</h3>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <RotateCcw size={24} className="text-red-400" />
                <div className="font-medium text-white">Reset All Data</div>
              </div>
              <div className="text-sm text-red-200 mb-4">
                This will permanently delete all your progress, statistics, and settings.
              </div>
              {!showResetConfirm ? (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reset All Data
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="text-red-200 font-medium">Are you sure? This cannot be undone.</div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Yes, Reset Everything
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save/Cancel Buttons */}
          <div className="flex gap-4 pt-4 border-t border-white/20">
            <button
              onClick={handleSave}
              className="flex-1 btn-primary"
            >
              Save Settings
            </button>
            <button
              onClick={onBack}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};