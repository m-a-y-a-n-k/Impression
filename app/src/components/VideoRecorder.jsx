import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { getScenario } from "../config/practiceScenarios";
import "../styles/VideoRecorder.css";

const VideoRecorder = ({ scenarioId, onComplete, onCancel, onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const scenario = getScenario(scenarioId);

  useEffect(() => {
    // Request camera and microphone access with high definition settings
    const initializeCamera = async () => {
      try {
        // Try to get the best available resolution (prefer 1080p, fallback to 720p)
        const constraints = {
          video: {
            width: { 
              min: 1280,
              ideal: 1920,
              max: 1920
            },
            height: { 
              min: 720,
              ideal: 1080,
              max: 1080
            },
            facingMode: 'user',
            frameRate: { ideal: 30, min: 24 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000
          }
        };

        let stream;
        try {
          // Try to get 1080p first with exact constraints for better control
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          
          // Verify we got the resolution we wanted
          const videoTrack = stream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();
          console.log('Video stream settings:', {
            width: settings.width,
            height: settings.height,
            frameRate: settings.frameRate
          });
          
          // If we didn't get 1080p, try to apply exact constraints
          if (settings.width < 1920 || settings.height < 1080) {
            console.warn('Did not get 1080p, got:', settings.width, 'x', settings.height);
            // Stop current stream and try with exact constraints
            stream.getTracks().forEach(track => track.stop());
            
            // Try with exact constraints (more strict)
            try {
              stream = await navigator.mediaDevices.getUserMedia({
                video: {
                  width: { exact: 1920 },
                  height: { exact: 1080 },
                  facingMode: 'user',
                  frameRate: { ideal: 30 }
                },
                audio: constraints.audio
              });
              console.log('Got 1080p with exact constraints');
            } catch (exactError) {
              console.warn('Exact 1080p failed, using best available:', exactError);
              // Use the original constraints which will give us the best available
              stream = await navigator.mediaDevices.getUserMedia(constraints);
            }
          } else {
            console.log('Successfully got 1080p video stream');
          }
        } catch (hdError) {
          // Fallback to 720p if 1080p is not available
          console.warn('1080p not available, falling back to 720p:', hdError);
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280, min: 640 },
              height: { ideal: 720, min: 480 },
              facingMode: 'user',
              frameRate: { ideal: 30, min: 24 }
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
          
          const videoTrack = stream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();
          console.log('Fallback video settings:', {
            width: settings.width,
            height: settings.height
          });
        }
        
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Set video element to play at full quality
          videoRef.current.setAttribute('playsinline', 'true');
          
          // Ensure video preserves native resolution and quality
          videoRef.current.setAttribute('autoplay', 'true');
          videoRef.current.setAttribute('muted', 'true');
          
          // Log final video dimensions and apply quality settings
          videoRef.current.addEventListener('loadedmetadata', () => {
            const video = videoRef.current;
            console.log('Video element dimensions:', {
              videoWidth: video.videoWidth,
              videoHeight: video.videoHeight,
              naturalWidth: video.videoWidth,
              naturalHeight: video.videoHeight
            });
            
            // Ensure video element uses native resolution
            // The video element will use its native dimensions for recording
            // CSS handles display size while preserving recording quality
          });
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Unable to access camera. Please check permissions.');
      }
    };

    initializeCamera();

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const startRecording = () => {
    try {
      chunksRef.current = [];
      
      // Get the actual video track settings to determine best codec and bitrate
      const videoTrack = streamRef.current.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      const videoWidth = settings.width || 1920;
      const isHD = videoWidth >= 1920; // 1080p or higher
      
      // Determine best mime type based on browser support
      // Prioritize codecs that support high quality recording
      let mimeType = 'video/webm;codecs=vp9,opus';
      const codecs = [
        'video/webm;codecs=vp9,opus', // Best quality, good compression (Chrome, Edge)
        'video/webm;codecs=vp8,opus', // Good quality fallback
        'video/mp4;codecs=h264,aac', // High quality, widely supported (Safari, some browsers)
        'video/webm;codecs=h264,opus', // Alternative
        'video/webm', // Last resort
        'video/mp4' // Final fallback
      ];
      
      for (const codec of codecs) {
        if (MediaRecorder.isTypeSupported(codec)) {
          mimeType = codec;
          break;
        }
      }
      
      // Configure MediaRecorder with high quality settings
      // Higher bitrate for better quality (8 Mbps for 1080p, 5 Mbps for 720p)
      const options = {
        mimeType: mimeType
      };
      
      // Set bitrate if supported (may not work in all browsers)
      if (isHD) {
        options.videoBitsPerSecond = 8000000; // 8 Mbps for 1080p
      } else {
        options.videoBitsPerSecond = 5000000; // 5 Mbps for 720p
      }
      options.audioBitsPerSecond = 128000; // 128 kbps for high-quality audio
      
      const mediaRecorder = new MediaRecorder(streamRef.current, options);
      
      // Log MediaRecorder settings for debugging
      console.log('MediaRecorder configuration:', {
        mimeType: options.mimeType,
        videoBitsPerSecond: options.videoBitsPerSecond,
        audioBitsPerSecond: options.audioBitsPerSecond,
        videoResolution: `${videoWidth}x${settings.height || 1080}`,
        isHD: isHD
      });
      
      // Store mimeType for use in onstop callback
      const recordedMimeType = mimeType.split(';')[0] || 'video/webm';

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recordedMimeType });
        const videoUrl = URL.createObjectURL(blob);
        
        setIsProcessing(true);
        
        // Create video element for analysis with high quality settings
        const videoElement = document.createElement('video');
        videoElement.src = videoUrl;
        videoElement.muted = true;
        videoElement.playsInline = true;
        // Ensure video loads at full quality
        videoElement.preload = 'metadata';
        
        await new Promise((resolve) => {
          videoElement.onloadedmetadata = () => {
            // Ensure we're using the actual video dimensions
            videoElement.currentTime = 0;
            resolve();
          };
          videoElement.onerror = () => {
            console.error('Error loading video for analysis');
            resolve(); // Resolve anyway to prevent hanging
          };
        });
        
        // Pass video blob and element to parent for analysis
        onComplete({
          blob,
          videoUrl,
          videoElement,
          duration: recordingTime
        });
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setError(null);

      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          // Auto-stop at scenario duration limit
          if (newTime >= scenario.duration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Failed to start recording. Please try again.');
    }
  };

  const startCountdown = () => {
    setCountdown(3);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          startRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = () => {
    const remaining = scenario.duration - recordingTime;
    return formatTime(remaining);
  };

  const handleHome = () => {
    // Stop recording if active
    if (isRecording && mediaRecorderRef.current) {
      stopRecording();
    }
    // Call onCancel to clean up camera stream
    if (onCancel) {
      onCancel();
    }
    // Call onBack to return to landing
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="video-recorder-container">
      <div className="video-recorder-header">
        <h2>
          <span className="scenario-icon">{scenario.icon}</span>
          {scenario.name}
        </h2>
        <div className="header-actions">
          {onBack && !isRecording && (
            <motion.button
              className="home-button"
              onClick={handleHome}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Go to home"
              title="Go to home"
            >
              <span className="home-icon">🏠</span>
              <span className="home-text">Home</span>
            </motion.button>
          )}
          <button
            className="cancel-recording-btn"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="video-preview-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`video-preview ${isRecording ? 'recording' : ''}`}
          style={{
            // Force hardware acceleration for better quality
            willChange: 'transform'
          }}
        />
        
        {countdown > 0 && (
          <motion.div
            className="countdown-overlay"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="countdown-number">{countdown}</div>
          </motion.div>
        )}

        {isRecording && (
          <motion.div
            className="recording-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="recording-dot"></span>
            <span>Recording</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="error-overlay"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </motion.div>
        )}
      </div>

      <div className="video-recorder-controls">
        <div className="recording-info">
          {isRecording ? (
            <>
              <div className="time-display">
                <span className="current-time">{formatTime(recordingTime)}</span>
                <span className="separator">/</span>
                <span className="max-time">{formatTime(scenario.duration)}</span>
              </div>
              <div className="remaining-time">
                {getRemainingTime()} remaining
              </div>
            </>
          ) : (
            <div className="scenario-tips">
              <h3>Tips for {scenario.name}:</h3>
              <ul>
                {scenario.tips.slice(0, 3).map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="control-buttons">
          {!isRecording && !isProcessing && (
            <motion.button
              className="start-recording-btn"
              onClick={startCountdown}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="record-icon">●</span>
              Start Recording
            </motion.button>
          )}

          {isRecording && (
            <motion.button
              className="stop-recording-btn"
              onClick={stopRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="stop-icon">■</span>
              Stop Recording
            </motion.button>
          )}

          {isProcessing && (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <span>Processing video...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;

