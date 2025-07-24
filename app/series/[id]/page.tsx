import SeriesDetailPage from "@/components/pages/series-detail-page"

interface PageProps {
  params: {
    id: string
  }
}

export default function SeriesDetail({ params }: PageProps) {
  return <SeriesDetailPage seriesId={params.id} />
}
