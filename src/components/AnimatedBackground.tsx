import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 25, mass: 1 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25, mass: 1 });

  const [windowSize, setWindowSize] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  const parallaxX = useTransform(springX, [0, windowSize.width], [20, -20]);
  const parallaxY = useTransform(springY, [0, windowSize.height], [20, -20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  return (
    <>
      {/* Cursor-reactive ambient glow (desktop only) */}
      {!isTouchDevice && (
        <motion.div
          className="fixed pointer-events-none z-[1] hidden md:block"
          style={{
            x: springX,
            y: springY,
            width: 500,
            height: 500,
            marginLeft: -250,
            marginTop: -250,
            background:
              'radial-gradient(circle, rgba(255,45,94,0.04) 0%, rgba(255,143,163,0.02) 35%, transparent 65%)',
            borderRadius: '50%',
          }}
        />
      )}

      {/* Animated gradient mesh at bottom */}
      <motion.div 
        className="fixed bottom-[-5vh] left-[-5vw] right-[-5vw] h-[45vh] pointer-events-none z-0"
        style={{ x: parallaxX, y: parallaxY }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(255,45,94,0.3) 50%, rgba(255,77,109,0.4) 100%)',
          }}
        />
      </motion.div>

      {/* Subtle top vignette */}
      <motion.div 
        className="fixed top-[-5vh] left-[-5vw] right-[-5vw] h-[25vh] pointer-events-none z-0"
        style={{ x: parallaxX, y: parallaxY }}
      >
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            background:
              'linear-gradient(0deg, transparent 0%, rgba(255,224,232,0.5) 100%)',
          }}
        />
      </motion.div>
    </>
  );
}
