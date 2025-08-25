"use client"

import { Play, Info } from "lucide-react"

interface HeroSectionProps {
  onPlayVideo: (video: any) => void
}

const featuredVideo = {
  id: "hero-1",
  title: "The Dark Adventure",
  description:
    "An epic journey across worlds, where heroes face impossible odds to save humanity.",
  banner: "/hero-banner.jpg", // Put this in /public
  isPremium: false,
}

export default function HeroSection({ onPlayVideo }: HeroSectionProps) {
  return (
    <section className="relative h-[80vh] flex items-center justify-start text-left">
      {/* Background banner */}
      <img
        src={featuredVideo.banner}
        alt={featuredVideo.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          {featuredVideo.title}
        </h1>
        <p className="text-base md:text-lg text-blue-200 mb-6 line-clamp-3">
          {featuredVideo.description}
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => onPlayVideo(featuredVideo)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-300 transition shadow-md"
          >
            <Play className="w-5 h-5" /> Play
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-600/70 text-white font-semibold rounded-lg hover:bg-gray-500/90 transition shadow-md">
            <Info className="w-5 h-5" /> More Info
          </button>
        </div>
      </div>
    </section>
  )
}
