import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAudioRecorderReturn {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  isRecordingAvailable: boolean;
  audioData: string | null;
  error: Error | null;
  getAudioChunk: () => Promise<string | null>;
}

export default function useAudioRecorder(): UseAudioRecorderReturn {
  const [audioData, setAudioData] = useState<string | null>(null);
  const [isRecordingAvailable, setIsRecordingAvailable] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingIntervalRef = useRef<number | null>(null);
  
  // Cleanup function to stop all media resources
  const cleanup = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };
  
  // Clean up on component unmount
  useEffect(() => {
    return cleanup;
  }, []);
  
  // Function to process audio chunks into base64
  const processAudioChunks = useCallback(async (chunks: Blob[]): Promise<string | null> => {
    if (chunks.length === 0) return null;
    
    const audioBlob = new Blob(chunks, { type: 'audio/wav' });
    
    // Check if the blob has actual content (not just headers)
    if (audioBlob.size < 100) return null;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Remove the data URL prefix (data:audio/wav;base64,)
        const base64Audio = base64data.split(',')[1];
        resolve(base64Audio);
      };
    });
  }, []);
  
  // Get current audio chunk for real-time processing
  const getAudioChunk = useCallback(async (): Promise<string | null> => {
    try {
      // If we have audio chunks, process them
      if (audioChunksRef.current.length > 0) {
        // Make a copy to avoid processing the same chunks multiple times
        const currentChunks = [...audioChunksRef.current];
        
        return await processAudioChunks(currentChunks);
      }
      return null;
    } catch (err) {
      console.error('Error getting audio chunk:', err);
      return null;
    }
  }, [processAudioChunks]);
  
  const startRecording = async (): Promise<void> => {
    try {
      cleanup(); // Make sure previous recording is stopped
      
      setAudioData(null);
      setIsRecordingAvailable(false);
      setError(null);
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        try {
          const base64Audio = await processAudioChunks(audioChunksRef.current);
          
          if (base64Audio) {
            setAudioData(base64Audio);
            setIsRecordingAvailable(true);
          } else {
            setIsRecordingAvailable(false);
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Unknown error processing audio'));
          setIsRecordingAvailable(false);
        }
      };
      
      // Start the recorder with a shorter timeslice for more frequent ondataavailable events
      mediaRecorder.start(1000); // Generate data available event every 1 second
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start recording'));
      throw err;
    }
  };
  
  const stopRecording = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
          reject(new Error('No active recording to stop'));
          return;
        }
        
        // Add an event handler to resolve when processing is complete
        const originalOnStop = mediaRecorderRef.current.onstop;
        mediaRecorderRef.current.onstop = (event) => {
          if (originalOnStop) {
            // @ts-ignore - we know onstop is a function
            originalOnStop(event);
          }
          
          // Give time for the async operations in the original onstop to complete
          setTimeout(() => {
            streamRef.current?.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            resolve();
          }, 500);
        };
        
        mediaRecorderRef.current.stop();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to stop recording'));
        reject(err);
      }
    });
  };
  
  return {
    startRecording,
    stopRecording,
    isRecordingAvailable,
    audioData,
    error,
    getAudioChunk
  };
}
