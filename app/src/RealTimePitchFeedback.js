import React, { useEffect, useRef, useState, useCallback } from 'react';
import { YIN } from 'pitchfinder';

const RealTimePitchFeedback = ({ isActive, micStream, onScoreUpdate, expectedPitches }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const sourceRef = useRef(null);
  
  const [currentPitch, setCurrentPitch] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const pitchHistoryRef = useRef([]);
  
  // Initialize expected pitches if not provided
  const expectedPitchesRef = useRef(expectedPitches || []);

  // Move score calculation to useCallback to avoid re-creation on every render
  const calculateRealTimeScore = useCallback((pitchHistory) => {
    // If we have expected pitches, compare to them
    if (expectedPitchesRef.current && expectedPitchesRef.current.length > 0) {
      // Simple implementation - get current expected pitch based on time
      // In a real app, you'd sync this with the song playback
      const currentTime = audioContextRef.current?.currentTime || 0;
      const expectedPitch = getExpectedPitchAtTime(currentTime);
      
      if (!expectedPitch) return 50; // Default score if no expected pitch
      
      // Calculate average pitch from history
      const avgPitch = pitchHistory.reduce((sum, p) => sum + p, 0) / pitchHistory.length;
      
      // Calculate cents difference (logarithmic pitch difference)
      const centsDiff = Math.abs(1200 * Math.log2(avgPitch / expectedPitch));
      
      // Convert cents difference to score (lower difference = higher score)
      if (centsDiff < 25) return 100; // Perfect
      if (centsDiff < 50) return 90; // Very good
      if (centsDiff < 100) return 75; // Good
      if (centsDiff < 200) return 60; // Okay
      return 50; // Not matching well
    }
    
    // If no expected pitches, use pitch stability as a score
    // Calculate pitch stability (less variation = more stable)
    if (pitchHistory.length < 2) return 50;
    
    let totalVariation = 0;
    for (let i = 1; i < pitchHistory.length; i++) {
      const centsDiff = Math.abs(1200 * Math.log2(pitchHistory[i] / pitchHistory[i-1]));
      totalVariation += centsDiff;
    }
    
    const avgVariation = totalVariation / (pitchHistory.length - 1);
    
    // Convert variation to score (lower variation = higher score)
    // Stable singing (even if not correct pitch) scores higher
    if (avgVariation < 10) return 90; // Very stable
    if (avgVariation < 25) return 80; // Stable
    if (avgVariation < 50) return 70; // Somewhat stable
    if (avgVariation < 100) return 60; // Varying
    return 50; // Unstable
  }, []);
  
  // Helper function to get expected pitch at a given time
  const getExpectedPitchAtTime = useCallback((time) => {
    // Simplified implementation - in a real app, you'd match with song data
    // This assumes expectedPitches is an array of {time, frequency} objects
    if (!expectedPitchesRef.current || expectedPitchesRef.current.length === 0) {
      return null;
    }
    
    // Find the closest expected pitch by time
    let closestPitch = expectedPitchesRef.current[0];
    let smallestTimeDiff = Math.abs(time - expectedPitchesRef.current[0].time);
    
    for (let i = 1; i < expectedPitchesRef.current.length; i++) {
      const timeDiff = Math.abs(time - expectedPitchesRef.current[i].time);
      if (timeDiff < smallestTimeDiff) {
        smallestTimeDiff = timeDiff;
        closestPitch = expectedPitchesRef.current[i];
      }
    }
    
    return closestPitch.frequency;
  }, []);
  
  // Draw visualization on canvas
  const drawPitchVisualization = useCallback((pitch) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Map pitch to y-position (higher pitch = higher on canvas)
    // Typical vocal range: 80Hz - 1200Hz
    const minPitch = 80;
    const maxPitch = 1200;
    
    // Convert to logarithmic scale (because that's how we hear pitch)
    const logPitch = Math.log2(Math.max(minPitch, Math.min(maxPitch, pitch)));
    const logMin = Math.log2(minPitch);
    const logMax = Math.log2(maxPitch);
    const logRange = logMax - logMin;
    
    // Calculate position (inverted because canvas y increases downward)
    const y = height - ((logPitch - logMin) / logRange) * height;
    
    // Draw the current pitch as a circle
    ctx.beginPath();
    ctx.arc(width / 2, y, 10, 0, 2 * Math.PI);
    
    // Color based on current score
    if (currentScore >= 90) {
      ctx.fillStyle = 'rgb(0, 255, 0)'; // Green for excellent
    } else if (currentScore >= 70) {
      ctx.fillStyle = 'rgb(0, 200, 200)'; // Teal for good
    } else if (currentScore >= 50) {
      ctx.fillStyle = 'rgb(255, 255, 0)'; // Yellow for okay
    } else {
      ctx.fillStyle = 'rgb(255, 0, 0)'; // Red for poor
    }
    
    ctx.fill();
    
    // Draw reference lines for common notes
    drawNoteLines(ctx, width, height);
    
    // Draw expected pitch if available
    if (expectedPitchesRef.current && expectedPitchesRef.current.length > 0 && audioContextRef.current) {
      const currentTime = audioContextRef.current.currentTime;
      const expectedPitch = getExpectedPitchAtTime(currentTime);
      
      if (expectedPitch) {
        // Convert expected pitch to y position
        const logExpectedPitch = Math.log2(Math.max(minPitch, Math.min(maxPitch, expectedPitch)));
        const expectedY = height - ((logExpectedPitch - logMin) / logRange) * height;
        
        // Draw expected pitch line
        ctx.beginPath();
        ctx.moveTo(0, expectedY);
        ctx.lineTo(width, expectedY);
        ctx.strokeStyle = 'rgba(255, 100, 100, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, [currentScore, getExpectedPitchAtTime]);
  
  // Draw horizontal lines for common notes
  const drawNoteLines = useCallback((ctx, width, height) => {
    const notes = [
      { name: 'C3', freq: 130.81 },
      { name: 'E3', freq: 164.81 },
      { name: 'G3', freq: 196.00 },
      { name: 'C4', freq: 261.63 }, // Middle C
      { name: 'E4', freq: 329.63 },
      { name: 'G4', freq: 392.00 },
      { name: 'C5', freq: 523.25 }
    ];
    
    // Draw lines for each note
    notes.forEach(note => {
      const logNote = Math.log2(note.freq);
      const logMin = Math.log2(80);
      const logMax = Math.log2(1200);
      const y = height - ((logNote - logMin) / (logMax - logMin)) * height;
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
      ctx.stroke();
      
      // Draw note name
      ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
      ctx.font = '12px sans-serif';
      ctx.fillText(note.name, 5, y - 5);
    });
  }, []);
  
  // Clear the canvas
  const clearCanvas = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Still draw the note lines
    drawNoteLines(ctx, canvas.width, canvas.height);
  }, [drawNoteLines]);
  
  // Main pitch detection effect
  useEffect(() => {
    if (!isActive || !micStream) return;
    
    // Set up audio context and analyzer
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyzerRef.current = audioContextRef.current.createAnalyser();
    analyzerRef.current.fftSize = 2048;
    
    // Connect microphone to analyzer
    sourceRef.current = audioContextRef.current.createMediaStreamSource(micStream);
    sourceRef.current.connect(analyzerRef.current);
    
    // Create pitch detector
    const detector = YIN({ 
      sampleRate: audioContextRef.current.sampleRate,
      threshold: 0.9
    });
    
    // Start the detection loop
    const detectPitch = () => {
      const bufferLength = analyzerRef.current.fftSize;
      const dataArray = new Float32Array(bufferLength);
      
      analyzerRef.current.getFloatTimeDomainData(dataArray);
      
      // Calculate volume to detect silence
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += Math.abs(dataArray[i]);
      }
      const average = sum / dataArray.length;
      
      // Only process if not silent
      if (average > 0.01) {
        const pitch = detector(dataArray);
        if (pitch) {
          // Update current pitch
          setCurrentPitch(Math.round(pitch));
          
          // Add to pitch history (keep only last 10 pitches)
          const newHistory = [...pitchHistoryRef.current, pitch].slice(-400);
          pitchHistoryRef.current = newHistory;
          
          // Calculate real-time score based on pitch history
          const newScore = calculateRealTimeScore(newHistory);
          setCurrentScore(newScore);
          
          // Notify parent component
          if (onScoreUpdate) {
            onScoreUpdate(newScore);
          }
          
          // Draw visualization
          drawPitchVisualization(pitch);
        }
      } else {
        setCurrentPitch(0);
        clearCanvas();
      }
      
      animationRef.current = requestAnimationFrame(detectPitch);
    };
    
    animationRef.current = requestAnimationFrame(detectPitch);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isActive, micStream, calculateRealTimeScore, drawPitchVisualization, clearCanvas, onScoreUpdate]);
  
  return (
    <div className="real-time-pitch">
      <div className="pitch-display">
        {currentPitch > 0 ? `${currentPitch} Hz` : 'Not singing'}
      </div>
      
      {/* Score display */}
      <div className="real-time-score-display" style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: currentScore >= 90 ? 'green' : 
               currentScore >= 70 ? 'teal' : 
               currentScore >= 50 ? 'gold' : 'red'
      }}>
        {currentScore > 0 ? Math.round(currentScore) : ''}
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={200} 
        className="pitch-canvas"
      />
    </div>
  );
};

export default RealTimePitchFeedback;