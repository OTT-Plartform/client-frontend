"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, ExternalLink, Minimize2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface VideoModalProps {
  video: any
  onClose: () => void
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([80])
  const [currentTime, setCurrentTime] = useState([0])
  const [duration, setDuration] = useState(100)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMini, setIsMini] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === " ") {
        e.preventDefault()
        togglePlay()
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault()
        toggleFullscreen()
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [onClose])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (video.isYouTube && iframeRef.current) {
      // For YouTube videos, we'll show play/pause state but actual control is handled by YouTube player
      const iframe = iframeRef.current
      const message = isPlaying
        ? '{"event":"command","func":"pauseVideo","args":""}'
        : '{"event":"command","func":"playVideo","args":""}'
      iframe.contentWindow?.postMessage(message, "*")
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (video.isYouTube && iframeRef.current) {
      const message = isMuted
        ? '{"event":"command","func":"unMute","args":""}'
        : '{"event":"command","func":"mute","args":""}'
      iframeRef.current.contentWindow?.postMessage(message, "*")
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const openInYouTube = () => {
    if (video.youtubeId) {
      window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, "_blank")
    }
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isMini ? 'pointer-events-none' : ''}`}
      style={{ background: isMini ? 'none' : 'rgba(0,0,0,0.95)', backdropFilter: isMini ? 'none' : 'blur(8px)' }}>
      <div className={`relative ${isMini ? 'w-80 h-44 bottom-4 right-4 fixed z-50 rounded-xl shadow-2xl pointer-events-auto bg-black/90' : 'w-full h-full'} transition-all duration-300`} style={isMini ? { position: 'fixed', bottom: 16, right: 16 } : {}} onMouseMove={handleMouseMove}>
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>
        {/* Minimize Button */}
        {!isMini && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-16 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
            onClick={() => setIsMini(true)}
            title="Minimize"
          >
            <Minimize2 className="w-6 h-6" />
          </Button>
        )}
        {/* Restore from Mini-Player */}
        {isMini && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-black/60 text-white hover:bg-black/80 rounded-full"
            onClick={() => setIsMini(false)}
            title="Restore"
          >
            <Maximize className="w-5 h-5" />
          </Button>
        )}

        {/* YouTube Link Button */}
        {video.isYouTube && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-16 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full"
            onClick={openInYouTube}
            title="Open in YouTube"
          >
            <ExternalLink className="w-6 h-6" />
          </Button>
        )}

        {/* Video Player */}
        <div className="relative w-full h-full bg-black flex items-center justify-center">
          {video.isYouTube && video.youtubeId ? (
            // YouTube Video Player
            <iframe
              ref={iframeRef}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&controls=1&modestbranding=1&rel=0&enablejsapi=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            // Fallback for non-YouTube content
            <div className="relative w-full h-full">
              <img src={video.backdrop || video.thumbnail} alt={video.title} className="w-full h-full object-contain" />

              {/* Play/Pause Overlay for non-YouTube content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="icon"
                  className="bg-black/50 text-white hover:bg-black/70 rounded-full w-20 h-20"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 fill-current" />}
                </Button>
              </div>

              {/* Custom Controls for non-YouTube content */}
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Progress Bar */}
                <div className="mb-4">
                  <Slider
                    value={currentTime}
                    onValueChange={setCurrentTime}
                    max={duration}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-300 mt-1">
                    <span>{formatTime(currentTime[0])}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={() => setCurrentTime([Math.max(0, currentTime[0] - 10)])}
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>

                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={togglePlay}>
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={() => setCurrentTime([Math.min(duration, currentTime[0] + 10)])}
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>
                      <div className="w-20">
                        <Slider value={volume} onValueChange={setVolume} max={100} step={1} />
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <h3 className="text-white font-semibold">{video.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {video.year} • {video.rating}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/10"
                      onClick={toggleFullscreen}
                    >
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Info Overlay for YouTube */}
        {video.isYouTube && (
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-xl">{video.title}</h3>
                <p className="text-gray-400">
                  {video.year} • {video.rating} • {video.duration}
                </p>
                <p className="text-gray-300 text-sm mt-2 max-w-2xl">{video.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={openInYouTube}
                  className="border-gray-400 text-white hover:bg-white/10 bg-transparent"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Watch on YouTube
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
