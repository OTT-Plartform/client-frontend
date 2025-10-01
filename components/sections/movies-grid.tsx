"use client"

import { useEffect, useMemo, useRef, useState } from "react"

interface MoviesGridProps {
  items: any[]
  pageSize?: number
  onEndReached?: () => void
  renderItem: (item: any) => JSX.Element
}

export default function MoviesGrid({ items, pageSize = 30, onEndReached, renderItem }: MoviesGridProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount])

  useEffect(() => {
    setVisibleCount(pageSize)
  }, [items, pageSize])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + pageSize, items.length))
          onEndReached?.()
        }
      },
      { rootMargin: "600px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [items.length, pageSize, onEndReached])

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 sm:gap-6">
        {visibleItems.map((item) => (
          <div key={item.id}>{renderItem(item)}</div>
        ))}
      </div>
      <div ref={sentinelRef} className="h-10" />
    </div>
  )
}


