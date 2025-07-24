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
    // Check if content requires authentication
    if (video.isPremium && !isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    setSelectedVideo(video)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // If there was a selected video waiting, play it now
    if (selectedVideo) {
      // Video will play since user is now authenticated
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <HeroSection onPlayVideo={handleVideoSelect} />
        <div className="px-4 md:px-8 lg:px-12 space-y-8 pb-20 pt-20">
          <ContentRow title="Trending Now" content={trending} onVideoSelect={handleVideoSelect} />
          <ContentRow title="Recommended for You" content={recommended} onVideoSelect={handleVideoSelect} />
          <ContentRow
            title="Popular Movies"
            content={content.filter((item) => item.type === "movie")}
            onVideoSelect={handleVideoSelect}
          />
          <ContentRow
            title="TV Series"
            content={content.filter((item) => item.type === "series")}
            onVideoSelect={handleVideoSelect}
          />
        </div>
      </main>

      {/* Video Modal - only show if authenticated or content is free */}
      {selectedVideo && (isAuthenticated || !selectedVideo.isPremium) && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}

      {/* Auth Modal - show when trying to access premium content */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} />}
    </div>
  )
}
