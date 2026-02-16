"use client"

import { useState, useEffect } from "react"
import { X, Settings, Shield, Target, Cookie, BarChart3 } from "lucide-react"
import { siteConfig } from "@/website/lib/config"
import { 
  trackConsentAllowEvent, 
  trackConsentDenyEvent, 
  trackConsentSelectedEvent,
  trackCmpVisibleEvent 
} from "@/website/lib/snowplow"
import { 
  ConsentPreferences, 
  getConsentPreferences, 
  saveConsentPreferences 
} from "@/website/lib/consent"

export default function ConsentManager() {
  const [showConsent, setShowConsent] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    preferences: false
  })

  // Check if consent has been given on component mount
  useEffect(() => {
    // Load saved preferences if they exist
    const savedPreferences = getConsentPreferences()
    if (savedPreferences) {
      setPreferences(savedPreferences)
    }

    // Listen for custom event to show consent manager
    const handleShowConsentManager = () => {
      setShowConsent(true)
      // Track CMP visible event
      trackCmpVisibleEvent()
    }

    window.addEventListener('showConsentManager', handleShowConsentManager)

    // Cleanup event listener
    return () => {
      window.removeEventListener('showConsentManager', handleShowConsentManager)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    }
    setPreferences(allAccepted)
    saveConsentPreferences(allAccepted)
    setShowConsent(false)
    
    // Track consent allow event
    trackConsentAllowEvent(["necessary", "analytics", "marketing", "preferences"])
  }

  const handleRejectAll = () => {
    const minimalConsent: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    }
    setPreferences(minimalConsent)
    saveConsentPreferences(minimalConsent)
    setShowConsent(false)
    
    // Track consent deny event
    trackConsentDenyEvent(["necessary"])
  }

  const handleSavePreferences = () => {
    saveConsentPreferences(preferences)
    setShowConsent(false)
    setShowSettings(false)
    
    // Track consent selected event with current preferences
    const consentScopes = Object.entries(preferences)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
    trackConsentSelectedEvent(consentScopes)
  }

  const saveConsent = (consentPrefs: ConsentPreferences) => {
    saveConsentPreferences(consentPrefs)
  }

  const handlePreferenceChange = (key: keyof ConsentPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Only render the modal when consent manager should be visible
  if (!showConsent && !showSettings) {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-brand-primary" />
              <h2 className="text-xl font-semibold text-gray-900">
                {showSettings ? "Cookie Settings" : "Privacy & Cookie Consent"}
              </h2>
            </div>
            <button
              onClick={() => {
                setShowConsent(false)
                setShowSettings(false)
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {!showSettings ? (
              // Initial consent popup
              <>
                <p className="text-gray-600 mb-6">
                  We use cookies and similar technologies to provide, protect, and improve our services. 
                  By clicking "Accept All", you consent to our use of cookies for analytics, marketing, and preferences.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Cookie className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Necessary Cookies</h3>
                      <p className="text-sm text-gray-600">Required for the website to function properly</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Analytics Cookies</h3>
                      <p className="text-sm text-gray-600">Help us understand how visitors interact with our website</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Marketing Cookies</h3>
                      <p className="text-sm text-gray-600">Used to deliver personalized advertisements</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Customize
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-4 py-2 text-white bg-brand-primary hover:bg-brand-primary-hover rounded-md transition-colors"
                  >
                    Accept All
                  </button>
                </div>
              </>
            ) : (
              // Detailed settings
              <>
                <p className="text-gray-600 mb-6">
                  Customize your cookie preferences. You can change these settings at any time.
                </p>
                
                <div className="space-y-4 mb-6">
                  {/* Necessary Cookies - Always enabled */}
                  <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Cookie className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Necessary Cookies</h3>
                        <p className="text-sm text-gray-600">Required for the website to function properly</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.necessary}
                        disabled
                        className="h-4 w-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Analytics Cookies</h3>
                        <p className="text-sm text-gray-600">Help us understand how visitors interact with our website</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Marketing Cookies</h3>
                        <p className="text-sm text-gray-600">Used to deliver personalized advertisements</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                        className="h-4 w-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Preferences Cookies */}
                  <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Settings className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">Preference Cookies</h3>
                        <p className="text-sm text-gray-600">Remember your settings and preferences</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.preferences}
                        onChange={(e) => handlePreferenceChange('preferences', e.target.checked)}
                        className="h-4 w-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setShowSettings(false)
                      setShowConsent(false)
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 px-4 py-2 text-white bg-brand-primary hover:bg-brand-primary-hover rounded-md transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              By using our website, you agree to our{" "}
              <a href="#" className="text-brand-primary hover:underline">Privacy Policy</a> and{" "}
              <a href="#" className="text-brand-primary hover:underline">Cookie Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}