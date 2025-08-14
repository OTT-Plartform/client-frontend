"use client"

import { useState, useEffect, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setContent } from "@/store/slices/contentSlice"
import Header from "@/components/layout/header"
import ContentGrid from "@/components/sections/content-grid"
import ContentFilters from "@/components/sections/content-filters"
import VideoModal from "@/components/modals/video-modal"
import { mockMovies } from "@/lib/mock-data"

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
    dispatch(setContent(mockMovies))
  }, [dispatch])

  const filteredMovies = useMemo(() => {
    let filtered = mockMovies.filter((movie) => movie.type === "movie")

    if (filters.searchQuery) {
      filtered = filtered.filter(
        (movie) =>
          movie.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          movie.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
    }

    if (filters.genre !== "all") {
      filtered = filtered.filter((movie) => movie.genres?.includes(filters.genre) || movie.genre === filters.genre)
    }

    if (filters.year !== "all") {
      const yearRange = filters.year.split("-")
      if (yearRange.length === 2) {
        const startYear = Number.parseInt(yearRange[0])
        const endYear = Number.parseInt(yearRange[1])
        filtered = filtered.filter((movie) => movie.year >= startYear && movie.year <= endYear)
      } else {
        filtered = filtered.filter((movie) => movie.year.toString() === filters.year)
      }
    }

    if (filters.rating !== "all") {
      filtered = filtered.filter((movie) => movie.rating === filters.rating)
    }

    switch (filters.sortBy) {
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "year":
        filtered.sort((a, b) => b.year - a.year)
        break
      case "rating":
        filtered.sort((a, b) => b.match - a.match)
        break
      default:
        filtered.sort((a, b) => b.match - a.match)
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
