const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// CORS configuration
const corsOptions = isProduction ? {
  origin: ['https://dozenducc.github.io', 'http://localhost:5173'],  // Replace with your actual GitHub Pages URL
  methods: ['GET', 'POST'],
  credentials: true,
} : {
  origin: true, // Allow all origins in development
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Game data schema
const gameDataSchema = new mongoose.Schema({
  username: String,
  trials: [{
    trial: Number,
    action: Number,
    reward: Number,
    states: [Number],
    timestamp: Date
  }],
  totalReward: Number,
  completedAt: {
    type: Date,
    default: Date.now
  }
});

const GameData = mongoose.model('GameData', gameDataSchema);

// Routes
// GET all game data
app.get('/api/gameData', async (req, res) => {
  try {
    const data = await GameData.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching game data:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST new game data
app.post('/api/gameData', async (req, res) => {
  try {
    console.log('Received game data:', req.body);
    const gameData = new GameData(req.body);
    await gameData.save();
    res.status(201).json(gameData);
  } catch (error) {
    console.error('Error saving game data:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    console.log('Fetching leaderboard');
    const leaderboard = await GameData.aggregate([
      {
        $group: {
          _id: "$username",
          totalReward: { $max: "$totalReward" },
          completedAt: { $first: "$completedAt" }
        }
      },
      { $sort: { totalReward: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          username: "$_id",
          totalReward: 1,
          completedAt: 1
        }
      }
    ]);
    console.log('Leaderboard data:', leaderboard);
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add a root route for basic API health check
app.get('/api', (req, res) => {
  res.json({ message: 'DFT Experiment API is running' });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.url}` });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});