/**
 * Custom hook for scroll-triggered animations with Framer Motion
 * Provides consistent viewport settings and reduced motion support
 */

import { useEffect, useState, useRef } from 'react';
import { useInView, useAnimation } from 'framer-motion';

export interface ScrollAnimationOptions {
  delay?: number;
  threshold?: number;
  once?: boolean;
}

/**
 * Hook that triggers animation when element enters viewport
 * Respects user's prefers-reduced-motion setting
 */
export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
  const { delay = 0, threshold = 0.1, once = true } = options;
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const controls = useAnimation();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Trigger animation when in view
  useEffect(() => {
    if (isInView) {
      if (prefersReducedMotion) {
        // Instant animation for reduced motion
        controls.start('visible');
      } else {
        // Delayed animation
        const timer = setTimeout(() => {
          controls.start('visible');
        }, delay * 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [isInView, controls, delay, prefersReducedMotion]);

  return { ref, controls, isInView, prefersReducedMotion };
};
