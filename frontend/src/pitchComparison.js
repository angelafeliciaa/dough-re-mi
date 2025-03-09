// pitchComparison.js - Utility for comparing singer's pitch to original
import { YIN } from 'pitchfinder';

/**
 * Analyzes player's singing and compares it to the original
 * @param {Blob} playerRecording - Recorded audio from the player
 * @param {Blob} originalVocals - Original vocal track to compare against
 * @returns {Promise<Object>} - Results with score and detailed metrics
 */
export async function compareVocals(playerRecording, originalVocals) {
  try {
    // Convert blobs to audio buffers
    const playerBuffer = await blobToAudioBuffer(playerRecording);
    const originalBuffer = await blobToAudioBuffer(originalVocals);
    
    // Extract pitch data
    const playerPitches = extractPitchData(playerBuffer);
    const originalPitches = extractPitchData(originalBuffer);
    
    // Calculate similarity score
    const result = calculateSimilarityScore(playerPitches, originalPitches);
    
    return result;
  } catch (error) {
    console.error('Error comparing vocals:', error);
    throw error;
  }
}

/**
 * Converts audio blob to AudioBuffer
 * @param {Blob} blob - Audio blob
 * @returns {Promise<AudioBuffer>} - Audio buffer
 */
async function blobToAudioBuffer(blob) {
  // Create audio context
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Convert blob to array buffer
  const arrayBuffer = await blob.arrayBuffer();
  
  // Decode audio data
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  return audioBuffer;
}

/**
 * Extracts pitch data from an audio buffer
 * @param {AudioBuffer} audioBuffer - Audio buffer to analyze
 * @returns {Array} - Array of pitch objects with time and frequency
 */
function extractPitchData(audioBuffer) {
  // Get audio data from first channel
  const audioData = audioBuffer.getChannelData(0);
  
  // Create a detector using PitchFinder's YIN algorithm
  const detectPitch = YIN({ 
    sampleRate: audioBuffer.sampleRate,
    threshold: 0.2 // Lower threshold = more sensitivity
  });
  
  // Process in chunks to extract pitch
  const pitchData = [];
  const chunkSize = 2048; // Adjust based on resolution needed
  const hopSize = 512;    // Overlap between chunks
  
  for (let i = 0; i < audioData.length - chunkSize; i += hopSize) {
    const chunk = audioData.slice(i, i + chunkSize);
    const pitch = detectPitch(chunk);
    
    if (pitch) {
      pitchData.push({
        time: i / audioBuffer.sampleRate,
        frequency: pitch
      });
    } else {
      // Silent frame, track it with frequency 0
      pitchData.push({
        time: i / audioBuffer.sampleRate,
        frequency: 0
      });
    }
  }
  
  return pitchData;
}

/**
 * Calculate similarity score between player and reference pitches
 * @param {Array} playerPitches - Array of player pitch data objects
 * @param {Array} originalPitches - Array of original pitch data objects
 * @returns {Object} - Score and detailed metrics
 */
