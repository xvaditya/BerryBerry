// ============================================
// Dictionary API - https://api.dictionaryapi.dev
// ============================================

export interface DictionaryPhonetic {
  text?: string;
  audio?: string;
}

export interface DictionaryDefinition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
}

export async function searchDictionary(word: string): Promise<DictionaryEntry | null> {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`);
    if (!res.ok) return null;
    const data: DictionaryEntry[] = await res.json();
    return data[0] || null;
  } catch {
    return null;
  }
}

export function getPhonetic(entry: DictionaryEntry): string {
  for (const p of entry.phonetics) {
    if (p.text) return p.text;
  }
  return '';
}

export function getAudioUrl(entry: DictionaryEntry): string | null {
  for (const p of entry.phonetics) {
    if (p.audio && p.audio.length > 0) return p.audio;
  }
  return null;
}

// ============================================
// Text-to-Speech API - speechSynthesis
// ============================================

export function speakText(text: string, lang: string = 'en-US'): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  utterance.pitch = 1;

  // Try to use a good English voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'))
    || voices.find(v => v.lang.startsWith('en-US'))
    || voices.find(v => v.lang.startsWith('en'));
  if (englishVoice) utterance.voice = englishVoice;

  window.speechSynthesis.speak(utterance);
}

// Preload voices (Chrome loads them async)
export function preloadVoices(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

// ============================================
// Speech Recognition API - Web Speech API
// ============================================

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

export function createSpeechRecognition(): SpeechRecognitionInstance | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition: SpeechRecognitionInstance = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  return recognition;
}

export function isSpeechRecognitionSupported(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
}

// ============================================
// AI Sentence Correction — Vercel Serverless API
// with comprehensive local fallback
// ============================================

export interface CorrectionResult {
  original: string;
  corrected: string;
  explanation: string;
  issues: { word: string; type: string }[];
  hasChanges: boolean;
  source: 'ai' | 'local';
}

export async function correctSentence(sentence: string): Promise<CorrectionResult> {
  const original = sentence.trim();

  // Try the serverless API endpoint (works on both dev proxy and Vercel)
  try {
    const res = await fetch('/api/correct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: original }),
      signal: AbortSignal.timeout(10000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.corrected) {
        const issues = findIssues(original, data.corrected);
        const hasChanges = data.corrected.toLowerCase() !== original.toLowerCase() &&
          data.corrected.toLowerCase() !== (original + '.').toLowerCase();

        return {
          original,
          corrected: data.corrected,
          explanation: hasChanges
            ? `AI detected ${issues.length || 'some'} grammar issue${issues.length !== 1 ? 's' : ''} and corrected your sentence.`
            : 'Your sentence looks grammatically correct! Great job.',
          issues,
          hasChanges,
          source: 'ai',
        };
      }
    }
  } catch {
    // API unavailable — fall through to local
  }

  // Fallback to comprehensive local correction engine
  return localCorrection(original);
}

function localCorrection(original: string): CorrectionResult {
  let corrected = original;
  const issues: { word: string; type: string }[] = [];

  // 1. Capitalize first letter
  if (corrected.length > 0 && corrected[0] !== corrected[0].toUpperCase()) {
    corrected = corrected[0].toUpperCase() + corrected.slice(1);
    issues.push({ word: `${original[0]} → ${corrected[0]}`, type: 'Capitalization' });
  }

  // 2. Add period if missing end punctuation
  if (corrected.length > 0 && !/[.!?]$/.test(corrected)) {
    corrected += '.';
    issues.push({ word: 'Added period', type: 'Punctuation' });
  }

  // 3. Comprehensive grammar correction patterns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patterns: [RegExp, any, string, string][] = [
    // Tense errors
    [/\b([Ss])he go\b/g, '$1he went', 'go → went', 'Tense'],
    [/\b([Hh])e go\b/g, '$1e went', 'go → went', 'Tense'],
    [/\b([Ii]) go to\b(?!.*\b(will|gonna|going to)\b)/g, '$1 went to', 'go → went', 'Tense'],
    [/\byesterday I eat\b/gi, 'yesterday I ate', 'eat → ate', 'Tense'],
    [/\byesterday (\w+) eat\b/gi, 'yesterday $1 ate', 'eat → ate', 'Tense'],
    [/\blast week (\w+) go\b/gi, 'last week $1 went', 'go → went', 'Tense'],
    [/\blast week (\w+) come\b/gi, 'last week $1 came', 'come → came', 'Tense'],
    [/\blast week (\w+) see\b/gi, 'last week $1 saw', 'see → saw', 'Tense'],
    [/\blast week (\w+) eat\b/gi, 'last week $1 ate', 'eat → ate', 'Tense'],
    [/\blast week (\w+) take\b/gi, 'last week $1 took', 'take → took', 'Tense'],
    [/\blast week (\w+) make\b/gi, 'last week $1 made', 'make → made', 'Tense'],

    // Subject-verb agreement
    [/\b([Ii]) am agree\b/g, '$1 agree', 'am agree → agree', 'Grammar'],
    [/\b([Tt])hey is\b/g, '$1hey are', 'is → are', 'Subject-Verb'],
    [/\b([Ww])e is\b/g, '$1e are', 'is → are', 'Subject-Verb'],
    [/\b([Hh])e don't\b/g, "$1e doesn't", "don't → doesn't", 'Subject-Verb'],
    [/\b([Ss])he don't\b/g, "$1he doesn't", "don't → doesn't", 'Subject-Verb'],
    [/\b([Ii])t don't\b/g, "$1t doesn't", "don't → doesn't", 'Subject-Verb'],
    [/\b([Hh])e have\b(?! to| been)/g, '$1e has', 'have → has', 'Subject-Verb'],
    [/\b([Ss])he have\b(?! to| been)/g, '$1he has', 'have → has', 'Subject-Verb'],
    [/\bI is\b/g, 'I am', 'is → am', 'Subject-Verb'],
    [/\bI has\b/g, 'I have', 'has → have', 'Subject-Verb'],

    // Double negatives & constructions
    [/\bmore better\b/gi, 'better', 'more better → better', 'Comparison'],
    [/\bmost fastest\b/gi, 'fastest', 'most fastest → fastest', 'Comparison'],
    [/\bmore bigger\b/gi, 'bigger', 'more bigger → bigger', 'Comparison'],
    [/\bmore easier\b/gi, 'easier', 'more easier → easier', 'Comparison'],

    // Common mistakes
    [/\bcould of\b/gi, 'could have', 'of → have', 'Grammar'],
    [/\bshould of\b/gi, 'should have', 'of → have', 'Grammar'],
    [/\bwould of\b/gi, 'would have', 'of → have', 'Grammar'],
    [/\bmust of\b/gi, 'must have', 'of → have', 'Grammar'],
    [/\btheir is\b/gi, 'there is', 'their → there', 'Spelling'],
    [/\btheir are\b/gi, 'there are', 'their → there', 'Spelling'],
    [/\byour welcome\b/gi, "you're welcome", 'your → you\'re', 'Grammar'],
    [/\bits a\b(?! [a-z]*ing)/g, "it's a", 'its → it\'s', 'Grammar'],
    [/\bi dont\b/gi, "I don't", 'dont → don\'t', 'Spelling'],
    [/\bi didnt\b/gi, "I didn't", 'didnt → didn\'t', 'Spelling'],
    [/\bi cant\b/gi, "I can't", 'cant → can\'t', 'Spelling'],
    [/\bi wont\b/gi, "I won't", 'wont → won\'t', 'Spelling'],
    [/\balot\b/gi, 'a lot', 'alot → a lot', 'Spelling'],
    [/\binfact\b/gi, 'in fact', 'infact → in fact', 'Spelling'],
    [/\btoday morning\b/gi, 'this morning', 'today morning → this morning', 'Usage'],

    // Article errors
    [/\ba ([aeiou])/gi, 'an $1', 'a → an (before vowel)', 'Article'],
    [/\ban ([^aeiou\s])/gi, 'a $1', 'an → a (before consonant)', 'Article'],

    // Double words
    [/\b(\w+)\s+\1\b/gi, '$1', 'Removed duplicate word', 'Repetition'],
  ];

  const beforePatterns = corrected;
  for (const [pattern, replacement, desc, type] of patterns) {
    if (pattern.test(corrected)) {
      corrected = corrected.replace(pattern, replacement);
      issues.push({ word: desc, type });
    }
  }

  // 4. Fix "I" lowercase in middle of sentence
  corrected = corrected.replace(/\bi\b(?=[^''])/g, (match, offset) => {
    if (offset === 0) return match;
    return 'I';
  });

  const hasChanges = corrected.toLowerCase() !== original.toLowerCase() &&
    corrected.toLowerCase() !== (original + '.').toLowerCase() &&
    corrected !== beforePatterns;

  return {
    original,
    corrected,
    explanation: hasChanges
      ? `Found ${issues.length} issue${issues.length !== 1 ? 's' : ''} in your sentence.`
      : 'Your sentence looks grammatically correct! Great job. ✨',
    issues: issues.filter((_, i) => {
      // Remove capitalization/punctuation-only issues if no real grammar fix
      if (!hasChanges && (issues[i].type === 'Capitalization' || issues[i].type === 'Punctuation')) return false;
      return true;
    }),
    hasChanges,
    source: 'local',
  };
}

function findIssues(original: string, corrected: string): { word: string; type: string }[] {
  const issues: { word: string; type: string }[] = [];
  const origWords = original.toLowerCase().split(/\s+/);
  const corrWords = corrected.toLowerCase().replace(/[.]$/, '').split(/\s+/);

  if (origWords.length !== corrWords.length) {
    issues.push({ word: 'Sentence structure changed', type: 'Grammar' });
  } else {
    for (let i = 0; i < origWords.length; i++) {
      const ow = origWords[i].replace(/[^a-z']/g, '');
      const cw = corrWords[i].replace(/[^a-z']/g, '');
      if (ow !== cw) {
        issues.push({ word: `${ow} → ${cw}`, type: 'Grammar' });
      }
    }
  }

  return issues;
}

