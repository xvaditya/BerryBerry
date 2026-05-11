import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { fadeUpVariants, staggerContainer } from '../utils/animations';

const testimonials = [
  {
    text: "BerryBerry made learning English feel like magic. The pronunciation checker is incredibly accurate!",
    author: 'Yuki T.',
    role: 'Student from Japan',
    emoji: '🍓',
  },
  {
    text: "I've tried dozens of apps, but nothing comes close to how beautiful and effective this is.",
    author: 'Marco R.',
    role: 'Designer from Italy',
    emoji: '✨',
  },
  {
    text: "The AI correction feature helped me write professional emails with confidence. Life-changing!",
    author: 'Priya S.',
    role: 'Engineer from India',
    emoji: '💖',
  },
  {
    text: "My kids love practicing pronunciation here. It's fun, not boring. That's a rare achievement.",
    author: 'Sofia L.',
    role: 'Parent from Brazil',
    emoji: '🌸',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-16 sm:py-32 overflow-hidden">
      <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-transparent via-berry-50/20 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
          <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 glass-pink rounded-full text-xs sm:text-sm font-medium text-berry-600">
            <Quote className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Loved by learners
          </motion.div>
          <motion.h2 variants={fadeUpVariants} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-berry-950">
            Sweet words from our <span className="text-gradient">community</span>
          </motion.h2>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUpVariants}>
              <div className="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full shadow-glass transition-shadow duration-500">
                <div className="text-2xl sm:text-3xl mb-3 sm:mb-4">{t.emoji}</div>
                <p className="text-berry-900/70 leading-relaxed mb-4 sm:mb-6 text-xs sm:text-sm">"{t.text}"</p>
                <div>
                  <div className="font-display font-bold text-berry-950 text-sm">{t.author}</div>
                  <div className="text-xs text-berry-400">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
