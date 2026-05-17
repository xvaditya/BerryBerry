// ============================================================
// BerryBerry — Type Definitions
// ============================================================

// Re-export data models
export type { Chat, Message } from './chat';

// Component prop types

export interface WordDefinition {
  word: string;
  phonetic?: string;
  phonetics: {
    text?: string;
    audio?: string;
    sourceUrl?: string;
    license?: {
      name: string;
      url: string;
    };
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms?: string[];
      antonyms?: string[];
    }[];
    synonyms?: string[];
    antonyms?: string[];
  }[];
  license?: {
    name: string;
    url: string;
  };
  sourceUrls?: string[];
}

export interface SentenceCorrectionResult {
  original: string;
  corrected: string;
  explanation: string;
}

export interface PronunciationResult {
  userSaid: string;
  correctWord: string;
  isCorrect: boolean;
  confidence: number;
}

export interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  label: string;
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export interface ChatBubbleProps {
  message: import('./chat').Message;
  isLatest?: boolean;
}

export interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
  disabled?: boolean;
}
