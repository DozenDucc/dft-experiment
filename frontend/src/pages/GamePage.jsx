import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { GAME_CONFIG } from '../config/gameConfig'; // Add this import

const GamePage = ({ username, onGameComplete }) => {
  const [states, setStates] = useState([0, 0]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [gameData, setGameData] = useState([]);
  const [showReward, setShowReward] = useState(false);
  
  const audioRef = useRef(new Audio('/ding.mp3'));
  
  // Remove local constants and use GAME_CONFIG instead
  const COOLDOWN_TIME = GAME_CONFIG.COOLDOWN_TIME;
  const REWARD_DISPLAY_TIME = 500;
  const GAME_LENGTH = GAME_CONFIG.GAME_LENGTH;
  // Remove REWARD_PROBS constant as we'll use GAME_CONFIG.REWARD_PROBS

  useEffect(() => {
    updateRewards();
  }, []);

  const random = () => Math.random();

  const updateRewards = useCallback(() => {
    setStates(prevStates => {
      return prevStates.map((state, index) => {
        // Use GAME_CONFIG.REWARD_PROBS here
        if (state === 0 && random() < GAME_CONFIG.REWARD_PROBS[index]) {
          return 1;
        }
        return state;
      });
    });
  }, []);


  // Handle button click
  const handleClick = async (buttonIndex) => {
    if (isDisabled || gameData.length >= GAME_LENGTH) return;

    setIsDisabled(true);
    const hasReward = states[buttonIndex] === 1;
    
    // Record the action
    const newGameData = [...gameData, {
      trial: gameData.length + 1,
      action: buttonIndex,
      reward: hasReward ? 1 : 0,
      states: [...states],
      timestamp: Date.now()
    }];
    setGameData(newGameData);

    // Handle reward
    if (hasReward) {
      setShowReward(true);
      audioRef.current.play();
      setStates(prev => {
        const newStates = [...prev];
        newStates[buttonIndex] = 0;
        return newStates;
      });
      setTimeout(() => setShowReward(false), REWARD_DISPLAY_TIME);
    }

    // Update rewards and handle cooldown
    updateRewards();
    setTimeout(() => {
      setIsDisabled(false);
    }, COOLDOWN_TIME);

    // Check if game is complete
    if (newGameData.length >= GAME_LENGTH) {
      onGameComplete(newGameData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Dynamic Foraging Task</h2>
            <p>Trials completed: {gameData.length} / {GAME_LENGTH}</p>
          </div>

          <div className="flex justify-center items-center space-x-8">
            <Button
              onClick={() => handleClick(0)}
              disabled={isDisabled}
              className="w-32 h-32 text-2xl"
            >
              Left
            </Button>
            <Button
              onClick={() => handleClick(1)}
              disabled={isDisabled}
              className="w-32 h-32 text-2xl"
            >
              Right
            </Button>
          </div>

          {showReward && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="text-6xl">😊</span>
            </div>
          )}

          {isDisabled && (
            <div className="text-center text-gray-500">
              Please wait...
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GamePage;