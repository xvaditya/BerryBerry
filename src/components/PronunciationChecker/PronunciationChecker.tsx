import { useState } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { speakText } from '../../utils/dictionaryApi';

export const PronunciationChecker = () => {
  const [targetWord, setTargetWord] = useState('');
  const { isListening, result, error, startListening } = useSpeechRecognition();

  const handleStartListening = () => {
    if (!targetWord.trim()) {
      alert('Please enter a word first!');
      return;
    }
    startListening(targetWord);
  };

  const handlePlayCorrectPronunciation = () => {
    if (targetWord) {
      speakText(targetWord, 0.8);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="text-3xl">🎤</span>
          Pronunciation Checker
        </h2>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            value={targetWord}
            onChange={(e) => setTargetWord(e.target.value)}
            placeholder="Enter a word to practice..."
            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-berry-blue-500 transition-all"
          />

          <div className="flex gap-2">
            <button
              onClick={handleStartListening}
              disabled={isListening || !targetWord.trim()}
              className={`flex-1 px-6 py-4 rounded-lg font-medium transition-all ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-gradient-to-r from-berry-blue-600 to-berry-blue-700 hover:from-berry-blue-500 hover:to-berry-blue-600'
              } text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/50`}
            >
              {isListening ? '🎙️ Listening...' : '🎙️ Start Speaking'}
            </button>

            <button
              onClick={handlePlayCorrectPronunciation}
              disabled={!targetWord.trim()}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Hear correct pronunciation"
            >
              🔊
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 mb-4">
            {error}
          </div>
        )}

        {result && (
          <div className="animate-fade-in space-y-3">
            <div className={`p-4 rounded-lg border-2 ${
              result.isCorrect 
                ? 'bg-green-500/20 border-green-500/50' 
                : 'bg-yellow-500/20 border-yellow-500/50'
            }`}>
              <p className="text-white/70 text-sm mb-1">You said:</p>
              <p className="text-white text-xl font-semibold">{result.userSaid}</p>
            </div>

            <div className="p-4 bg-berry-blue-500/20 border-2 border-berry-blue-500/50 rounded-lg">
              <p className="text-white/70 text-sm mb-1">Correct word:</p>
              <p className="text-white text-xl font-semibold">{result.correctWord}</p>
            </div>

            <div className={`p-4 rounded-lg ${
              result.isCorrect 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-orange-500/10 border border-orange-500/30'
            }`}>
              <p className={`font-semibold text-lg ${
                result.isCorrect ? 'text-green-400' : 'text-orange-400'
              }`}>
                {result.isCorrect ? '✅ Perfect! Great pronunciation!' : '🔄 Try again! Listen and repeat.'}
              </p>
              <p className="text-white/50 text-sm mt-1">
                Confidence: {Math.round(result.confidence * 100)}%
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/70 text-sm">
            💡 <span className="font-semibold">Tip:</span> Make sure to allow microphone access in your browser. 
            Speak clearly and at a normal pace.
          </p>
        </div>
      </div>
    </div>
  );
};
