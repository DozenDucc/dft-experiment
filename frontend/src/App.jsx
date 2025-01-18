import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import GamePage from './pages/GamePage'
import ResultsPage from './pages/ResultsPage'

function App() {
  const [gameState, setGameState] = useState({
    stage: 'landing', // 'landing', 'game', 'results'
    username: '',
    gameData: null,
  });

  const handleStart = (username) => {
    setGameState({
      stage: 'game',
      username,
      gameData: null,
    });
  };

  const handleGameComplete = (gameData) => {
    setGameState(prev => ({
      ...prev,
      stage: 'results',
      gameData,
    }));
  };

  return (
    <>
      {gameState.stage === 'landing' && (
        <LandingPage onStart={handleStart} />
      )}
      {gameState.stage === 'game' && (
        <GamePage 
          username={gameState.username}
          onGameComplete={handleGameComplete}
        />
      )}
      {gameState.stage === 'results' && (
        <ResultsPage 
          gameData={gameState.gameData}
          username={gameState.username}
        />
      )}
    </>
  );
}

export default App