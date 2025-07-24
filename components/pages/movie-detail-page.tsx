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
  DollarSign,
} from "lucide-react"
import { mockMovies, mockSeries } from "@/lib/mock-data"

interface MovieDetailPageProps {
  movieId: string
}

export default function MovieDetailPage({ movieId }: MovieDetailPageProps) {
  const router = useRouter()
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // Find the movie data
  const movie = mockMovies.find((m) => m.id === movieId)

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
          <Button onClick={() => router.back()} className="bg-red-600 hover:bg-red-700">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const relatedContent = [...mockMovies, ...mockSeries]
    .filter(
      (content) =>
        content.id !== movie.id &&
        (content.genres.some((g) => movie.genres.includes(g)) || content.country === movie.country),
    )
    .slice(0, 6)

  const handlePlayMovie = () => {
    setSelectedVideo(movie)
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
          <img src={movie.backdrop || movie.thumbnail} alt={movie.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 pb-16">
            <div className="max-w-3xl">
              {/* Movie Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-red-600 text-white">Movie</Badge>
                {movie.isAfrican && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                    African Cinema
                  </Badge>
                )}
                <Badge variant="outline" className="border-gray-400 text-gray-300">
                  {movie.country}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{movie.title}</h1>

              {/* Movie Info */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-white font-semibold">{movie.match}% Match</span>
                </div>
                <span className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-semibold">{movie.rating}</span>
                <div className="flex items-center gap-1 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Globe className="w-4 h-4" />
                  <span>{movie.language}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className={`text-lg text-gray-300 leading-relaxed ${showFullDescription ? "" : "line-clamp-3"}`}>
                  {movie.description}
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
                {movie.genres.map((genre, index) => (
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
                  onClick={handlePlayMovie}
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
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-gray-800 mb-8">
            <TabsTrigger value="details" className="text-white data-[state=active]:bg-red-600">
              Details
            </TabsTrigger>
            <TabsTrigger value="cast" className="text-white data-[state=active]:bg-red-600">
              Cast & Crew
            </TabsTrigger>
            <TabsTrigger value="production" className="text-white data-[state=active]:bg-red-600">
              Production
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-white text-xl font-bold mb-4">Movie Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Plot</h4>
                    <p className="text-white">{movie.plot}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Country</h4>
                    <p className="text-white">{movie.country}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Language</h4>
                    <p className="text-white">{movie.language}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Director</h4>
                    <p className="text-white">{movie.director}</p>
                  </div>
                  <div>
                    <h4 className="text-gray-400 text-sm font-medium mb-1">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre, index) => (
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
                  {movie.awards?.map((award, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="text-white">{award}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-white text-xl font-bold mb-4 mt-8">Box Office</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Budget</span>
                    <span className="text-white font-semibold">{movie.budget}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Box Office</span>
                    <span className="text-white font-semibold">{movie.boxOffice}</span>
                  </div>
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
                  {movie.cast.map((actor, index) => (
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
                      <h4 className="text-white font-semibold">{movie.director}</h4>
                      <p className="text-gray-400 text-sm">Director</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Production Tab */}
          <TabsContent value="production" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2">Budget</h3>
                  <p className="text-2xl font-bold text-green-500">{movie.budget}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2">Box Office</h3>
                  <p className="text-2xl font-bold text-blue-500">{movie.boxOffice}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2">Release Year</h3>
                  <p className="text-2xl font-bold text-purple-500">{movie.year}</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-white text-xl font-bold mb-4">Production Notes</h3>
              <p className="text-gray-300 leading-relaxed">
                This film represents a significant achievement in African cinema, showcasing local talent and telling
                authentic African stories. The production brought together talented cast and crew from across the
                continent to create a compelling narrative that resonates with audiences both locally and
                internationally.
              </p>
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
