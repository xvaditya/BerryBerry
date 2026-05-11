import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, CheckCircle, AlertCircle, Send, Loader2, Sparkles } from 'lucide-react';
import { fadeUpVariants, staggerContainer } from '../utils/animations';
import { correctSentence, type CorrectionResult } from '../utils/api';

const examples = [
  'She go to school yesterday',
  'I am agree with you',
  'He don\'t like apples',
  'They is going to the park',
  'I could of done better',
];

export default function CorrectionSection() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCorrect = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setResult(null);

    const correction = await correctSentence(input);
    setResult(correction);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCorrect();
    }
  };

  return (
    <section className="relative py-16 sm:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-berry-200 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
          <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 glass-pink rounded-full text-xs sm:text-sm font-medium text-berry-600">
            <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            AI Correction
          </motion.div>
          <motion.h2 variants={fadeUpVariants} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-berry-950">
            Write with <span className="text-gradient">confidence</span>
          </motion.h2>
          <motion.p variants={fadeUpVariants} className="text-sm sm:text-base text-berry-900/50 max-w-lg mx-auto">
            Type any sentence and let AI polish your grammar instantly.
          </motion.p>
        </motion.div>

        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-2xl mx-auto">
          {/* Input */}
          <div className="glass-strong rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-glass-lg mb-3 sm:mb-4">
            <div className="flex items-start gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a sentence to correct..."
                rows={2}
                className="flex-1 bg-transparent text-berry-900 placeholder-berry-300 outline-none text-sm font-medium resize-none mt-1 min-w-0"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCorrect}
                disabled={isLoading || !input.trim()}
                className="p-2.5 sm:p-3 bg-gradient-to-r from-berry-500 to-berry-600 text-white rounded-xl shadow-berry shrink-0 disabled:opacity-50 transition-opacity"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Example buttons */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8 justify-center items-center">
            <span className="text-[10px] sm:text-xs text-berry-400">Try:</span>
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => { setInput(ex); setResult(null); }}
                className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 glass rounded-lg text-berry-600 active:bg-berry-50 transition-colors"
              >
                "{ex}"
              </button>
            ))}
          </div>

          {/* Loading */}
          <AnimatePresence>
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-8">
                <div className="flex items-center gap-3 text-berry-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span className="text-sm font-medium">AI is analyzing your sentence...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence mode="wait">
            {result && !isLoading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="glass-strong rounded-3xl p-8 shadow-float berry-glow"
              >
                {/* Original */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Original</span>
                  </div>
                  <p className={`text-sm ${result.hasChanges ? 'text-berry-900/60 line-through' : 'text-berry-900'}`}>
                    {result.original}
                  </p>
                </div>

                {/* Corrected */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Corrected</span>
                  </div>
                  <p className="text-berry-950 font-semibold text-lg">{result.corrected}</p>
                </div>

                {/* Status badge */}
                {!result.hasChanges && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl mb-4"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-700">No errors found — great job!</span>
                  </motion.div>
                )}

                {/* Explanation */}
                <div className="bg-berry-50/50 rounded-2xl p-4 mb-4">
                  <p className="text-sm text-berry-700">{result.explanation}</p>
                </div>

                {/* Issues */}
                {result.issues.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {result.issues.map((issue, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-berry-100/60 rounded-lg text-xs font-medium text-berry-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-berry-400" />
                        {issue.type}: {issue.word}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
