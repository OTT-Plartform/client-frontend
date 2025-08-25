"use client"

import { X } from "lucide-react"

interface EpisodesModalProps {
  series: any
  onClose: () => void
  onEpisodeSelect: (episode: any) => void
}

export default function EpisodesModal({
  series,
  onClose,
  onEpisodeSelect,
}: EpisodesModalProps) {
  if (!series) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-blue-950 rounded-xl max-w-2xl w-full overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-800">
          <h2 className="text-xl font-bold">{series.title} – Episodes</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-blue-200 hover:text-white" />
          </button>
        </div>

        {/* Episode list */}
        <div className="max-h-[70vh] overflow-y-auto divide-y divide-blue-800">
          {series.episodes?.length ? (
            series.episodes.map((ep: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 hover:bg-blue-900/50 transition cursor-pointer"
                onClick={() => onEpisodeSelect(ep)}
              >
                <div>
                  <p className="font-semibold">
                    Episode {i + 1}: {ep.title}
                  </p>
                  <p className="text-sm text-blue-300">{ep.description}</p>
                </div>
                <button className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 transition text-sm">
                  Play
                </button>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-blue-300">
              No episodes available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
