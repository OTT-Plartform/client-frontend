"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, ThumbsUp, ChevronDown, ExternalLink, Lock } from "lucide-react"
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
      className="relative w-full group cursor-pointer transition-shadow duration-300 shadow-md hover:shadow-2xl rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-800">
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

        {/* YouTube Badge */}
        {content.isYouTube && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
            YouTube
          </div>
        )}

        {/* Free Badge */}
        {!content.isPremium && (
          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
            Free
          </div>
        )}

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            className="bg-white/20 text-white hover:bg-white/30 rounded-full backdrop-blur-sm w-12 h-12"
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

      {/* Content Info */}
      <div className="mt-3 px-1">
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">{content.title}</h3>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-green-500 text-xs font-semibold">{content.match}% Match</span>
          <span className="bg-gray-600 text-white px-1.5 py-0.5 rounded text-xs">{content.rating}</span>
          <span className="text-gray-400 text-xs">{content.year}</span>
          {content.isPremium && (
            <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 text-xs">
              Premium
            </Badge>
          )}
        </div>
        {content.duration && <span className="text-gray-400 text-xs">{content.duration}</span>}
      </div>

      {/* Expanded Card on Hover - Only on larger screens */}
      {isHovered && (
        <div className="hidden lg:block absolute top-0 left-0 w-80 bg-gray-900 rounded-lg shadow-2xl z-20 transform scale-110 transition-transform duration-300">
          <div className="relative">
            <img
              src={content.thumbnail || "/placeholder.svg"}
              alt={content.title}
              className="w-full h-44 object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-lg" />

            {/* Premium Badge */}
            {content.isPremium && (
              <div className="absolute top-2 left-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Premium
              </div>
            )}

            {/* YouTube Badge */}
            {content.isYouTube && (
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                YouTube
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <Button
                size="icon"
                className="bg-white text-black hover:bg-gray-200 rounded-full"
                onClick={handlePlayClick}
              >
                {content.isPremium && !isAuthenticated ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 fill-current" />
                )}
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-gray-400 text-white hover:bg-white/10 rounded-full bg-transparent"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-gray-400 text-white hover:bg-white/10 rounded-full bg-transparent"
              >
                <ThumbsUp className="w-4 h-4" />
              </Button>
              {content.isYouTube && (
                <Button
                  size="icon"
                  variant="outline"
                  className="border-gray-400 text-white hover:bg-white/10 rounded-full bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(`https://www.youtube.com/watch?v=${content.youtubeId}`, "_blank")
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="icon"
                variant="outline"
                className="border-gray-400 text-white hover:bg-white/10 rounded-full ml-auto bg-transparent"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-white font-semibold mb-2">{content.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-500 text-sm font-semibold">{content.match}% Match</span>
              <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs">{content.rating}</span>
              <span className="text-gray-400 text-sm">{content.year}</span>
              {content.duration && <span className="text-gray-400 text-sm">{content.duration}</span>}
            </div>
            <p className="text-gray-400 text-sm line-clamp-3">{content.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {content.genres?.slice(0, 3).map((genre: string, index: number) => (
                <span key={index} className="text-gray-400 text-xs">
                  {genre}
                  {index < 2 ? " •" : ""}
                </span>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              {content.isPremium ? (
                <div className="text-xs text-yellow-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Premium Content
                </div>
              ) : (
                <div className="text-xs text-green-400">✓ Free to watch</div>
              )}
              {content.isYouTube && <div className="text-xs text-red-400">▶ Available on YouTube</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
