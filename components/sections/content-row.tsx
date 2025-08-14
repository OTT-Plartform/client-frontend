"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ContentCard from "@/components/cards/content-card"

interface ContentRowProps {
  title: string
  content: any[]
  onVideoSelect: (video: any) => void
  titleClass?: string // ✅ Optional custom class for title
}

export default function ContentRow({ title, content, onVideoSelect, titleClass }: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" })

      setTimeout(updateScrollButtons, 300)
    }
  }

  useEffect(() => {
    updateScrollButtons()
    const handleResize = () => updateScrollButtons()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [content])

  return (
    <div className="relative group px-2 sm:px-4 md:px-6">
      <h2 className={`mb-2 ${titleClass || "text-xl md:text-2xl font-bold text-white"}`}>{title}</h2>

      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        )}

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {content.map((item, index) => (
            <div key={`${item.id}-${index}`} className="min-w-[150px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] transition-transform duration-300 hover:scale-105">
              <ContentCard content={item} onPlay={() => onVideoSelect(item)} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  )
}
