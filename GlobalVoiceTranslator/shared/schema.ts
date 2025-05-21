import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Translation history table
export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sourceLanguage: text("source_language").notNull(),
  originalText: text("original_text").notNull(),
  translatedText: text("translated_text").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
});

export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = typeof translations.$inferSelect;
