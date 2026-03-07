/**
 * Video Analysis Utility
 * Analyzes video for facial expressions, body language, and other visual cues
 * Note: This is a simplified implementation. For production, consider using
 * libraries like face-api.js, TensorFlow.js, or cloud-based APIs
 */

/**
 * Analyze facial expressions from video frame
 * @param {ImageData} frameData - Video frame image data
 * @returns {Object} Facial expression analysis
 */
export const analyzeFacialExpressions = async (frameData) => {
  // Simplified analysis - in production, use ML models
  // This is a placeholder that simulates analysis
  
  // For now, return mock data based on simple heuristics
  // In a real implementation, you would:
  // 1. Use face-api.js or TensorFlow.js for face detection
  // 2. Analyze facial landmarks
  // 3. Detect emotions (happy, sad, neutral, etc.)
  // 4. Calculate confidence scores
  
  return {
    detected: true,
    emotions: {
      happy: Math.random() * 0.3 + 0.4, // 40-70%
      neutral: Math.random() * 0.2 + 0.2, // 20-40%
      confident: Math.random() * 0.3 + 0.5, // 50-80%
    },
    confidence: Math.random() * 0.2 + 0.7, // 70-90%
    faceDetected: true
  };
};

/**
 * Analyze body language from video frame
 * @param {ImageData} frameData - Video frame image data
 * @returns {Object} Body language analysis
 */
export const analyzeBodyLanguage = async (frameData) => {
  // Simplified analysis - in production, use pose estimation models
  // This would analyze:
  // - Posture (straight, slouched, etc.)
  // - Gestures (hand movements, etc.)
  // - Openness (arms crossed, open stance, etc.)
  // - Movement (still, fidgeting, etc.)
  
  return {
    posture: {
      score: Math.random() * 0.2 + 0.7, // 70-90%
      quality: 'good' // 'excellent', 'good', 'fair', 'poor'
    },
    gestures: {
      detected: true,
      frequency: Math.random() * 0.3 + 0.4, // 40-70%
      appropriateness: Math.random() * 0.2 + 0.7 // 70-90%
    },
    openness: {
      score: Math.random() * 0.2 + 0.75, // 75-95%
      armsCrossed: Math.random() < 0.2 // 20% chance
    },
    movement: {
      still: Math.random() < 0.7, // 70% chance of being still
      fidgeting: Math.random() < 0.15 // 15% chance of fidgeting
    }
  };
};

/**
 * Calculate eye contact percentage
 * @param {Array} frames - Array of frame analysis results
 * @returns {number} Eye contact percentage (0-100)
 */
export const calculateEyeContact = (frames) => {
  if (!frames || frames.length === 0) return 0;
  
  // Count frames where eyes are looking at camera
  const eyeContactFrames = frames.filter(frame => 
    frame.eyeContact && frame.eyeContact.lookingAtCamera
  ).length;
  
  return Math.round((eyeContactFrames / frames.length) * 100);
};

/**
 * Analyze video for overall visual metrics (optimized for speed)
 * @param {HTMLVideoElement} videoElement - Video element to analyze
 * @param {number} sampleRate - Frames per second to sample (default: 1 for faster processing)
 * @param {Function} onProgress - Optional progress callback (0-100)
 * @returns {Promise<Object>} Complete video analysis
 */
