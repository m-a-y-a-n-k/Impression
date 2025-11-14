/**
 * Q&A Questions Configuration for STEM Topics
 * Science, Technology, Engineering, Mathematics
 */

export const STEM_CATEGORIES = {
  SCIENCE: 'science',
  TECHNOLOGY: 'technology',
  ENGINEERING: 'engineering',
  MATHEMATICS: 'mathematics'
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
export const STEM_QUESTIONS = {
  science: [
    // BEGINNER SCIENCE
    {
      id: 'sci_001',
      category: STEM_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain what photosynthesis is and why it is important for life on Earth.',
      keywords: ['photosynthesis', 'plants', 'chlorophyll', 'sunlight', 'carbon dioxide', 'oxygen', 'glucose', 'energy'],
      expectedLength: 100,
      timeLimit: 180, // 3 minutes
      evaluationCriteria: {
        accuracy: 0.3,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.2
      }
    },
    {
      id: 'sci_001b',
      category: STEM_CATEGORIES.SCIENCE,
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
      id: 'sci_001c',
      category: STEM_CATEGORIES.SCIENCE,
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
    {
      id: 'sci_004',
      category: STEM_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What causes the seasons on Earth? Explain the role of Earth\'s tilt.',
      keywords: ['axial tilt', 'orbit', 'sun', 'hemisphere', 'summer', 'winter', 'equinox', 'solstice', 'rotation', 'revolution'],
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
      id: 'sci_005',
      category: STEM_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is gravity and how does it affect objects on Earth?',
      keywords: ['gravity', 'force', 'mass', 'weight', 'attraction', 'Earth', 'acceleration', 'Newton'],
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
      id: 'sci_006',
      category: STEM_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain the difference between renewable and non-renewable energy sources.',
      keywords: ['renewable', 'non-renewable', 'solar', 'wind', 'fossil fuels', 'coal', 'oil', 'sustainable', 'energy'],
      expectedLength: 100,
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
      id: 'sci_002',
      category: STEM_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'What is the difference between DNA and RNA? Explain their roles in living organisms.',
      keywords: ['DNA', 'RNA', 'deoxyribonucleic acid', 'ribonucleic acid', 'nucleotides', 'genetic', 'protein', 'synthesis', 'double helix', 'single strand'],
      expectedLength: 120,
      timeLimit: 240, // 4 minutes
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'sci_007',
      category: STEM_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Describe the greenhouse effect and its impact on climate change.',
      keywords: ['greenhouse effect', 'carbon dioxide', 'methane', 'atmosphere', 'temperature', 'climate change', 'global warming', 'infrared radiation'],
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
      id: 'sci_008',
      category: STEM_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain how vaccines work to protect the body from diseases.',
      keywords: ['vaccine', 'immune system', 'antibodies', 'antigen', 'immunity', 'white blood cells', 'memory cells', 'pathogen'],
      expectedLength: 110,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'sci_009',
      category: STEM_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'What is natural selection and how does it drive evolution?',
      keywords: ['natural selection', 'evolution', 'adaptation', 'survival', 'fitness', 'Darwin', 'genetic variation', 'species'],
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
      id: 'sci_003',
      category: STEM_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Explain the process of protein synthesis from transcription to translation.',
      keywords: ['transcription', 'translation', 'mRNA', 'tRNA', 'ribosome', 'amino acids', 'codons', 'anticodons', 'polypeptide', 'nucleus', 'cytoplasm'],
      expectedLength: 150,
      timeLimit: 300, // 5 minutes
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    },
    {
      id: 'sci_010',
      category: STEM_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Describe the electron transport chain and its role in cellular respiration.',
      keywords: ['electron transport chain', 'mitochondria', 'ATP', 'oxidative phosphorylation', 'NADH', 'FADH2', 'proton gradient', 'chemiosmosis'],
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
      id: 'sci_011',
      category: STEM_CATEGORIES.SCIENCE,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Explain quantum entanglement and its implications for quantum computing.',
      keywords: ['quantum entanglement', 'superposition', 'qubits', 'quantum computing', 'correlation', 'measurement', 'quantum mechanics'],
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
  technology: [
    // BEGINNER TECHNOLOGY
    {
      id: 'tech_001',
      category: STEM_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is cloud computing and what are its main benefits?',
      keywords: ['cloud', 'internet', 'servers', 'storage', 'scalability', 'flexibility', 'cost', 'remote', 'data center', 'accessibility'],
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
      id: 'tech_005',
      category: STEM_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is the difference between hardware and software in computers?',
      keywords: ['hardware', 'software', 'physical', 'programs', 'CPU', 'RAM', 'operating system', 'applications'],
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
      id: 'tech_006',
      category: STEM_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain what a computer virus is and how to protect against it.',
      keywords: ['virus', 'malware', 'antivirus', 'software', 'infection', 'protection', 'security', 'backup'],
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
      category: STEM_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is artificial intelligence and give examples of its applications?',
      keywords: ['artificial intelligence', 'AI', 'machine learning', 'automation', 'algorithms', 'applications', 'voice assistants', 'recommendations'],
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
      id: 'tech_002',
      category: STEM_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain how blockchain technology works and its key features.',
      keywords: ['blockchain', 'distributed', 'ledger', 'decentralized', 'blocks', 'hash', 'consensus', 'immutable', 'transparency', 'cryptography'],
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
      id: 'tech_004',
      category: STEM_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'What is the difference between HTTP and HTTPS? Why is HTTPS important?',
      keywords: ['HTTP', 'HTTPS', 'protocol', 'SSL', 'TLS', 'encryption', 'security', 'certificate', 'data', 'privacy'],
      expectedLength: 100,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.3,
        completeness: 0.2,
        vocabulary: 0.15
      }
    },
    {
      id: 'tech_008',
      category: STEM_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Describe the Internet of Things (IoT) and its potential impact on daily life.',
      keywords: ['Internet of Things', 'IoT', 'connected devices', 'sensors', 'smart home', 'network', 'automation', 'data'],
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
      category: STEM_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'What is version control and why is it important in software development?',
      keywords: ['version control', 'Git', 'repository', 'commits', 'branches', 'collaboration', 'history', 'software development'],
      expectedLength: 110,
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
      id: 'tech_003',
      category: STEM_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Describe the architecture and working principles of a neural network in machine learning.',
      keywords: ['neural network', 'layers', 'neurons', 'weights', 'activation', 'backpropagation', 'training', 'input', 'output', 'hidden layers', 'deep learning'],
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
      id: 'tech_010',
      category: STEM_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Explain the CAP theorem and its implications for distributed systems.',
      keywords: ['CAP theorem', 'consistency', 'availability', 'partition tolerance', 'distributed systems', 'trade-offs', 'databases'],
      expectedLength: 140,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    },
    {
      id: 'tech_011',
      category: STEM_CATEGORIES.TECHNOLOGY,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Describe the principles of microservices architecture and its advantages over monolithic systems.',
      keywords: ['microservices', 'architecture', 'distributed', 'services', 'scalability', 'deployment', 'monolithic', 'API', 'independence'],
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
      category: STEM_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What are the fundamental differences between AC and DC current?',
      keywords: ['AC', 'DC', 'alternating', 'direct', 'current', 'voltage', 'frequency', 'electrons', 'power', 'electrical'],
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
      id: 'eng_004',
      category: STEM_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is the purpose of a transistor and how does it work in electronic circuits?',
      keywords: ['transistor', 'semiconductor', 'switch', 'amplifier', 'base', 'collector', 'emitter', 'current', 'voltage', 'electronic'],
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
      id: 'eng_005',
      category: STEM_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain the basic principles of how a lever works and its mechanical advantage.',
      keywords: ['lever', 'fulcrum', 'force', 'mechanical advantage', 'load', 'effort', 'simple machine', 'torque'],
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
      id: 'eng_006',
      category: STEM_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is Ohm\'s Law and how is it used in electrical circuits?',
      keywords: ['Ohm\'s Law', 'voltage', 'current', 'resistance', 'V=IR', 'electrical circuits', 'relationship'],
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
      id: 'eng_002',
      category: STEM_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain the working principle of a heat engine and the concept of thermal efficiency.',
      keywords: ['heat engine', 'thermal efficiency', 'carnot', 'heat', 'work', 'temperature', 'energy conversion', 'thermodynamics', 'hot reservoir', 'cold reservoir'],
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
      category: STEM_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Describe the four-stroke cycle of an internal combustion engine.',
      keywords: ['four-stroke', 'intake', 'compression', 'power', 'exhaust', 'piston', 'combustion', 'engine', 'crankshaft'],
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
      category: STEM_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'What is strain and stress in materials science, and how are they related?',
      keywords: ['stress', 'strain', 'force', 'deformation', 'elasticity', 'Young\'s modulus', 'materials science', 'tension'],
      expectedLength: 110,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'eng_009',
      category: STEM_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain the principles of feedback control systems in engineering.',
      keywords: ['feedback', 'control system', 'input', 'output', 'error', 'controller', 'setpoint', 'closed-loop', 'open-loop'],
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
      id: 'eng_003',
      category: STEM_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Describe the principles of finite element analysis (FEA) and its applications in structural engineering.',
      keywords: ['finite element', 'FEA', 'mesh', 'nodes', 'elements', 'structural analysis', 'stress', 'strain', 'simulation', 'boundary conditions'],
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
      id: 'eng_010',
      category: STEM_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Explain the concept of fluid dynamics and the Navier-Stokes equations.',
      keywords: ['fluid dynamics', 'Navier-Stokes', 'viscosity', 'turbulence', 'flow', 'momentum', 'conservation', 'velocity field'],
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
      id: 'eng_011',
      category: STEM_CATEGORIES.ENGINEERING,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Describe signal processing techniques and the Fourier Transform in engineering applications.',
      keywords: ['signal processing', 'Fourier Transform', 'frequency domain', 'time domain', 'filtering', 'spectrum', 'analysis'],
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
  mathematics: [
    // BEGINNER MATHEMATICS
    {
      id: 'math_001',
      category: STEM_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain what a derivative is in calculus and provide a real-world application.',
      keywords: ['derivative', 'rate of change', 'slope', 'tangent', 'calculus', 'instantaneous', 'velocity', 'optimization', 'limit'],
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
      id: 'math_004',
      category: STEM_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is the Pythagorean theorem and how is it applied in real-world scenarios?',
      keywords: ['pythagorean', 'theorem', 'right triangle', 'hypotenuse', 'perpendicular', 'base', 'square', 'distance', 'geometry'],
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
      id: 'math_005',
      category: STEM_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'What is probability and how is it calculated for simple events?',
      keywords: ['probability', 'chance', 'likelihood', 'events', 'outcomes', 'ratio', 'fraction', 'sample space'],
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
      category: STEM_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.BEGINNER,
      question: 'Explain what a function is in mathematics and give examples.',
      keywords: ['function', 'input', 'output', 'domain', 'range', 'mapping', 'relation', 'variables'],
      expectedLength: 90,
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
      id: 'math_002',
      category: STEM_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'What is the difference between permutations and combinations? Provide examples.',
      keywords: ['permutation', 'combination', 'order', 'arrangement', 'selection', 'factorial', 'counting', 'probability', 'nPr', 'nCr'],
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
      category: STEM_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain the concept of limits in calculus and their importance.',
      keywords: ['limits', 'calculus', 'approaching', 'continuity', 'infinity', 'convergence', 'derivative', 'integral'],
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
      id: 'math_008',
      category: STEM_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'What is a matrix and how are matrices used in linear algebra?',
      keywords: ['matrix', 'linear algebra', 'rows', 'columns', 'operations', 'systems of equations', 'transformation', 'vectors'],
      expectedLength: 110,
      timeLimit: 240,
      evaluationCriteria: {
        accuracy: 0.35,
        clarity: 0.25,
        completeness: 0.25,
        vocabulary: 0.15
      }
    },
    {
      id: 'math_009',
      category: STEM_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
      question: 'Explain the binomial theorem and provide an example of its application.',
      keywords: ['binomial theorem', 'expansion', 'coefficients', 'Pascal\'s triangle', 'powers', 'combinations'],
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
      id: 'math_003',
      category: STEM_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Explain the Fundamental Theorem of Calculus and its significance.',
      keywords: ['fundamental theorem', 'calculus', 'integration', 'differentiation', 'antiderivative', 'definite integral', 'continuous', 'relationship'],
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
      id: 'math_010',
      category: STEM_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Describe the concept of eigenvalues and eigenvectors in linear algebra.',
      keywords: ['eigenvalues', 'eigenvectors', 'linear algebra', 'matrix', 'transformation', 'characteristic equation', 'diagonalization'],
      expectedLength: 140,
      timeLimit: 300,
      evaluationCriteria: {
        accuracy: 0.4,
        clarity: 0.2,
        completeness: 0.3,
        vocabulary: 0.1
      }
    },
    {
      id: 'math_011',
      category: STEM_CATEGORIES.MATHEMATICS,
      difficulty: DIFFICULTY_LEVELS.ADVANCED,
      question: 'Explain the concept of complex numbers and their applications in mathematics and engineering.',
      keywords: ['complex numbers', 'imaginary', 'real part', 'imaginary part', 'polar form', 'Euler\'s formula', 'applications'],
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
  return STEM_QUESTIONS[category] || [];
};

/**
 * Get questions by difficulty level
 */
export const getQuestionsByDifficulty = (difficulty) => {
  const allQuestions = Object.values(STEM_QUESTIONS).flat();
  return allQuestions.filter(q => q.difficulty === difficulty);
};

/**
 * Get a random question from a category
 */
export const getRandomQuestion = (category = null, difficulty = null) => {
  let questions;
  
  if (category) {
    questions = STEM_QUESTIONS[category] || [];
  } else {
    questions = Object.values(STEM_QUESTIONS).flat();
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
  const allQuestions = Object.values(STEM_QUESTIONS).flat();
  return allQuestions.find(q => q.id === questionId);
};

/**
 * Get all categories
 */
export const getAllCategories = () => {
  return Object.keys(STEM_QUESTIONS);
};

/**
 * Get category icon
 */
export const getCategoryIcon = (category) => {
  const icons = {
    science: '🔬',
    technology: '💻',
    engineering: '⚙️',
    mathematics: '📐'
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
    mathematics: 'Mathematics'
  };
  return names[category] || category;
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
export const getQuestionCountByDifficulty = (difficulty) => {
  return getQuestionsByDifficulty(difficulty).length;
};
