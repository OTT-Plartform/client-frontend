"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VideoModal from "@/components/modals/video-modal"
import ContentRow from "@/components/sections/content-row"
import {
  Play,
  Plus,
  ThumbsUp,
  Share,
  Download,
  Star,
  Calendar,
  Clock,
  Globe,
  Award,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { mockSeries } from "@/lib/mock-data"

interface SeriesDetailPageProps {
  seriesId: string
}

export default function SeriesDetailPage({ seriesId }: SeriesDetailPageProps) {
  const router = useRouter()
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // Find the series data
  const series = mockSeries.find((s) => s.id === seriesId)

  if (!series) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Series Not Found</h1>
          <Button onClick={() => router.back()} className="bg-red-600 hover:bg-red-700">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const currentSeasonData = series.seasonsData?.find((s) => s.seasonNumber === selectedSeason)
  const relatedContent = mockSeries
    .filter(
      (s) => s.id !== series.id && (s.genres.some((g) => series.genres.includes(g)) || s.country === series.country),
    )
    .slice(0, 6)

  const handlePlaySeries = () => {
    setSelectedVideo(series)
  }

  const handlePlayEpisode = (episode: any) => {
    const episodeData = {
      ...series,
      title: `${series.title} - S${selectedSeason}E${episode.episodeNumber}: ${episode.title}`,
      description: episode.description,
      duration: episode.duration,
    }
    setSelectedVideo(episodeData)
  }

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src={series.backdrop || series.thumbnail} alt={series.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 pb-16">
            <div className="max-w-3xl">
              {/* Series Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-red-600 text-white">
                  {series.type === "series" ? "TV Series" : series.type === "podcast" ? "Podcast" : "Show"}
                </Badge>
                {series.isAfrican && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                    African Content
                  </Badge>
                )}
                <Badge variant="outline" className="border-gray-400 text-gray-300">
                  {series.country}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{series.title}</h1>

              {/* Series Info */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-white font-semibold">{series.match}% Match</span>
                </div>
                <span className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-semibold">{series.rating}</span>
                <div className="flex items-center gap-1 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{series.year}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{series.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Globe className="w-4 h-4" />
                  <span>{series.language}</span>
                </div>
              </div>

              {/* Seasons & Episodes Info */}
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{series.seasons}</div>
                  <div className="text-gray-400 text-sm">Seasons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{series.episodes}</div>
                  <div className="text-gray-400 text-sm">Episodes</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className={`text-lg text-gray-300 leading-relaxed ${showFullDescription ? "" : "line-clamp-3"}`}>
                  {series.description}
                </p>
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-red-400 hover:text-red-300 text-sm mt-2 flex items-center gap-1"
                >
                  {showFullDescription ? (
                    <>
                      Show Less <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-8">
                {series.genres.map((genre, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 flex-wrap">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 font-semibold px-8"
                  onClick={handlePlaySeries}
                >
                  <Play className="w-5 h-5 mr-2 fill-current" />
                  Play
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-400 text-white hover:bg-white/10 bg-transparent px-8"
                  onClick={toggleWatchlist}
                >
                  <Plus className={`w-5 h-5 mr-2 ${isInWatchlist ? "rotate-45" : ""}`} />
                  {isInWatchlist ? "Remove from List" : "My List"}
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className="border-gray-400 text-white hover:bg-white/10 bg-transparent"
                  onClick={toggleLike}
                >
                  <ThumbsUp className={`w-5 h-5 ${isLiked ? "fill-current text-red-500" : ""}`} />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className="border-gray-400 text-white hover:bg-white/10 bg-transparent"
                >
                  <Share className="w-5 h-5" />
                </Button>

                <Button
                  size="icon"
                  variant="outline"
                  className="border-gray-400 text-white hover:bg-white/10 bg-transparent"
                >
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8 pt-20">
        <Tabs defaultValue="episodes" className="w-full">
          <TabsList className="bg-gray-800 mb-8">
            <TabsTrigger value="episodes" className="text-white data-[state=active]:bg-red-600">
              Episodes
            </TabsTrigger>
            <TabsTrigger value="details" className="text-white data-[state=active]:bg-red-600">
              Details
            </TabsTrigger>
            <TabsTrigger value="cast" className="text-white data-[state=active]:bg-red-600">
              Cast & Crew
            </TabsTrigger>
          </TabsList>

          {/* Episodes Tab */}
          <TabsContent value="episodes" className="space-y-6">
            {/* Season Selector */}
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-white">Episodes</h2>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2"
              >
                {Array.from({ length: series.seasons }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Season {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Episodes List */}
            <div className="space-y-4">
              {currentSeasonData?.episodes_list?.map((episode, index) => (
                <Card
                  key={index}
                  className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative w-32 h-20 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={series.thumbnail || "/placeholder.svg"}
                          alt={episode.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            className="bg-white/20 text-white hover:bg-white/30 rounded-full"
                            onClick={() => handlePlayEpisode(episode)}
                          >
                            <Play className="w-4 h-4 fill-current" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-white font-semibold">
                              {episode.episodeNumber}. {episode.title}
                            </h3>
                            <p className="text-gray-400 text-sm">{episode.duration}</p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                            onClick={() => handlePlayEpisode(episode)}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-gray-300 text-sm line-clamp-2">{episode.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-white text-xl font-bold mb-4">Series Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Plot</h4>
                    <p className="text-white">{series.plot}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Country</h4>
                    <p className="text-white">{series.country}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Language</h4>
                    <p className="text-white">{series.language}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Director</h4>
                    <p className="text-white">{series.director}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {series.genres.map((genre, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white text-xl font-bold mb-4">Awards & Recognition</h3>
                <div className="space-y-3">
                  {series.awards?.map((award, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="text-white">{award}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-white text-xl font-bold mb-4 mt-8">Season Information</h3>
                <div className="space-y-4">
                  {series.seasonsData?.map((season, index) => (
                    <Card key={index} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold">Season {season.seasonNumber}</h4>
                          <Badge variant="secondary" className="bg-red-600 text-white">
                            {season.episodes} Episodes
                          </Badge>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{season.description}</p>
                        <p className="text-gray-400 text-xs">Released: {season.year}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Cast & Crew Tab */}
          <TabsContent value="cast" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-white text-xl font-bold mb-4">Main Cast</h3>
                <div className="space-y-4">
                  {series.cast.map((actor, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{actor}</h4>
                        <p className="text-gray-400 text-sm">Actor</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-white text-xl font-bold mb-4">Crew</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{series.director}</h4>
                      <p className="text-gray-400 text-sm">Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* More Like This Section */}
        {relatedContent.length > 0 && (
          <div className="mt-16">
            <ContentRow title="More Like This" content={relatedContent} onVideoSelect={setSelectedVideo} />
          </div>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  )
}
