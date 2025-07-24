import MovieDetailPage from "@/components/pages/movie-detail-page"

interface PageProps {
  params: {
    id: string
  }
}

export default function MovieDetail({ params }: PageProps) {
  return <MovieDetailPage movieId={params.id} />
}
