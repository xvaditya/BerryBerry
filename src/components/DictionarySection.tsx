import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Volume2, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { fadeUpVariants, staggerContainer } from '../utils/animations';
import { searchDictionary, getPhonetic, getAudioUrl, speakText, type DictionaryEntry } from '../utils/api';

const suggestions = ['serendipity', 'ephemeral', 'eloquent', 'luminous', 'ethereal', 'mellifluous'];

export default function DictionarySection() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<DictionaryEntry | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSearch = async (word: string) => {
    const trimmed = word.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setShowSuggestions(false);
    setIsLoading(true);
    setError('');
    setResult(null);

    const entry = await searchDictionary(trimmed);
    setIsLoading(false);

    if (entry) {
      setResult(entry);
    } else {
      setError(`No results found for "${trimmed}". Try another word!`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch(query);
  };

  const playAudio = (entry: DictionaryEntry) => {
    const audioUrl = getAudioUrl(entry);
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play().catch(() => {
        // Fallback to TTS if audio URL fails
        speakText(entry.word);
      });
    } else {
      // Use browser TTS as fallback
      speakText(entry.word);
    }
  };

  // Extract best data from the result
  const phonetic = result ? getPhonetic(result) : '';
  const allSynonyms = result
    ? [...new Set(result.meanings.flatMap(m => [...m.synonyms, ...m.definitions.flatMap(d => d.synonyms)]).filter(Boolean))].slice(0, 8)
    : [];

  return (
    <section id="dictionary" className="relative py-16 sm:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-berry-200 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
          <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 glass-pink rounded-full text-xs sm:text-sm font-medium text-berry-600">
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Smart Dictionary
          </motion.div>
          <motion.h2 variants={fadeUpVariants} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-berry-950">
            Explore words <span className="text-gradient">beautifully</span>
          </motion.h2>
          <motion.p variants={fadeUpVariants} className="text-sm sm:text-base text-berry-900/50 max-w-lg mx-auto">
            Discover meanings, pronunciation, and usage — powered by a real dictionary API.
          </motion.p>
        </motion.div>

        {/* Search */}
        <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="glass-strong rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 shadow-glass-lg berry-glow">
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-berry-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); setError(''); }}
                onFocus={() => { if (!result) setShowSuggestions(true); }}
                onKeyDown={handleKeyDown}
                placeholder="Type any English word..."
                className="flex-1 bg-transparent text-base sm:text-lg text-berry-900 placeholder-berry-300 outline-none font-medium min-w-0"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSearch(query)}
                disabled={isLoading}
                className="px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-berry-500 to-berry-600 text-white font-semibold rounded-xl text-sm shadow-berry disabled:opacity-50 shrink-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </motion.button>
            </div>
          </div>

          {/* Suggestions */}
          <AnimatePresence>
            {showSuggestions && !result && !isLoading && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 right-0 mt-3 glass-strong rounded-2xl shadow-glass-lg overflow-hidden z-20">
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-medium text-berry-400 uppercase tracking-wider">Try these words</div>
                  {suggestions.map((word) => (
                    <button key={word} onClick={() => handleSearch(word)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-berry-50/50 rounded-xl transition-colors group">
                      <span className="text-sm font-medium text-berry-800 capitalize">{word}</span>
                      <ArrowRight className="w-4 h-4 text-berry-300 group-hover:text-berry-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loading */}
        <AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-12">
              <div className="flex items-center gap-3 text-berry-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm font-medium">Searching dictionary...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto text-center py-8">
              <p className="text-berry-400 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div key={result.word} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="max-w-2xl mx-auto">
              <div className="glass-strong rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-float berry-glow">
                {/* Word header */}
                <div className="flex items-start justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-berry-950 capitalize">{result.word}</h3>
                    {phonetic && <p className="text-berry-500 font-mono text-sm mt-1">{phonetic}</p>}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => playAudio(result)}
                    className="p-3 bg-berry-50 rounded-xl hover:bg-berry-100 transition-colors"
                    title="Listen to pronunciation"
                  >
                    <Volume2 className="w-5 h-5 text-berry-500" />
                  </motion.button>
                </div>

                {/* All meanings */}
                <div className="space-y-6">
                  {result.meanings.map((meaning, mi) => (
                    <div key={mi}>
                      <div className="inline-block px-3 py-1 bg-berry-100/60 rounded-lg text-xs font-semibold text-berry-600 mb-3">
                        {meaning.partOfSpeech}
                      </div>
                      <div className="space-y-3">
                        {meaning.definitions.slice(0, 3).map((def, di) => (
                          <div key={di}>
                            <p className="text-berry-900 leading-relaxed text-sm">
                              <span className="text-berry-400 mr-2">{di + 1}.</span>
                              {def.definition}
                            </p>
                            {def.example && (
                              <div className="bg-berry-50/50 rounded-xl p-3 mt-2 ml-5">
                                <p className="text-xs text-berry-700 italic">"{def.example}"</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Synonyms */}
                {allSynonyms.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-berry-100">
                    <p className="text-xs font-semibold text-berry-400 uppercase tracking-wider mb-3">Synonyms</p>
                    <div className="flex flex-wrap gap-2">
                      {allSynonyms.map((syn) => (
                        <button
                          key={syn}
                          onClick={() => handleSearch(syn)}
                          className="px-3 py-1.5 glass rounded-lg text-xs font-medium text-berry-600 hover:bg-berry-50 transition-colors cursor-pointer"
                        >
                          {syn}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
