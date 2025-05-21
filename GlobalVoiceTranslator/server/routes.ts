import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { translateText2 } from "./services/openai";
import { TranslationRequest, TranslationResponse } from "@shared/types";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for translating text
  app.post('/api/translate', async (req, res) => {
    try {
      const { originalText, sourceLanguage } = req.body as { originalText: string, sourceLanguage: string };
      
      if (!originalText) {
        return res.status(400).json({
          success: false,
          error: "No text provided for translation"
        });
      }
      
      if (!sourceLanguage) {
        return res.status(400).json({
          success: false,
          error: "Source language not specified"
        });
      }
      
      // Process the text using OpenAI API
      const result = await translateText2(originalText, sourceLanguage);
      
      const response: TranslationResponse = {
        originalText: result.originalText,
        translatedText: result.translatedText,
        success: true
      };
      
      return res.json(response);
    } catch (error) {
      console.error('Translation error:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
