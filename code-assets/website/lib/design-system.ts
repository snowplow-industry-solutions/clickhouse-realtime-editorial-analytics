/**
 * Design System Constants
 * Centralized design tokens and styling constants for the application
 */

// Spacing scale (based on Tailwind's spacing scale)
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const

// Border radius scale
export const borderRadius = {
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const

// Typography scale
export const typography = {
  sizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const

// Shadow scale
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const

// Animation durations
export const animations = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const

// Z-index scale
export const zIndex = {
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modal: '1040',
  popover: '1050',
  tooltip: '1060',
} as const

// Breakpoints (matching Tailwind's default breakpoints)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// Component-specific constants
export const components = {
  header: {
    height: '4rem', // 64px
    mobileHeight: '3.5rem', // 56px
  },
  sidebar: {
    width: '16rem', // 256px
    collapsedWidth: '4rem', // 64px
  },
  modal: {
    maxWidth: '32rem', // 512px
    maxHeight: '90vh',
  },
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
} as const

// Common class combinations
export const commonClasses = {
  // Button variants
  button: {
    primary: 'bg-brand-primary hover:bg-brand-primary-hover text-white font-medium py-2 px-4 rounded-md transition-colors',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-md transition-colors',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors',
  },
  // Input styles
  input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
  // Card styles
  card: 'bg-white rounded-lg shadow-md border border-gray-200',
  // Text styles
  text: {
    heading: 'text-gray-900 font-bold',
    body: 'text-gray-700',
    muted: 'text-gray-500',
    link: 'text-brand-primary hover:text-brand-primary-hover underline',
  },
} as const 