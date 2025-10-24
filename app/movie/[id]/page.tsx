import MovieDetailPage from "@/components/pages/movie-detail-page"

interface PageProps {
  params: {
    id: string
  }
}

export default function MovieDetail({ params }: PageProps) {
  return <MovieDetailPage movieId={params.id} />
}

export async function generateStaticParams() {
  // Replace with actual movie IDs, e.g., from an API or mock data
  const ids = ['1', '2', '3']; // Example IDs
  return ids.map((id) => ({
    id,
  }));
}
