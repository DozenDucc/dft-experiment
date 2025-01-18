import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const LandingPage = ({ onStart }) => {
  const [username, setUsername] = useState('');

  const handleStart = () => {
    if (username.trim()) {
      onStart(username);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to the Dynamic Foraging Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Rules of the Game:</h2>
              <div className="space-y-2">
                <p>1. You will see two buttons on the game screen.</p>
                <p>2. Each button may or may not contain a reward at any given time.</p>
                <p>3. Click on a button to check if it has a reward.</p>
                <p>4. If there is a reward, you'll see a smiley face and hear a sound.</p>
                <p>5. After each click, there will be a 2-second cooldown period.</p>
                <p>6. The game will track your performance and show results at the end.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                Enter your username to begin:
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full"
              />
            </div>

            <Button 
              onClick={handleStart}
              disabled={!username.trim()}
              className="w-full"
            >
              Start Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LandingPage;