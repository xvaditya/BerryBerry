export const checkBrowserSupport = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

export const createRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;
  
  return recognition;
};

export const compareWords = (spokenWord: string, expectedWord: string): boolean => {
  return spokenWord.toLowerCase().trim() === expectedWord.toLowerCase().trim();
};