export const analyzeVideo = async (videoElement, sampleRate = 1, onProgress = null) => {
  return new Promise((resolve, reject) => {
    // Wait for video to be ready
    if (videoElement.readyState < 2) {
      videoElement.addEventListener('loadedmetadata', () => {
        processVideo();
      });
      videoElement.load();
    } else {
      processVideo();
    }

    function processVideo() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Use actual video dimensions, but scale down for faster analysis
      // We'll analyze at a lower resolution for speed, but still get good results
      const videoWidth = videoElement.videoWidth || videoElement.width || 1920;
      const videoHeight = videoElement.videoHeight || videoElement.height || 1080;
      
      // Scale down canvas for faster processing (but still maintain quality)
      // Use 720p for analysis even if video is 1080p - this is much faster
      const analysisWidth = Math.min(1280, videoWidth);
      const analysisHeight = Math.min(720, videoHeight);
      
      canvas.width = analysisWidth;
      canvas.height = analysisHeight;
      
      // Enable high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      const duration = videoElement.duration || 30;
      // Optimize sample rate for faster processing based on video length
      // Use even lower sample rates for faster analysis
      let optimizedSampleRate = sampleRate;
      if (duration > 60) {
        optimizedSampleRate = 0.33; // 1 frame every 3 seconds for very long videos
      } else if (duration > 30) {
        optimizedSampleRate = 0.5; // 1 frame every 2 seconds
      } else {
        optimizedSampleRate = 0.75; // 1 frame every 1.33 seconds for short videos
      }
      
      const totalFrames = Math.ceil(duration * optimizedSampleRate);
      const frameInterval = 1 / optimizedSampleRate;
      
      console.log(`Video analysis: ${totalFrames} frames to process over ${duration.toFixed(1)}s (${optimizedSampleRate} fps)`);
      
      const analyses = [];
      let currentTime = 0;
      let framesProcessed = 0;
      const startTime = Date.now();
      const timeout = Math.min(30000, duration * 1000 + 10000); // Timeout based on video length
      
      const processFrame = () => {
        // Timeout check
        if (Date.now() - startTime > timeout) {
          console.warn('Video analysis timeout, using partial results');
          finishAnalysis();
          return;
        }
        
        if (currentTime >= duration || framesProcessed >= totalFrames) {
          finishAnalysis();
          return;
        }
        
        // Seek to current time
        videoElement.currentTime = currentTime;
        
        const seekHandler = async () => {
          try {
            // Draw frame to canvas (scaled down for speed)
            ctx.drawImage(videoElement, 0, 0, analysisWidth, analysisHeight);
            const imageData = ctx.getImageData(0, 0, analysisWidth, analysisHeight);
            
            // Analyze frame (await async functions properly)
            const facial = await analyzeFacialExpressions(imageData);
            const body = await analyzeBodyLanguage(imageData);
            
            analyses.push({
              time: currentTime,
              facial,
              body,
              eyeContact: {
                lookingAtCamera: facial.confidence > 0.6
              }
            });
            
            framesProcessed++;
            currentTime += frameInterval;
            
            // Update progress after each frame
            if (onProgress) {
              const progress = Math.min(100, Math.round((framesProcessed / totalFrames) * 100));
              onProgress(progress);
            }
            
            // Process next frame immediately (no delay for speed)
            processFrame();
          } catch (err) {
            console.error('Error processing frame:', err);
            // Continue with next frame even if this one fails
            framesProcessed++;
            currentTime += frameInterval;
            processFrame();
          }
        };
        
        videoElement.addEventListener('seeked', seekHandler, { once: true });
        
        // Fallback timeout for seek (reduced from 1000ms to 500ms for faster processing)
        setTimeout(() => {
          videoElement.removeEventListener('seeked', seekHandler);
          // Skip this frame if seek takes too long
          framesProcessed++;
          currentTime += frameInterval;
          // Update progress even when skipping
          if (onProgress) {
            const progress = Math.min(100, Math.round((framesProcessed / totalFrames) * 100));
            onProgress(progress);
          }
          processFrame();
        }, 500);
      };
      
      const finishAnalysis = () => {
        if (onProgress) onProgress(100);
        
        // Calculate aggregate metrics
        const eyeContact = calculateEyeContact(analyses);
        
        const avgEmotions = analyses.reduce((acc, analysis) => {
          if (analysis.facial) {
            acc.happy = (acc.happy || 0) + analysis.facial.emotions.happy;
            acc.confident = (acc.confident || 0) + analysis.facial.emotions.confident;
            acc.neutral = (acc.neutral || 0) + analysis.facial.emotions.neutral;
          }
          return acc;
        }, {});
        
        const emotionCount = analyses.filter(a => a.facial).length;
        if (emotionCount > 0) {
          avgEmotions.happy = avgEmotions.happy / emotionCount;
          avgEmotions.confident = avgEmotions.confident / emotionCount;
          avgEmotions.neutral = avgEmotions.neutral / emotionCount;
        }
        
        const avgPosture = analyses.reduce((acc, analysis) => {
          if (analysis.body) {
            acc.score = (acc.score || 0) + analysis.body.posture.score;
            acc.count = (acc.count || 0) + 1;
          }
          return acc;
        }, { score: 0, count: 0 });
        
        const avgPostureScore = avgPosture.count > 0 
          ? avgPosture.score / avgPosture.count 
          : 0.7;
        
        resolve({
          eyeContact: eyeContact,
          facialExpressions: {
            average: avgEmotions,
            dominant: avgEmotions.happy > 0.5 ? 'positive' : 
                     avgEmotions.confident > 0.6 ? 'confident' : 'neutral'
          },
          bodyLanguage: {
            posture: {
              score: Math.round(avgPostureScore * 100),
              quality: avgPostureScore > 0.8 ? 'excellent' : 
                      avgPostureScore > 0.7 ? 'good' : 
                      avgPostureScore > 0.6 ? 'fair' : 'poor'
            },
            gestures: {
              detected: analyses.some(a => a.body?.gestures?.detected),
              frequency: Math.round(
                analyses.reduce((sum, a) => sum + (a.body?.gestures?.frequency || 0), 0) / 
                Math.max(analyses.length, 1) * 100
              )
            },
            openness: {
              score: Math.round(
                analyses.reduce((sum, a) => sum + (a.body?.openness?.score || 0), 0) / 
                Math.max(analyses.length, 1) * 100
              ),
              armsCrossed: analyses.some(a => a.body?.openness?.armsCrossed)
            }
          },
          confidence: Math.round(
            analyses.reduce((sum, a) => sum + (a.facial?.confidence || 0.7), 0) / 
            Math.max(analyses.length, 1) * 100
          ),
          framesAnalyzed: analyses.length,
          duration: duration
        });
      };
      
      // Start processing
      processFrame();
    }
  });
};

