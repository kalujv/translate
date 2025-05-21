import { useState } from 'react';
import { TranslationResult } from '@shared/types';
import { apiRequest } from '@/lib/queryClient';

interface UseTranslationReturn {
  translate: (originalText: string, sourceLanguage: string) => Promise<TranslationResult>;
  isTranslating: boolean;
  error: Error | null;
}

export default function useTranslation(): UseTranslationReturn {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const translate = async (originalText: string, sourceLanguage: string): Promise<TranslationResult> => {
    setIsTranslating(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/translate', {
        originalText,
        sourceLanguage
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Translation failed');
      }
      
      return {
        originalText: result.originalText,
        translatedText: result.translatedText,
        sourceLanguage
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Translation failed'));
      throw err;
    } finally {
      setIsTranslating(false);
    }
  };
  
  return {
    translate,
    isTranslating,
    error
  };
}
