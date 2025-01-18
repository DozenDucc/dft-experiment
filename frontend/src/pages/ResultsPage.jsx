import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { saveGameData } from '../services/api';
import { GAME_CONFIG } from '../config/gameConfig'; // Add this import

const ResultsPage = ({ gameData, username }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [visualizationData, setVisualizationData] = useState([]);
  const [totalReward, setTotalReward] = useState(0);

  // Remove the local probability constants
  // Instead use GAME_CONFIG.REWARD_PROBS[0] for LEFT_PROB
  // and GAME_CONFIG.REWARD_PROBS[1] for RIGHT_PROB

  useEffect(() => {
    const processData = () => {
      let leftCount = 0;
      let rightCount = 0;
      let rewardSum = 0;
      const dataPoints = [];

      dataPoints.push({
        rightCumulative: 0,
        leftCumulative: 0,
        incomeRatio: 0
      });

      gameData.forEach((trial) => {
        if (trial.action === 0) {
          leftCount += 1;
        } else {
          rightCount += 1;
        }
        rewardSum += trial.reward;

        dataPoints.push({
          rightCumulative: rightCount,
          leftCumulative: leftCount,
          // Use GAME_CONFIG.REWARD_PROBS here
          incomeRatio: rightCount * (GAME_CONFIG.REWARD_PROBS[0]/GAME_CONFIG.REWARD_PROBS[1])
        });
      });

      setVisualizationData(dataPoints);
      setTotalReward(rewardSum);

      saveGameData({
        username,
        trials: gameData,
        totalReward: rewardSum
      });
    };

    processData();
    fetchLeaderboard();
  }, [gameData, username]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('https://dft-experiment-backend.onrender.com/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Visualization Card */}
        <Card>
          <CardHeader>
            <CardTitle>Choice vs Income Ratio</CardTitle>
            <div className="text-sm text-gray-600">
              Total Reward: {totalReward}
            </div>
          </CardHeader>
          <CardContent>
            <LineChart 
              width={500} 
              height={400} 
              data={visualizationData}
              margin={{ top: 20, right: 30, left: 50, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="rightCumulative" 
                label={{ 
                  value: 'Cumulative right choices', 
                  position: 'bottom',
                  offset: 20
                }}
                type="number"
                domain={[0, 'dataMax + 1']}
                ticks={Array.from({ length: GAME_CONFIG.GAME_LENGTH }, (_, i) => i)}
              />
              <YAxis 
                label={{ 
                  value: 'Cumulative left choices', 
                  angle: -90, 
                  position: 'left',
                  offset: 30
                }}
                type="number"
                domain={[0, 'dataMax + 1']}
                ticks={Array.from({ length: GAME_CONFIG.GAME_LENGTH}, (_, i) => i)}
              />
              <Tooltip />
              <Legend wrapperStyle={{ bottom: -10 }} />
              <Line 
                type="monotone" 
                dataKey="leftCumulative" 
                stroke="#8884d8" 
                name="Choice Ratio"
                dot={true}
              />
              <Line 
                type="monotone" 
                dataKey="incomeRatio" 
                stroke="#82ca9d" 
                name="Income Ratio"
                dot={false}
              />
            </LineChart>
          </CardContent>
        </Card>

        {/* Leaderboard Card */}
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-2 bg-white rounded shadow"
                >
                  <span className="font-medium">
                    {index + 1}. {entry.username}
                  </span>
                  <span>Score: {entry.totalReward}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsPage;