const BASE_URL = 'http://localhost:5001/api';

export const saveGameData = async (gameData) => {
  try {
    const response = await fetch(`${BASE_URL}/gameData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving game data:', error);
    throw error;
  }
};

export const fetchLeaderboard = async () => {
  try {
    const response = await fetch(`${BASE_URL}/leaderboard`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};