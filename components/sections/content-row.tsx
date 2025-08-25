"use client"

import { ChevronLeft, ChevronRight, Play, List } from "lucide-react"
import { useRef } from "react"

interface ContentRowProps {
  title: string
  titleClass?: string
  content: any[]
  onVideoSelect: (video: any) => void
  onShowEpisodes?: (series: any) => void // ✅ optional prop for series
}

export default function ContentRow({
  title,
  titleClass,
  content,
  onVideoSelect,
  onShowEpisodes,
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const { clientWidth } = scrollRef.current
    scrollRef.current.scrollBy({
      left: direction === "left" ? -clientWidth : clientWidth,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative">
      {/* Title */}
      <h2 className={titleClass}>{title}</h2>

      {/* Scrollable row */}
      <div className="relative group">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Thumbnails container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll scrollbar-hide gap-4 py-4 px-1 scroll-smooth"
        >
          {content.map((item) => (
            <div
              key={item.id}
              className="relative group/item min-w-[150px] sm:min-w-[180px] md:min-w-[220px] cursor-pointer rounded-lg overflow-hidden shadow-md hover:scale-105 transition"
            >
              {/* Thumbnail */}
              <img
                src={item.thumbnail || "/placeholder.jpg"}
                alt={item.title}
                className="w-full h-40 object-cover"
                onClick={() => onVideoSelect(item)}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/item:opacity-100 flex flex-col items-center justify-center gap-2 transition">
                {/* Play button */}
                <button
                  onClick={() => onVideoSelect(item)}
                  className="flex items-center gap-2 px-3 py-1 bg-white text-black rounded-md text-sm font-medium hover:bg-gray-200 transition"
                >
                  <Play className="w-4 h-4" />
                  Play
                </button>

                {/* Show episodes (only for series) */}
                {item.type === "series" && onShowEpisodes && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onShowEpisodes(item)
                    }}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
                  >
                    <List className="w-4 h-4" />
                    Episodes
                  </button>
                )}
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-xs sm:text-sm">
                {item.title}
              </div>
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  )
}
