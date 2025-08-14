import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DollarSign, Film, User } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    // Fetch the movie details
    const fetchMovie = async () => {
      try {
        const response = await fetch(`/api/movies/${movieId}`);
        if (!response.ok) {
          throw new Error("Movie not found");
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie:", error);
        setMovie(null);
      }
    };

    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
          <p className="mb-6">We couldn't find the movie you're looking for.</p>
          <Button onClick={() => router.back()} className="bg-blue-600 hover:bg-blue-700">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const truncatedDescription = movie.description?.slice(0, 300);

  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-1/3 w-full">
          <AspectRatio ratio={2 / 3} className="bg-muted">
            <img
              src={movie.posterUrl || "/placeholder.jpg"}
              alt={movie.title}
              className="rounded-md object-cover w-full h-full"
            />
          </AspectRatio>
        </div>

        <div className="lg:w-2/3 w-full">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-blue-600 text-white">Movie</Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-500">
              Afristream
            </Badge>
            <span className="text-gray-400 text-sm">{movie.releaseDate}</span>
          </div>

          <p className="text-gray-300">
            {showFullDescription ? movie.description : truncatedDescription}
          </p>
          {movie.description && movie.description.length > 300 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-400 hover:text-blue-300 text-sm mt-2 flex items-center gap-1"
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
          )}

          <div className="mt-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="bg-gray-800 mb-8">
                <TabsTrigger value="details" className="text-white data-[state=active]:bg-blue-600">
                  Details
                </TabsTrigger>
                <TabsTrigger value="cast" className="text-white data-[state=active]:bg-blue-600">
                  Cast & Crew
                </TabsTrigger>
                <TabsTrigger value="production" className="text-white data-[state=active]:bg-blue-600">
                  Production
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <p className="text-gray-300">{movie.details}</p>
              </TabsContent>

              <TabsContent value="cast">
                <ul className="list-disc ml-5 text-gray-300">
                  {movie.cast?.map((member, index) => (
                    <li key={index}>{member}</li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="production">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6 text-center">
                      <DollarSign className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-white font-bold text-lg mb-2">Box Office</h3>
                      <p className="text-2xl font-bold text-blue-500">{movie.boxOffice}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6 text-center">
                      <Film className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-white font-bold text-lg mb-2">Runtime</h3>
                      <p className="text-2xl font-bold text-blue-500">{movie.runtime}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6 text-center">
                      <User className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                      <h3 className="text-white font-bold text-lg mb-2">Director</h3>
                      <p className="text-2xl font-bold text-blue-500">{movie.director}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
