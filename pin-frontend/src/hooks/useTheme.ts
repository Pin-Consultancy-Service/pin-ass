'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * useTheme Hook
 * Manages dark/light mode state with localStorage persistence and custom event support
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read saved theme from localStorage on mount
    const saved = localStorage.getItem('theme');
    const prefersDark = saved === 'dark' || 
      (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDark(prefersDark);
    applyTheme(prefersDark);
    setMounted(true);

    // Listen for custom theme toggle events from other components
    const handleThemeToggle = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.isDarkMode !== undefined) {
        setIsDark(customEvent.detail.isDarkMode);
        applyTheme(customEvent.detail.isDarkMode);
      }
    };

    window.addEventListener('themeToggle', handleThemeToggle);
    return () => window.removeEventListener('themeToggle', handleThemeToggle);
  }, []);

  const applyTheme = useCallback((dark: boolean) => {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    applyTheme(newTheme);
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(
      new CustomEvent('themeToggle', {
        detail: { isDarkMode: newTheme },
      })
    );
  }, [isDark, applyTheme]);

  return {
    isDark,
    mounted,
    toggleTheme,
  };
}

/**
 * Helper function to get current theme from localStorage
 */
export function getCurrentTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('theme');
  return saved === 'dark' ? 'dark' : 'light';
}

/**
 * Helper function to check if dark mode is active
 */
export function isDarkMode(): boolean {
  return getCurrentTheme() === 'dark';
}
