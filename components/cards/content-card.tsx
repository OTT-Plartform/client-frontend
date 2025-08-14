"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Lock, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"

interface ContentCardProps {
  content: any
  onPlay: () => void
}

export default function ContentCard({ content, onPlay }: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const handleCardClick = () => {
    if (content.type === "series" || content.type === "podcast") {
      router.push(`/series/${content.id}`)
    } else {
      router.push(`/movie/${content.id}`)
    }
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPlay()
  }

  return (
    <div
      className="relative w-64 group cursor-pointer transition-shadow duration-300 shadow-md hover:shadow-2xl rounded-xl flex flex-col bg-gray-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Thumbnail Section */}
      <div className="relative rounded-t-xl overflow-hidden aspect-[16/9] bg-gray-800">
        <img
          src={content.thumbnail || "/placeholder.svg"}
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-active:scale-105"
        />

        {/* Premium Badge */}
        {content.isPremium && (
          <div className="absolute top-2 left-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Premium
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            className="bg-white/20 text-white hover:bg-white/30 rounded-full backdrop-blur-sm w-14 h-14"
            onClick={handlePlayClick}
          >
            {content.isPremium && !isAuthenticated ? (
              <Lock className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 fill-current" />
            )}
          </Button>
        </div>
      </div>

      {/* Content Info at Bottom */}
      <div className="p-4 text-white flex flex-col">
        <h3
          className="font-semibold text-lg truncate"
          title={content.title}
        >
          {content.title}
        </h3>
        <div className="flex items-center text-sm text-gray-400 space-x-2 mt-2 truncate">
          <span>{content.year}</span>
          {content.genres && content.genres.length > 0 && (
            <>
              <span>•</span>
              <span className="truncate">{content.genres[0]}</span>
            </>
          )}
          <span>•</span>
          <span className="bg-gray-600 text-white px-3 py-1 rounded select-none text-xs">
            {content.rating}
          </span>
        </div>
      </div>
    </div>
  )
}
