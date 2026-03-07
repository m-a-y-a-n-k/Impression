/**
 * Practice Scenarios Configuration
 * Defines different practice scenarios with specific feedback criteria
 */

export const PRACTICE_SCENARIOS = {
  'job-interview': {
    id: 'job-interview',
    name: 'Job Interview',
    icon: '💼',
    description: 'Practice for your next job interview',
    duration: 300, // 5 minutes max
    tips: [
      'Maintain eye contact with the camera',
      'Speak clearly and confidently',
      'Use positive body language',
      'Avoid filler words',
      'Show enthusiasm and interest'
    ],
    evaluationCriteria: {
      eyeContact: { weight: 0.25, min: 60 }, // 60% of time
      confidence: { weight: 0.20, min: 70 },
      clarity: { weight: 0.20, min: 75 },
      bodyLanguage: { weight: 0.15, min: 65 },
      enthusiasm: { weight: 0.20, min: 70 }
    },
    commonQuestions: [
      'Tell me about yourself',
      'Why do you want this position?',
      'What are your strengths?',
      'Where do you see yourself in 5 years?',
      'Why should we hire you?'
    ],
    feedbackTemplates: {
      excellent: [
        'Outstanding interview performance! You demonstrated confidence and professionalism.',
        'Excellent! You maintained great eye contact and spoke with clarity.',
        'Impressive! Your body language and enthusiasm really shine through.'
      ],
      good: [
        'Good performance! A few adjustments could make it even better.',
        'Solid interview skills! Consider working on maintaining eye contact.',
        'Well done! Try to reduce filler words for a more polished delivery.'
      ],
      needsImprovement: [
        'Keep practicing! Focus on maintaining eye contact throughout.',
        'Good start! Work on speaking more confidently and clearly.',
        'Practice makes perfect! Try to show more enthusiasm and energy.'
      ]
    }
  },
  'elevator-pitch': {
    id: 'elevator-pitch',
    name: 'Elevator Pitch',
    icon: '🚀',
    description: 'Perfect your 30-60 second pitch',
    duration: 90, // 90 seconds max
    tips: [
      'Keep it concise and engaging',
      'Start with a hook',
      'Show passion and energy',
      'Maintain confident posture',
      'End with a clear call to action'
    ],
    evaluationCriteria: {
      conciseness: { weight: 0.30, min: 80 }, // Should be brief
      engagement: { weight: 0.25, min: 75 },
      energy: { weight: 0.25, min: 70 },
      clarity: { weight: 0.20, min: 80 }
    },
    commonPrompts: [
      'Introduce yourself and your idea',
      'Explain what problem you solve',
      'Describe your unique value proposition',
      'Pitch your startup or project',
      'Present your professional brand'
    ],
    feedbackTemplates: {
      excellent: [
        'Perfect pitch! Concise, engaging, and memorable.',
        'Excellent! You captured attention and delivered your message clearly.',
        'Outstanding! Your energy and clarity make this pitch compelling.'
      ],
      good: [
        'Good pitch! Try to make it even more concise.',
        'Solid delivery! Add more energy to make it more engaging.',
        'Well done! Consider starting with a stronger hook.'
      ],
      needsImprovement: [
        'Keep practicing! Focus on keeping it under 60 seconds.',
        'Good start! Work on showing more passion and energy.',
        'Practice makes perfect! Try to be more concise and clear.'
      ]
    }
  },
  'presentation': {
    id: 'presentation',
    name: 'Presentation',
    icon: '📊',
    description: 'Practice your presentation skills',
    duration: 600, // 10 minutes max
    tips: [
      'Use gestures to emphasize points',
      'Vary your speaking pace',
      'Maintain audience engagement',
      'Use pauses effectively',
      'Show confidence and authority'
    ],
    evaluationCriteria: {
      engagement: { weight: 0.25, min: 70 },
      clarity: { weight: 0.20, min: 75 },
      bodyLanguage: { weight: 0.20, min: 70 },
      pacing: { weight: 0.20, min: 70 },
      confidence: { weight: 0.15, min: 75 }
    },
    commonTopics: [
      'Present your project',
      'Explain a complex topic',
      'Pitch a business idea',
      'Share research findings',
      'Deliver a training session'
    ],
    feedbackTemplates: {
      excellent: [
        'Outstanding presentation! Engaging and well-delivered.',
        'Excellent! Your pacing and body language are spot on.',
        'Impressive! You maintained great engagement throughout.'
      ],
      good: [
        'Good presentation! Consider using more gestures.',
        'Solid delivery! Work on varying your speaking pace.',
        'Well done! Try to maintain better eye contact.'
      ],
      needsImprovement: [
        'Keep practicing! Focus on using more engaging body language.',
        'Good start! Work on your pacing and clarity.',
        'Practice makes perfect! Try to show more confidence.'
      ]
    }
  },
  'networking': {
    id: 'networking',
    name: 'Networking',
    icon: '🤝',
    description: 'Practice your networking conversation',
    duration: 180, // 3 minutes max
    tips: [
      'Be warm and approachable',
      'Show genuine interest',
      'Listen actively',
      'Maintain positive body language',
      'Be authentic and memorable'
    ],
    evaluationCriteria: {
      warmth: { weight: 0.25, min: 70 },
      engagement: { weight: 0.25, min: 75 },
      authenticity: { weight: 0.25, min: 75 },
      bodyLanguage: { weight: 0.25, min: 70 }
    },
    commonSituations: [
      'Introduce yourself at an event',
      'Make a memorable first impression',
      'Follow up on a previous meeting',
      'Connect with a potential collaborator',
      'Build rapport with a new contact'
    ],
    feedbackTemplates: {
      excellent: [
        'Perfect networking approach! Warm and engaging.',
        'Excellent! You come across as authentic and memorable.',
        'Outstanding! Your body language shows genuine interest.'
      ],
      good: [
        'Good networking skills! Try to show more warmth.',
        'Solid approach! Work on being more engaging.',
        'Well done! Consider showing more genuine interest.'
      ],
      needsImprovement: [
        'Keep practicing! Focus on being more approachable.',
        'Good start! Work on showing more warmth and engagement.',
        'Practice makes perfect! Try to be more authentic.'
      ]
    }
  }
};

/**
 * Get scenario by ID
 */
export const getScenario = (scenarioId) => {
  return PRACTICE_SCENARIOS[scenarioId] || PRACTICE_SCENARIOS['job-interview'];
};

/**
 * Get all scenario IDs
 */
export const getAllScenarioIds = () => {
  return Object.keys(PRACTICE_SCENARIOS);
};

/**
 * Get scenario-specific feedback based on score
 */
export const getScenarioFeedback = (scenarioId, overallScore) => {
  const scenario = getScenario(scenarioId);
  const templates = scenario.feedbackTemplates;
  
  if (overallScore >= 85) {
    return templates.excellent[Math.floor(Math.random() * templates.excellent.length)];
  } else if (overallScore >= 70) {
    return templates.good[Math.floor(Math.random() * templates.good.length)];
  } else {
    return templates.needsImprovement[Math.floor(Math.random() * templates.needsImprovement.length)];
  }
};

