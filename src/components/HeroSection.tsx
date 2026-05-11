import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Mic, Volume2, Loader2 } from 'lucide-react';
import { useMousePosition } from '../hooks/useMousePosition';
import { useMagneticButton } from '../hooks/useMagneticButton';
import { useIsMobile } from '../hooks/useIsMobile';
import { fadeUpVariants, staggerContainer } from '../utils/animations';
import { searchDictionary, getPhonetic, speakText, preloadVoices, createSpeechRecognition, isSpeechRecognitionSupported } from '../utils/api';

function StrawberrySVG({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 120 140" className={className} style={style} fill="none">
      <defs>
        <linearGradient id="berryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D6D" />
          <stop offset="50%" stopColor="#FF2D5E" />
          <stop offset="100%" stopColor="#C9184A" />
        </linearGradient>
        <radialGradient id="berryShine" cx="35%" cy="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <path d="M60 20 C45 5, 25 10, 35 25 C30 15, 20 5, 15 20 C10 30, 30 35, 60 30" fill="#4ADE80" opacity="0.8" />
      <path d="M60 20 C75 5, 95 10, 85 25 C90 15, 100 5, 105 20 C110 30, 90 35, 60 30" fill="#22C55E" opacity="0.7" />
      <ellipse cx="60" cy="80" rx="45" ry="55" fill="url(#berryGrad)" />
      <ellipse cx="60" cy="80" rx="45" ry="55" fill="url(#berryShine)" />
      {[[40,60],[55,50],[75,55],[35,80],[50,75],[70,70],[60,95],[45,100],[75,90],[55,110],[65,105]].map(([cx,cy],i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="2.5" ry="3.5" fill="#FFE0A0" opacity="0.7" transform={`rotate(${(i*7)%30-15} ${cx} ${cy})`} />
      ))}
    </svg>
  );
}

