import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { HomePage } from './components/HomePage';
import { GameHeader } from './components/GameHeader';
import { ProblemDisplay } from './components/ProblemDisplay';
import { GameResults } from './components/GameResults';
import { StatsPage } from './components/StatsPage';
import { SettingsPage } from './components/SettingsPage';
import { GameSettings } from './types';

type AppScreen = 'home' | 'game' | 'results' | 'stats' | 'settings';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [showResult, setShowResult] = useState(false);
  
  const {
    currentSession,
    currentProblemIndex,
    currentStreak,
    userStats,
    gameSettings,
    isPlaying,
    isPaused,
    timeRemaining,
    startGame,
    submitAnswer,
    nextProblem,
    pauseGame,
    resumeGame,
    endGame,
    loadData,
  } = useGameStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentProblem = currentSession?.problems[currentProblemIndex];
  const isCorrect = currentProblem?.isCorrect;

  useEffect(() => {
    if (!isPlaying && currentSession && currentSession.endTime) {
      setCurrentScreen('results');
    }
  }, [isPlaying, currentSession]);

  useEffect(() => {
    if (!isPlaying || isPaused || !currentSession || timeRemaining === null) return;

    const interval = setInterval(() => {
      const { timeRemaining: currentTimeRemaining } = useGameStore.getState();
      
      if (currentTimeRemaining !== null && currentTimeRemaining > 0) {
        const newTimeRemaining = currentTimeRemaining - 1;
        useGameStore.setState({ timeRemaining: newTimeRemaining });
        
        if (newTimeRemaining <= 0) {
          endGame();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, timeRemaining, endGame]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showResult) {
      const delayTime = isCorrect ? 1000 : 2000;
      timeout = setTimeout(() => {
        setShowResult(false);
        nextProblem();
      }, delayTime);
    }
    return () => clearTimeout(timeout);
  }, [showResult, nextProblem, isCorrect]);

  const handleStartGame = (settings: GameSettings) => {
    startGame(settings);
    setCurrentScreen('game');
    setShowResult(false);
  };

  const handleSubmitAnswer = (answer: number) => {
    submitAnswer(answer);
    setShowResult(true);
  };

  const handleNextProblem = () => {
    setShowResult(false);
    nextProblem();
  };

  const handleHomeNavigation = () => {
    setCurrentScreen('home');
    setShowResult(false);
  };

  const handlePlayAgain = () => {
    if (currentSession) {
      startGame({
        difficulty: currentSession.difficulty,
        operations: currentSession.operations,
        mode: currentSession.mode,
      });
      setCurrentScreen('game');
      setShowResult(false);
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <HomePage
              gameSettings={gameSettings}
              onStartGame={handleStartGame}
              onShowStats={() => setCurrentScreen('stats')}
              onShowSettings={() => setCurrentScreen('settings')}
            />
          </motion.div>
        )}

        {currentScreen === 'game' && currentSession && currentProblem && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full"
          >
            <GameHeader
              score={currentSession.score}
              problemNumber={currentProblemIndex + 1}
              totalProblems={currentSession.problems.length}
              timeRemaining={timeRemaining || undefined}
              isPaused={isPaused}
              currentStreak={currentStreak}
              onPause={pauseGame}
              onResume={resumeGame}
              onHome={handleHomeNavigation}
            />
            
            <div className="flex items-center justify-center">
              {isPaused ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-effect rounded-2xl p-12 text-center text-white"
                >
                  <div className="text-6xl mb-4">⏸️</div>
                  <h2 className="text-3xl font-bold mb-2">Game Paused</h2>
                  <p className="text-blue-200 mb-6">Take a break! Click resume when ready.</p>
                  <button onClick={resumeGame} className="btn-primary">
                    Resume Game
                  </button>
                </motion.div>
              ) : (
                <ProblemDisplay
                  problem={currentProblem}
                  onSubmit={handleSubmitAnswer}
                  onNext={handleNextProblem}
                  isCorrect={isCorrect}
                  showResult={showResult}
                  soundEnabled={gameSettings.soundEnabled}
                />
              )}
            </div>
          </motion.div>
        )}

        {currentScreen === 'results' && currentSession && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full"
          >
            <GameResults
              session={currentSession}
              userStats={userStats}
              onPlayAgain={handlePlayAgain}
              onHome={handleHomeNavigation}
            />
          </motion.div>
        )}

        {currentScreen === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            <StatsPage
              stats={userStats}
              onBack={handleHomeNavigation}
            />
          </motion.div>
        )}

        {currentScreen === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full"
          >
            <SettingsPage
              onBack={handleHomeNavigation}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;