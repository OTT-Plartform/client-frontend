"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, SlidersHorizontal } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ContentFiltersProps {
  filters: {
    genre: string
    year: string
    rating: string
    sortBy: string
    searchQuery: string
  }
  onFiltersChange: (filters: any) => void
  contentType: "movies" | "series"
  totalResults: number
}

const movieGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
]

const seriesGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Reality",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Talk Show",
]

const yearRanges = [
  { label: "2020s", value: "2020-2024" },
  { label: "2010s", value: "2010-2019" },
  { label: "2000s", value: "2000-2009" },
  { label: "1990s", value: "1990-1999" },
  { label: "1980s", value: "1980-1989" },
]

const ratings = ["G", "PG", "PG-13", "R", "TV-G", "TV-PG", "TV-14", "TV-MA"]

export default function ContentFilters({ filters, onFiltersChange, contentType, totalResults }: ContentFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const genres = contentType === "movies" ? movieGenres : seriesGenres

  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      genre: "all",
      year: "all",
      rating: "all",
      sortBy: "popularity",
      searchQuery: "",
    })
  }

  const hasActiveFilters =
    filters.genre !== "all" || filters.year !== "all" || filters.rating !== "all" || filters.searchQuery !== ""

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={`Search ${contentType}...`}
          value={filters.searchQuery}
          onChange={(e) => updateFilter("searchQuery", e.target.value)}
          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-red-600"
        />
        {filters.searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white h-6 w-6"
            onClick={() => updateFilter("searchQuery", "")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 bg-transparent">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && <span className="ml-2 bg-red-600 text-white rounded-full w-2 h-2"></span>}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Genre Filter */}
                    <div className="space-y-2">
                      <Label className="text-white">Genre</Label>
                      <Select value={filters.genre} onValueChange={(value) => updateFilter("genre", value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="All Genres" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="all" className="text-white">
                            All Genres
                          </SelectItem>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre} className="text-white">
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Year Filter */}
                    <div className="space-y-2">
                      <Label className="text-white">Release Year</Label>
                      <Select value={filters.year} onValueChange={(value) => updateFilter("year", value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="All Years" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="all" className="text-white">
                            All Years
                          </SelectItem>
                          {yearRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value} className="text-white">
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rating Filter */}
                    <div className="space-y-2">
                      <Label className="text-white">Rating</Label>
                      <Select value={filters.rating} onValueChange={(value) => updateFilter("rating", value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="All Ratings" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="all" className="text-white">
                            All Ratings
                          </SelectItem>
                          {ratings.map((rating) => (
                            <SelectItem key={rating} value={rating} className="text-white">
                              {rating}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-2">
                      <Label className="text-white">Sort By</Label>
                      <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="popularity" className="text-white">
                            Popularity
                          </SelectItem>
                          <SelectItem value="title" className="text-white">
                            Title A-Z
                          </SelectItem>
                          <SelectItem value="year" className="text-white">
                            Release Date
                          </SelectItem>
                          <SelectItem value="rating" className="text-white">
                            Rating
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="border-gray-600 text-white hover:bg-gray-700 bg-transparent"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="text-gray-400 text-sm">
          {totalResults} {contentType} found
        </div>
      </div>
    </div>
  )
}
