"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setContent, setTrending, setRecommended } from "@/store/slices/contentSlice"
import Header from "@/components/layout/header"
import HeroSection from "@/components/sections/hero-section"
import ContentRow from "@/components/sections/content-row"
import MovieCard from "@/components/cards/movie-card"
import SeriesCard from "@/components/cards/series-card"
import SeriesInfoModal from "@/components/modals/series-info-modal"
import MovieInfoModal from "@/components/modals/movie-info-modal"
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
  const [seriesInfoOpen, setSeriesInfoOpen] = useState(false)
  const [infoItem, setInfoItem] = useState<any | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)

  useEffect(() => {
    // Simulate API calls
    const normalize = (item: any) => ({
      id: String(item.id),
      title: item.title || "Untitled",
      description: item.description || "",
      thumbnail: item.thumbnail || "/placeholder.jpg",
      backdrop: item.backdrop,
      type: item.type === "series" ? "series" : "movie",
      genre: item.genre || (Array.isArray(item.genres) ? item.genres[0] || "General" : "General"),
      genres: item.genres,
      year: Number(item.year) || new Date().getFullYear(),
      rating: item.rating || "PG-13",
      duration: item.duration || undefined,
      match: Number(item.match) || 95,
      // preserve full episodes array for series modals
      episodes: Array.isArray(item.episodes) ? item.episodes : undefined,
      seasons: item.seasons || undefined,
      ageLimit: item.ageLimit || undefined,
      cast: Array.isArray(item.cast) ? item.cast : undefined,
      crew: Array.isArray(item.crew) ? item.crew : undefined,
      youtubeId: item.youtubeId || undefined,
      videoUrl: item.videoUrl || undefined,
    })

    dispatch(setContent((mockContent as any[]).map(normalize) as any))
    dispatch(setTrending((mockTrending as any[]).map(normalize) as any))
    dispatch(setRecommended((mockRecommended as any[]).map(normalize) as any))
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
    setSeriesInfoOpen(true)
  }

  const handleMoreInfo = (item: any) => {
    setInfoItem(item)
    setInfoOpen(true)
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
            renderItem={(item, onPlay, onEpisodes) => (
              item.type === 'series' ? (
                <SeriesCard item={item} onPlay={onPlay} onShowEpisodes={onEpisodes} hoverContext="row" />
              ) : (
                <MovieCard item={item} onPlay={onPlay} onMoreInfo={handleMoreInfo} hoverContext="row" />
              )
            )}
          />
          <ContentRow
            title="⭐ Recommended For You"
            titleClass="text-2xl font-bold text-blue-100 mb-4"
            content={recommended}
            onVideoSelect={handleVideoSelect}
            onShowEpisodes={handleShowEpisodes}
            renderItem={(item, onPlay, onEpisodes) => (
              item.type === 'series' ? (
                <SeriesCard item={item} onPlay={onPlay} onShowEpisodes={onEpisodes} hoverContext="row" />
              ) : (
                <MovieCard item={item} onPlay={onPlay} onMoreInfo={handleMoreInfo} hoverContext="row" />
              )
            )}
          />
          {/* 🆕 New on UbiqEnt */}
          <ContentRow
            title="🆕 New on UbiqEnt"
            titleClass="text-2xl font-bold text-blue-100 mb-4"
            content={content.filter((item) => item.year >= new Date().getFullYear() - 1)}
            onVideoSelect={handleVideoSelect}
            onShowEpisodes={handleShowEpisodes}
            renderItem={(item, onPlay, onEpisodes) => (
              item.type === 'series' ? (
                <SeriesCard item={item} onPlay={onPlay} onShowEpisodes={onEpisodes} hoverContext="row" />
              ) : (
                <MovieCard item={item} onPlay={onPlay} onMoreInfo={handleMoreInfo} hoverContext="row" />
              )
            )}
          />
          <ContentRow
            title="🎬 Movies"
            titleClass="text-2xl font-bold text-blue-100 mb-4"
            content={content.filter((item) => item.type === "movie")}
            onVideoSelect={handleVideoSelect}
            renderItem={(item, onPlay) => (
              <MovieCard item={item} onPlay={onPlay} onMoreInfo={handleMoreInfo} hoverContext="row" />
            )}
          />
          <ContentRow
            title="📺 Series"
            titleClass="text-2xl font-bold text-blue-100 mb-4"
            content={content.filter((item) => item.type === "series")}
            onVideoSelect={handleVideoSelect}
            onShowEpisodes={handleShowEpisodes}
            renderItem={(item, onPlay, onEpisodes) => (
              <SeriesCard item={item} onPlay={onPlay} onShowEpisodes={onEpisodes} hoverContext="row" />
            )}
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
        <SeriesInfoModal
          item={selectedSeries}
          open={seriesInfoOpen}
          onClose={() => { setSeriesInfoOpen(false); setSelectedSeries(null) }}
          onPlayEpisode={handleVideoSelect}
        />
      )}

      {infoItem && (
        <MovieInfoModal
          item={infoItem}
          open={infoOpen}
          onClose={() => setInfoOpen(false)}
          onPlay={handleVideoSelect}
          onAddToList={() => {}}
          related={content.filter((m) => m.type === 'movie' && m.id !== infoItem.id).slice(0, 12)}
          renderRelatedCard={(rel) => (
            <MovieCard item={rel} onPlay={handleVideoSelect} onMoreInfo={handleMoreInfo} showHoverDescription={false} hoverContext="row" />
          )}
        />
      )}

      {/* 👇 Footer at bottom */}
      <Footer />
    </div>
  )
}
