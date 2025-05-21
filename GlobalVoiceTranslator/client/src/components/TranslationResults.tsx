import React, { useRef, useEffect } from 'react';

interface TranslationResultsProps {
  originalText: string;
  translatedText: string;
  onPlaySpeech: (text: string) => void;
}

export default function TranslationResults({ 
  originalText, 
  translatedText,
  onPlaySpeech
}: TranslationResultsProps) {
  const translationRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom of the translation area when content changes
  useEffect(() => {
    if (translationRef.current) {
      translationRef.current.scrollTop = translationRef.current.scrollHeight;
    }
  }, [translatedText]);
  
  return (
    <div className="border-t border-gray-200 pt-6 translation-appear">
      <div className="bg-[#F1F3F4] rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-google-sans text-sm text-gray-500">Original Text</h3>
        </div>
        <div className="max-h-32 overflow-y-auto">
          <p className="font-roboto text-base whitespace-pre-wrap">{originalText}</p>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-google-sans text-sm text-gray-500">Translation</h3>
          <button 
            className="text-[#4285F4] hover:text-[#4285F4]/80 focus:outline-none"
            onClick={() => onPlaySpeech(translatedText)}
            aria-label="Read translation aloud"
          >
            <span className="material-icons">volume_up</span>
          </button>
        </div>
        <div 
          ref={translationRef}
          className="max-h-48 overflow-y-auto" 
        >
          <p className="font-roboto text-lg whitespace-pre-wrap leading-relaxed">{translatedText}</p>
        </div>
      </div>
    </div>
  );
}
