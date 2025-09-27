"use client"

import { useState, useEffect, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setContent } from "@/store/slices/contentSlice"
import Header from "@/components/layout/header"
import ContentFilters from "@/components/sections/content-filters"
import VideoModal from "@/components/modals/video-modal"
import { mockContent } from "@/lib/mock-data"
import Footer from "../layout/footer"

export default function MoviesPage() {
  const dispatch = useDispatch()
  const { content } = useSelector((state: RootState) => state.content)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [filters, setFilters] = useState({
    genre: "all",
    year: "all",
    rating: "all",
    sortBy: "popularity",
    searchQuery: "",
    language: "all",
    duration: "all",
    director: "all",
    cast: "all",
  })
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    dispatch(setContent(mockContent))
  }, [dispatch])

  const filteredMovies = useMemo(() => {
    const list = Array.isArray(mockContent) ? mockContent : []
    let filtered = list.filter((item: any) => item?.type === "movie")

    const q = filters.searchQuery.toLowerCase()
    if (filters.searchQuery) filtered = filtered.filter(movie => (movie?.title || "").toLowerCase().includes(q))

    if (filters.genre !== "all") filtered = filtered.filter(movie => Array.isArray(movie?.genres) ? movie.genres.includes(filters.genre) : movie.genre === filters.genre)
    if (filters.year !== "all") filtered = filtered.filter(movie => {
      const yearValue = Number(movie?.year)
      if (filters.year.includes("-")) {
        const [start, end] = filters.year.split("-").map(Number)
        return yearValue >= start && yearValue <= end
      }
      return yearValue === Number(filters.year)
    })
    if (filters.rating !== "all") filtered = filtered.filter(movie => movie?.rating === filters.rating)
    if (filters.language !== "all") filtered = filtered.filter(movie => movie?.language === filters.language)
    if (filters.duration !== "all") filtered = filtered.filter(movie => {
      const runtime = Number(movie?.duration)
      if (filters.duration.startsWith("<")) return runtime < Number(filters.duration.slice(1))
      if (filters.duration.startsWith(">")) return runtime > Number(filters.duration.slice(1))
      if (filters.duration.includes("-")) {
        const [min, max] = filters.duration.split("-").map(Number)
        return runtime >= min && runtime <= max
      }
      return true
    })
    if (filters.director !== "all") filtered = filtered.filter(movie => movie?.director?.toLowerCase() === filters.director.toLowerCase())
    if (filters.cast !== "all") filtered = filtered.filter(movie => Array.isArray(movie?.cast) && movie.cast.includes(filters.cast))

    switch (filters.sortBy) {
      case "title":
        filtered.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""))
        break
      case "year":
        filtered.sort((a, b) => (b?.year || 0) - (a?.year || 0))
        break
      case "rating":
        filtered.sort((a, b) => (b?.match || 0) - (a?.match || 0))
        break
      case "duration":
        filtered.sort((a, b) => (b?.duration || 0) - (a?.duration || 0))
        break
      default:
        filtered.sort((a, b) => (b?.match || 0) - (a?.match || 0))
    }

    return filtered
  }, [filters])

  return (
    <div className="min-h-screen bg-blue-950 text-blue-100">
      <Header />

      <div className="pt-20 px-4 md:px-8 lg:px-12 flex flex-col md:flex-row">
        {/* Filters Sidebar (Desktop) */}
        <div className="hidden md:block md:w-72 md:pr-6 sticky top-20 self-start">
          <ContentFilters
            filters={filters}
            onFiltersChange={setFilters}
            contentType="movies"
            totalResults={filteredMovies.length}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filters Button */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="bg-blue-700 text-blue-100 px-4 py-2 rounded"
            >
              Filters
            </button>
          </div>

          {/* Mobile Filters Modal */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-start pt-20">
              <div className="bg-blue-900 p-4 rounded-lg w-11/12 max-w-md">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="mb-4 text-blue-300 underline"
                >
                  Close
                </button>
                <ContentFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  contentType="movies"
                  totalResults={filteredMovies.length}
                />
              </div>
            </div>
          )}

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">Movies</h1>
            <p className="text-blue-300">
              Discover {filteredMovies.length} movies from our collection
            </p>
          </div>

          {/* Movie Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMovies.map((movie: any) => (
              <div
                key={movie.id}
                className="relative group cursor-pointer rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedVideo(movie)}
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-60 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 text-sm text-blue-100">
                  <h2 className="font-semibold">{movie.title}</h2>
                  <p className="text-xs">{movie.year} • {movie.rating}</p>
                  <p className="text-xs truncate">{Array.isArray(movie.genres) ? movie.genres.join(", ") : movie.genre}</p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Play Trailer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
      {/* 👇 Footer at bottom */}
      <Footer />
    </div>
  )
}