function calculateSimilarityScore(playerPitches, originalPitches) {
  // Align the two pitch sequences based on time
  const alignedPairs = alignPitchSequences(playerPitches, originalPitches);
  
  // Calculate score metrics
  let totalPairs = 0;
  let matchedPairs = 0;
  let totalCentsDiff = 0;
  let noteSustainScore = 0;
  let noteTransitionScore = 0;
  
  // Iterate through aligned pairs
  alignedPairs.forEach(pair => {
    const { playerPitch, originalPitch } = pair;
    
    // Skip if both are silent
    if (originalPitch.frequency === 0 && playerPitch.frequency === 0) {
      return;
    }
    
    totalPairs++;
    
    // If original note is silent, player should be silent too
    if (originalPitch.frequency === 0) {
      // Penalize if player is singing during silence
      if (playerPitch.frequency > 0) {
        noteSustainScore -= 1;
      }
      return;
    }
    
    // If player is silent but shouldn't be, penalize
    if (playerPitch.frequency === 0 && originalPitch.frequency > 0) {
      return;
    }
    
    // Both have pitches, calculate cents difference
    const centsDiff = Math.abs(1200 * Math.log2(playerPitch.frequency / originalPitch.frequency));
    totalCentsDiff += centsDiff;
    
    // Note is considered matched if within 50 cents (half semitone)
    if (centsDiff < 50) {
      matchedPairs++;
      noteSustainScore += 1;
    } else if (centsDiff < 100) {
      // Close but not quite
      matchedPairs += 0.5;
      noteSustainScore += 0.5;
    }
  });
  
  // Analyze note transitions (how well player follows melody)
  if (alignedPairs.length > 1) {
    for (let i = 1; i < alignedPairs.length; i++) {
      const prevOriginal = alignedPairs[i-1].originalPitch;
      const currOriginal = alignedPairs[i].originalPitch;
      const prevPlayer = alignedPairs[i-1].playerPitch;
      const currPlayer = alignedPairs[i].playerPitch;
      
      // Skip if any are silent
      if (prevOriginal.frequency === 0 || currOriginal.frequency === 0 || 
          prevPlayer.frequency === 0 || currPlayer.frequency === 0) {
        continue;
      }
      
      // Calculate interval change in original vs player
      const originalInterval = 1200 * Math.log2(currOriginal.frequency / prevOriginal.frequency);
      const playerInterval = 1200 * Math.log2(currPlayer.frequency / prevPlayer.frequency);
      
      // Compare interval difference
      const intervalDiff = Math.abs(originalInterval - playerInterval);
      
      // Score based on how well player follows the melodic contour
      if (intervalDiff < 50) {
        noteTransitionScore += 1;
      } else if (intervalDiff < 100) {
        noteTransitionScore += 0.5;
      }
    }
    
    // Normalize transition score
    noteTransitionScore = noteTransitionScore / (alignedPairs.length - 1) * 100;
  }
  
  // Calculate final scores
  const pitchAccuracy = totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0;
  const averageCentsDiff = totalPairs > 0 ? totalCentsDiff / totalPairs : 0;
  const noteSustainAccuracy = totalPairs > 0 ? (noteSustainScore / totalPairs) * 100 :.0;
  
  // Weighted final score (customize weights as needed)
  const finalScore = Math.round(
    (pitchAccuracy * 0.6) + 
    (noteTransitionScore * 0.3) + 
    (noteSustainAccuracy * 0.1)
  );
  
  return {
    finalScore,
    metrics: {
      pitchAccuracy: Math.round(pitchAccuracy),
      noteTransitionScore: Math.round(noteTransitionScore),
      noteSustainAccuracy: Math.round(noteSustainAccuracy),
      averageCentsDiff: Math.round(averageCentsDiff)
    }
  };
}

/**
 * Align player pitches with original pitches based on time
 * @param {Array} playerPitches - Array of player pitch data
 * @param {Array} originalPitches - Array of original pitch data
 * @returns {Array} - Array of aligned {playerPitch, originalPitch} pairs
 */
function alignPitchSequences(playerPitches, originalPitches) {
  const alignedPairs = [];
  let playerIndex = 0;
  let originalIndex = 0;
  
  // Simple time-based alignment (can be improved with dynamic time warping)
  while (playerIndex < playerPitches.length && originalIndex < originalPitches.length) {
    const playerPitch = playerPitches[playerIndex];
    const originalPitch = originalPitches[originalIndex];
    
    // Add current pair
    alignedPairs.push({
      playerPitch,
      originalPitch
    });
    
    // Advance indices based on time
    if (playerIndex + 1 < playerPitches.length && 
        originalIndex + 1 < originalPitches.length) {
      
      const nextPlayerTime = playerPitches[playerIndex + 1].time;
      const nextOriginalTime = originalPitches[originalIndex + 1].time;
      
      if (nextPlayerTime < nextOriginalTime) {
        playerIndex++;
      } else {
        originalIndex++;
      }
    } else {
      // Reached the end of one of the sequences
      playerIndex++;
      originalIndex++;
    }
  }
  
  return alignedPairs;
}

/**
 * Simple function to use in a hackathon that compares 
 * a player's recording to the original vocals
 * @param {Blob} playerRecording - Player's recording
 * @param {Blob} originalVocals - Original vocals
 * @returns {Promise<number>} - Score from 0-100
 */
export async function getQuickScore(playerRecording, originalVocals) {
  try {
    const result = await compareVocals(playerRecording, originalVocals);
    return result.finalScore;
  } catch (error) {
    console.error('Error getting quick score:', error);
    return 0; // Return 0 on error
  }
}

/**
 * Use this function when you only have the original vocals as an audio element
 * @param {Blob} playerRecording - Player's recording as a blob
 * @param {string} originalVocalsUrl - URL to the original vocals audio file
 * @returns {Promise<number>} - Score from 0-100
 */
export async function scoreWithAudioUrl(playerRecording, originalVocalsUrl) {
  try {
    // Fetch the original vocals audio
    const response = await fetch(originalVocalsUrl);
    const originalBlob = await response.blob();

    console.log("response", response);
    console.log("originalbob", originalBlob);

    // Compare and return score
    return await getQuickScore(playerRecording, originalBlob);
  } catch (error) {
    console.error('Error scoring with audio URL:', error);
    return 0;
  }
}