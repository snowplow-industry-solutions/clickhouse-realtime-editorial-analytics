import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date consistently for server and client rendering
 * This prevents hydration errors by ensuring the same output on both server and client
 * Always uses 'en-US' locale to avoid locale-specific formatting differences
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Use consistent locale and options to prevent hydration mismatches
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  return dateObj.toLocaleDateString('en-US', defaultOptions)
}

/**
 * Format date for short display (e.g., "Jan 15, 2024")
 */
export function formatDateShort(date: string | Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format date for long display (e.g., "January 15, 2024")
 */
export function formatDateLong(date: string | Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get category color classes based on category name
 * Centralized function to replace duplicate logic across components
 */
export function getCategoryColor(category: string): string {
  const categoryMap: Record<string, string> = {
    technology: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    business: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    ai: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
  
  const normalizedCategory = category.toLowerCase().trim()
  return categoryMap[normalizedCategory] || categoryMap.default
}

/**
 * Get brand color classes for consistent styling
 */
export const brandColors = {
  primary: "text-brand-primary hover:text-brand-primary-hover",
  bgPrimary: "bg-brand-primary hover:bg-brand-primary-hover",
  borderPrimary: "border-brand-primary",
  bgPrimaryLight: "bg-brand-primary/10",
  textPrimary: "text-brand-primary"
} as const

/**
 * Build a URL with UTM parameters for marketing tracking
 */
export function buildUrlWithUtm(url: string, utmParams: {
  source: string
  medium: string
  campaign: string
  term?: string
  content?: string
}): string {
  const urlObj = new URL(url, window.location.origin)
  
  // Add UTM parameters
  urlObj.searchParams.set('utm_source', utmParams.source)
  urlObj.searchParams.set('utm_medium', utmParams.medium)
  urlObj.searchParams.set('utm_campaign', utmParams.campaign)
  
  if (utmParams.term) {
    urlObj.searchParams.set('utm_term', utmParams.term)
  }
  
  if (utmParams.content) {
    urlObj.searchParams.set('utm_content', utmParams.content)
  }
  
  return urlObj.toString()
}
