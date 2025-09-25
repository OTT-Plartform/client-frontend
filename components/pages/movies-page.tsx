"use client"

import { useState, useEffect, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setContent } from "@/store/slices/contentSlice"
import Header from "@/components/layout/header"
import ContentGrid from "@/components/sections/content-grid"
import ContentFilters from "@/components/sections/content-filters"
import VideoModal from "@/components/modals/video-modal"
import { mockContent } from "@/lib/mock-data"

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
  })

  useEffect(() => {
    // Load movies data
    dispatch(setContent(mockContent))
  }, [dispatch])

  const filteredMovies = useMemo(() => {
    const list = Array.isArray(mockContent) ? mockContent : []
    let filtered = list.filter((item: any) => item?.type === "movie")

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      filtered = filtered.filter((movie: any) => (movie?.title || "").toLowerCase().includes(q))
    }

    if (filters.genre !== "all") {
      filtered = filtered.filter((movie: any) => {
        const fromArray = Array.isArray(movie?.genres) && movie.genres.includes(filters.genre)
        const fromSingle = typeof movie?.genre === "string" && movie.genre === filters.genre
        return fromArray || fromSingle
      })
    }

    if (filters.year !== "all") {
      filtered = filtered.filter((movie: any) => {
        const yearValue = Number.parseInt(String(movie?.year ?? ""))
        if (!Number.isFinite(yearValue)) return false
        const parts = filters.year.split("-")
        if (parts.length === 2) {
          const start = Number.parseInt(parts[0])
          const end = Number.parseInt(parts[1])
          if (Number.isFinite(start) && Number.isFinite(end)) {
            return yearValue >= start && yearValue <= end
          }
          return true
        }
        return String(yearValue) === filters.year
      })
    }

    if (filters.rating !== "all") {
      filtered = filtered.filter((movie: any) => movie?.rating === filters.rating)
    }

    switch (filters.sortBy) {
      case "title":
        filtered.sort((a: any, b: any) => (a?.title || "").localeCompare(b?.title || ""))
        break
      case "year":
        filtered.sort((a: any, b: any) => (b?.year || 0) - (a?.year || 0))
        break
      case "rating":
        filtered.sort((a: any, b: any) => (b?.match || 0) - (a?.match || 0))
        break
      default:
        filtered.sort((a: any, b: any) => (b?.match || 0) - (a?.match || 0))
    }

    return filtered
  }, [filters])

  return (
    <div className="min-h-screen bg-blue-950 text-blue-100">
      <Header />
      <div className="pt-20 px-4 md:px-8 lg:px-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">Movies</h1>
          <p className="text-blue-300">Discover amazing movies from our collection</p>
        </div>

        <ContentFilters
          filters={filters}
          onFiltersChange={setFilters}
          contentType="movies"
          totalResults={filteredMovies.length}
        />

        <ContentGrid content={filteredMovies} onVideoSelect={setSelectedVideo} isLoading={false} />
      </div>

      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  )
}
