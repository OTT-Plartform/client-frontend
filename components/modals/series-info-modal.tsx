"use client"

import { useEffect, useMemo, useState } from "react"
import { X, Play, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SeriesInfoModalProps {
  item: any
  open: boolean
  onClose: () => void
  onPlayEpisode: (episode: any) => void
}

export default function SeriesInfoModal({ item, open, onClose, onPlayEpisode }: SeriesInfoModalProps) {
  const [animateIn, setAnimateIn] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const seasons = useMemo(() => item.seasons || 1, [item])
  const episodes = useMemo(() => (Array.isArray(item.episodes) ? item.episodes : []), [item])

  useEffect(() => {
    if (open) setAnimateIn(true)
    else setAnimateIn(false)
  }, [open])

  const handleClose = () => {
    setAnimateIn(false)
    setTimeout(() => onClose(), 200)
  }

  if (!open && !animateIn) return null

  const seasonEpisodes = Array.isArray(episodes) ? episodes : [] // demo: no season grouping in mock
  const firstEpisode = seasonEpisodes[0]

  return (
    <div className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="min-h-full w-full flex justify-center py-10 px-4">
        <div className={`relative w-full max-w-6xl bg-blue-950/95 border border-blue-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${animateIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
          <button className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2" onClick={handleClose} aria-label="Close">
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Playback of first episode */}
          <div className="relative w-full aspect-[16/9] bg-black max-h-[60vh] mx-auto">
            {firstEpisode?.videoUrl ? (
              <video controls autoPlay poster={item.backdrop || item.thumbnail} className="w-full h-full object-cover">
                <source src={firstEpisode.videoUrl} />
              </video>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button onClick={() => onPlayEpisode(firstEpisode)} className="bg-white text-black hover:bg-gray-200">
                  <Play className="w-4 h-4 mr-2" /> Play S1:E1
                </Button>
              </div>
            )}
          </div>

          {/* Details and season controls */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-blue-50">{item.title}</h2>
                <div className="mt-1 text-blue-300 text-sm">{item.year} • {item.rating} • {item.duration || `${episodes.length} eps`}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={viewMode === 'list' ? 'default' : 'secondary'} onClick={() => setViewMode('list')} className="bg-blue-700/80 hover:bg-blue-700 text-white">
                  <List className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === 'grid' ? 'default' : 'secondary'} onClick={() => setViewMode('grid')} className="bg-blue-700/80 hover:bg-blue-700 text-white">
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* More info: genres, cast, crew */}
            <div className="grid md:grid-cols-2 gap-4 text-blue-200 text-sm">
              <div>
                {Array.isArray(item.genres) && item.genres.length > 0 && (
                  <div className="mb-2"><span className="text-blue-400">Genres:</span> {item.genres.join(', ')}</div>
                )}
                {item.description && (
                  <div className="text-blue-100/90">{item.description}</div>
                )}
              </div>
              <div>
                {Array.isArray(item.cast) && item.cast.length > 0 && (
                  <div className="mb-2"><span className="text-blue-400">Cast:</span> {item.cast.join(', ')}</div>
                )}
                {Array.isArray(item.crew) && item.crew.length > 0 && (
                  <div className="mb-2"><span className="text-blue-400">Crew:</span> {item.crew.join(', ')}</div>
                )}
              </div>
            </div>

            {/* Season switcher (demo) */}
            <div className="flex items-center gap-3 text-blue-200 text-sm">
              <span>Seasons:</span>
              {Array.from({ length: seasons }).map((_, i) => (
                <button key={i} onClick={() => setSelectedSeason(i + 1)} className={`px-3 py-1 rounded-full border ${selectedSeason === i + 1 ? 'bg-blue-700 text-white border-blue-600' : 'border-blue-700 hover:bg-blue-800'}`}>{i + 1}</button>
              ))}
            </div>

            {/* Episodes */}
            {viewMode === 'list' ? (
              <div className="space-y-3">
                {seasonEpisodes.map((ep: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-blue-900/30 border border-blue-800 hover:border-blue-600">
                    <img src={ep.thumbnail || item.thumbnail} alt={ep.title} className="w-28 h-16 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <div className="text-blue-100 font-semibold truncate">S{selectedSeason}:E{idx + 1} — {ep.title}</div>
                      <div className="text-blue-300 text-xs line-clamp-2">{ep.description}</div>
                    </div>
                    <Button onClick={() => onPlayEpisode(ep)} className="bg-white text-black hover:bg-gray-200">
                      <Play className="w-4 h-4 mr-2" /> Play
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {seasonEpisodes.map((ep: any, idx: number) => (
                  <div key={idx} className="group relative rounded-lg overflow-hidden border border-blue-800 hover:border-blue-600">
                    <div className="aspect-video">
                      <img src={ep.thumbnail || item.thumbnail} alt={ep.title} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="p-2 text-blue-100 text-sm line-clamp-1">S{selectedSeason}:E{idx + 1} — {ep.title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}


