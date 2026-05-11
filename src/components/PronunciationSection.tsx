import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, CheckCircle, XCircle, Volume2, AlertTriangle } from 'lucide-react';
import { fadeUpVariants, staggerContainer } from '../utils/animations';
import { createSpeechRecognition, isSpeechRecognitionSupported, speakText } from '../utils/api';

type ListeningState = 'idle' | 'listening' | 'success' | 'error';

const practiceWords = ['Strawberry', 'Beautiful', 'Pronunciation', 'Serendipity', 'Extraordinary', 'Ephemeral', 'Eloquent', 'Magnificent'];

function WaveformBar({ index, active }: { index: number; active: boolean }) {
  const heightValues = useRef([12, Math.random() * 32 + 16, 12]);
  return (
    <motion.div
      className="w-1 rounded-full bg-gradient-to-t from-berry-500 to-berry-300"
      animate={active ? {
        height: heightValues.current,
        opacity: [0.5, 1, 0.5],
      } : { height: 12, opacity: 0.3 }}
      transition={{
        duration: 0.5 + Math.random() * 0.3,
        repeat: active ? Infinity : 0,
        ease: 'easeInOut',
        delay: index * 0.05,
      }}
    />
  );
}

export default function PronunciationSection() {
  const [state, setState] = useState<ListeningState>('idle');
  const [currentWord, setCurrentWord] = useState(practiceWords[0]);
  const [spokenText, setSpokenText] = useState('');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<ReturnType<typeof createSpeechRecognition>>(null);

  useEffect(() => {
    setSupported(isSpeechRecognitionSupported());
  }, []);

  const hearWord = () => {
    speakText(currentWord);
  };

  const calculateSimilarity = (spoken: string, target: string): number => {
    const s = spoken.toLowerCase().trim();
    const t = target.toLowerCase().trim();
    if (s === t) return 100;

    // Levenshtein-based similarity
    const len = Math.max(s.length, t.length);
    if (len === 0) return 100;

    const matrix: number[][] = [];
    for (let i = 0; i <= s.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= t.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= s.length; i++) {
      for (let j = 1; j <= t.length; j++) {
        const cost = s[i - 1] === t[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    const distance = matrix[s.length][t.length];
    return Math.round(((len - distance) / len) * 100);
  };

  const toggleListening = useCallback(() => {
    if (state === 'listening') {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setState('idle');
      return;
    }

    if (!supported) return;

    const recognition = createSpeechRecognition();
    if (!recognition) {
      setSupported(false);
      return;
    }
    recognitionRef.current = recognition;

    setState('listening');
    setSpokenText('');
    setAccuracy(null);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);

      const sim = calculateSimilarity(transcript, currentWord);
      setAccuracy(sim);

      if (sim >= 70) {
        setState('success');
      } else {
        setState('error');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        setSpokenText('No speech detected. Try again!');
      } else if (event.error === 'not-allowed') {
        setSpokenText('Microphone access denied. Please allow mic access.');
      } else {
        setSpokenText(`Error: ${event.error}`);
      }
      setState('error');
    };

    recognition.onend = () => {
      // If still in listening state (no result came), reset
      setState((prev) => prev === 'listening' ? 'idle' : prev);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setState('idle');
    }
  }, [state, currentWord, supported]);

  const nextWord = () => {
    const idx = practiceWords.indexOf(currentWord);
    setCurrentWord(practiceWords[(idx + 1) % practiceWords.length]);
    setState('idle');
    setSpokenText('');
    setAccuracy(null);
  };

  const tryAgain = () => {
    setState('idle');
    setSpokenText('');
    setAccuracy(null);
  };

  return (
    <section id="pronunciation" className="relative py-16 sm:py-32 overflow-hidden">
      <div className="hidden sm:block absolute inset-0 bg-gradient-to-b from-transparent via-berry-50/30 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-20">
          <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 glass-pink rounded-full text-xs sm:text-sm font-medium text-berry-600">
            <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Pronunciation Practice
          </motion.div>
          <motion.h2 variants={fadeUpVariants} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-berry-950">
            Perfect your <span className="text-gradient">accent</span>
          </motion.h2>
          <motion.p variants={fadeUpVariants} className="text-sm sm:text-base text-berry-900/50 max-w-lg mx-auto">
            Speak naturally. Real speech recognition listens and scores your pronunciation.
          </motion.p>
        </motion.div>

        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col items-center">
          {/* Not supported warning */}
          {!supported && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-strong rounded-2xl px-6 py-4 shadow-glass mb-8 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
              <p className="text-sm text-berry-700">Speech recognition is not supported in this browser. Try Chrome or Edge.</p>
            </motion.div>
          )}

          {/* Word to pronounce */}
          <motion.div key={currentWord} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-12 text-center">
            <p className="text-xs sm:text-sm text-berry-400 font-medium mb-2">Say this word:</p>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-berry-950 mb-3">{currentWord}</h3>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={hearWord}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm font-medium text-berry-500 active:bg-berry-50 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Hear it
            </motion.button>
          </motion.div>

          {/* Mic button with pulse rings */}
          <div className="relative mb-8 sm:mb-12">
            <AnimatePresence>
              {state === 'listening' && (
                <>
                  {[0, 1].map((i) => (
                    <motion.div key={i} initial={{ scale: 1, opacity: 0.4 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }} className="absolute inset-0 rounded-full border-2 border-berry-400/30" />
                  ))}
                </>
              )}
            </AnimatePresence>

            <motion.button
              onClick={toggleListening}
              whileTap={{ scale: 0.95 }}
              disabled={!supported}
              className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                state === 'listening'
                  ? 'bg-gradient-to-br from-berry-500 to-berry-600 shadow-berry-lg'
                  : state === 'success'
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg'
                  : state === 'error'
                  ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow-lg'
                  : 'bg-gradient-to-br from-berry-400 to-berry-500 shadow-berry'
              }`}
            >
              {state === 'listening' ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : state === 'success' ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : state === 'error' ? (
                <XCircle className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </motion.button>
          </div>

          {/* Waveform */}
          <div className="flex items-end justify-center gap-1 h-12 mb-8">
            {Array.from({ length: 24 }).map((_, i) => (
              <WaveformBar key={i} index={i} active={state === 'listening'} />
            ))}
          </div>

          {/* Result */}
          <AnimatePresence mode="wait">
            {spokenText && state !== 'listening' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-strong rounded-2xl px-8 py-5 shadow-float text-center mb-8 min-w-[280px]">
                <p className="text-sm text-berry-400 mb-1">You said:</p>
                <p className={`text-xl font-display font-bold ${state === 'success' ? 'text-emerald-600' : 'text-orange-500'}`}>
                  "{spokenText}"
                </p>
                {accuracy !== null && (
                  <div className="mt-3">
                    <div className="w-full bg-berry-100 rounded-full h-2 mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${accuracy}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-2 rounded-full ${accuracy >= 70 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-orange-400 to-red-400'}`}
                      />
                    </div>
                    <p className="text-xs text-berry-500">{accuracy}% match</p>
                  </div>
                )}
                {state === 'success' && <p className="text-sm text-emerald-500 mt-2">✨ Excellent pronunciation!</p>}
                {state === 'error' && (
                  <div className="mt-3">
                    <p className="text-sm text-orange-500 mb-2">Keep practicing! Try listening first.</p>
                    <motion.button onClick={tryAgain} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-4 py-1.5 bg-berry-50 rounded-lg text-xs font-medium text-berry-600 hover:bg-berry-100 transition-colors">
                      Try Again
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button onClick={nextWord} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="px-6 py-2.5 glass rounded-xl text-sm font-medium text-berry-600 hover:bg-berry-50 transition-colors">
            Next Word →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
