import { apiClient } from "@/lib/apiClient"

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

export const profileApi = {
  async listProfiles(): Promise<ApiResponse<{ profiles: any[] }>> {
    return apiClient.get<ApiResponse>("/profiles")
  },

  async createProfile(data: any): Promise<ApiResponse<{ profile: any }>> {
    return apiClient.post<ApiResponse>("/profiles", data)
  },

  async getProfileById(profileId: number): Promise<ApiResponse<{ profile: any }>> {
    return apiClient.get<ApiResponse>(`/profiles/${profileId}`)
  },

  async updateProfile(profileId: number, data: any): Promise<ApiResponse<{ profile: any }>> {
    return apiClient.put<ApiResponse>(`/profiles/${profileId}`, data)
  },

  async deleteProfile(profileId: number): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/profiles/${profileId}`)
  },

  async setPrimaryProfile(profileId: number): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(`/profiles/${profileId}/set-primary`)
  },

  async getWatchHistory(profileId: number): Promise<ApiResponse> {
    return apiClient.get<ApiResponse>(`/profiles/${profileId}/watch-history`)
  },
}