export default function HeroSection() {
  const mouse = useMousePosition();
  const startBtn = useMagneticButton(0.25);
  const micBtn = useMagneticButton(0.2);
  const isMobile = useIsMobile();

  const [heroQuery, setHeroQuery] = useState('');
  const [heroResult, setHeroResult] = useState<string | null>(null);
  const [heroLoading, setHeroLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Disable parallax on mobile
  const parallaxX = isMobile ? 0 : mouse.normalizedX * 15;
  const parallaxY = isMobile ? 0 : mouse.normalizedY * 15;

  useEffect(() => { preloadVoices(); }, []);

  const handleHeroSearch = async () => {
    if (!heroQuery.trim()) return;
    setHeroLoading(true);
    setHeroResult(null);
    const entry = await searchDictionary(heroQuery);
    setHeroLoading(false);
    if (entry) {
      const phonetic = getPhonetic(entry);
      const def = entry.meanings[0]?.definitions[0]?.definition || '';
      setHeroResult(`${entry.word} ${phonetic ? phonetic + ' ' : ''}— ${def}`);
      speakText(entry.word);
    } else {
      setHeroResult(`No results for "${heroQuery}"`);
    }
  };

  const handleHeroVoiceSearch = () => {
    if (!isSpeechRecognitionSupported()) return;
    const recognition = createSpeechRecognition();
    if (!recognition) return;
    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setHeroQuery(transcript);
      setIsListening(false);
      setTimeout(async () => {
        setHeroLoading(true);
        const entry = await searchDictionary(transcript);
        setHeroLoading(false);
        if (entry) {
          const phonetic = getPhonetic(entry);
          const def = entry.meanings[0]?.definitions[0]?.definition || '';
          setHeroResult(`${entry.word} ${phonetic ? phonetic + ' ' : ''}— ${def}`);
          speakText(entry.word);
        } else {
          setHeroResult(`No results for "${transcript}"`);
        }
      }, 100);
    };
    recognition.onerror = () => { setIsListening(false); };
    recognition.onend = () => { setIsListening(false); };
    recognition.start();
  };

  const handleHeroKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleHeroSearch();
  };

  return (
    <section id="learn" className="relative min-h-[100dvh] flex items-center overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16">
      {/* Ambient glow — hidden on mobile for GPU savings */}
      <div className="hidden md:block absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-berry-300/15 rounded-full blur-[80px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-strawberry-glow/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 sm:space-y-8">
            <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 glass rounded-full text-xs sm:text-sm font-medium text-berry-600">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              AI-Powered English Learning
            </motion.div>

            <motion.h1 variants={fadeUpVariants} className="font-display text-[2.5rem] leading-[1.1] sm:text-6xl lg:text-7xl font-bold sm:leading-[1.05] tracking-tight">
              <span className="text-berry-950">Learn English</span><br />
              <span className="text-gradient">beautifully</span><br />
              <span className="text-berry-950">with AI</span>
            </motion.h1>

            <motion.p variants={fadeUpVariants} className="text-base sm:text-lg text-berry-900/60 max-w-lg leading-relaxed">
              Master pronunciation, expand vocabulary, and perfect your grammar with our intelligent, beautiful learning companion.
            </motion.p>

            {/* Search bar */}
            <motion.div variants={fadeUpVariants} className="relative max-w-md">
              <div className="glass-strong rounded-2xl p-1.5 shadow-glass-lg">
                <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-berry-400 shrink-0" />
                  <input
                    type="text"
                    value={heroQuery}
                    onChange={(e) => { setHeroQuery(e.target.value); setHeroResult(null); }}
                    onKeyDown={handleHeroKeyDown}
                    placeholder="Search any English word..."
                    className="flex-1 bg-transparent text-berry-900 placeholder-berry-300 outline-none text-sm font-medium min-w-0"
                  />
                  {heroLoading && <Loader2 className="w-4 h-4 text-berry-400 animate-spin shrink-0" />}
                  <div className="w-px h-5 bg-berry-200 shrink-0" />
                  <button
                    onClick={handleHeroVoiceSearch}
                    className={`p-1.5 rounded-lg transition-colors shrink-0 ${isListening ? 'bg-berry-100 text-berry-600' : 'hover:bg-berry-50 text-berry-400'}`}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {heroResult && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 glass-strong rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-glass"
                >
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-berry-400 shrink-0 cursor-pointer" onClick={() => heroQuery && speakText(heroQuery)} />
                    <p className="text-xs text-berry-700 line-clamp-2">{heroResult}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-3 sm:gap-4">
              <motion.button ref={startBtn.ref} onMouseMove={startBtn.handleMouseMove} onMouseLeave={startBtn.handleMouseLeave} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => document.getElementById('dictionary')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-berry-500 to-berry-600 text-white font-semibold rounded-2xl shadow-berry hover:shadow-berry-lg transition-all text-sm">
                Start Learning
              </motion.button>
              <motion.button ref={micBtn.ref} onMouseMove={micBtn.handleMouseMove} onMouseLeave={micBtn.handleMouseLeave} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => document.getElementById('pronunciation')?.scrollIntoView({ behavior: 'smooth' })} className="px-6 sm:px-8 py-3 sm:py-3.5 glass font-semibold rounded-2xl shadow-glass text-berry-700 hover:bg-white/80 transition-all text-sm">
                Try Pronunciation
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUpVariants} className="flex gap-6 sm:gap-8 pt-2 sm:pt-4">
              {[{ value: '50K+', label: 'Active Learners' },{ value: '98%', label: 'Accuracy' },{ value: '4.9★', label: 'Rating' }].map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl sm:text-2xl font-display font-bold text-gradient">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-berry-900/50 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Strawberry Visuals (desktop only) */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }} className="relative h-[500px] lg:h-[600px] hidden lg:flex items-center justify-center">
            <motion.div style={{ x: parallaxX * 0.3, y: parallaxY * 0.3 }} className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-berry-200/30 to-berry-400/15 blur-xl" />
            </motion.div>
            <motion.div style={{ x: parallaxX * 0.8, y: parallaxY * 0.8 }} animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="relative z-10">
              <StrawberrySVG className="w-48 h-56 drop-shadow-2xl" />
            </motion.div>
            <motion.div style={{ x: parallaxX * 1.2, y: parallaxY * 1.2 }} animate={{ y: [-15, 5, -15], rotate: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className="absolute top-12 right-8 z-20">
              <StrawberrySVG className="w-20 h-24 drop-shadow-xl opacity-80" />
            </motion.div>
            <motion.div style={{ x: parallaxX * 1.5, y: parallaxY * 0.5 }} animate={{ y: [5, -12, 5], rotate: [-3, 3, -3] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute bottom-16 left-4 z-20">
              <StrawberrySVG className="w-16 h-20 drop-shadow-xl opacity-70" />
            </motion.div>
            <motion.div style={{ x: parallaxX * 0.6, y: parallaxY * 1.3 }} animate={{ y: [-8, 12, -8] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} className="absolute top-1/3 left-0 z-[5]">
              <StrawberrySVG className="w-12 h-14 drop-shadow-lg opacity-50" />
            </motion.div>

            {/* Floating Glass Cards */}
            <motion.div style={{ x: parallaxX * 0.4, y: parallaxY * 0.6 }} animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-24 right-4 z-30">
              <div className="glass-strong rounded-2xl px-4 py-3 shadow-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
                  <div>
                    <div className="text-xs font-semibold text-berry-900">"Strawberry"</div>
                    <div className="text-[10px] text-berry-500">Perfect pronunciation!</div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div style={{ x: parallaxX * 0.5, y: parallaxY * 0.3 }} animate={{ y: [5, -8, 5] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} className="absolute top-8 left-8 z-30">
              <div className="glass-strong rounded-2xl px-4 py-3 shadow-float">
                <div className="text-xs font-semibold text-berry-900">🎯 Daily Streak</div>
                <div className="text-lg font-display font-bold text-gradient">14 days</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
