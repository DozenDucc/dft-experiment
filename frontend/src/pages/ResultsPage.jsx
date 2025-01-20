import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { saveGameData } from '../services/api';

const ResultsPage = ({ gameData, username }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [visualizationData, setVisualizationData] = useState([]);
  const [totalReward, setTotalReward] = useState(0);

  useEffect(() => {
    const processData = () => {
      let leftCount = 0;
      let rightCount = 0;
      let rewardSum = 0;
      const dataPoints = [];

      // Calculate income ratio line segments
      const calculateIncomeRatio = (x, trial) => {
        const trialData = gameData[trial];
        if (!trialData) return 0;
        
        // Get the probabilities for the current phase
        const leftProb = trialData.probabilities[0];
        const rightProb = trialData.probabilities[1];
        const ratio = leftProb / rightProb;

        // Calculate previous phases' total height
        let previousHeight = 0;
        let previousX = 0;

        if (trial >= 200) {
          // Add phase 1 total
          const phase1Ratio = gameData[0].probabilities[0] / gameData[0].probabilities[1];
          previousHeight += phase1Ratio * 200;
          previousX = 200;
        }
        
        if (trial >= 400) {
          // Add phase 2 total
          const phase2Ratio = gameData[200].probabilities[0] / gameData[200].probabilities[1];
          previousHeight += phase2Ratio * 200;
          previousX = 400;
        }

        // Calculate current segment
        return previousHeight + ratio * (x - previousX);
      };

      // Add starting point
      dataPoints.push({
        rightCumulative: 0,
        leftCumulative: 0,
        incomeRatio: 0
      });

      // Process each trial
      gameData.forEach((trial, index) => {
        if (trial.action === 0) {
          leftCount += 1;
        } else {
          rightCount += 1;
        }
        rewardSum += trial.reward;

        dataPoints.push({
          rightCumulative: rightCount,
          leftCumulative: leftCount,
          incomeRatio: calculateIncomeRatio(rightCount, index)
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
      const response = await fetch('http://localhost:5001/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Visualization Card - Now full width */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Choice vs Income Ratio</CardTitle>
            <div className="text-sm text-gray-600">
              Total Reward: {totalReward}
            </div>
          </CardHeader>
          <CardContent>
            <LineChart 
              width={800} 
              height={600} 
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
                ticks={Array.from({ length: 7 }, (_, i) => i * 100)}
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
                ticks={Array.from({ length: 7 }, (_, i) => i * 100)}
              />
              <Tooltip />
              <Legend wrapperStyle={{ bottom: -10 }} />
              <Line 
                type="monotone" 
                dataKey="leftCumulative" 
                stroke="#8884d8" 
                name="Choice Ratio"
                dot={false}
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
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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