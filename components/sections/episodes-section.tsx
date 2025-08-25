"use client"

import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface EpisodesSectionProps {
  series: any
  onClose: () => void
  onPlayEpisode: (ep: any) => void
}

export default function EpisodesSection({
  series,
  onClose,
  onPlayEpisode,
}: EpisodesSectionProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
      >
        <div className="relative w-full max-w-4xl bg-gradient-to-b from-blue-950 to-blue-900 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[85vh]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-blue-300 hover:text-white"
          >
            <X size={28} />
          </button>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-8">
            {series.title} – Episodes
          </h2>

          {/* Episodes List */}
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.isArray(series.episodes) &&
              series.episodes.map((ep: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onPlayEpisode(ep)}
                  className="cursor-pointer bg-blue-800/40 hover:bg-blue-700/60 rounded-xl shadow-lg p-5 transition transform hover:scale-[1.03]"
                >
                  <h3 className="font-semibold text-lg mb-2 text-white">
                    {ep.title}
                  </h3>
                  <p className="text-blue-300 text-sm">{ep.description}</p>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
