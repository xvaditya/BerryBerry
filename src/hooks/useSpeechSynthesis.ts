import { useState, useEffect, useCallback } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Try to find a nice English voice
      const preferredVoices = ['Google US English', 'Samantha', 'Karen', 'Victoria', 'Tessa'];
      let selectedVoice = voices.find(v => preferredVoices.includes(v.name));
      
      if (!selectedVoice) {
         // Fallback to any English female voice, or just the first English voice
         selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) 
                      || voices.find(v => v.lang.startsWith('en')) 
                      || voices[0];
      }
      setVoice(selectedVoice || null);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Remove Markdown so it reads naturally
    const cleanText = text
      .replace(/[#*_~`]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove links but keep text
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (voice) {
      utterance.voice = voice;
    }
    
    // Adjust pitch and rate for a friendly tone
    utterance.pitch = 1.1; 
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voice]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    speak,
    stop,
  };
}
