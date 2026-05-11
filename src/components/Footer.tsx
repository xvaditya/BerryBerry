import { motion } from 'framer-motion';
import { Cherry, Heart, ExternalLink, Mail } from 'lucide-react';
import { fadeUpVariants, staggerContainer } from '../utils/animations';

const footerLinks = [
  { heading: 'Product', links: ['Features', 'Pricing', 'Dictionary', 'Pronunciation'] },
  { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
  { heading: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] },
];

export default function Footer() {
  return (
    <footer className="relative pt-16 sm:pt-32 pb-8 sm:pb-12 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-berry-200 to-transparent" />

      {/* CTA Banner */}
      <motion.div variants={fadeUpVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-4xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        <div className="relative rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-berry-500 via-berry-600 to-rose-600 p-8 sm:p-12 text-center overflow-hidden">
          {/* Decorative — hidden on mobile */}
          <div className="hidden md:block absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">Ready to learn beautifully?</h2>
            <p className="text-white/70 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">Join thousands of learners who are mastering English with BerryBerry's AI-powered platform.</p>
            <motion.button whileTap={{ scale: 0.97 }} className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-berry-600 font-bold rounded-xl sm:rounded-2xl shadow-lg text-sm active:bg-berry-50 transition-colors">
              Get Started — It's Free
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <motion.div variants={fadeUpVariants} className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Cherry className="w-5 h-5 sm:w-6 sm:h-6 text-berry-500" />
              <span className="font-display font-bold text-base sm:text-lg">
                <span className="text-gradient">Berry</span>
                <span className="text-berry-900">Berry</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-berry-900/50 leading-relaxed max-w-xs mb-4 sm:mb-6">
              Beautiful AI-powered English learning. Practice pronunciation, explore words, and perfect your grammar.
            </p>
            <div className="flex gap-3">
              {[ExternalLink, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 sm:w-10 sm:h-10 glass rounded-xl flex items-center justify-center text-berry-400 hover:text-berry-600 active:bg-berry-50 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {footerLinks.map((col) => (
            <motion.div key={col.heading} variants={fadeUpVariants}>
              <h4 className="font-display font-semibold text-berry-950 mb-3 sm:mb-4 text-xs sm:text-sm">{col.heading}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs sm:text-sm text-berry-900/50 hover:text-berry-600 active:text-berry-700 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div className="border-t border-berry-100 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-xs text-berry-900/40">© 2026 BerryBerry. All rights reserved.</p>
          <p className="text-[10px] sm:text-xs text-berry-900/40 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-berry-400 fill-berry-400" /> and AI
          </p>
        </div>
      </div>
    </footer>
  );
}
