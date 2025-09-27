"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setContent, setTrending, setRecommended } from "@/store/slices/contentSlice"
import Header from "@/components/layout/header"
import HeroSection from "@/components/sections/hero-section"
import ContentRow from "@/components/sections/content-row"
import VideoModal from "@/components/modals/video-modal"
import EpisodesSection from "@/components/sections/episodes-section"
import AuthModal from "@/components/modals/auth-modal"
import Footer from "@/components/layout/footer"   // 👈 import your footer
import { mockContent, mockTrending, mockRecommended } from "@/lib/mock-data"

export default function HomePage() {
  const dispatch = useDispatch()
  const { content, trending, recommended } = useSelector((state: RootState) => state.content)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedSeries, setSelectedSeries] = useState<any>(null) // for episodes modal

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

  const handleShowEpisodes = (series: any) => {
    setSelectedSeries(series)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-blue-100 flex flex-col">
      {/* Sticky header with blur */}
      <Header />

      <main className="flex-1">
        {/* Hero section */}
        <HeroSection onPlayVideo={handleVideoSelect} />

        {/* Modern content rows */}
        <div className="px-2 md:px-6 space-y-10 pb-20 pt-10">
          <ContentRow
            title="🔥 Trending Now"
            titleClass="text-2xl font-bold text-blue-100 mb-4"
            content={trending}
            onVideoSelect={handleVideoSelect}
            onShowEpisodes={handleShowEpisodes}
          />
          <ContentRow
            title="⭐ Recommended For You"
            titleClass="text-2xl font-bold text-blue-100 mb-4"
            content={recommended}
            onVideoSelect={handleVideoSelect}
            onShowEpisodes={handleShowEpisodes}
          />
          {/* 🆕 New on UbiqEnt */}
          <ContentRow
            title="🆕 New on UbiqEnt"
            titleClass="text-2xl font-bold text-blue-100 mb-4"
            content={content.filter((item) => item.isNew)}
            onVideoSelect={handleVideoSelect}
            onShowEpisodes={handleShowEpisodes}
          />
          <ContentRow
            title="🎬 Movies"
            titleClass="text-2xl font-bold text-blue-100 mb-4"
            content={content.filter((item) => item.type === "movie")}
            onVideoSelect={handleVideoSelect}
          />
          <ContentRow
            title="📺 Series"
            titleClass="text-2xl font-bold text-blue-100 mb-4"
            content={content.filter((item) => item.type === "series")}
            onVideoSelect={handleVideoSelect}
            onShowEpisodes={handleShowEpisodes}
          />
        </div>
      </main>

      {/* Video Modal */}
      {selectedVideo && (isAuthenticated || !selectedVideo.isPremium) && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {/* Episodes Modal */}
      {selectedSeries && (
        <div className="px-2 md:px-6">
          <EpisodesSection
            series={selectedSeries}
            onClose={() => setSelectedSeries(null)}
            onPlayEpisode={handleVideoSelect}
          />
        </div>
      )}

      {/* 👇 Footer at bottom */}
      <Footer />
    </div>
  )
}
