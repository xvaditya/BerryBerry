import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function useSmoothScroll() {
  useEffect(() => {
    // Skip Lenis on mobile — native scroll is smoother on touch devices
    if (isMobile()) return;

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}
