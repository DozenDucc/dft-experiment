// Trial phase configurations
const PHASE_CONFIGS = {
  phase1: {
    start: 0,
    end: 200,
    probConfigs: [
      [0.2, 0.1],
      [0.1, 0.2],
      [0.15, 0.15]
    ]
  },
  phase2: {
    start: 200,
    end: 400,
    probConfigs: [
      [0.3, 0.3],
      [0.5, 0.1],
      [0.1, 0.5],
      [0.4, 0.2],
      [0.2, 0.4]
    ]
  },
  phase3: {
    start: 400,
    end: 600,
    probConfigs: [
      [0.5, 0.5],
      [0.8, 0.2],
      [0.2, 0.8],
      [0.6, 0.4],
      [0.4, 0.6]
    ]
  }
};

// Helper function to randomly select probability configuration for a phase
const selectRandomConfig = (configs) => {
  const randomIndex = Math.floor(Math.random() * configs.length);
  return configs[randomIndex];
};

export const GAME_CONFIG = {
  GAME_LENGTH: 600,
  COOLDOWN_TIME: 100, // Minimal cooldown in milliseconds
  REWARD_VALUE: 1,
  PHASES: PHASE_CONFIGS,
  // This function will be used to get the current reward probabilities
  getCurrentPhaseProbs: (trialNumber) => {
    if (trialNumber < PHASE_CONFIGS.phase1.end) {
      return selectRandomConfig(PHASE_CONFIGS.phase1.probConfigs);
    } else if (trialNumber < PHASE_CONFIGS.phase2.end) {
      return selectRandomConfig(PHASE_CONFIGS.phase2.probConfigs);
    } else {
      return selectRandomConfig(PHASE_CONFIGS.phase3.probConfigs);
    }
  }
};