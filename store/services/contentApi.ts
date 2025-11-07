import { apiClient } from "@/lib/apiClient"

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

export interface Genre {
  id: number
  name: string
  slug: string
  description?: string
}

export const contentApi = {
  async getGenres(): Promise<ApiResponse<{ genres: Genre[] }>> {
    return apiClient.get<ApiResponse>("/genres", { requireAuth: false })
  },

  async getGenreById(genreId: number): Promise<ApiResponse<{ genre: Genre }>> {
    return apiClient.get<ApiResponse>(`/genres/${genreId}`, { requireAuth: false })
  },
}
