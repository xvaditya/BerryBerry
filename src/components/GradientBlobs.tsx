import { motion } from 'framer-motion';

const blobs = [
  {
    className: 'w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-berry-200/30 to-berry-300/15',
    style: { top: '5%', left: '-5%' },
    animate: {
      x: [0, 20, -15, 0],
      y: [0, -25, 15, 0],
    },
    duration: 25,
  },
  {
    className: 'w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-gradient-to-bl from-strawberry-light/20 to-cream-200/20',
    style: { top: '30%', right: '-8%' },
    animate: {
      x: [0, -20, 25, 0],
      y: [0, 20, -20, 0],
    },
    duration: 30,
  },
  {
    className: 'hidden md:block w-[350px] h-[350px] bg-gradient-to-tr from-berry-100/30 to-berry-200/15',
    style: { bottom: '10%', left: '20%' },
    animate: {
      x: [0, 25, -10, 0],
      y: [0, -15, 20, 0],
    },
    duration: 28,
  },
];

export default function GradientBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ willChange: 'auto' }}>
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${blob.className}`}
          style={{
            ...blob.style,
            filter: 'blur(60px)',
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
    </div>
  );
}
