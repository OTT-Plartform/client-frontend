"use client"

import { useMemo } from "react"
import { Play, List as ListIcon, BadgeInfo } from "lucide-react"

interface SeriesCardProps {
  item: any
  onPlay: (item: any) => void
  onShowEpisodes?: (series: any) => void
  onMoreInfo?: (series: any) => void
  hoverContext?: "grid" | "row"
}

export default function SeriesCard({ item, onPlay, onShowEpisodes, onMoreInfo, hoverContext = "grid" }: SeriesCardProps) {
  const seasons = useMemo(() => item.seasons || (Array.isArray(item.episodes) ? 1 : undefined), [item])
  return (
    <div className={`group relative rounded-xl overflow-hidden border border-blue-800 transition-all duration-200 shadow-lg ${hoverContext === 'grid' ? 'hover:shadow-2xl hover:z-20' : 'hover:shadow-xl hover:z-10'}`}>
      <div className="aspect-[4/3] w-full">
        <img src={item.thumbnail || "/placeholder.jpg"} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
        <div className="absolute left-2 top-2 text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white font-semibold shadow">
          Series
        </div>
        {seasons && (
          <div className="absolute left-2 top-6 text-[10px] px-2 py-0.5 rounded-full bg-blue-700 text-white font-semibold shadow">
            {seasons} {seasons === 1 ? "Season" : "Seasons"}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <div className="text-blue-50 text-base sm:text-lg font-bold line-clamp-1 drop-shadow">{item.title}</div>
        </div>
      </div>

      <div className={`absolute inset-0 scale-100 ${hoverContext === 'grid' ? 'group-hover:scale-[1.12]' : 'group-hover:scale-[1.06]'} group-hover:-translate-y-0.5 transition-transform duration-200`}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/85 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <button onClick={() => onPlay(item)} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-black hover:bg-gray-200" aria-label="Play">
              <Play className="w-4 h-4" />
            </button>
            {onShowEpisodes && (
              <button onClick={() => onShowEpisodes(item)} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-700/80 text-white hover:bg-blue-600" aria-label="Episodes">
                <ListIcon className="w-4 h-4" />
              </button>
            )}
            {onMoreInfo && (
              <button onClick={() => onMoreInfo(item)} className="ml-auto inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-700/80 text-white hover:bg-blue-600" aria-label="More info">
                <BadgeInfo className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


