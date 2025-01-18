const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Updated CORS configuration for production
const corsOptions = {
  origin: ['https://yourusername.github.io', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
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
    action: Number,    // 0 for left, 1 for right
    reward: Number,    // 1 if rewarded, 0 if not
    states: [Number],  // State of both buttons
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
app.post('/api/gameData', async (req, res) => {
  try {
    const gameData = new GameData(req.body);
    await gameData.save();
    res.status(201).json(gameData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await GameData.find()
      .sort({ totalReward: -1 })
      .limit(10)
      .select('username totalReward completedAt');
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});