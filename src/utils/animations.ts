import type { Variants, Transition } from 'framer-motion';

// Smooth spring transition
export const smoothSpring: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 0.8,
};

export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 60,
  damping: 15,
  mass: 1,
};

export const snappySpring: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
  mass: 0.5,
};

// Fade up animation
export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Stagger children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

// Scale fade
export const scaleFadeVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Slide in from left
export const slideInLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Slide in from right
export const slideInRightVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Float animation for continuous motion
export const floatAnimation = {
  y: [-10, 10, -10],
  rotate: [-1, 1, -1],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

export const floatAnimationSlow = {
  y: [-8, 8, -8],
  rotate: [-0.5, 0.5, -0.5],
  transition: {
    duration: 8,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};
