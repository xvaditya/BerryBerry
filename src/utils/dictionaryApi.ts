import type { WordDefinition } from '../types';

const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export const fetchWordDefinition = async (word: string): Promise<WordDefinition> => {
  try {
    const response = await fetch(`${DICTIONARY_API}/${word.toLowerCase()}`);
    
    if (!response.ok) {
      throw new Error('Word not found');
    }
    
    const data = await response.json();
    return data[0];
  } catch (error) {
    throw new Error('Failed to fetch word definition');
  }
};

export const playAudio = (audioUrl: string): void => {
  const audio = new Audio(audioUrl);
  audio.play().catch(err => console.error('Audio playback failed:', err));
};

export const speakText = (text: string, rate: number = 1): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }
};
