/**
 * Reusable animation variants for Framer Motion
 * Respects user's prefers-reduced-motion setting
 */

import { Variants, Transition } from 'framer-motion';

// Check if user prefers reduced motion
const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Helper to create transition with reduced motion support
const createTransition = (duration: number, ease: any = 'easeOut', delay: number = 0): Transition => {
  if (shouldReduceMotion()) {
    return { duration: 0, delay: 0 };
  }
  return { duration, ease, delay };
};

// Viewport options for consistent scroll animations
export const viewportOptions = {
  once: true,
  margin: '-80px',
};

/**
 * Fade in with upward slide
 */
export const fadeSlideUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: shouldReduceMotion() ? 0 : 24 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: createTransition(0.6, 'easeOut') 
  },
};

/**
 * Simple fade in
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: createTransition(0.6, 'easeOut') 
  },
};

/**
 * Scale in with fade
 */
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: shouldReduceMotion() ? 1 : 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: createTransition(0.5, 'easeOut') 
  },
};

/**
 * Slide in from left with fade
 */
export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: shouldReduceMotion() ? 0 : -30 
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: createTransition(0.6, 'easeOut') 
  },
};

/**
 * Slide in from right with fade
 */
export const slideInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: shouldReduceMotion() ? 0 : 30 
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: createTransition(0.6, 'easeOut') 
  },
};

/**
 * Container for staggered children animations
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: shouldReduceMotion() ? 0 : 0.1,
    },
  },
};

/**
 * Item variant for staggered animations (used as child of staggerContainer)
 */
export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: shouldReduceMotion() ? 0 : 24 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: createTransition(0.6, 'easeOut') 
  },
};

/**
 * Helper to modify any variant for reduced motion
 * Returns a copy with all durations set to 0 and transforms removed
 */
export const reducedVariant = (variant: Variants): Variants => {
  if (!shouldReduceMotion()) return variant;
  
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0 } },
  };
};
