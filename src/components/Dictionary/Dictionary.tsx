import { useState } from 'react';
import type { WordDefinition } from '../../types';
import { fetchWordDefinition, playAudio, speakText } from '../../utils/dictionaryApi';

export const Dictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [wordData, setWordData] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setWordData(null);

    try {
      const data = await fetchWordDefinition(searchTerm);
      setWordData(data);
    } catch (err) {
      setError('Word not found. Please try another word.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = () => {
    if (wordData?.phonetics) {
      const audioPhonetic = wordData.phonetics.find(p => p.audio);
      if (audioPhonetic?.audio) {
        playAudio(audioPhonetic.audio);
      } else {
        // Fallback to speech synthesis
        speakText(wordData.word);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">📖</span>
          Dictionary
        </h2>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search any English word..."
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-berry-blue-500 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-berry-blue-600 to-berry-blue-700 text-white rounded-lg font-medium hover:from-berry-blue-500 hover:to-berry-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 mb-4">
            {error}
          </div>
        )}

        {wordData && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-3xl font-bold text-white capitalize">{wordData.word}</h3>
                {wordData.phonetic && (
                  <p className="text-berry-blue-400 text-lg mt-1">{wordData.phonetic}</p>
                )}
              </div>
              <button
                onClick={handlePlayAudio}
                className="p-4 bg-berry-blue-500/20 hover:bg-berry-blue-500/30 rounded-full transition-all hover:scale-110 animate-glow"
                aria-label="Play pronunciation"
              >
                <svg className="w-6 h-6 text-berry-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {wordData.meanings.map((meaning, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-berry-blue-400 font-semibold mb-2 italic">
                    {meaning.partOfSpeech}
                  </p>
                  {meaning.definitions.slice(0, 2).map((def, defIdx) => (
                    <div key={defIdx} className="mb-3 last:mb-0">
                      <p className="text-white leading-relaxed">
                        <span className="text-berry-blue-500 mr-2">•</span>
                        {def.definition}
                      </p>
                      {def.example && (
                        <p className="text-white/60 text-sm mt-1 ml-4 italic">
                          Example: "{def.example}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
