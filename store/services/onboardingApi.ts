import { apiClient } from "@/lib/apiClient"

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

export const onboardingApi = {
  async savePersonalInfo(payload: {
    firstName: string
    lastName: string
    phoneNumber: string
    dateOfBirth: string
    country: string
    city: string
    bio?: string
  }): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>("/onboarding/personal-info", {
      firstName: payload.firstName,
      lastName: payload.lastName,
      phoneNumber: payload.phoneNumber,
      dateOfBirth: payload.dateOfBirth,
      country: payload.country,
      city: payload.city,
      bio: payload.bio,
    })
  },

  async saveGenres(genreIds: number[]): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>("/onboarding/genres", {
      genre_ids: genreIds,
    })
  },

  async saveSubscription(payload: {
    planId: number
    billingCycle: "monthly" | "yearly"
    paymentMethod?: string
  }): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>("/onboarding/subscription", payload)
  },
}
