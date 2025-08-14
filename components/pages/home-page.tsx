"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setContent, setTrending, setRecommended } from "@/store/slices/contentSlice"
import Header from "@/components/layout/header"
import HeroSection from "@/components/sections/hero-section"
import ContentRow from "@/components/sections/content-row"
import VideoModal from "@/components/modals/video-modal"
import AuthModal from "@/components/modals/auth-modal"
import { mockContent, mockTrending, mockRecommended } from "@/lib/mock-data"

export default function HomePage() {
  const dispatch = useDispatch()
  const { content, trending, recommended } = useSelector((state: RootState) => state.content)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    // Simulate API calls
    dispatch(setContent(mockContent))
    dispatch(setTrending(mockTrending))
    dispatch(setRecommended(mockRecommended))
  }, [dispatch])

  const handleVideoSelect = (video: any) => {
    if (video.isPremium && !isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    setSelectedVideo(video)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
  }

  return (
    <div className="min-h-screen bg-blue-950 text-blue-100">
      <Header />
      <main>
        <HeroSection onPlayVideo={handleVideoSelect} />

        {/* Thumbnail-focused content sections with horizontal scroll and arrows */}
        <div className="px-2 md:px-4 lg:px-6 space-y-6 pb-10 pt-10">
          <ContentRow
            title="Trending"
            titleClass="text-lg font-semibold text-blue-100"
            content={trending}
            onVideoSelect={handleVideoSelect}
          />
          <ContentRow
            title="Recommended"
            titleClass="text-lg font-semibold text-blue-100"
            content={recommended}
            onVideoSelect={handleVideoSelect}
          />
          <ContentRow
            title="Movies"
            titleClass="text-lg font-semibold text-blue-100"
            content={content.filter((item) => item.type === "movie")}
            onVideoSelect={handleVideoSelect}
          />
          <ContentRow
            title="Series"
            titleClass="text-lg font-semibold text-blue-100"
            content={content.filter((item) => item.type === "series")}
            onVideoSelect={handleVideoSelect}
          />
        </div>
      </main>

      {/* Modals */}
      {selectedVideo && (isAuthenticated || !selectedVideo.isPremium) && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}
