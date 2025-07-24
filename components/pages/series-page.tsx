"use client"

import { useState, useEffect, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setContent } from "@/store/slices/contentSlice"
import Header from "@/components/layout/header"
import ContentGrid from "@/components/sections/content-grid"
import ContentFilters from "@/components/sections/content-filters"
import VideoModal from "@/components/modals/video-modal"
import { mockSeries } from "@/lib/mock-data"

export default function SeriesPage() {
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
    // Load series data
    dispatch(setContent(mockSeries))
  }, [dispatch])

  const filteredSeries = useMemo(() => {
    let filtered = mockSeries.filter((series) => series.type === "series")

    // Apply search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(
        (series) =>
          series.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          series.description.toLowerCase().includes(filters.searchQuery.toLowerCase()),
      )
    }

    // Apply genre filter
    if (filters.genre !== "all") {
      filtered = filtered.filter((series) => series.genres?.includes(filters.genre) || series.genre === filters.genre)
    }

    // Apply year filter
    if (filters.year !== "all") {
      const yearRange = filters.year.split("-")
      if (yearRange.length === 2) {
        const startYear = Number.parseInt(yearRange[0])
        const endYear = Number.parseInt(yearRange[1])
        filtered = filtered.filter((series) => series.year >= startYear && series.year <= endYear)
      } else {
        filtered = filtered.filter((series) => series.year.toString() === filters.year)
      }
    }

    // Apply rating filter
    if (filters.rating !== "all") {
      filtered = filtered.filter((series) => series.rating === filters.rating)
    }

    // Apply sorting
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
      default: // popularity
        filtered.sort((a, b) => b.match - a.match)
    }

    return filtered
  }, [filters])

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-20 px-4 md:px-8 lg:px-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">TV Shows</h1>
          <p className="text-gray-400">Explore our extensive collection of TV series</p>
        </div>

        <ContentFilters
          filters={filters}
          onFiltersChange={setFilters}
          contentType="series"
          totalResults={filteredSeries.length}
        />

        <ContentGrid content={filteredSeries} onVideoSelect={setSelectedVideo} isLoading={false} />
      </div>

      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  )
}
