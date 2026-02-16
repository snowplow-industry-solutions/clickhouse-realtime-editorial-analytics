"use client"

import { useEffect, useState } from "react"
import RecommendationCard from "./recommendation-card"
import NewsletterSignup from "./newsletter-signup"
import Advertisement from "./advertisement"
import { getRecommendations } from "@/website/lib/recommendations"
import { siteConfig } from "@/website/lib/config"
import { Article } from "@/website/lib/config"

interface SidebarProps {
  className?: string
  recommendationCount?: number
  showNewsletter?: boolean
  category?: string
}

export default function Sidebar({ 
  className = "", 
  recommendationCount = 4,
  showNewsletter = true,
  category
}: SidebarProps) {
  const [recommendations, setRecommendations] = useState<Article[]>(() => 
    getRecommendations(recommendationCount)
  )
  const [isLoading, setIsLoading] = useState(false)
  const [useClickHouse, setUseClickHouse] = useState(true)

  useEffect(() => {
    if (!useClickHouse) return

    const fetchClickHouseRecommendations = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/recommendations?count=${recommendationCount}`)
        const result = await response.json()
        
        console.log(result.data);
        if (result.success && result.data) {
          setRecommendations(result.data)
        } else {
          console.warn('ClickHouse recommendations failed, using fallback')
          setUseClickHouse(false)
        }
      } catch (error) {
        console.warn('Failed to fetch ClickHouse recommendations:', error)
        setUseClickHouse(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClickHouseRecommendations()
  }, [recommendationCount, useClickHouse])

  return (
    <div className={`lg:col-span-1 ${className}`}>
      <div className="sticky top-8 space-y-6">
        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recommended Reading</h3>
            {useClickHouse && (
              <div className="flex items-center text-xs text-gray-500">
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
                }`}></div>
                {isLoading ? 'Loading...' : 'Live'}
              </div>
            )}
          </div>
          <div className="space-y-4">
            {recommendations.map((item) => (
              <RecommendationCard key={item.id} recommendation={item} />
            ))}
          </div>
        </div>

        {/* Sidebar Advertisement */}
        {siteConfig.features.advertising && (
          <Advertisement type="sidebar" category={category} />
        )}

        {/* Newsletter Signup */}
        {showNewsletter && siteConfig.features.newsletter && (
          <NewsletterSignup />
        )}
      </div>
    </div>
  )
} 