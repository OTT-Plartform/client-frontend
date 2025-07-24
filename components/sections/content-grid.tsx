"use client"

import { useState } from "react"
import ContentCard from "@/components/cards/content-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ContentGridProps {
  content: any[]
  onVideoSelect: (video: any) => void
  isLoading: boolean
}

export default function ContentGrid({ content, onVideoSelect, isLoading }: ContentGridProps) {
  const [displayCount, setDisplayCount] = useState(20)

  const loadMore = () => {
    setDisplayCount((prev) => prev + 20)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    )
  }

  if (content.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-400 text-lg mb-4">No content found</div>
        <p className="text-gray-500">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  const displayedContent = content.slice(0, displayCount)
  const hasMore = content.length > displayCount

  return (
    <div className="space-y-8">
      {/* Content Grid - Fixed responsive layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-6">
        {displayedContent.map((item, index) => (
          <div key={`${item.id}-${index}`} className="w-full animate-fade-in">
            <ContentCard content={item} onPlay={() => onVideoSelect(item)} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={loadMore}
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800 bg-transparent px-8 py-3"
          >
            Load More
          </Button>
        </div>
      )}

      {/* Results Summary */}
      <div className="text-center text-gray-400 text-sm">
        Showing {displayedContent.length} of {content.length} results
      </div>
    </div>
  )
}
