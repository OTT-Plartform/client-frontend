"use client"

import { useEffect, useMemo, useState } from "react"
import { X, Play, BookmarkPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MovieInfoModalProps {
  item: any
  open: boolean
  onClose: () => void
  onPlay: (item: any) => void
  onAddToList?: (item: any) => void
  related?: any[]
  renderRelatedCard?: (item: any) => JSX.Element
}

export default function MovieInfoModal({ item, open, onClose, onPlay, onAddToList, related = [], renderRelatedCard }: MovieInfoModalProps) {
  const [animateIn, setAnimateIn] = useState(false)
  const genres = useMemo(() => item.genres || (item.genre ? [item.genre] : []), [item])

  // Sync animation state with `open`. When `open` becomes false, animate out.
  useEffect(() => {
    if (open) {
      setAnimateIn(true)
    } else {
      setAnimateIn(false)
    }
  }, [open])

  const handleClose = () => {
    setAnimateIn(false)
    setTimeout(() => onClose(), 200)
  }

  // Unmount only when fully closed and no exit animation is running
  if (!open && !animateIn) return null
  return (
    <div className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto transition-opacity duration-300 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="min-h-full w-full flex justify-center py-10 px-4">
        <div className={`relative w-full max-w-6xl bg-blue-950/95 border border-blue-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${animateIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
          <button className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2" onClick={handleClose} aria-label="Close">
            <X className="w-5 h-5 text-white" />
          </button>
          {/* Video top section */}
          <div className="w-full">
            <div className="relative w-full aspect-[16/9] bg-black max-h-[60vh] mx-auto">
              {/* Inline video close button (overlay) */}
              <button className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2" onClick={handleClose} aria-label="Close">
                <X className="w-5 h-5 text-white" />
              </button>
              {/* If a real video url is available, embed it */}
              {item.videoUrl ? (
                <video controls autoPlay poster={item.backdrop || item.thumbnail} className="w-full h-full object-cover">
                  <source src={item.videoUrl} />
                </video>
              ) : item.youtubeId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                  title={item.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button onClick={() => onPlay(item)} className="bg-white text-black hover:bg-gray-200">
                    <Play className="w-4 h-4 mr-2" /> Play
                  </Button>
                </div>
              )}
              {/* Overlay buttons */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <Button onClick={() => onPlay(item)} className="bg-white text-black hover:bg-gray-200">
                  <Play className="w-4 h-4 mr-2" /> Play
                </Button>
                {onAddToList && (
                  <Button variant="secondary" onClick={() => onAddToList(item)} className="bg-blue-700 hover:bg-blue-600 text-white">
                    <BookmarkPlus className="w-4 h-4 mr-2" /> Add to List
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Details below video */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-50">{item.title}</h2>
              <div className="mt-2 text-blue-300 text-sm">
                <span>{item.year}</span>
                {item.rating && <span className="mx-2">• {item.rating}</span>}
                {item.duration && <span className="mx-2">• {item.duration}</span>}
              </div>
              {genres.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {genres.map((g: string) => (
                    <span key={g} className="text-xs px-2 py-0.5 rounded-full border border-blue-700 text-blue-200">{g}</span>
                  ))}
                </div>
              )}
              <p className="mt-4 text-blue-100/90 leading-relaxed">{item.description || ""}</p>
            </div>
            <div className="text-blue-200 text-sm">
              <div className="grid grid-cols-2 gap-y-2">
                {Array.isArray(item.cast) && item.cast.length > 0 && (
                  <>
                    <div className="text-blue-400">Cast</div>
                    <div className="text-blue-200">{item.cast.join(", ")}</div>
                  </>
                )}
                {Array.isArray(item.crew) && item.crew.length > 0 && (
                  <>
                    <div className="text-blue-400">Crew</div>
                    <div className="text-blue-200">{item.crew.join(", ")}</div>
                  </>
                )}
                {item.ageLimit && (
                  <>
                    <div className="text-blue-400">Age limit</div>
                    <div className="text-blue-200">{item.ageLimit}</div>
                  </>
                )}
                {item.duration && (
                  <>
                    <div className="text-blue-400">Length</div>
                    <div className="text-blue-200">{item.duration}</div>
                  </>
                )}
                {Array.isArray(item.genres) && item.genres.length > 0 && (
                  <>
                    <div className="text-blue-400">Genres</div>
                    <div className="text-blue-200">{item.genres.join(", ")}</div>
                  </>
                )}
                {Array.isArray(item.genres) && item.genres.length > 0 && (
                  <>
                    <div className="text-blue-400">Similar to</div>
                    <div className="text-blue-200">{item.genres[0]} classics</div>
                  </>
                )}
              </div>
            </div>
          </div>
          {related.length > 0 && (
            <div className="p-6 pt-2">
              <div className="text-blue-100 font-semibold mb-3">More like this</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {related.map((r) => (
                  <div key={r.id}>
                    {renderRelatedCard ? renderRelatedCard(r) : (
                      <img src={r.thumbnail} alt={r.title} className="w-full h-full rounded-md object-cover" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