/**
 * Calculate overall video score based on scenario criteria
 * @param {Object} videoAnalysis - Video analysis results
 * @param {Object} audioAnalysis - Audio/speech analysis results
 * @param {Object} scenario - Practice scenario configuration
 * @returns {Object} Overall score and breakdown
 */
export const calculateVideoScore = (videoAnalysis, audioAnalysis, scenario) => {
  const criteria = scenario.evaluationCriteria;
  const scores = {};
  
  // Calculate individual metric scores
  if (criteria.eyeContact) {
    scores.eyeContact = Math.min(100, (videoAnalysis.eyeContact / criteria.eyeContact.min) * 100);
  }
  
  if (criteria.confidence) {
    scores.confidence = Math.min(100, (videoAnalysis.confidence / 70) * 100);
  }
  
  if (criteria.clarity) {
    scores.clarity = audioAnalysis ? 
      Math.min(100, (audioAnalysis.overallScore / criteria.clarity.min) * 100) : 75;
  }
  
  if (criteria.bodyLanguage) {
    const bodyScore = (videoAnalysis.bodyLanguage.posture.score * 0.6) + 
                     (videoAnalysis.bodyLanguage.openness.score * 0.4);
    scores.bodyLanguage = Math.min(100, (bodyScore / criteria.bodyLanguage.min) * 100);
  }
  
  if (criteria.enthusiasm) {
    const enthusiasmScore = (videoAnalysis.facialExpressions.average.happy * 100 * 0.6) +
                            (videoAnalysis.facialExpressions.average.confident * 100 * 0.4);
    scores.enthusiasm = Math.min(100, (enthusiasmScore / criteria.enthusiasm.min) * 100);
  }
  
  if (criteria.engagement) {
    const engagementScore = (videoAnalysis.facialExpressions.average.confident * 100 * 0.5) +
                           (videoAnalysis.bodyLanguage.gestures.frequency * 0.5);
    scores.engagement = Math.min(100, (engagementScore / criteria.engagement.min) * 100);
  }
  
  if (criteria.conciseness) {
    // Based on audio duration vs expected duration
    const expectedDuration = scenario.duration;
    const actualDuration = audioAnalysis?.pace?.estimatedDuration || videoAnalysis.duration;
    const concisenessRatio = Math.min(1, expectedDuration / actualDuration);
    scores.conciseness = concisenessRatio * 100;
  }
  
  if (criteria.energy) {
    const energyScore = (videoAnalysis.facialExpressions.average.confident * 100 * 0.6) +
                       (videoAnalysis.bodyLanguage.gestures.frequency * 0.4);
    scores.energy = Math.min(100, (energyScore / criteria.energy.min) * 100);
  }
  
  // Calculate weighted overall score
  let overallScore = 0;
  let totalWeight = 0;
  
  Object.entries(criteria).forEach(([key, config]) => {
    if (scores[key] !== undefined) {
      overallScore += scores[key] * config.weight;
      totalWeight += config.weight;
    }
  });
  
  // Normalize if weights don't sum to 1
  if (totalWeight > 0) {
    overallScore = overallScore / totalWeight;
  }
  
  return {
    overall: Math.round(overallScore),
    breakdown: scores,
    criteria: Object.keys(criteria)
  };
};

