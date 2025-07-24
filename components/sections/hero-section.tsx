"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Info, Volume2, VolumeX } from "lucide-react"
import { mockHeroContent } from "@/lib/mock-data"

interface HeroSectionProps {
  onPlayVideo: (video: any) => void
}

export default function HeroSection({ onPlayVideo }: HeroSectionProps) {
  const [currentHero, setCurrentHero] = useState(0)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % mockHeroContent.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const hero = mockHeroContent[currentHero]

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <img src={hero.backdrop || "/placeholder.svg"} alt={hero.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{hero.title}</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6 line-clamp-3">{hero.description}</p>
            <div className="flex items-center gap-2 mb-8">
              <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-semibold">{hero.rating}</span>
              <span className="text-gray-300">{hero.year}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300">{hero.duration}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300">{hero.genre}</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 font-semibold"
                onClick={() => onPlayVideo(hero)}
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Play
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-400 text-white hover:bg-white/10 bg-transparent"
              >
                <Info className="w-5 h-5 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Volume Control */}
      <div className="absolute bottom-24 right-8 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/50 text-white hover:bg-black/70 rounded-full"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>

      {/* Hero Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {mockHeroContent.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${index === currentHero ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentHero(index)}
          />
        ))}
      </div>
    </div>
  )
}
