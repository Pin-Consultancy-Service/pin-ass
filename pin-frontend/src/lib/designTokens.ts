/**
 * Design System Tokens
 * Centralized color, typography, spacing, and component tokens
 * Used throughout the student dashboard redesign
 */

export const designTokens = {
  // Primary Colors
  colors: {
    primary: '#008751',
    darkGreen: '#1a5c2a',
    darkGreenAccent: '#005c38',
    yellow: '#facc15',
    
    // Light Mode Palette
    light: {
      // Background
      bg: '#ffffff',
      bgSecondary: '#f3f4f6',
      surface: '#ffffff',
      
      // Cards & UI Elements
      cardBg: '#ffffff',
      cardBorder: 'rgba(0,0,0,0.07)',
      
      // Text
      textPrimary: '#111827',
      textSecondary: '#374151',
      textMuted: '#9ca3af',
      
      // Components
      divider: 'rgba(0,0,0,0.06)',
      rowHover: '#f9fafb',
      inputBg: '#ffffff',
      inputBorder: 'rgba(0,0,0,0.12)',
      barBg: '#f3f4f6',
      
      // Pill System
      pillBg: 'rgba(0,0,0,0.05)',
      pillBorder: 'rgba(0,0,0,0.10)',
      pillHover: 'rgba(0,0,0,0.07)',
      
      // Sidebar
      sidebarBg: '#ffffff',
      
      // Nav states
      navIdleIconBg: 'rgba(0,0,0,0.05)',
      navIdleIconColor: 'rgba(0,0,0,0.50)',
      navIdleLabel: 'rgba(0,0,0,0.65)',
      navIdleHover: 'rgba(0,0,0,0.05)',
      navActiveBg: 'rgba(0,135,81,0.12)',
      navActiveBorder: 'rgba(0,135,81,0.35)',
      navActiveLabel: '#004d2e',
      
      // Section labels
      sectionLabel: 'rgba(0,0,0,0.30)',
      
      // Status
      successBg: '#f0fdf4',
      successText: '#15803d',
      warningBg: '#fffbeb',
      warningText: '#b45309',
      infoBg: '#eff6ff',
      infoText: '#1d4ed8',
      dangerBg: '#fef2f2',
      dangerText: '#b91c1c',
      purpleBg: '#f5f3ff',
      purpleText: '#6d28d9',
    },
    
    dark: {
      // Background
      bg: '#001a0e',
      bgSecondary: '#002814',
      surface: 'rgba(255,255,255,0.06)',
      
      // Cards & UI Elements
      cardBg: 'rgba(255,255,255,0.06)',
      cardBorder: 'rgba(255,255,255,0.10)',
      
      // Text
      textPrimary: '#ffffff',
      textSecondary: 'rgba(255,255,255,0.65)',
      textMuted: 'rgba(255,255,255,0.40)',
      
      // Components
      divider: 'rgba(255,255,255,0.07)',
      rowHover: 'rgba(255,255,255,0.04)',
      inputBg: 'rgba(255,255,255,0.07)',
      inputBorder: 'rgba(255,255,255,0.15)',
      barBg: 'rgba(255,255,255,0.10)',
      
      // Pill System
      pillBg: 'rgba(255,255,255,0.08)',
      pillBorder: 'rgba(255,255,255,0.12)',
      pillHover: 'rgba(255,255,255,0.14)',
      
      // Sidebar
      sidebarBg: '#0d1f14',
      
      // Nav states
      navIdleIconBg: 'rgba(255,255,255,0.07)',
      navIdleIconColor: 'rgba(255,255,255,0.55)',
      navIdleLabel: 'rgba(255,255,255,0.70)',
      navIdleHover: 'rgba(255,255,255,0.07)',
      navActiveBg: 'rgba(0,135,81,0.30)',
      navActiveBorder: 'rgba(0,135,81,0.35)',
      navActiveLabel: '#ffffff',
      
      // Section labels
      sectionLabel: 'rgba(255,255,255,0.28)',
      
      // Status
      successBg: 'rgba(34,197,94,0.18)',
      successText: '#86efac',
      warningBg: 'rgba(251,191,36,0.18)',
      warningText: '#fde68a',
      infoBg: 'rgba(59,130,246,0.18)',
      infoText: '#93c5fd',
      dangerBg: 'rgba(239,68,68,0.18)',
      dangerText: '#fca5a5',
      purpleBg: 'rgba(139,92,246,0.18)',
      purpleText: '#c4b5fd',
    },
  },

  // Typography
  typography: {
    // Font families (use with Tailwind font-[lexend] and font-[syne] classes)
    fontFamily: {
      body: 'var(--font-lexend, "Lexend", sans-serif)',
      display: 'var(--font-syne, "Syne", sans-serif)',
    },
    
    // Font sizes and weights
    pageHeading: {
      fontSize: '26px',
      fontWeight: '700',
      family: 'syne',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
    },
    
    cardHeading: {
      fontSize: '17px',
      fontWeight: '600',
      family: 'syne',
      lineHeight: '1.4',
    },
    
    statNumber: {
      fontSize: '42px',
      fontWeight: '700',
      family: 'syne',
      lineHeight: '1',
    },
    
    body: {
      fontSize: '15px',
      fontWeight: '400',
      family: 'lexend',
      lineHeight: '1.5',
    },
    
    bodyBold: {
      fontSize: '15px',
      fontWeight: '600',
      family: 'lexend',
      lineHeight: '1.5',
    },
    
    tableCell: {
      fontSize: '15px',
      fontWeight: '600',
      family: 'lexend',
      lineHeight: '1.5',
    },
    
    tableCellSecondary: {
      fontSize: '14px',
      fontWeight: '400',
      family: 'lexend',
      lineHeight: '1.5',
    },
    
    badge: {
      fontSize: '13px',
      fontWeight: '600',
      family: 'lexend',
      lineHeight: '1.4',
    },
    
    label: {
      fontSize: '12px',
      fontWeight: '500',
      family: 'lexend',
      lineHeight: '1.4',
    },
    
    caption: {
      fontSize: '11px',
      fontWeight: '400',
      family: 'lexend',
      lineHeight: '1.4',
    },
  },

  // Layout
  layout: {
    sidebarWidth: 'w-64',
    sidebarWidthCollapsed: 'w-20',
    headerHeight: 'h-[4.79rem]',
    mainContentMargin: 'ml-64',
    mainContentMarginCollapsed: 'ml-20',
    navItemHeight: 'h-12',
    navItemRounded: 'rounded-[12px]',
    iconSquareSize: 'w-8 h-8',
    iconSquareRounded: 'rounded-[9px]',
    cardRadius: 'rounded-2xl',
    largeCardRadius: 'rounded-3xl',
  },

  // Gradients
  gradients: {
    lightBg: 'linear-gradient(160deg, #ffffff 0%, #f3f4f6 60%, #ffffff 100%)',
    darkBg: 'linear-gradient(160deg, #152D6E 0%, #1E3A8A 50%, #152D6E 100%)',
    sidebarDarkOverlay: 'linear-gradient(160deg, rgba(30,58,138,0.97) 0%, rgba(21,45,110,0.95) 40%, rgba(30,58,138,0.90) 70%, rgba(21,45,110,0.96) 100%)',
    bannerGradient: 'linear-gradient(120deg, #1a5c2a 0%, #008751 60%, #005c38 100%)',
  },

  // Content overlay opacity
  contentOverlay: {
    light: 'rgba(255,255,255,0.6)',
    dark: 'rgba(0,30,15,0.55)',
  },

  // Component Styles
  button: {
    primary: {
      height: 'h-11',
      padding: 'px-5',
      rounded: 'rounded-xl',
      fontSize: '15px',
      fontWeight: '600',
    },
    secondary: {
      height: 'h-11',
      padding: 'px-5',
      rounded: 'rounded-xl',
      fontSize: '15px',
      fontWeight: '600',
    },
    small: {
      height: 'h-9',
      padding: 'px-4',
      rounded: 'rounded-xl',
      fontSize: '13px',
      fontWeight: '600',
    },
  },

  // Badge styles (use with status bg/text colors)
  badge: {
    padding: 'px-3 py-1',
    rounded: 'rounded-full',
    fontSize: '13px',
    fontWeight: '600',
  },

  // Input styles
  input: {
    minHeight: 'h-[42px]',
    padding: 'px-4',
    rounded: 'rounded-xl',
    fontSize: '14px',
    fontWeight: '400',
  },

  // Sidebar photo background
  sidebarPhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',

  // Accent colors for status badges
  statusColors: {
    success: {
      light: { bg: '#f0fdf4', text: '#15803d' },
      dark: { bg: 'rgba(34,197,94,0.18)', text: '#86efac' },
    },
    warning: {
      light: { bg: '#fffbeb', text: '#b45309' },
      dark: { bg: 'rgba(251,191,36,0.18)', text: '#fde68a' },
    },
    info: {
      light: { bg: '#eff6ff', text: '#1d4ed8' },
      dark: { bg: 'rgba(59,130,246,0.18)', text: '#93c5fd' },
    },
    danger: {
      light: { bg: '#fef2f2', text: '#b91c1c' },
      dark: { bg: 'rgba(239,68,68,0.18)', text: '#fca5a5' },
    },
    purple: {
      light: { bg: '#f5f3ff', text: '#6d28d9' },
      dark: { bg: 'rgba(139,92,246,0.18)', text: '#c4b5fd' },
    },
  },
};

/**
 * Helper function to get mode-specific token values
 */
export const getToken = (tokenPath: string, isDark: boolean): string => {
  const keys = tokenPath.split('.');
  let value: any = designTokens;
  
  for (const key of keys) {
    if (key === 'mode') {
      value = isDark ? value.dark : value.light;
    } else {
      value = value[key];
    }
  }
  
  return value;
};

/**
 * Color palette for easy access
 */
export const colorPalette = {
  green: {
    primary: '#008751',
    dark: '#1a5c2a',
    accent: '#005c38',
    light: '#e8f5ec',
    lightLight: 'rgba(0,135,81,0.20)',
    border: '#b6dfc0',
    borderDark: 'rgba(0,135,81,0.35)',
    text: '#1a5c2a',
    textLight: '#86efac',
  },
  yellow: {
    accent: '#facc15',
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};
