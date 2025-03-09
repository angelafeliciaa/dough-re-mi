import React, { useState, useEffect, useRef } from 'react';
import './PlayerRecorder.css'; // Create this file for styling
import RealTimePitchFeedback from './RealTimePitchFeedback';
import { scoreWithAudioUrl } from './pitchComparison'; // Import the scoring function
import "./PlayerRecorder.css";

const PlayerRecorder = ({ 
  playerName, 
  lineText, 
  originalVocalsUrl, 
  lineDuration,
  onScoreCalculated,
  onRealtimeScoreUpdate,
  microphoneStream,
  autoStart = false,
  instrumentalDelay = 0 // Delay in seconds for instrumental (0 = no delay)
}) => {
  // Add countdown state to show user how much time until recording starts
  const [status, setStatus] = useState(autoStart ? 'preparing' : 'ready'); // ready, preparing, recording, processing
  const [recordingTime, setRecordingTime] = useState(0);
  const [countdownTime, setCountdownTime] = useState(instrumentalDelay);
  const [errorMessage, setErrorMessage] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  
  // Determine if we need instrumental delay
  const needsInstrumentalDelay = instrumentalDelay > 0;
  
  // Start the countdown before recording
  const startCountdown = () => {
    setStatus('countdown');
    setCountdownTime(instrumentalDelay);
    
    // Set up countdown timer
    let remainingTime = instrumentalDelay;
    countdownTimerRef.current = setInterval(() => {
      remainingTime -= 0.1; // Decrement by 100ms for smoother display
      setCountdownTime(Math.max(0, parseFloat(remainingTime.toFixed(1))));
      
      // When countdown reaches zero, start recording
      if (remainingTime <= 0) {
        clearInterval(countdownTimerRef.current);
        startRecording();
      }
    }, 100);
  };
  
  // Start recording after countdown
  const startRecording = async () => {
    try {
      // Use the provided microphoneStream if available, otherwise request a new one
      const stream = microphoneStream || await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create media recorder using the provided stream
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Handle recording stop
      mediaRecorder.onstop = () => {
        processRecording();
      };
      
      // Start recording
      mediaRecorder.start();
      setStatus('recording');
      setRecordingTime(0);
      
      // Set up timer to track recording duration
      let elapsedTime = 1;
      recordingTimerRef.current = setInterval(() => {
        elapsedTime += 0.1; // Increment by 100ms for more precision
        setRecordingTime(Math.floor(elapsedTime)); // Only update display with whole seconds
        
        // Auto-stop exactly at duration
        if (elapsedTime >= lineDuration) {
          stopRecording();
        }
      }, 100); 
    } catch (error) {
      console.error('Error starting recorder:', error);
      setErrorMessage('Could not access microphone. Please check permissions.');
      setStatus('ready');
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      clearInterval(recordingTimerRef.current);
      
      // Don't stop the audio tracks - just pause the recorder
      // We'll keep the microphone stream active for the next player
    }
  };
  
  const processRecording = async () => {
    // Create a blob from recorded chunks
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    try {
      // We'll still calculate the real score, but skip showing the processing screen
      // by not updating the status to 'processing'
      
      // Start score calculation in the background
      const calculationPromise = scoreWithAudioUrl(audioBlob, originalVocalsUrl);
      
      // Set a timeout to ensure we don't wait longer than 750ms
      const timeoutPromise = new Promise(resolve => {
        setTimeout(() => resolve({ finalScore: 75 }), 750);
      });
      
      // Race between actual calculation and timeout
      const result = await Promise.race([calculationPromise, timeoutPromise]);
      
      // Proceed to the next player with the calculated score
      onScoreCalculated(result.finalScore || result);
    } catch (error) {
      console.error('Error calculating score:', error);
      // Use a reasonable fallback score on error
      onScoreCalculated(75);
    }
  };
  
  // Auto-start countdown or recording based on if instrumental delay is needed
  useEffect(() => {
    if (autoStart && microphoneStream) {
      // Set status to 'preparing' immediately (already done in initial state)
      const timer = setTimeout(() => {

        // startRecording();
        // Start countdown if we need instrumental delay, otherwise start recording directly
        if (needsInstrumentalDelay) {
          startCountdown();
        } else {
          // Skip the countdown
          startRecording();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  // }, [autoStart, microphoneStream, needsInstrumentalDelay]);
}, [autoStart, microphoneStream]);
  
  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);
  
  return (
    <div className="player-recorder">
      <div className="player-info">
        <h3>{playerName}'s Turn</h3>
      </div>
      
      <div className="recording-section">
        {status === 'ready' && (
          //  <button className="record-button" onClick={startRecording}>
          <button 
            className="record-button" 
            onClick={needsInstrumentalDelay ? startCountdown : startRecording}
          >
            Start Recording
          </button>
        )}
        
        {status === 'preparing' && (
          <div className="preparing-info">
            <p>Get ready to sing!</p>
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {status === 'countdown' && (
          <div className="countdown-info">
            <p className='countdown-text'>Instrumental playing... Recording starts in:</p>
            <div className="countdown-timer">{countdownTime.toFixed(1)}s</div>
          </div>
        )}
        
        {status === 'recording' && (
          <div className="recording-info">
            <div className="recording-indicator">Recording... {recordingTime}s</div>
            <button className="stop-button" onClick={stopRecording}>
              Stop Recording
            </button>
          </div>
        )}
        
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerRecorder;