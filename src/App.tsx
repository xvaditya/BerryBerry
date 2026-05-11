import './index.css';
import { lazy, Suspense } from 'react';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useIsMobile } from './hooks/useIsMobile';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import DictionarySection from './components/DictionarySection';
import PronunciationSection from './components/PronunciationSection';
import CorrectionSection from './components/CorrectionSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import GradientBlobs from './components/GradientBlobs';

// Lazy load heavy desktop-only effects
const ParticleField = lazy(() => import('./components/ParticleField'));
const CursorGlow = lazy(() => import('./components/CursorGlow'));

export default function App() {
  useSmoothScroll();
  const isMobile = useIsMobile();

  return (
    <div className="relative min-h-screen bg-cream-50 noise-overlay">
      {/* Background layers — lighter on mobile */}
      <GradientBlobs />

      {/* Desktop-only effects */}
      {!isMobile && (
        <Suspense fallback={null}>
          <ParticleField />
          <CursorGlow />
        </Suspense>
      )}

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <DictionarySection />
          <PronunciationSection />
          <CorrectionSection />
          <FeaturesSection />
          <TestimonialsSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
