"use client"

import { useMemo, useState } from "react"
import { Play, Info, Clock, Shield, BookmarkPlus } from "lucide-react"

interface MovieCardProps {
  item: any
  onPlay: (item: any) => void
  onAddToList?: (item: any) => void
  onMoreInfo?: (item: any) => void
  showHoverDescription?: boolean
  hoverContext?: "grid" | "row"
}

export default function MovieCard({ item, onPlay, onAddToList, onMoreInfo, showHoverDescription = true, hoverContext = "grid" }: MovieCardProps) {
  const [hovered, setHovered] = useState(false)

  const isNew = useMemo(() => {
    // naive tag: mark some ids as new for demo. In real app, use addedAt
    const numeric = Number(item.id)
    return Number.isFinite(numeric) ? numeric % 5 === 0 : false
  }, [item.id])

  return (
    <div
      className={`group relative rounded-xl overflow-hidden border border-blue-800 transition-all duration-200 will-change-transform shadow-lg ${hoverContext === 'grid' ? 'hover:shadow-2xl hover:z-20' : 'hover:shadow-xl hover:z-10'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Base sizing: landscape card (w:h = 4:3) */}
      <div className="aspect-[4/3] w-full">
        {/* Background image layer */}
        <img
          src={item.thumbnail || "/placeholder.jpg"}
          alt={item.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Dim overlay + text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
        {isNew && (
          <div className="absolute left-2 top-2 text-[10px] px-2 py-0.5 rounded-full bg-green-600 text-white font-semibold shadow">
            New
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <div className="text-blue-50 text-base sm:text-lg font-bold line-clamp-1 drop-shadow">{item.title}</div>
          <div className="mt-1 flex items-center gap-3 text-[11px] sm:text-sm text-blue-200/90">
            {item.duration && (
              <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{item.duration}</span>
            )}
            {item.rating && (
              <span className="inline-flex items-center gap-1"><Shield className="w-3 h-3" />{item.rating}</span>
            )}
          </div>
        </div>
      </div>

      {/* Hover expand */}
      <div
        className={`absolute inset-0 scale-100 ${hoverContext === 'grid' ? 'group-hover:scale-[1.15]' : 'group-hover:scale-[1.07]'} group-hover:-translate-y-0.5 transition-transform duration-200`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/85 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlay(item)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-200"
              aria-label="Play"
            >
              <Play className="w-4 h-4" />
            </button>
            {onAddToList && (
              <button
                onClick={() => onAddToList(item)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-700/80 text-white hover:bg-blue-600"
                aria-label="Add to List"
              >
                <BookmarkPlus className="w-4 h-4" />
              </button>
            )}
            {onMoreInfo && (
              <button
                onClick={() => onMoreInfo(item)}
                className="ml-auto inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-700/80 text-white hover:bg-blue-600"
                aria-label="More info"
              >
                <Info className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="mt-3">
            <div className="text-blue-50 text-sm sm:text-base font-semibold line-clamp-1">{item.title}</div>
            {showHoverDescription && (
              <div className="text-blue-200 text-xs sm:text-sm line-clamp-2">{item.description || ""}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


