export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
}

export interface TranslationRequest {
  audioData: string; // base64 encoded audio data
  sourceLanguage: string;
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  success: boolean;
  error?: string;
}
