export interface WordDefinition {
  word: string;
  phonetic?: string;
  phonetics: {
    text?: string;
    audio?: string;
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

export interface PronunciationResult {
  userSaid: string;
  correctWord: string;
  isCorrect: boolean;
  confidence: number;
}

export interface SentenceCorrectionResult {
  original: string;
  corrected: string;
  explanation?: string;
}
