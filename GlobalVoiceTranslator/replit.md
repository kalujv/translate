# Voice Translator Application

## Overview

This application is a real-time voice translation tool that allows users to record audio in one language and get a translation in English. It uses OpenAI's speech recognition and language processing APIs to provide accurate translations.

The application follows a modern web architecture with a React frontend and Express backend. It incorporates a SQL database (using Drizzle ORM) for storing user information and translation history.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The application uses a React frontend with the following key technologies:
- **React**: Core UI library
- **Tailwind CSS**: For styling components
- **shadcn/ui**: A collection of reusable UI components built with Radix UI
- **Wouter**: For client-side routing
- **React Query**: For data fetching and state management

The frontend is organized with a component-based architecture where individual UI elements are composed to build complex pages. The application uses custom hooks for shared functionality like audio recording and translation.

### Backend

The backend is built with:
- **Express.js**: A minimal web server framework
- **Drizzle ORM**: For database operations
- **OpenAI API**: For audio transcription and translation

The server follows a RESTful API design pattern with dedicated endpoints for handling translation requests.

### Database

The application uses PostgreSQL with Drizzle ORM for database management. The schema includes tables for:
- **Users**: Storing user credentials
- **Translations**: Storing translation history including original and translated text

## Key Components

### Client Components

1. **TranslationPanel**: The main component allowing users to select a source language, record audio, and view translation results.
2. **AudioControls**: Manages recording state and UI for starting/stopping recording.
3. **LanguageSelector**: Dropdown for selecting the source language.
4. **TranslationResults**: Displays the original text and its translation.

### Server Components

1. **Translation Service**: Interfaces with OpenAI's API for audio transcription and text translation.
2. **API Routes**: Express routes that handle client requests.
3. **Storage Service**: Abstracts database operations for saving and retrieving translations.

### Custom Hooks

1. **useAudioRecorder**: Manages browser audio recording functionality.
2. **useTranslation**: Handles the translation process and API communication.
3. **useToast**: Provides toast notifications for user feedback.

## Data Flow

1. **Audio Recording**:
   - User selects a source language
   - User clicks the recording button to start capture
   - The browser's Web Audio API captures audio until user stops recording
   - Recorded audio is encoded as base64

2. **Translation Process**:
   - Frontend sends audio data and language selection to backend
   - Backend sends audio to OpenAI for transcription in original language
   - Original text is translated to English using OpenAI
   - Result is returned to frontend with both original and translated text

3. **Result Display**:
   - Frontend displays original text and translation
   - User can play the translation using text-to-speech
   - Translations can be saved to user history (when user system is implemented)

## External Dependencies

### API Services
- **OpenAI API**: Used for audio transcription and translation

### Frontend Libraries
- **React**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI
- **Tanstack Query**: Data fetching and state management
- **Wouter**: Lightweight routing

### Backend Libraries
- **Express.js**: Web server framework
- **Drizzle ORM**: SQL query builder and ORM
- **Drizzle-zod**: Schema validation integration

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:
- **Development Mode**: `npm run dev` starts both server and client in development mode
- **Production Build**: `npm run build` creates optimized frontend assets and bundles the server
- **Production Start**: `NODE_ENV=production node dist/index.js` runs the application in production mode

Database provisioning will use PostgreSQL, with environment variables managing the database connection. The Drizzle ORM handles database migrations and schema changes.

## Future Enhancements

Potential enhancements to consider:
1. **User Authentication**: Implementing the user login/registration functionality
2. **Translation History**: Storing and displaying past translations
3. **Additional Languages**: Supporting translation to languages other than English
4. **Offline Support**: Adding capabilities to work without an internet connection
5. **Mobile App**: Creating native mobile applications for iOS and Android