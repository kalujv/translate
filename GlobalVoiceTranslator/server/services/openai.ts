import OpenAI from "openai";
import { TranslationResult } from "@shared/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

// Language codes to full names mapping
export const languageNames: Record<string, string> = {
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'zh': 'Chinese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'ar': 'Arabic'
};

/**
 * Translates text from source language to English using OpenAI's GPT-4o model
 */
export async function translateText(text: string, sourceLanguage: string): Promise<string> {
  try {
    // Get the language name from code
    const languageName = languageNames[sourceLanguage] || sourceLanguage;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following ${languageName} text into English. Maintain the tone, formality, and meaning of the original text. Provide only the translated text without explanations.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent translations
    });
    
    return response.choices[0].message.content || '';
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error(`Failed to translate text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Handles text translation from source language to English
 */
export async function translateText2(originalText: string, sourceLanguage: string): Promise<TranslationResult> {
  try {
    if (!originalText || originalText.trim() === '') {
      throw new Error("No text provided for translation.");
    }
    
    // Translate the text to English
    const translatedText = await translateText(originalText, sourceLanguage);
    
    return {
      originalText,
      translatedText,
      sourceLanguage
    };
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}
