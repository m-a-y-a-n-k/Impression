/**
 * Q&A Questions Configuration for Diverse Topics
 * Expanded beyond STEM to include Business, History, Arts, Current Affairs, and more
 */

export const QUESTION_CATEGORIES = {
  // STEM Categories
  SCIENCE: 'science',
  TECHNOLOGY: 'technology',
  ENGINEERING: 'engineering',
  MATHEMATICS: 'mathematics',
  // Non-STEM Categories
  BUSINESS: 'business',
  HISTORY: 'history',
  ARTS: 'arts',
  CURRENT_AFFAIRS: 'current_affairs',
  PSYCHOLOGY: 'psychology',
  LITERATURE: 'literature'
};

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

/**
 * Question bank organized by category
 * Each question includes a timeLimit in seconds
 */
export const QUESTION_BANK = {
  science: [
    // BEGINNER SCIENCE
    {
      id: 'sci_001',
      category: QUESTION_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain what photosynthesis is and why it is important for life on Earth.',
      keywords: ['photosynthesis', 'plants', 'chlorophyll', 'sunlight', 'carbon dioxide', 'oxygen', 'glucose', 'energy'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.2
      }
    },
    {
      id: 'sci_002',
      category: QUESTION_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is the water cycle and why is it essential for Earth\'s ecosystems?',
      keywords: ['water cycle', 'evaporation', 'condensation', 'precipitation', 'runoff', 'atmosphere', 'hydrosphere', 'ecosystem'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.2
      }
    },
    {
      id: 'sci_003',
      category: QUESTION_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Describe the three states of matter and give examples of each.',
      keywords: ['states of matter', 'solid', 'liquid', 'gas', 'particles', 'molecules', 'volume', 'shape', 'energy'],
      expectedLength: 90,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // INTERMEDIATE SCIENCE
    {
      id: 'sci_004',
      category: QUESTION_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'What is the difference between DNA and RNA? Explain their roles in living organisms.',
      keywords: ['DNA', 'RNA', 'deoxyribonucleic acid', 'ribonucleic acid', 'nucleotides', 'genetic', 'protein', 'synthesis'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'sci_005',
      category: QUESTION_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Describe the greenhouse effect and its impact on climate change.',
      keywords: ['greenhouse effect', 'carbon dioxide', 'methane', 'atmosphere', 'temperature', 'climate change', 'global warming'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // ADVANCED SCIENCE
    {
      id: 'sci_006',
      category: QUESTION_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Explain the process of protein synthesis from transcription to translation.',
      keywords: ['transcription', 'translation', 'mRNA', 'tRNA', 'ribosome', 'amino acids', 'codons', 'polypeptide'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    },
    {
      id: 'sci_007',
      category: QUESTION_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is gravity and how does it affect objects on Earth?',
      keywords: ['gravity', 'force', 'mass', 'weight', 'Earth', 'attraction', 'Newton', 'acceleration'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'sci_008',
      category: QUESTION_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Describe the human digestive system and its main functions.',
      keywords: ['digestive system', 'stomach', 'intestines', 'nutrients', 'enzymes', 'absorption', 'digestion', 'food'],
      expectedLength: 110,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.2
      }
    },
    {
      id: 'sci_009',
      category: QUESTION_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain how vaccines work to protect against diseases.',
      keywords: ['vaccines', 'immunity', 'antibodies', 'antigens', 'immune system', 'prevention', 'disease', 'memory cells'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'sci_010',
      category: QUESTION_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'What is the theory of evolution by natural selection?',
      keywords: ['evolution', 'natural selection', 'Darwin', 'adaptation', 'survival', 'species', 'traits', 'environment'],
      expectedLength: 130,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'sci_011',
      category: QUESTION_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Discuss the role of CRISPR-Cas9 technology in genetic engineering.',
      keywords: ['CRISPR', 'Cas9', 'genetic engineering', 'gene editing', 'DNA', 'biotechnology', 'genome', 'modification'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    },
    {
      id: 'sci_012',
      category: QUESTION_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Explain quantum entanglement and its implications for physics.',
      keywords: ['quantum', 'entanglement', 'particles', 'physics', 'correlation', 'measurement', 'spooky action', 'quantum mechanics'],
      expectedLength: 160,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    }
  ],

  technology: [
    // BEGINNER TECHNOLOGY
    {
      id: 'tech_001',
      category: QUESTION_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is cloud computing and what are its main benefits?',
      keywords: ['cloud', 'internet', 'servers', 'storage', 'scalability', 'flexibility', 'cost', 'remote', 'data center'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'tech_002',
      category: QUESTION_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is artificial intelligence and give examples of its applications?',
      keywords: ['artificial intelligence', 'AI', 'machine learning', 'automation', 'algorithms', 'applications', 'voice assistants'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // INTERMEDIATE TECHNOLOGY
    {
      id: 'tech_003',
      category: QUESTION_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain how blockchain technology works and its key features.',
      keywords: ['blockchain', 'distributed', 'ledger', 'decentralized', 'blocks', 'hash', 'consensus', 'immutable'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // ADVANCED TECHNOLOGY
    {
      id: 'tech_004',
      category: QUESTION_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Describe the architecture and working principles of a neural network in machine learning.',
      keywords: ['neural network', 'layers', 'neurons', 'weights', 'activation', 'backpropagation', 'training', 'deep learning'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    },
    {
      id: 'tech_005',
      category: QUESTION_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is the Internet of Things (IoT) and provide examples of its use?',
      keywords: ['IoT', 'Internet of Things', 'connected devices', 'sensors', 'smart home', 'automation', 'network', 'data'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'tech_006',
      category: QUESTION_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain what cybersecurity is and why it is important.',
      keywords: ['cybersecurity', 'security', 'protection', 'threats', 'hackers', 'data', 'privacy', 'firewall', 'encryption'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'tech_007',
      category: QUESTION_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'How does quantum computing differ from classical computing?',
      keywords: ['quantum computing', 'classical computing', 'qubits', 'superposition', 'entanglement', 'processing', 'algorithms'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'tech_008',
      category: QUESTION_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain the concept of edge computing and its advantages over cloud computing.',
      keywords: ['edge computing', 'cloud computing', 'latency', 'processing', 'distributed', 'bandwidth', 'data', 'devices'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'tech_009',
      category: QUESTION_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Discuss the ethical implications of artificial intelligence and autonomous systems.',
      keywords: ['ethics', 'artificial intelligence', 'autonomous', 'bias', 'accountability', 'decision-making', 'society', 'responsibility'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    }
  ],

  engineering: [
    // BEGINNER ENGINEERING
    {
      id: 'eng_001',
      category: QUESTION_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What are the fundamental differences between AC and DC current?',
      keywords: ['AC', 'DC', 'alternating', 'direct', 'current', 'voltage', 'frequency', 'electrons', 'power'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.3,
        completeness: 0.2,
        vocabulary: 0.15
      }
    },
    {
      id: 'eng_002',
      category: QUESTION_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is Ohm\'s Law and how is it used in electrical circuits?',
      keywords: ['Ohm\'s Law', 'voltage', 'current', 'resistance', 'V=IR', 'electrical circuits'],
      expectedLength: 90,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.3,
        completeness: 0.2,
        vocabulary: 0.15
      }
    },
    // INTERMEDIATE ENGINEERING
    {
      id: 'eng_003',
      category: QUESTION_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain the working principle of a heat engine and the concept of thermal efficiency.',
      keywords: ['heat engine', 'thermal efficiency', 'carnot', 'heat', 'work', 'temperature', 'energy conversion'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // ADVANCED ENGINEERING
    {
      id: 'eng_004',
      category: QUESTION_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Describe the principles of finite element analysis (FEA) and its applications in structural engineering.',
      keywords: ['finite element', 'FEA', 'mesh', 'nodes', 'elements', 'structural analysis', 'stress', 'strain', 'simulation'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    },
    {
      id: 'eng_005',
      category: QUESTION_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is the purpose of a bridge and what are the main types of bridges?',
      keywords: ['bridge', 'structure', 'beam', 'arch', 'suspension', 'cable-stayed', 'truss', 'engineering', 'design'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.3,
        completeness: 0.2,
        vocabulary: 0.15
      }
    },
    {
      id: 'eng_006',
      category: QUESTION_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain the principles of renewable energy engineering and its importance.',
      keywords: ['renewable energy', 'solar', 'wind', 'hydroelectric', 'sustainable', 'engineering', 'clean energy', 'environment'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'eng_007',
      category: QUESTION_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'What is mechatronics and how does it integrate different engineering disciplines?',
      keywords: ['mechatronics', 'mechanical', 'electrical', 'computer', 'robotics', 'automation', 'systems', 'integration'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'eng_008',
      category: QUESTION_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Discuss the challenges in designing sustainable urban infrastructure.',
      keywords: ['sustainable', 'urban', 'infrastructure', 'green building', 'transportation', 'water management', 'energy efficiency', 'planning'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    }
  ],

  mathematics: [
    // BEGINNER MATHEMATICS
    {
      id: 'math_001',
      category: QUESTION_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain what a derivative is in calculus and provide a real-world application.',
      keywords: ['derivative', 'rate of change', 'slope', 'tangent', 'calculus', 'instantaneous', 'velocity'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.3,
        completeness: 0.2,
        vocabulary: 0.15
      }
    },
    {
      id: 'math_002',
      category: QUESTION_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is the Pythagorean theorem and how is it applied in real-world scenarios?',
      keywords: ['pythagorean', 'theorem', 'right triangle', 'hypotenuse', 'perpendicular', 'base', 'square', 'distance'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // INTERMEDIATE MATHEMATICS
    {
      id: 'math_003',
      category: QUESTION_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'What is the difference between permutations and combinations? Provide examples.',
      keywords: ['permutation', 'combination', 'order', 'arrangement', 'selection', 'factorial', 'counting', 'probability'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // ADVANCED MATHEMATICS
    {
      id: 'math_004',
      category: QUESTION_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Explain the Fundamental Theorem of Calculus and its significance.',
      keywords: ['fundamental theorem', 'calculus', 'integration', 'differentiation', 'antiderivative', 'definite integral'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    },
    {
      id: 'math_005',
      category: QUESTION_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is the concept of variables and constants in algebra?',
      keywords: ['variables', 'constants', 'algebra', 'equations', 'unknown', 'value', 'mathematics', 'symbols'],
      expectedLength: 90,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'math_006',
      category: QUESTION_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain the concept of matrices and their applications in real life.',
      keywords: ['matrices', 'linear algebra', 'rows', 'columns', 'operations', 'applications', 'systems', 'transformations'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'math_007',
      category: QUESTION_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Discuss the Riemann Hypothesis and its importance in number theory.',
      keywords: ['Riemann Hypothesis', 'number theory', 'prime numbers', 'zeta function', 'mathematics', 'conjecture', 'unsolved'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    }
  ],

  business: [
    // BEGINNER BUSINESS
    {
      id: 'bus_001',
      category: QUESTION_CATEGORIES.BUSINESS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is the difference between revenue and profit in a business?',
      keywords: ['revenue', 'profit', 'income', 'expenses', 'costs', 'sales', 'net income', 'gross income', 'margin'],
      expectedLength: 90,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'bus_002',
      category: QUESTION_CATEGORIES.BUSINESS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain what a business model is and why it is important for startups.',
      keywords: ['business model', 'value proposition', 'revenue streams', 'customers', 'strategy', 'monetization', 'startup'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'bus_003',
      category: QUESTION_CATEGORIES.BUSINESS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is marketing and how does it differ from sales?',
      keywords: ['marketing', 'sales', 'promotion', 'advertising', 'branding', 'customer', 'demand', 'awareness', 'conversion'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // INTERMEDIATE BUSINESS
    {
      id: 'bus_004',
      category: QUESTION_CATEGORIES.BUSINESS,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Describe the concept of supply and demand and how it affects pricing.',
      keywords: ['supply', 'demand', 'equilibrium', 'price', 'market', 'scarcity', 'surplus', 'shortage', 'economics'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'bus_005',
      category: QUESTION_CATEGORIES.BUSINESS,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'What is SWOT analysis and how is it used in strategic planning?',
      keywords: ['SWOT', 'strengths', 'weaknesses', 'opportunities', 'threats', 'analysis', 'strategic planning', 'business strategy'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'bus_006',
      category: QUESTION_CATEGORIES.BUSINESS,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain the concept of brand equity and its importance to a company.',
      keywords: ['brand equity', 'brand value', 'reputation', 'loyalty', 'recognition', 'intangible assets', 'customer perception'],
      expectedLength: 110,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // ADVANCED BUSINESS
    {
      id: 'bus_007',
      category: QUESTION_CATEGORIES.BUSINESS,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Discuss the principles of behavioral economics and how they influence consumer decision-making.',
      keywords: ['behavioral economics', 'cognitive biases', 'decision-making', 'nudge theory', 'psychology', 'consumer behavior', 'irrationality'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    },
    {
      id: 'bus_008',
      category: QUESTION_CATEGORIES.BUSINESS,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Explain the concept of disruptive innovation and provide real-world examples.',
      keywords: ['disruptive innovation', 'technology', 'market disruption', 'incumbents', 'transformation', 'Clayton Christensen'],
      expectedLength: 140,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    }
  ],

  history: [
    // BEGINNER HISTORY
    {
      id: 'his_001',
      category: QUESTION_CATEGORIES.HISTORY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain the significance of the Industrial Revolution and its impact on society.',
      keywords: ['Industrial Revolution', 'manufacturing', 'machines', 'urbanization', 'society', 'economy', 'factory', 'steam engine'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'his_002',
      category: QUESTION_CATEGORIES.HISTORY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What were the main causes of World War I?',
      keywords: ['World War I', 'causes', 'alliances', 'imperialism', 'nationalism', 'militarism', 'assassination', 'Franz Ferdinand'],
      expectedLength: 110,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'his_003',
      category: QUESTION_CATEGORIES.HISTORY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Describe the significance of the Renaissance period in European history.',
      keywords: ['Renaissance', 'rebirth', 'art', 'science', 'humanism', 'Europe', 'culture', 'innovation', 'Leonardo da Vinci'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // INTERMEDIATE HISTORY
    {
      id: 'his_004',
      category: QUESTION_CATEGORIES.HISTORY,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Analyze the factors that led to the fall of the Roman Empire.',
      keywords: ['Roman Empire', 'fall', 'decline', 'barbarian invasions', 'economic troubles', 'political instability', 'division'],
      expectedLength: 130,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'his_005',
      category: QUESTION_CATEGORIES.HISTORY,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain the key principles of the French Revolution and its global impact.',
      keywords: ['French Revolution', 'liberty', 'equality', 'fraternity', 'monarchy', 'republic', 'Bastille', 'Reign of Terror'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // ADVANCED HISTORY
    {
      id: 'his_006',
      category: QUESTION_CATEGORIES.HISTORY,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Discuss the geopolitical consequences of the Cold War and its influence on modern international relations.',
      keywords: ['Cold War', 'geopolitical', 'Soviet Union', 'United States', 'proxy wars', 'nuclear arms', 'détente', 'international relations'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    }
  ],

  arts: [
    // BEGINNER ARTS
    {
      id: 'art_001',
      category: QUESTION_CATEGORIES.ARTS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is impressionism in art and who were its main representatives?',
      keywords: ['impressionism', 'art movement', 'light', 'color', 'Monet', 'Renoir', 'painting', 'France', '19th century'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'art_002',
      category: QUESTION_CATEGORIES.ARTS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain the basic elements of music: rhythm, melody, and harmony.',
      keywords: ['music', 'rhythm', 'melody', 'harmony', 'beat', 'tune', 'chords', 'composition', 'sound'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'art_003',
      category: QUESTION_CATEGORIES.ARTS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is the significance of Shakespeare in English literature?',
      keywords: ['Shakespeare', 'literature', 'playwright', 'poetry', 'English', 'theater', 'sonnets', 'Renaissance', 'influence'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // INTERMEDIATE ARTS
    {
      id: 'art_004',
      category: QUESTION_CATEGORIES.ARTS,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Compare and contrast classical and modern architecture.',
      keywords: ['architecture', 'classical', 'modern', 'design', 'columns', 'minimalism', 'function', 'form', 'materials'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'art_005',
      category: QUESTION_CATEGORIES.ARTS,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain the impact of digital technology on contemporary art.',
      keywords: ['digital art', 'technology', 'contemporary', 'NFT', 'digital media', 'new media', 'innovation', 'creativity'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // ADVANCED ARTS
    {
      id: 'art_006',
      category: QUESTION_CATEGORIES.ARTS,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Analyze the role of surrealism in challenging perceptions of reality in art and literature.',
      keywords: ['surrealism', 'art movement', 'reality', 'subconscious', 'Dalí', 'Magritte', 'dream', 'automatic writing', 'perception'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    }
  ],

  current_affairs: [
    // BEGINNER CURRENT AFFAIRS
    {
      id: 'cur_001',
      category: QUESTION_CATEGORIES.CURRENT_AFFAIRS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is climate change and why is it a global concern?',
      keywords: ['climate change', 'global warming', 'greenhouse gases', 'carbon emissions', 'temperature', 'environment', 'sustainability'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'cur_002',
      category: QUESTION_CATEGORIES.CURRENT_AFFAIRS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain what the United Nations is and its primary objectives.',
      keywords: ['United Nations', 'UN', 'international organization', 'peace', 'security', 'cooperation', 'humanitarian', 'member states'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'cur_003',
      category: QUESTION_CATEGORIES.CURRENT_AFFAIRS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is cryptocurrency and how does it differ from traditional currency?',
      keywords: ['cryptocurrency', 'Bitcoin', 'blockchain', 'digital currency', 'decentralized', 'traditional money', 'transactions'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // INTERMEDIATE CURRENT AFFAIRS
    {
      id: 'cur_004',
      category: QUESTION_CATEGORIES.CURRENT_AFFAIRS,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Discuss the implications of artificial intelligence on the future job market.',
      keywords: ['artificial intelligence', 'job market', 'automation', 'employment', 'skills', 'displacement', 'future', 'workforce'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'cur_005',
      category: QUESTION_CATEGORIES.CURRENT_AFFAIRS,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain the concept of sustainable development and the UN Sustainable Development Goals.',
      keywords: ['sustainable development', 'SDGs', 'United Nations', 'goals', 'poverty', 'environment', 'social', 'economic', '2030 Agenda'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // ADVANCED CURRENT AFFAIRS
    {
      id: 'cur_006',
      category: QUESTION_CATEGORIES.CURRENT_AFFAIRS,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Analyze the geopolitical tensions surrounding semiconductor manufacturing and technology supply chains.',
      keywords: ['semiconductors', 'geopolitics', 'supply chain', 'technology', 'manufacturing', 'China', 'Taiwan', 'trade', 'strategic'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    }
  ],

  psychology: [
    // BEGINNER PSYCHOLOGY
    {
      id: 'psy_001',
      category: QUESTION_CATEGORIES.PSYCHOLOGY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is cognitive psychology and what does it study?',
      keywords: ['cognitive psychology', 'mental processes', 'perception', 'memory', 'thinking', 'problem-solving', 'attention', 'learning'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'psy_002',
      category: QUESTION_CATEGORIES.PSYCHOLOGY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain Maslow\'s hierarchy of needs and its relevance to human motivation.',
      keywords: ['Maslow', 'hierarchy of needs', 'motivation', 'self-actualization', 'physiological', 'safety', 'belonging', 'esteem'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'psy_003',
      category: QUESTION_CATEGORIES.PSYCHOLOGY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is emotional intelligence and why is it important?',
      keywords: ['emotional intelligence', 'EQ', 'emotions', 'self-awareness', 'empathy', 'social skills', 'relationships', 'management'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // INTERMEDIATE PSYCHOLOGY
    {
      id: 'psy_004',
      category: QUESTION_CATEGORIES.PSYCHOLOGY,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Describe the main differences between classical and operant conditioning.',
      keywords: ['classical conditioning', 'operant conditioning', 'Pavlov', 'Skinner', 'learning', 'behavior', 'reinforcement', 'punishment'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'psy_005',
      category: QUESTION_CATEGORIES.PSYCHOLOGY,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain cognitive dissonance and provide real-life examples.',
      keywords: ['cognitive dissonance', 'conflict', 'beliefs', 'behavior', 'inconsistency', 'attitude', 'Leon Festinger', 'psychology'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // ADVANCED PSYCHOLOGY
    {
      id: 'psy_006',
      category: QUESTION_CATEGORIES.PSYCHOLOGY,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Discuss the neurobiological basis of memory formation and consolidation.',
      keywords: ['neurobiology', 'memory', 'formation', 'consolidation', 'hippocampus', 'synaptic plasticity', 'long-term potentiation', 'brain'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    }
  ],

  literature: [
    // BEGINNER LITERATURE
    {
      id: 'lit_001',
      category: QUESTION_CATEGORIES.LITERATURE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is the difference between a metaphor and a simile? Provide examples.',
      keywords: ['metaphor', 'simile', 'figurative language', 'comparison', 'like', 'as', 'literary device', 'poetry'],
      expectedLength: 90,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'lit_002',
      category: QUESTION_CATEGORIES.LITERATURE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain what a protagonist and antagonist are in a story.',
      keywords: ['protagonist', 'antagonist', 'character', 'story', 'main character', 'conflict', 'hero', 'villain', 'narrative'],
      expectedLength: 90,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'lit_003',
      category: QUESTION_CATEGORIES.LITERATURE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is the significance of the novel "1984" by George Orwell?',
      keywords: ['1984', 'George Orwell', 'dystopia', 'totalitarianism', 'surveillance', 'Big Brother', 'freedom', 'propaganda'],
      expectedLength: 100,
      timeLimit: 180,
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.3,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // INTERMEDIATE LITERATURE
    {
      id: 'lit_004',
      category: QUESTION_CATEGORIES.LITERATURE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Analyze the use of symbolism in F. Scott Fitzgerald\'s "The Great Gatsby".',
      keywords: ['symbolism', 'Great Gatsby', 'Fitzgerald', 'green light', 'American Dream', 'valley of ashes', 'literary analysis'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'lit_005',
      category: QUESTION_CATEGORIES.LITERATURE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Compare the themes of love and tragedy in Shakespeare\'s Romeo and Juliet.',
      keywords: ['Romeo and Juliet', 'Shakespeare', 'love', 'tragedy', 'fate', 'conflict', 'family feud', 'themes'],
      expectedLength: 120,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    // ADVANCED LITERATURE
    {
      id: 'lit_006',
      category: QUESTION_CATEGORIES.LITERATURE,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Discuss the concept of postmodernism in literature and its key characteristics.',
      keywords: ['postmodernism', 'literature', 'metafiction', 'irony', 'fragmentation', 'self-reflexivity', 'reality', 'narrative'],
      expectedLength: 150,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    }
  ]
};

/**
 * Get all questions from a specific category
 */
export const getQuestionsByCategory = (category) => {
  return QUESTION_BANK[category] || [];
};

/**
 * Get questions by difficulty level
 */
export const getQuestionsByDifficulty = (difficulty, category = null) => {
  if (category) {
    const categoryQuestions = QUESTION_BANK[category] || [];
    return categoryQuestions.filter(q => q.difficulty === difficulty);
  }
  
  const allQuestions = Object.values(QUESTION_BANK).flat();
  return allQuestions.filter(q => q.difficulty === difficulty);
};

/**
 * Get a random question from a category
 */
export const getRandomQuestion = (category = null, difficulty = null) => {
  let questions;
  
  if (category) {
    questions = QUESTION_BANK[category] || [];
  } else {
    questions = Object.values(QUESTION_BANK).flat();
  }
  
  if (difficulty) {
    questions = questions.filter(q => q.difficulty === difficulty);
  }
  
  if (questions.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

/**
 * Get question by ID
 */
export const getQuestionById = (questionId) => {
  const allQuestions = Object.values(QUESTION_BANK).flat();
  return allQuestions.find(q => q.id === questionId);
};

/**
 * Get all categories
 */
export const getAllCategories = () => {
  return Object.keys(QUESTION_BANK);
};

/**
 * Get category count
 */
export const getCategoryQuestionCount = (category, difficulty = null) => {
  const questions = QUESTION_BANK[category] || [];
  if (difficulty) {
    return questions.filter(q => q.difficulty === difficulty).length;
  }
  return questions.length;
};

/**
 * Get category icon
 */
export const getCategoryIcon = (category) => {
  const icons = {
    science: '🔬',
    technology: '💻',
    engineering: '⚙️',
    mathematics: '📐',
    business: '💼',
    history: '📜',
    arts: '🎨',
    current_affairs: '📰',
    psychology: '🧠',
    literature: '📚'
  };
  return icons[category] || '📚';
};

/**
 * Get category display name
 */
export const getCategoryDisplayName = (category) => {
  const names = {
    science: 'Science',
    technology: 'Technology',
    engineering: 'Engineering',
    mathematics: 'Mathematics',
    business: 'Business & Economics',
    history: 'History',
    arts: 'Arts & Culture',
    current_affairs: 'Current Affairs',
    psychology: 'Psychology',
    literature: 'Literature'
  };
  return names[category] || category;
};

/**
 * Get category description
 */
export const getCategoryDescription = (category) => {
  const descriptions = {
    science: 'Explore natural phenomena, biology, chemistry, and physics',
    technology: 'Dive into computing, AI, and digital innovation',
    engineering: 'Understand systems, structures, and problem-solving',
    mathematics: 'Master numbers, logic, and mathematical concepts',
    business: 'Learn about markets, strategy, and entrepreneurship',
    history: 'Discover past events and their impact on today',
    arts: 'Appreciate creativity, culture, and artistic expression',
    current_affairs: 'Stay informed about global issues and trends',
    psychology: 'Understand the human mind and behavior',
    literature: 'Explore stories, poetry, and literary analysis'
  };
  return descriptions[category] || 'Test your knowledge on various topics';
};

/**
 * Get difficulty color
 */
export const getDifficultyColor = (difficulty) => {
  const colors = {
    beginner: '#10b981',
    intermediate: '#f59e0b',
    advanced: '#ef4444'
  };
  return colors[difficulty] || '#6b7280';
};

/**
 * Get difficulty label
 */
export const getDifficultyLabel = (difficulty) => {
  const labels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  };
  return labels[difficulty] || difficulty;
};

/**
 * Get time limit display string
 */
export const getTimeLimitDisplay = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min${minutes !== 1 ? 's' : ''}`;
};

/**
 * Get question count by difficulty
 */
export const getQuestionCountByDifficulty = (difficulty, category = null) => {
  return getQuestionsByDifficulty(difficulty, category).length;
};
