import { motion } from 'framer-motion';
import { Brain, Mic, BookOpen, Wand2, Globe, Zap } from 'lucide-react';
import { fadeUpVariants, staggerContainer } from '../utils/animations';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Learning',
    description: 'Adaptive lessons that evolve with your skill level using advanced language models.',
    gradient: 'from-berry-400 to-berry-600',
  },
  {
    icon: Mic,
    title: 'Voice Recognition',
    description: 'Real-time pronunciation analysis with instant feedback on your accent and clarity.',
    gradient: 'from-rose-400 to-pink-600',
  },
  {
    icon: BookOpen,
    title: 'Smart Dictionary',
    description: 'Context-aware definitions with examples, synonyms, and usage patterns.',
    gradient: 'from-pink-400 to-berry-500',
  },
  {
    icon: Wand2,
    title: 'Grammar Correction',
    description: 'AI-powered sentence correction with detailed explanations of each fix.',
    gradient: 'from-berry-300 to-rose-500',
  },
  {
    icon: Globe,
    title: 'Contextual Learning',
    description: 'Learn words and phrases in real-world contexts that stick in your memory.',
    gradient: 'from-fuchsia-400 to-berry-500',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Get immediate, detailed feedback on every interaction to accelerate your progress.',
    gradient: 'from-orange-400 to-berry-500',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-16 sm:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-berry-200 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="text-center space-y-3 sm:space-y-4 mb-12 sm:mb-20">
          <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 glass-pink rounded-full text-xs sm:text-sm font-medium text-berry-600">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Features
          </motion.div>
          <motion.h2 variants={fadeUpVariants} className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-berry-950">
            Everything you need to <span className="text-gradient">excel</span>
          </motion.h2>
          <motion.p variants={fadeUpVariants} className="text-sm sm:text-base text-berry-900/50 max-w-lg mx-auto">
            Powerful tools designed to make your English learning journey effective and enjoyable.
          </motion.p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeUpVariants} className="group active:scale-[0.98] transition-transform">
              <div className="glass-strong rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-full shadow-glass md:hover:shadow-float transition-shadow duration-500 relative overflow-hidden">
                {/* Hover glow — desktop only */}
                <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-berry-50/50 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6 shadow-berry md:group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-bold text-berry-950 mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-berry-900/50 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
