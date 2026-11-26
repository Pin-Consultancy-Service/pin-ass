/**
 * Reusable animation variants for Framer Motion
 * Respects user's prefers-reduced-motion setting
 */

import { Variants, Transition } from 'framer-motion';

// Viewport options for consistent scroll animations
export const viewportOptions = {
  once: true,
  margin: '-80px',
};

/**
 * Helper to create transition with reduced motion support
 * @param reduced - Whether reduced motion is preferred
 */
const createTransition = (duration: number, ease: any = 'easeOut', delay: number = 0, reduced: boolean = false): Transition => {
  if (reduced) {
    return { duration: 0, delay: 0 };
  }
  return { duration, ease, delay };
};

/**
 * Factory function to create animation variants with reduced motion support
 * @param reduced - Whether user prefers reduced motion
 */
export const getVariants = (reduced: boolean = false) => ({
  /**
   * Fade in with upward slide
   */
  fadeSlideUp: {
    hidden: { 
      opacity: 0, 
      y: reduced ? 0 : 24 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: createTransition(0.6, 'easeOut', 0, reduced) 
    },
  } as Variants,

  /**
   * Simple fade in
   */
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: createTransition(0.6, 'easeOut', 0, reduced) 
    },
  } as Variants,

  /**
   * Scale in with fade
   */
  scaleIn: {
    hidden: { 
      opacity: 0, 
      scale: reduced ? 1 : 0.95 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: createTransition(0.5, 'easeOut', 0, reduced) 
    },
  } as Variants,

  /**
   * Slide in from left with fade
   */
  slideInLeft: {
    hidden: { 
      opacity: 0, 
      x: reduced ? 0 : -30 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: createTransition(0.6, 'easeOut', 0, reduced) 
    },
  } as Variants,

  /**
   * Slide in from right with fade
   */
  slideInRight: {
    hidden: { 
      opacity: 0, 
      x: reduced ? 0 : 30 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: createTransition(0.6, 'easeOut', 0, reduced) 
    },
  } as Variants,

  /**
   * Container for staggered children animations
   */
  staggerContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.1,
      },
    },
  } as Variants,

  /**
   * Item variant for staggered animations (used as child of staggerContainer)
   */
  staggerItem: {
    hidden: { 
      opacity: 0, 
      y: reduced ? 0 : 24 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: createTransition(0.6, 'easeOut', 0, reduced) 
    },
  } as Variants,
});

// Export default variants for components that don't use the context
const defaultVariants = getVariants(false);
export const fadeSlideUp = defaultVariants.fadeSlideUp;
export const fadeIn = defaultVariants.fadeIn;
export const scaleIn = defaultVariants.scaleIn;
export const slideInLeft = defaultVariants.slideInLeft;
export const slideInRight = defaultVariants.slideInRight;
export const staggerContainer = defaultVariants.staggerContainer;
export const staggerItem = defaultVariants.staggerItem;
