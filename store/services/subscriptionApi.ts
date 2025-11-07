import { apiClient } from "@/lib/apiClient"

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

export const subscriptionApi = {
  async getPlans(): Promise<ApiResponse> {
    return apiClient.get<ApiResponse>("/subscription-plans", { requireAuth: false })
  },

  async getPaymentMethods(): Promise<ApiResponse> {
    return apiClient.get<ApiResponse>("/payments/methods")
  },

  async createSubscription(payload: {
    planId: number
    billingCycle: "monthly" | "yearly"
    paymentMethod?: string
  }): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>("/subscriptions", payload)
  },

  async cancelSubscription(): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>("/subscriptions/cancel")
  },

  async getCurrentSubscription(): Promise<ApiResponse> {
    return apiClient.get<ApiResponse>("/subscriptions/current")
  },
}