/**
 * Generate video-specific suggestions
 * @param {Object} videoAnalysis - Video analysis results
 * @param {Object} scoreBreakdown - Score breakdown
 * @param {Object} scenario - Practice scenario
 * @returns {Array} Array of improvement suggestions
 */
export const generateVideoSuggestions = (videoAnalysis, scoreBreakdown, scenario) => {
  const suggestions = [];
  
  // Eye contact suggestions
  if (scoreBreakdown.eyeContact < 70) {
    suggestions.push({
      type: 'eye-contact',
      priority: 'high',
      message: `Your eye contact is ${videoAnalysis.eyeContact}%. Try to look at the camera more consistently.`,
      tip: 'Practice by placing a small sticker near your camera as a reminder to look there.'
    });
  }
  
  // Posture suggestions
  if (videoAnalysis.bodyLanguage.posture.quality === 'poor' || 
      videoAnalysis.bodyLanguage.posture.score < 60) {
    suggestions.push({
      type: 'posture',
      priority: 'high',
      message: 'Your posture could be improved. Sit or stand up straight.',
      tip: 'Keep your shoulders back and head up. This projects confidence.'
    });
  }
  
  // Body language suggestions
  if (videoAnalysis.bodyLanguage.openness.armsCrossed) {
    suggestions.push({
      type: 'body-language',
      priority: 'medium',
      message: 'Avoid crossing your arms. Keep an open posture.',
      tip: 'Open body language makes you appear more approachable and confident.'
    });
  }
  
  // Gesture suggestions
  if (videoAnalysis.bodyLanguage.gestures.frequency < 30) {
    suggestions.push({
      type: 'gestures',
      priority: 'low',
      message: 'Consider using more hand gestures to emphasize your points.',
      tip: 'Natural gestures can make your delivery more engaging and dynamic.'
    });
  }
  
  // Facial expression suggestions
  if (videoAnalysis.facialExpressions.average.happy < 0.4) {
    suggestions.push({
      type: 'expression',
      priority: 'medium',
      message: 'Try to show more positive facial expressions.',
      tip: 'A warm smile and positive expressions make you more engaging.'
    });
  }
  
  // Confidence suggestions
  if (scoreBreakdown.confidence < 70) {
    suggestions.push({
      type: 'confidence',
      priority: 'high',
      message: 'Work on projecting more confidence in your delivery.',
      tip: 'Practice speaking with conviction and maintaining steady eye contact.'
    });
  }
  
  return suggestions;
};

