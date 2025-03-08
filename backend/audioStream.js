import {YIN} from 'pitchfinder';

// Basic setup to capture real-time audio from a microphone
async function setupAudioCapture() {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      
      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create source from the microphone stream
      const microphoneSource = audioContext.createMediaStreamSource(stream);
      
      // Create an analyzer node for processing
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);
      
      // Connect the microphone to the analyzer
      microphoneSource.connect(analyser);
      
      // Process audio data in real-time
      function processAudio() {
        // Get time-domain data
        analyser.getFloatTimeDomainData(dataArray);
        
        // Now you can pass this data to pitchfinder
        // const pitch = yourPitchFinder(dataArray, audioContext.sampleRate);
        
        // Continue processing in real-time
        requestAnimationFrame(processAudio);
      }
      
      // Start processing
      processAudio();
      
      return {
        stream,
        audioContext,
        analyser,
        microphoneSource
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }