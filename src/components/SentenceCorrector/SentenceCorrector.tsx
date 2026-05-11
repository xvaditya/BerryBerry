import { useState } from 'react';
import { correctSentence } from '../../utils/aiCorrection';
import type { SentenceCorrectionResult } from '../../types';

export const SentenceCorrector = () => {
  const [inputSentence, setInputSentence] = useState('');
  const [result, setResult] = useState<SentenceCorrectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCorrect = async () => {
    if (!inputSentence.trim()) {
      alert('Please enter a sentence!');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const correctionResult = await correctSentence(inputSentence);
      setResult(correctionResult);
    } catch (err) {
      setError('Failed to correct sentence. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputSentence('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          AI Sentence Corrector
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">
              Enter your sentence:
            </label>
            <textarea
              value={inputSentence}
              onChange={(e) => setInputSentence(e.target.value)}
              placeholder="Type a sentence to check grammar..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-berry-blue-500 transition-all resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCorrect}
              disabled={loading || !inputSentence.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-berry-blue-600 to-berry-blue-700 text-white rounded-lg font-medium hover:from-berry-blue-500 hover:to-berry-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Checking...
                </span>
              ) : (
                '✨ Check Grammar'
              )}
            </button>

            <button
              onClick={handleClear}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-medium transition-all"
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 animate-fade-in space-y-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/70 text-sm mb-2">Original:</p>
              <p className="text-white/90 leading-relaxed">{result.original}</p>
            </div>

            <div className="p-4 bg-berry-blue-500/20 border-2 border-berry-blue-500/50 rounded-lg">
              <p className="text-berry-blue-400 text-sm mb-2 font-semibold">Corrected:</p>
              <p className="text-white text-lg leading-relaxed font-medium">{result.corrected}</p>
            </div>

            {result.explanation && (
              <div className={`p-4 rounded-lg ${
                result.explanation === 'Correct!' 
                  ? 'bg-green-500/20 border border-green-500/50' 
                  : 'bg-yellow-500/20 border border-yellow-500/50'
              }`}>
                <p className={`text-sm font-semibold mb-1 ${
                  result.explanation === 'Correct!' ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {result.explanation === 'Correct!' ? '✅ ' : '💡 '}
                  Explanation:
                </p>
                <p className="text-white/90">{result.explanation}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/70 text-sm">
            🤖 <span className="font-semibold">Powered by AI:</span> Get instant grammar corrections 
            and helpful explanations to improve your English writing.
          </p>
        </div>
      </div>
    </div>
  );
};
