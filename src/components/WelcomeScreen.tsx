import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Mic, PenTool } from 'lucide-react';

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
}

const suggestions = [
  {
    icon: <BookOpen className="w-4 h-4" />,
    title: 'Explain grammar',
    prompt: 'Can you explain when to use "has been" vs "have been"?',
    color: 'from-blue-400/10 to-blue-500/5',
    border: 'border-blue-200/30',
    iconColor: 'text-blue-500',
  },
  {
    icon: <PenTool className="w-4 h-4" />,
    title: 'Fix my sentence',
    prompt: 'Please correct this: "I am agree with you about the meeting."',
    color: 'from-purple-400/10 to-purple-500/5',
    border: 'border-purple-200/30',
    iconColor: 'text-purple-500',
  },
  {
    icon: <Mic className="w-4 h-4" />,
    title: 'Help with pronunciation',
    prompt: 'How do I pronounce "comfortable" correctly?',
    color: 'from-berry-400/10 to-berry-500/5',
    border: 'border-berry-200/30',
    iconColor: 'text-berry-500',
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    title: 'Teach me vocabulary',
    prompt: 'Teach me 5 advanced English words for daily conversation.',
    color: 'from-amber-400/10 to-amber-500/5',
    border: 'border-amber-200/30',
    iconColor: 'text-amber-500',
  },
];

export default function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-12">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <div className="relative inline-flex">
            <motion.div
              className="absolute inset-0 rounded-3xl"
              animate={{
                boxShadow: [
                  '0 0 40px rgba(255,45,94,0.15)',
                  '0 0 60px rgba(255,45,94,0.25)',
                  '0 0 40px rgba(255,45,94,0.15)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-berry-400 via-berry-500 to-berry-600 flex items-center justify-center relative">
              <span className="text-3xl">🍓</span>
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-amber-400 drop-shadow-lg" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-[3.5rem] font-display font-bold leading-tight tracking-tight mb-4"
        >
          <span className="text-berry-950">Learn English</span>
          <br />
          <span className="text-gradient">beautifully with AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-[15px] md:text-base text-berry-400 max-w-md mx-auto mb-10 leading-relaxed"
        >
          Your personal AI tutor for mastering English. Ask anything about grammar, vocabulary, pronunciation, or writing.
        </motion.p>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto"
        >
          {suggestions.map((s, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSuggestionClick(s.prompt)}
              className={`group text-left p-4 rounded-2xl cursor-pointer bg-gradient-to-br ${s.color} border ${s.border} hover:shadow-glass transition-all duration-300`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center ${s.iconColor} shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-berry-900 mb-0.5">{s.title}</p>
                  <p className="text-[11px] text-berry-400 leading-snug line-clamp-2">{s.prompt}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
