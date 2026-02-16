/**
 * Consent management utilities
 * Handles consent state, validation, and utility functions
 */

export interface ConsentPreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

/**
 * Check if user has given consent for analytics tracking
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  
  const consentGiven = localStorage.getItem("consent-given")
  if (!consentGiven) return false
  
  const savedPreferences = localStorage.getItem("consent-preferences")
  if (!savedPreferences) return false
  
  try {
    const preferences = JSON.parse(savedPreferences)
    return preferences.analytics === true
  } catch (error) {
    console.error("Error parsing consent preferences:", error)
    return false
  }
}

/**
 * Check if user has given consent for marketing tracking
 */
export function hasMarketingConsent(): boolean {
  if (typeof window === 'undefined') return false
  
  const consentGiven = localStorage.getItem("consent-given")
  if (!consentGiven) return false
  
  const savedPreferences = localStorage.getItem("consent-preferences")
  if (!savedPreferences) return false
  
  try {
    const preferences = JSON.parse(savedPreferences)
    return preferences.marketing === true
  } catch (error) {
    console.error("Error parsing consent preferences:", error)
    return false
  }
}

/**
 * Get all consent preferences
 */
export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null
  
  const savedPreferences = localStorage.getItem("consent-preferences")
  if (!savedPreferences) return null
  
  try {
    return JSON.parse(savedPreferences)
  } catch (error) {
    console.error("Error parsing consent preferences:", error)
    return null
  }
}

/**
 * Save consent preferences to localStorage
 */
export function saveConsentPreferences(preferences: ConsentPreferences): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem("consent-given", "true")
  localStorage.setItem("consent-preferences", JSON.stringify(preferences))
  localStorage.setItem("consent-date", new Date().toISOString())
}

/**
 * Check if consent has been given
 */
export function hasConsentBeenGiven(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem("consent-given") === "true"
}

/**
 * Clear all consent data
 */
export function clearConsentData(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem("consent-given")
  localStorage.removeItem("consent-preferences")
  localStorage.removeItem("consent-date")
} 