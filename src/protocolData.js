// Multi-Expert Protocol Data
export const protocolCategories = {
  morning: {
    id: 'morning',
    name: 'Morning Routine',
    icon: '🌅',
    color: '#FF6B35'
  },
  sleep: {
    id: 'sleep',
    name: 'Sleep Optimization',
    icon: '😴',
    color: '#4A90E2'
  },
  exercise: {
    id: 'exercise',
    name: 'Exercise & Movement',
    icon: '💪',
    color: '#7ED321'
  },
  nutrition: {
    id: 'nutrition',
    name: 'Nutrition & Hydration',
    icon: '🥗',
    color: '#F5A623'
  },
  focus: {
    id: 'focus',
    name: 'Focus & Productivity',
    icon: '🧠',
    color: '#9013FE'
  },
  recovery: {
    id: 'recovery',
    name: 'Recovery & Stress',
    icon: '🧘',
    color: '#50E3C2'
  }
};

export const protocolItems = [
  // MORNING ROUTINE PROTOCOLS
  
  // Andrew Huberman Protocols
  {
    id: 'morning-light',
    title: 'Morning Light Exposure',
    category: 'morning',
    author: 'Andrew Huberman',
    authorIcon: '🧬',
    description: 'Get 5-30 minutes of natural sunlight exposure into your eyes within the first 30-60 minutes of waking up.',
    benefits: ['Sets circadian rhythm', 'Improves mood', 'Enhances energy', 'Better sleep quality'],
    instructions: [
      'Go outside within 30-60 minutes of waking',
      'Get direct sunlight (not through windows)',
      'Look toward the sun (not directly at it)',
      'Duration: 5-30 minutes depending on weather'
    ],
    difficulty: 'Easy',
    timeRequired: '5-30 minutes',
    frequency: 'Daily'
  },
  {
    id: 'morning-hydration',
    title: 'Morning Hydration',
    category: 'morning',
    author: 'Andrew Huberman',
    authorIcon: '🧬',
    description: 'Drink 16-32 ounces of water immediately upon waking, often with electrolytes.',
    benefits: ['Rehydrates body', 'Boosts metabolism', 'Improves cognitive function', 'Supports detoxification'],
    instructions: [
      'Drink 16-32 oz of water immediately upon waking',
      'Add a pinch of sea salt for electrolytes',
      'Avoid caffeine for first 90-120 minutes'
    ],
    difficulty: 'Easy',
    timeRequired: '2-5 minutes',
    frequency: 'Daily'
  },
  {
    id: 'delayed-caffeine',
    title: 'Delayed Caffeine Intake',
    category: 'morning',
    author: 'Andrew Huberman',
    authorIcon: '🧬',
    description: 'Wait 90-120 minutes after waking before consuming caffeine to allow natural cortisol peak.',
    benefits: ['Prevents energy crashes', 'Maintains natural energy cycles', 'Better long-term energy'],
    instructions: [
      'Wait 90-120 minutes after waking',
      'Allow natural cortisol and adrenaline to peak first',
      'Then consume caffeine if desired'
    ],
    difficulty: 'Medium',
    timeRequired: '0 minutes (timing)',
    frequency: 'Daily'
  },

  // Tim Ferriss Protocols
  {
    id: 'ferriss-morning-pages',
    title: 'Morning Pages',
    category: 'morning',
    author: 'Tim Ferriss',
    authorIcon: '⚡',
    description: 'Write 3 pages of stream-of-consciousness writing first thing in the morning.',
    benefits: ['Clears mental clutter', 'Enhances creativity', 'Reduces anxiety', 'Improves focus'],
    instructions: [
      'Write 3 pages of stream-of-consciousness',
      'No editing or filtering thoughts',
      'Do this before checking phone or email',
      'Write by hand for better cognitive benefits'
    ],
    difficulty: 'Easy',
    timeRequired: '10-15 minutes',
    frequency: 'Daily'
  },
  {
    id: 'ferriss-5-minute-journal',
    title: '5-Minute Journal',
    category: 'morning',
    author: 'Tim Ferriss',
    authorIcon: '⚡',
    description: 'Structured gratitude and goal-setting practice each morning.',
    benefits: ['Increases gratitude', 'Improves mood', 'Sets daily intentions', 'Enhances mindfulness'],
    instructions: [
      'Write 3 things you\'re grateful for',
      'Write 3 things that would make today great',
      'Write daily affirmation',
      'Keep it simple and consistent'
    ],
    difficulty: 'Easy',
    timeRequired: '5 minutes',
    frequency: 'Daily'
  },

  // SLEEP OPTIMIZATION PROTOCOLS

  // Andrew Huberman Sleep Protocols
  {
    id: 'consistent-sleep',
    title: 'Consistent Sleep Schedule',
    category: 'sleep',
    author: 'Andrew Huberman',
    authorIcon: '🧬',
    description: 'Go to bed and wake up at the same time each day to maintain circadian rhythm.',
    benefits: ['Better sleep quality', 'Improved energy', 'Enhanced mood', 'Stronger circadian rhythm'],
    instructions: [
      'Set consistent bedtime and wake time',
      'Maintain schedule even on weekends',
      'Allow 7-9 hours of sleep',
      'Create bedtime routine'
    ],
    difficulty: 'Medium',
    timeRequired: '0 minutes (scheduling)',
    frequency: 'Daily'
  },
  {
    id: 'evening-light-avoidance',
    title: 'Evening Light Management',
    category: 'sleep',
    author: 'Andrew Huberman',
    authorIcon: '🧬',
    description: 'Reduce bright light exposure 2-3 hours before bedtime to support melatonin production.',
    benefits: ['Better sleep onset', 'Improved sleep quality', 'Natural melatonin production'],
    instructions: [
      'Dim lights 2-3 hours before bed',
      'Avoid screens or use blue light filters',
      'Use warm, dim lighting in evening',
      'Consider candlelight or salt lamps'
    ],
    difficulty: 'Easy',
    timeRequired: '0 minutes (environment)',
    frequency: 'Daily'
  },

  // Peter Attia Sleep Protocols
  {
    id: 'attia-sleep-tracking',
    title: 'Sleep Tracking & Optimization',
    category: 'sleep',
    author: 'Peter Attia',
    authorIcon: '🏥',
    description: 'Use data-driven approach to optimize sleep quality and duration.',
    benefits: ['Data-driven insights', 'Better sleep quality', 'Optimized recovery', 'Improved performance'],
    instructions: [
      'Track sleep with wearable device',
      'Monitor sleep stages and duration',
      'Adjust bedtime based on data',
      'Optimize sleep environment'
    ],
    difficulty: 'Medium',
    timeRequired: '5 minutes daily',
    frequency: 'Daily'
  },

  // EXERCISE & MOVEMENT PROTOCOLS

  // Andrew Huberman Exercise Protocols
  {
    id: 'cold-exposure',
    title: 'Cold Exposure',
    category: 'exercise',
    author: 'Andrew Huberman',
    authorIcon: '🧬',
    description: 'Incorporate deliberate cold exposure to increase alertness, energy, and resilience.',
    benefits: ['Increased alertness', 'Enhanced energy', 'Improved resilience', 'Better mood'],
    instructions: [
      'Start with cold showers (30-60 seconds)',
      'Progress to cold plunges if desired',
      'Avoid immediately before/after main workout',
      'Start gradually and build tolerance'
    ],
    difficulty: 'Hard',
    timeRequired: '2-10 minutes',
    frequency: '2-3x per week'
  },
  {
    id: 'resistance-training',
    title: 'Resistance Training',
    category: 'exercise',
    author: 'Andrew Huberman',
    authorIcon: '🧬',
    description: 'Engage in structured resistance training for strength, muscle mass, and metabolic health.',
    benefits: ['Increased strength', 'Better body composition', 'Improved metabolism', 'Enhanced bone density'],
    instructions: [
      'Focus on compound movements',
      'Train 2-4x per week',
      'Progressive overload',
      'Allow adequate recovery between sessions'
    ],
    difficulty: 'Medium',
    timeRequired: '45-90 minutes',
    frequency: '2-4x per week'
  },

  // Wim Hof Method
  {
    id: 'wim-hof-breathing',
    title: 'Wim Hof Breathing Method',
    category: 'exercise',
    author: 'Wim Hof',
    authorIcon: '❄️',
    description: 'Controlled breathing technique to increase energy, reduce stress, and improve focus.',
    benefits: ['Increased energy', 'Reduced stress', 'Better focus', 'Enhanced immune function'],
    instructions: [
      '30-40 deep breaths in rapid succession',
      'Hold breath after final exhale',
      'Breathe in and hold for 15 seconds',
      'Repeat 3-4 rounds'
    ],
    difficulty: 'Medium',
    timeRequired: '10-15 minutes',
    frequency: 'Daily'
  },
  {
    id: 'wim-hof-cold-therapy',
    title: 'Wim Hof Cold Therapy',
    category: 'exercise',
    author: 'Wim Hof',
    authorIcon: '❄️',
    description: 'Combined breathing and cold exposure for maximum benefits.',
    benefits: ['Enhanced resilience', 'Improved immune function', 'Better stress management', 'Increased energy'],
    instructions: [
      'Practice Wim Hof breathing first',
      'Start with 30 seconds cold shower',
      'Gradually increase exposure time',
      'Focus on controlled breathing during exposure'
    ],
    difficulty: 'Hard',
    timeRequired: '15-30 minutes',
    frequency: '3-4x per week'
  },

  // Peter Attia Exercise Protocols
  {
    id: 'attia-zone-2-training',
    title: 'Zone 2 Cardio Training',
    category: 'exercise',
    author: 'Peter Attia',
    authorIcon: '🏥',
    description: 'Low-intensity steady-state cardio for mitochondrial health and longevity.',
    benefits: ['Improved mitochondrial function', 'Better cardiovascular health', 'Enhanced fat burning', 'Increased longevity'],
    instructions: [
      'Exercise at 60-70% max heart rate',
      'Should be able to hold conversation',
      'Duration: 45-90 minutes',
      'Frequency: 3-4x per week'
    ],
    difficulty: 'Easy',
    timeRequired: '45-90 minutes',
    frequency: '3-4x per week'
  },
  {
    id: 'attia-vo2-max-training',
    title: 'VO2 Max Training',
    category: 'exercise',
    author: 'Peter Attia',
    authorIcon: '🏥',
    description: 'High-intensity interval training to improve cardiovascular capacity.',
    benefits: ['Increased VO2 max', 'Better cardiovascular fitness', 'Enhanced performance', 'Improved longevity'],
    instructions: [
      '4x4 minute intervals at 90-95% max heart rate',
      '3 minute recovery between intervals',
      'Warm up and cool down properly',
      'Frequency: 1-2x per week'
    ],
    difficulty: 'Hard',
    timeRequired: '30-45 minutes',
    frequency: '1-2x per week'
  },

  // NUTRITION & HYDRATION PROTOCOLS

  // Peter Attia Nutrition Protocols
  {
    id: 'attia-intermittent-fasting',
    title: 'Intermittent Fasting',
    category: 'nutrition',
    author: 'Peter Attia',
    authorIcon: '🏥',
    description: 'Time-restricted eating to improve metabolic health and longevity.',
    benefits: ['Improved insulin sensitivity', 'Enhanced autophagy', 'Better metabolic health', 'Weight management'],
    instructions: [
      '16:8 or 18:6 eating window',
      'Eat within 6-8 hour window',
      'Stay hydrated during fasting',
      'Start gradually and adjust'
    ],
    difficulty: 'Medium',
    timeRequired: '0 minutes (timing)',
    frequency: 'Daily'
  },
  {
    id: 'attia-protein-optimization',
    title: 'Protein Optimization',
    category: 'nutrition',
    author: 'Peter Attia',
    authorIcon: '🏥',
    description: 'Optimize protein intake for muscle maintenance and longevity.',
    benefits: ['Muscle preservation', 'Better body composition', 'Improved recovery', 'Enhanced longevity'],
    instructions: [
      '1.6-2.2g protein per kg body weight',
      'Distribute across 3-4 meals',
      'Include complete protein sources',
      'Time protein around workouts'
    ],
    difficulty: 'Medium',
    timeRequired: '5-10 minutes planning',
    frequency: 'Daily'
  },

  // FOCUS & PRODUCTIVITY PROTOCOLS

  // Andrew Huberman Focus Protocols
  {
    id: 'deep-focus-blocks',
    title: 'Deep Focus Work Blocks',
    category: 'focus',
    author: 'Andrew Huberman',
    authorIcon: '🧬',
    description: 'Structure work in 90-minute focused blocks when dopamine and adrenaline naturally support focus.',
    benefits: ['Enhanced productivity', 'Better quality work', 'Reduced mental fatigue', 'Improved learning'],
    instructions: [
      'Work in 90-minute focused blocks',
      'Minimize distractions (phone, email, social media)',
      'Take breaks between blocks',
      'Schedule important work during peak focus times'
    ],
    difficulty: 'Medium',
    timeRequired: '90 minutes per block',
    frequency: 'Daily'
  },
  {
    id: 'nsdr',
    title: 'Non-Sleep Deep Rest (NSDR)',
    category: 'focus',
    author: 'Andrew Huberman',
    authorIcon: '🧬',
    description: 'Practice NSDR techniques like Yoga Nidra to reset the mind and restore energy.',
    benefits: ['Reduced stress', 'Improved focus', 'Better recovery', 'Enhanced mood'],
    instructions: [
      'Use when feeling unrested or stressed',
      'Practice Yoga Nidra or similar techniques',
      'Duration: 10-30 minutes',
      'Can be done anytime during the day'
    ],
    difficulty: 'Easy',
    timeRequired: '10-30 minutes',
    frequency: 'As needed'
  },

  // Tim Ferriss Productivity Protocols
  {
    id: 'ferriss-pomodoro',
    title: 'Pomodoro Technique',
    category: 'focus',
    author: 'Tim Ferriss',
    authorIcon: '⚡',
    description: 'Work in 25-minute focused intervals with 5-minute breaks.',
    benefits: ['Improved focus', 'Better time management', 'Reduced burnout', 'Enhanced productivity'],
    instructions: [
      'Work for 25 minutes uninterrupted',
      'Take 5-minute break',
      'After 4 cycles, take 15-30 minute break',
      'Use timer to maintain discipline'
    ],
    difficulty: 'Easy',
    timeRequired: '25 minutes per cycle',
    frequency: 'As needed'
  },
  {
    id: 'ferriss-batching',
    title: 'Task Batching',
    category: 'focus',
    author: 'Tim Ferriss',
    authorIcon: '⚡',
    description: 'Group similar tasks together to minimize context switching.',
    benefits: ['Reduced context switching', 'Improved efficiency', 'Better focus', 'Less mental fatigue'],
    instructions: [
      'Group similar tasks together',
      'Schedule specific times for each batch',
      'Minimize interruptions during batches',
      'Review and adjust batching strategy'
    ],
    difficulty: 'Easy',
    timeRequired: 'Varies by task',
    frequency: 'Daily'
  },

  // RECOVERY & STRESS PROTOCOLS

  // Wim Hof Recovery Protocols
  {
    id: 'wim-hof-meditation',
    title: 'Wim Hof Meditation',
    category: 'recovery',
    author: 'Wim Hof',
    authorIcon: '❄️',
    description: 'Combined breathing and meditation for stress reduction and recovery.',
    benefits: ['Reduced stress', 'Better recovery', 'Improved focus', 'Enhanced well-being'],
    instructions: [
      'Practice Wim Hof breathing',
      'Follow with 10-20 minute meditation',
      'Focus on breath and body awareness',
      'Practice daily for best results'
    ],
    difficulty: 'Medium',
    timeRequired: '20-30 minutes',
    frequency: 'Daily'
  },

  // Peter Attia Recovery Protocols
  {
    id: 'attia-sleep-optimization',
    title: 'Sleep Optimization Protocol',
    category: 'recovery',
    author: 'Peter Attia',
    authorIcon: '🏥',
    description: 'Data-driven approach to optimize sleep for recovery and performance.',
    benefits: ['Better recovery', 'Improved performance', 'Enhanced health', 'Optimized sleep'],
    instructions: [
      'Track sleep with wearable device',
      'Optimize sleep environment',
      'Maintain consistent schedule',
      'Monitor and adjust based on data'
    ],
    difficulty: 'Medium',
    timeRequired: '5 minutes daily',
    frequency: 'Daily'
  },

  // Tim Ferriss Recovery Protocols
  {
    id: 'ferriss-meditation',
    title: '10-Minute Meditation',
    category: 'recovery',
    author: 'Tim Ferriss',
    authorIcon: '⚡',
    description: 'Simple 10-minute meditation practice for stress reduction and mental clarity.',
    benefits: ['Reduced stress', 'Better focus', 'Improved mood', 'Enhanced mindfulness'],
    instructions: [
      'Sit comfortably for 10 minutes',
      'Focus on breath or body scan',
      'When mind wanders, gently return to focus',
      'Practice daily for consistency'
    ],
    difficulty: 'Easy',
    timeRequired: '10 minutes',
    frequency: 'Daily'
  }
];

export const getProtocolsByCategory = (categoryId) => {
  return protocolItems.filter(item => item.category === categoryId);
};

export const getProtocolById = (id) => {
  return protocolItems.find(item => item.id === id);
};

export const getProtocolsByAuthor = (author) => {
  return protocolItems.filter(item => item.author === author);
};

export const getAuthors = () => {
  const authors = [...new Set(protocolItems.map(item => item.author))];
  return authors.map(author => ({
    name: author,
    icon: protocolItems.find(item => item.author === author)?.authorIcon || '👤',
    count: protocolItems.filter(item => item.author === author).length
  }));
};