import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const blobs = [
  {
    className:
      'w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gradient-to-br from-berry-200/25 to-berry-300/10',
    style: { top: '5%', left: '-10%' },
    animate: { x: [0, 30, -20, 0], y: [0, -30, 20, 0] },
    duration: 22,
  },
  {
    className:
      'w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-bl from-strawberry-light/20 to-cream-200/15',
    style: { top: '40%', right: '-12%' },
    animate: { x: [0, -25, 30, 0], y: [0, 25, -20, 0] },
    duration: 28,
  },
  {
    className:
      'hidden md:block w-[350px] h-[350px] bg-gradient-to-tr from-berry-100/25 to-cream-300/10',
    style: { bottom: '5%', left: '30%' },
    animate: { x: [0, 20, -15, 0], y: [0, -20, 25, 0] },
    duration: 26,
  },
  {
    className:
      'w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-gradient-to-bl from-berry-300/15 to-strawberry-glow/10',
    style: { top: '60%', left: '10%' },
    animate: { x: [0, -15, 20, 0], y: [0, 15, -10, 0] },
    duration: 32,
  },
];

export default function FloatingBlobs() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 25, mass: 1 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25, mass: 1 });

  const [windowSize, setWindowSize] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const parallaxX = useTransform(springX, [0, windowSize.width], [40, -40]);
  const parallaxY = useTransform(springY, [0, windowSize.height], [40, -40]);

  return (
    <motion.div
      className="fixed inset-[-10%] w-[120%] h-[120%] overflow-hidden pointer-events-none z-0"
      style={{ willChange: 'auto', x: parallaxX, y: parallaxY }}
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${blob.className}`}
          style={{
            ...blob.style,
            filter: 'blur(80px)',
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
          animate={blob.animate}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
}
