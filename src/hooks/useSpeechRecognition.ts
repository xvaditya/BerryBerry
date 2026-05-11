import { useState, useCallback } from 'react';
import { createRecognition, checkBrowserSupport, compareWords } from '../utils/speechRecognition';
import type { PronunciationResult } from '../types';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback((expectedWord: string) => {
    if (!checkBrowserSupport()) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    setError(null);
    setResult(null);
    setIsListening(true);

    const recognition = createRecognition();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      const isCorrect = compareWords(transcript, expectedWord);

      setResult({
        userSaid: transcript,
        correctWord: expectedWord,
        isCorrect,
        confidence
      });
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, []);

  return { isListening, result, error, startListening };
};
