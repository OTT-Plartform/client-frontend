import SeriesDetailPage from "@/components/pages/series-detail-page"

interface PageProps {
  params: {
    id: string
  }
}

export default function SeriesDetail({ params }: PageProps) {
  return <SeriesDetailPage seriesId={params.id} />
}

export async function generateStaticParams() {
  // Replace with actual series IDs, e.g., from an API or mock data
  const ids = ['1', '2', '3']; // Example IDs
  return ids.map((id) => ({
    id,
  }));
}
