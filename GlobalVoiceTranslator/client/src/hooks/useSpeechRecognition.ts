import { useState, useEffect, useRef } from 'react';

interface UseSpeechRecognitionProps {
  language: string;
  onTextChange?: (text: string) => void;
  onFinalText?: (text: string) => void;
}

interface UseSpeechRecognitionReturn {
  text: string;
  isListening: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  hasRecognitionSupport: boolean;
  error: Error | null;
}

// Create a simpler, more reliable speech recognition hook
export default function useSpeechRecognition({
  language,
  onTextChange,
  onFinalText,
}: UseSpeechRecognitionProps): UseSpeechRecognitionReturn {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Store recognition instance
  const recognitionRef = useRef<any>(null);
  
  // Check browser support
  const SpeechRecognition = typeof window !== 'undefined' 
    ? window.SpeechRecognition || (window as any).webkitSpeechRecognition 
    : null;
  
  const hasRecognitionSupport = !!SpeechRecognition;
  
  useEffect(() => {
    // Cleanup function to stop recognition if component unmounts
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error stopping recognition on cleanup:', e);
        }
      }
    };
  }, []);
  
  const startListening = async (): Promise<void> => {
    try {
      // Reset state
      setText('');
      setError(null);
      
      if (!hasRecognitionSupport) {
        throw new Error('Speech recognition not supported in this browser');
      }
      
      // Create a fresh recognition instance
      const recognition = new SpeechRecognition();
      
      // Configure it
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      
      // Setup event handlers
      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        // Process results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Use final transcript if available, otherwise use interim
        const currentText = finalTranscript || interimTranscript;
        console.log('Speech recognition heard:', currentText);
        
        // Update our local state
        setText(currentText);
        
        // Notify parent component immediately
        if (onTextChange) {
          onTextChange(currentText);
        }
        
        // If we have final text, send that too
        if (finalTranscript && onFinalText) {
          onFinalText(finalTranscript);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        if (event.error === 'network') {
          console.log('Network error detected, attempting to restart...');
          
          // For network errors, try to restart after a delay
          setTimeout(() => {
            try {
              if (isListening && recognitionRef.current) {
                recognitionRef.current.stop();
                setTimeout(() => {
                  if (isListening) {
                    recognitionRef.current?.start();
                  }
                }, 300);
              }
            } catch (e) {
              console.error('Error restarting after network error:', e);
              setError(new Error('Failed to restart speech recognition'));
              setIsListening(false);
            }
          }, 1000);
        } else {
          // For other errors, notify the user
          setError(new Error(`Speech recognition error: ${event.error}`));
          setIsListening(false);
        }
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        
        // If we're still supposed to be listening, restart
        if (isListening) {
          try {
            setTimeout(() => {
              if (isListening && recognitionRef.current) {
                recognitionRef.current.start();
              }
            }, 300);
          } catch (e) {
            console.error('Error restarting recognition:', e);
            setIsListening(false);
          }
        }
      };
      
      // Store reference and start
      recognitionRef.current = recognition;
      recognition.start();
      
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError(err instanceof Error ? err : new Error('Unknown error starting speech recognition'));
      setIsListening(false);
      throw err;
    }
  };
  
  const stopListening = () => {
    setIsListening(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
  };
  
  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error
  };
}