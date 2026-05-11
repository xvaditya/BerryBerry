import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cherry, Sparkles, Menu, X } from 'lucide-react';
import { useMagneticButton } from '../hooks/useMagneticButton';

const navLinks = [
  { label: 'Learn', href: '#learn' },
  { label: 'Dictionary', href: '#dictionary' },
  { label: 'Pronounce', href: '#pronunciation' },
  { label: 'Features', href: '#features' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ctaBtn = useMagneticButton(0.2);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className={`flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500 ${scrolled ? 'glass-strong shadow-glass' : 'bg-transparent'}`}>
            <a href="#" className="flex items-center gap-2 group">
              <motion.div whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                <Cherry className="w-7 h-7 text-berry-500" />
              </motion.div>
              <span className="font-display font-bold text-xl tracking-tight">
                <span className="text-gradient">Berry</span>
                <span className="text-berry-900">Berry</span>
              </span>
            </a>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="relative px-4 py-2 text-sm font-medium text-berry-900/70 hover:text-berry-600 transition-colors rounded-xl group">
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-berry-400 rounded-full transition-all duration-300 group-hover:w-6" />
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <motion.button ref={ctaBtn.ref} onMouseMove={ctaBtn.handleMouseMove} onMouseLeave={ctaBtn.handleMouseLeave} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-berry-500 to-berry-600 text-white text-sm font-semibold rounded-xl shadow-berry hover:shadow-berry-lg transition-shadow">
                <Sparkles className="w-4 h-4" />
                Start Free
              </motion.button>
            </div>

            <button className="md:hidden p-2 text-berry-700" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-40 pt-24 px-6 bg-cream-50/95 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.a key={link.label} href={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="px-4 py-3 text-lg font-medium text-berry-900 hover:text-berry-500 rounded-xl hover:bg-berry-50 transition-all" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </motion.a>
              ))}
              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4 w-full py-3 bg-gradient-to-r from-berry-500 to-berry-600 text-white font-semibold rounded-xl shadow-berry">
                Start Free
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
