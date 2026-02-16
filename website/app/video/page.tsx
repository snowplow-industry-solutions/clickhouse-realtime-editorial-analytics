"use client"

import { useEffect, useRef } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  initializeVideoTracking
} from "@/website/lib/snowplow"
import { startMediaTracking, trackMediaPlay, trackMediaPause, trackMediaEnd, trackMediaVolumeChange, trackMediaFullscreenChange, trackMediaSeekStart, trackMediaSeekEnd, updateMediaTracking } from '@snowplow/browser-plugin-media'

const VIDEO_ID = "customer_data_infra_demo"
const VIDEO_TITLE = "Snowplow Customer Data Infrastructure Demo"
const VIDEO_SRC = "/videos/snowplow_customer_data_infrastructure_1080p.mp4"

export default function VideoPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const percentBoundaries = [25, 50, 75, 100]
  const isVisible = useRef(false)
  const isSeeking = useRef(false)
  const router = useRouter()

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Initialize Snowplow tracking
      initializeVideoTracking(VIDEO_ID)
      
      startMediaTracking({
        id: VIDEO_ID,
        player: { playerType: 'org.whatwg-media_element' },
        boundaries: percentBoundaries
      })

      // Set page as visible after a short delay to avoid initial auto-play events
      const visibilityTimer = setTimeout(() => {
        isVisible.current = true
      }, 100)

      // Manual event listeners for media events
      const handlePlay = () => { 
        console.log('🎬 Video PLAY event fired', new Date().toISOString(), 'Paused:', video.paused, 'CurrentTime:', video.currentTime)
        // Only track play events when the page is visible to avoid initial auto-play events
        if (isVisible.current) {
          trackMediaPlay({ id: VIDEO_ID }) 
        }
      }
      const handlePause = () => {
        console.log('⏸️ Video PAUSE event fired', new Date().toISOString(), 'Paused:', video.paused, 'CurrentTime:', video.currentTime)
        trackMediaPause({ id: VIDEO_ID }) 
      }
      const handleEnded = () => {
        console.log('🏁 Video ENDED event fired', new Date().toISOString(), 'Paused:', video.paused, 'CurrentTime:', video.currentTime)
        trackMediaEnd({ id: VIDEO_ID }) 
      }
      const handleVolumeChange = () => {
        console.log('🔊 Video VOLUME CHANGE event fired', new Date().toISOString(), 'Volume:', video.volume)
        // Convert volume from 0.0-1.0 to 0-100 integer
        const volumePercent = Math.round(video.volume * 100)
        trackMediaVolumeChange({ id: VIDEO_ID, newVolume: volumePercent }) 
      }
      const handleFullscreenChange = () => {
        console.log('🖥️ Video FULLSCREEN CHANGE event fired', new Date().toISOString(), 'Fullscreen:', !!document.fullscreenElement)
        trackMediaFullscreenChange({ id: VIDEO_ID, fullscreen: !!document.fullscreenElement }) 
      }
      const handleTimeUpdate = () => {
        if (!video.duration) return
        // Update the media tracking with current playback state
        // This allows the plugin to automatically track percent progress events
        updateMediaTracking({
          id: VIDEO_ID,
          player: {
            currentTime: video.currentTime,
            duration: video.duration,
            paused: video.paused,
            volume: Math.round(video.volume * 100),
            fullscreen: !!document.fullscreenElement
          }
        })
      }

      const handleSeeking = () => {
        if (!isSeeking.current) {
          console.log('🔍 Video SEEK START event fired', new Date().toISOString(), 'CurrentTime:', video.currentTime)
          isSeeking.current = true
          trackMediaSeekStart({ id: VIDEO_ID })
        }
      }

      const handleSeeked = () => {
        if (isSeeking.current) {
          console.log('✅ Video SEEK END event fired', new Date().toISOString(), 'CurrentTime:', video.currentTime)
          isSeeking.current = false
          trackMediaSeekEnd({ id: VIDEO_ID })
        }
      }

      video.addEventListener('play', handlePlay)
      video.addEventListener('pause', handlePause)
      video.addEventListener('ended', handleEnded)
      video.addEventListener('volumechange', handleVolumeChange)
      video.addEventListener('fullscreenchange', handleFullscreenChange)
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('seeking', handleSeeking)
      video.addEventListener('seeked', handleSeeked)

      return () => {
        clearTimeout(visibilityTimer)
        isVisible.current = false
        isSeeking.current = false
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('pause', handlePause)
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('volumechange', handleVolumeChange)
        video.removeEventListener('fullscreenchange', handleFullscreenChange)
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('seeking', handleSeeking)
        video.removeEventListener('seeked', handleSeeked)
      }
    }
  }, [])

  const handleHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleHome}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Home
            </button>
            <h1 className="text-lg font-semibold text-gray-900">{VIDEO_TITLE}</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              controls
              muted
              className="absolute top-0 left-0 w-full h-full bg-black"
              title={VIDEO_TITLE}
            />
          </div>
        </div>
        
        {/* Video Description */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Video</h2>
          <p className="text-gray-600 leading-relaxed">
            Learn about Snowplow's customer data infrastructure and how it enables organizations 
            to collect, process, and analyze customer data at scale. This demo showcases the 
            key features and capabilities of our platform for building robust data pipelines.
          </p>
        </div>
      </div>
    </div>
  )
} 