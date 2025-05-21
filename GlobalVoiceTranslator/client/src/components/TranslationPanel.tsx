import React, { useState, useEffect, useRef } from 'react';
import LanguageSelector from './LanguageSelector';
import AudioControls from './AudioControls';
import AudioVisualizer from './AudioVisualizer';
import { TranslationResult } from '@shared/types';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import useTranslation from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';

// Language code mapping for speech recognition
const speechRecognitionLanguages: Record<string, string> = {
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'it': 'it-IT',
  'pt': 'pt-PT',
  'ru': 'ru-RU',
  'zh': 'zh-CN',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
  'ar': 'ar-SA'
};

export default function SimpleTranslationPanel() {
  // Component state
  const [sourceLanguage, setSourceLanguage] = useState('es');
  const [recordingStatus, setRecordingStatus] = useState('Click microphone to start');
  const [currentSpeechText, setCurrentSpeechText] = useState('');
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  
  // Refs for scrolling
  const originalTextRef = useRef<HTMLDivElement>(null);
  const translatedTextRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const { translate, isTranslating } = useTranslation();
  
  // Get the appropriate language code
  const speechLanguage = speechRecognitionLanguages[sourceLanguage] || sourceLanguage;
  
  // Auto-scroll when text changes
  useEffect(() => {
    if (originalTextRef.current) {
      originalTextRef.current.scrollTop = originalTextRef.current.scrollHeight;
    }
    if (translatedTextRef.current && translation?.translatedText) {
      translatedTextRef.current.scrollTop = translatedTextRef.current.scrollHeight;
    }
  }, [currentSpeechText, translation?.translatedText]);
  
  // Text change handler - this is called constantly as the user speaks
  const handleTextChange = (text: string) => {
    console.log('Text change:', text);
    if (text && text.trim() !== '') {
      // Update our local state to show what's being said immediately
      setCurrentSpeechText(text);
    }
  };
  
  // Final text handler - this is called when the user pauses speaking
  const handleFinalText = async (finalText: string) => {
    console.log('Final text:', finalText);
    if (!finalText || finalText.trim() === '') return;
    
    try {
      // Show processing status
      setRecordingStatus('Translating...');
      
      // Translate the text
      const result = await translate(finalText, sourceLanguage);
      
      // Update the result
      setTranslation(result);
      setRecordingStatus('Listening...');
      
      // Auto-play the translation
      if (result.translatedText) {
        playSpeech(result.translatedText);
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: 'Translation failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
      setRecordingStatus('Translation failed');
    }
  };
  
  // Speech recognition hook
  const {
    text: speechRecognitionText,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
    error: recognitionError
  } = useSpeechRecognition({
    language: speechLanguage,
    onTextChange: handleTextChange,
    onFinalText: handleFinalText
  });
  
  // Handle recognition errors
  useEffect(() => {
    if (recognitionError) {
      console.error('Recognition error:', recognitionError);
      setRecordingStatus(`Error: ${recognitionError.message}`);
      toast({
        title: 'Speech Recognition Error',
        description: recognitionError.message,
        variant: 'destructive'
      });
    }
  }, [recognitionError, toast]);
  
  // Handle language change
  const handleLanguageChange = (language: string) => {
    setSourceLanguage(language);
  };
  
  // Toggle recording
  const toggleRecording = async () => {
    if (isListening) {
      // Stop recording
      try {
        stopListening();
        setRecordingStatus('Click microphone to start');
      } catch (error) {
        console.error('Error stopping recording:', error);
        toast({
          title: 'Error',
          description: 'Failed to stop recording',
          variant: 'destructive'
        });
      }
    } else {
      // Start recording
      try {
        // Clear previous state
        setCurrentSpeechText('');
        
        // Start listening
        await startListening();
        setRecordingStatus('Listening...');
      } catch (error) {
        console.error('Error starting recording:', error);
        
        let errorMessage = 'Please allow microphone access';
        if (!hasRecognitionSupport) {
          errorMessage = 'Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari';
        }
        
        toast({
          title: 'Microphone Error',
          description: errorMessage,
          variant: 'destructive'
        });
        
        setRecordingStatus('Microphone error');
      }
    }
  };
  
  // Text-to-speech function
  const playSpeech = (text: string) => {
    if (!text) return;
    
    // Cancel any current speech
    window.speechSynthesis.cancel();
    
    // Create and configure utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    
    // Speak
    window.speechSynthesis.speak(utterance);
  };
  
  // Determine what text to display
  const displayText = isListening 
    ? currentSpeechText || speechRecognitionText 
    : (translation?.originalText || '');
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="p-6 md:p-8">
        {/* Language selector */}
        <LanguageSelector
          selectedLanguage={sourceLanguage}
          onLanguageChange={handleLanguageChange}
        />
        
        {/* Audio controls */}
        <AudioControls
          isRecording={isListening}
          status={isTranslating ? 'Translating...' : recordingStatus}
          onToggleRecording={toggleRecording}
        />
        
        {/* Audio visualizer */}
        {isListening && (
          <AudioVisualizer />
        )}
        
        {/* Text display areas */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          {/* Original text area */}
          <div className="bg-[#F1F3F4] rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-google-sans text-sm text-gray-500">
                {isListening ? 'Transcript (speaking...)' : 'Original Text'}
              </h3>
            </div>
            <div 
              ref={originalTextRef}
              className="min-h-[60px] max-h-32 overflow-y-auto"
            >
              <p className="font-roboto text-base whitespace-pre-wrap">
                {displayText}
              </p>
            </div>
          </div>
          
          {/* Translation area */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-google-sans text-sm text-gray-500">Translation</h3>
              {translation?.translatedText && (
                <button 
                  className="text-[#4285F4] hover:text-[#4285F4]/80 focus:outline-none"
                  onClick={() => playSpeech(translation.translatedText)}
                  aria-label="Read translation aloud"
                >
                  <span className="material-icons">volume_up</span>
                </button>
              )}
            </div>
            <div 
              ref={translatedTextRef}
              className="min-h-[80px] max-h-48 overflow-y-auto"
            >
              <p className="font-roboto text-lg whitespace-pre-wrap leading-relaxed">
                {isTranslating 
                  ? 'Translating...' 
                  : (translation?.translatedText || '')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}