"use client"

import { useEffect, useState } from "react"
import PageLayout from "../components/page-layout"
import MainContentLayout from "../components/main-content-layout"
import PageHeader from "../components/page-header"
import Link from "next/link"
import { siteConfig } from "@/website/lib/config"

export default function AdvertiserRedirectPage() {
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer)
          window.location.href = "/"
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdownTimer)
  }, [])

  return (
    <PageLayout>
      <MainContentLayout sidebar={null}>
        <PageHeader 
          title={`Thank you for visiting ${siteConfig.brand.name}!`}
          description="You are being redirected..."
          className="text-center"
        />
        
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-md p-12 max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-brand-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
                <span className="text-sm text-gray-500">
                  Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 mb-4">
                If you are not redirected automatically, please click the button below.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary-hover transition-colors"
              >
                Return to {siteConfig.brand.name}
              </Link>
            </div>
          </div>
        </div>
      </MainContentLayout>
    </PageLayout>
  )
} 