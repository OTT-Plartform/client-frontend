"use client"

import { useState, useEffect, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setContent, setTrending, setRecommended } from "@/store/slices/contentSlice"
import Header from "@/components/layout/header"
import MoviesGrid from "@/components/sections/movies-grid"
import MovieCard from "@/components/cards/movie-card"
import MovieInfoModal from "@/components/modals/movie-info-modal"
import Footer from "@/components/layout/footer"
import { mockContent, mockTrending, mockRecommended } from "@/lib/mock-data"

export default function MoviesPage() {
  const dispatch = useDispatch()
  const { content, trending, recommended } = useSelector((state: RootState) => state.content)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [infoItem, setInfoItem] = useState<any | null>(null)

  // Filters state
  const [filters, setFilters] = useState({
    genre: "all",
    year: "all",
    rating: "all",
    language: "all",
    searchQuery: "",
  })

  useEffect(() => {
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
      episodes: Array.isArray(item.episodes) ? item.episodes.length : undefined,
      seasons: item.seasons || undefined,
      ageLimit: item.ageLimit || undefined,
      cast: Array.isArray(item.cast) ? item.cast : undefined,
      crew: Array.isArray(item.crew) ? item.crew : undefined,
      youtubeId: item.youtubeId || undefined,
      videoUrl: item.videoUrl || undefined,
    })

    dispatch(setContent(mockContent.map(normalize) as any))
    dispatch(setTrending(mockTrending.map(normalize) as any))
    dispatch(setRecommended(mockRecommended.map(normalize) as any))
  }, [dispatch])

  const handleVideoSelect = (video: any) => {
    if (video.isPremium && !isAuthenticated) return
    setSelectedVideo(video)
  }

  const handleMoreInfo = (item: any) => {
    setInfoItem(item)
    setInfoOpen(true)
  }

  const filteredMovies = useMemo(() => {
    let list = content.filter((item) => item.type === "movie")

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      list = list.filter((m) => (m.title || "").toLowerCase().includes(q))
    }

    if (filters.genre !== "all") list = list.filter((m) => Array.isArray(m.genres) ? m.genres.includes(filters.genre) : m.genre === filters.genre)
    if (filters.year !== "all") list = list.filter((m) => String(m.year) === filters.year)
    if (filters.rating !== "all") list = list.filter((m) => String(m.rating) === filters.rating)
    if (filters.language !== "all") list = list.filter((m) => (m as any).language === filters.language)

    return list
  }, [content, filters])

  const filteredTrending = trending.filter((t) => t.type === "movie" && filteredMovies.includes(t))
  const filteredRecommended = recommended.filter((r) => r.type === "movie" && filteredMovies.includes(r))

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-blue-100 flex flex-col">
      <Header />

      <main className="flex-1 px-2 md:px-6 pt-24 pb-20 space-y-10">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-blue-100 mb-6">🎬 Movies</h1>

        {/* Sticky Filters Bar */}
        <div className="sticky top-24 z-50 bg-blue-950/95 backdrop-blur-md p-4 rounded-md mb-6 flex flex-wrap gap-4 shadow-md">
          <input
            type="text"
            placeholder="Search movies..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
            className="px-3 py-2 rounded bg-blue-800 text-blue-100 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.genre}
            onChange={(e) => setFilters({...filters, genre: e.target.value})}
            className="px-3 py-2 rounded bg-blue-800 text-blue-100"
            aria-label="Filter by genre"
          >
            <option value="all">All Genres</option>
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Horror">Horror</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Thriller">Thriller</option>
            <option value="Documentary">Documentary</option>
            <option value="Music">Music</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="News">News</option>
            <option value="Sports">Sports</option>
            <option value="Kids">Kids</option>
            <option value="Reality">Reality</option>
            <option value="Platform Originals">Platform Originals</option>
            <option value="Comedy: Skits">Comedy: Skits</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Diaspora">Diaspora</option>
            <option value="Afrimation">Afrimation</option>
            <option value="Documentaries">Documentaries</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Exclusive">Exclusive</option>
            <option value="Classics">Classics</option>
          </select>
          <select
            value={filters.year}
            onChange={(e) => setFilters({...filters, year: e.target.value})}
            className="px-3 py-2 rounded bg-blue-800 text-blue-100"
            aria-label="Filter by year"
          >
            <option value="all">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          <select
            value={filters.rating}
            onChange={(e) => setFilters({...filters, rating: e.target.value})}
            className="px-3 py-2 rounded bg-blue-800 text-blue-100"
            aria-label="Filter by rating"
          >
            <option value="all">All Ratings</option>
            <option value="G">G</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
          </select>
          <select
            value={filters.language}
            onChange={(e) => setFilters({...filters, language: e.target.value})}
            className="px-3 py-2 rounded bg-blue-800 text-blue-100"
            aria-label="Filter by language"
          >
            <option value="all">All Languages</option>
            <option value="English">English</option>
            <option value="Shona">Shona</option>
            <option value="French">French</option>
            <option value="Zulu">Zulu</option>
            <option value="Portuguese">Portuguese</option>
            <option value="Swahili">Swahili</option>
          </select>
        </div>

        {/* All Movies Grid */}
        <div>
          <h2 className="text-2xl font-bold text-blue-100 mb-4">🎬 All Movies</h2>
          <MoviesGrid
            items={filteredMovies}
            pageSize={30}
            renderItem={(item) => (
              <MovieCard
                item={item}
                onPlay={handleVideoSelect}
                onAddToList={() => {}}
                onMoreInfo={handleMoreInfo}
              />
            )}
          />
        </div>
      </main>

      {/* Video Modal (existing full-screen player) */}
      {/* Keeping available but not auto-opened from info modal; open on Play */}
      {/* Add your existing VideoModal here if desired */}

      {/* Info Modal - Netflix style */}
      {infoItem && (
        <MovieInfoModal
          item={infoItem}
          open={infoOpen}
          onClose={() => setInfoOpen(false)}
          onPlay={handleVideoSelect}
          onAddToList={() => {}}
          related={filteredMovies.filter((m) => m.id !== infoItem.id).slice(0, 12)}
          renderRelatedCard={(rel) => (
            <MovieCard item={rel} onPlay={handleVideoSelect} onMoreInfo={handleMoreInfo} showHoverDescription={false} />
          )}
        />
      )}

      <Footer />
    </div>
  )
}
