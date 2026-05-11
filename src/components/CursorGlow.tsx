import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

export default function CursorGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 80, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Hide on mobile / touch devices
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  if (isTouchDevice) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[2] hidden md:block"
      style={{
        x: springX,
        y: springY,
        width: 300,
        height: 300,
        marginLeft: -150,
        marginTop: -150,
        background: 'radial-gradient(circle, rgba(255,45,94,0.06) 0%, rgba(255,143,163,0.03) 40%, transparent 70%)',
        borderRadius: '50%',
      }}
    />
  );
}
