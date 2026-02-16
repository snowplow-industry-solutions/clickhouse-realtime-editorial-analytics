"use client"

import { ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getRandomAdvertisement, getRandomAdvertisementByCategory } from "@/website/lib/config"
import { trackAdImpression, trackAdClick } from "@/website/lib/snowplow-tracking"
import { useEffect, useRef, useState } from "react"

interface AdvertisementProps {
  type?: "banner" | "sponsored" | "sidebar"
  className?: string
  category?: string
}

export default function Advertisement({ type, className = "", category }: AdvertisementProps) {
  const [advertisement] = useState(() =>
    category
      ? getRandomAdvertisementByCategory(category, type)
      : getRandomAdvertisement(type)
  )
  
  const adRef = useRef<HTMLDivElement>(null)
  const displayType = type || "banner"
  
  if (!advertisement) {
    return null // Don't render anything if no ad is available
  }

  // Track ad impression when component mounts
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackAdImpression({
              ad_id: advertisement.id || `ad-${displayType}-${Date.now()}`,
              placement: displayType === 'banner' ? 'header' : displayType === 'sponsored' ? 'content_body' : 'sidebar',
              type: 'banner',
              position: 1,
              cost: advertisement.cost,
              cost_model: advertisement.cost_model,
              campaign_id: advertisement.campaign_id,
              advertiser_id: advertisement.advertiser_id
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (adRef.current) {
      observer.observe(adRef.current);
    }

    return () => observer.disconnect();
  }, [advertisement.id, displayType]);

  if (displayType === "banner") {
    return (
      <div ref={adRef} className={`bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">SPONSORED</p>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">{advertisement.title}</h4>
            <p className="text-xs text-gray-600">
              {advertisement.description}
            </p>
          </div>
          <div className="ml-4">
            <Image
              src={advertisement.image}
              alt={advertisement.title}
              className="w-20 h-15 object-cover rounded"
              width={80}
              height={60}
            />
          </div>
        </div>
        <Link href={advertisement.ctaLink}>
          <button 
            className="mt-3 text-xs text-blue-600 hover:text-blue-800 flex items-center transition-colors"
            onClick={() => trackAdClick({
              ad_id: advertisement.id || `ad-${displayType}-${Date.now()}`,
              placement: 'header',
              type: 'banner',
              position: 1,
              cost: advertisement.cost,
              cost_model: advertisement.cost_model,
              campaign_id: advertisement.campaign_id,
              advertiser_id: advertisement.advertiser_id
            })}
          >
            {advertisement.ctaText} <ExternalLink className="h-3 w-3 ml-1" />
          </button>
        </Link>
      </div>
    )
  }

  if (displayType === "sponsored") {
    return (
      <div ref={adRef} className={`bg-white border-l-4 border-purple-200 p-4 rounded-r-lg ${className}`}>
        <p className="text-xs text-gray-500 mb-2">SPONSORED CONTENT</p>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          {advertisement.title}
        </h4>
        <p className="text-xs text-gray-600 mb-3">
          {advertisement.description}
        </p>
        <Link href={advertisement.ctaLink}>
          <button 
            className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center transition-colors"
            onClick={() => trackAdClick({
              ad_id: advertisement.id || `ad-${displayType}-${Date.now()}`,
              placement: 'content_body',
              type: 'sponsored_content',
              position: 1,
              cost: advertisement.cost,
              cost_model: advertisement.cost_model,
              campaign_id: advertisement.campaign_id,
              advertiser_id: advertisement.advertiser_id
            })}
          >
            {advertisement.ctaText} <ExternalLink className="h-3 w-3 ml-1" />
          </button>
        </Link>
      </div>
    )
  }

  // Default sidebar type
  return (
    <div ref={adRef} className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <p className="text-xs text-gray-500 mb-3">ADVERTISEMENT</p>
      <div className="text-center">
        <Image
          src={advertisement.image}
          alt={advertisement.title}
          className="w-full h-24 object-cover rounded-lg mb-3"
          width={400}
          height={96}
        />
        <h4 className="text-sm font-semibold text-gray-900 mb-2">{advertisement.title}</h4>
        <p className="text-xs text-gray-600 mb-3">
          {advertisement.description}
        </p>
        <Link href={advertisement.ctaLink}>
          <button 
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium py-2 px-4 rounded transition-colors"
            onClick={() => trackAdClick({
              ad_id: advertisement.id || `ad-${displayType}-${Date.now()}`,
              placement: 'sidebar',
              type: 'banner',
              position: 1,
              cost: advertisement.cost,
              cost_model: advertisement.cost_model,
              campaign_id: advertisement.campaign_id,
              advertiser_id: advertisement.advertiser_id
            })}
          >
            {advertisement.ctaText}
          </button>
        </Link>
      </div>
    </div>
  )
}
