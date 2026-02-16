"use client"

import { useState } from "react"
import Link from "next/link"
import { X, Sparkles, CheckCircle, LogIn } from "lucide-react"
import { useUser } from "../contexts/user-context"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  articlesRead: number
  isBlocking?: boolean
}

export default function SubscriptionModal({ isOpen, onClose, articlesRead, isBlocking = false }: SubscriptionModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [email, setEmail] = useState("")
  const { login } = useUser()

  const handleClose = () => {
    // Don't allow closing if this is a blocking modal
    if (isBlocking) {
      return;
    }
    
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      login(email.trim())
      // Clear modal qualification since user is now logged in
      localStorage.removeItem('qualifiedForSubscriptionModal')
      localStorage.removeItem('userArticleCount')
      onClose()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Don't allow backdrop clicks to close if this is blocking
    if (isBlocking) {
      return;
    }
    
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isBlocking 
          ? 'bg-white bg-opacity-95 backdrop-blur-md' 
          : 'bg-black bg-opacity-50 backdrop-blur-sm'
      } ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - only show if not blocking */}
        {!isBlocking && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Modal Content */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isBlocking ? "Subscribe to continue reading 📚" : "You're on a reading streak! 🔥"}
            </h2>
            <p className="text-gray-600">
              {isBlocking 
                ? `You've enjoyed ${articlesRead} free articles. Subscribe now for unlimited access to quality journalism.`
                : `You've read ${articlesRead} articles and clearly love great content.`
              }
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
              <span>Unlimited access to all premium articles</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
              <span>Ad-free reading experience</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
              <span>Weekly newsletter with exclusive insights</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
              <span>Early access to new articles and features</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              href="/subscribe"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 block text-center"
              onClick={() => {
                // Track subscription CTA click and clear modal qualification
                console.log('Subscription CTA clicked from modal')
                localStorage.removeItem('qualifiedForSubscriptionModal')
                localStorage.removeItem('userArticleCount')
                handleClose()
              }}
            >
              Start Your Subscription
            </Link>
            
            {/* Login Option */}
            {!showLoginForm ? (
              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 flex items-center justify-center"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Already have an account? Log in
              </button>
            ) : (
              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  autoFocus
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gray-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLoginForm(false)}
                    className="flex-1 bg-gray-100 text-gray-600 font-medium py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Only show "Continue Reading" button if not blocking */}
            {!isBlocking && (
              <button
                onClick={handleClose}
                className="w-full text-gray-500 font-medium py-2 px-6 rounded-lg hover:text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Continue Reading
              </button>
            )}
          </div>

          {/* Trust Signal */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Join thousands of readers who trust us for quality journalism
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}