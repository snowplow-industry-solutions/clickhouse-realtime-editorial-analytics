"use client"

import { useState } from "react"
import { Mail, X } from "lucide-react"
import { trackNewsletterSignup } from "@/website/lib/snowplow-tracking"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [showPopup, setShowPopup] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      // Track newsletter signup
      trackNewsletterSignup();
      
      setShowPopup(true)
      setEmail("")
    }
  }

  const closePopup = () => {
    setShowPopup(false)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 w-full max-w-md">
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-brand-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Stay Updated</h3>
            <p className="text-gray-600 text-sm">Get the latest news and insights delivered to your inbox.</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-2">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-medium rounded-md transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-custom flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 relative animate-in fade-in duration-200">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you for subscribing!</h3>
              <p className="text-gray-600 mb-6">
                You&apos;ll receive the latest news and insights from The Plow directly in your inbox.
              </p>

              <button
                onClick={closePopup}
                className="px-6 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-md transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
