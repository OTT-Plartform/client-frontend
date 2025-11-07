import { apiClient } from "@/lib/apiClient"
import { setStoredTokens, clearStoredTokens } from "@/lib/auth"

export interface LoginPayload {
  email: string
  password: string
  device_name?: string
  device_type?: string
  device_identifier?: string
  device_model?: string
  os_name?: string
  os_version?: string
  app_version?: string
  device_metadata?: Record<string, any>
  profile_id?: number
}

export interface RegisterPayload {
  email: string
  password: string
  password_confirmation: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: any
    current_profile_id?: number
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/login", payload, { requireAuth: false })
    
    if (response.success && response.data.token) {
      setStoredTokens({ accessToken: response.data.token, refreshToken: null })
      
      // Set cookie for SSR
      if (typeof document !== "undefined") {
        document.cookie = `accessToken=${encodeURIComponent(response.data.token)}; Path=/; SameSite=Lax`
      }
      
      // Set active profile if returned
      if (response.data.current_profile_id) {
        apiClient.setActiveProfileId(Number(response.data.current_profile_id))
      }
    }
    
    return response
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/register", payload, { requireAuth: false })
    
    if (response.success && response.data.token) {
      setStoredTokens({ accessToken: response.data.token, refreshToken: null })
    }
    
    return response
  },

  async logout(): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>("/logout")
    clearStoredTokens()
    apiClient.setActiveProfileId(null)
    return response
  },

  async getProfile(): Promise<ApiResponse> {
    return apiClient.get<ApiResponse>("/profile")
  },

  async updateProfile(payload: FormData): Promise<ApiResponse> {
    return apiClient.put<ApiResponse>("/profile", payload)
  },

  async getOAuthRedirectUrl(provider: 'google' | 'facebook'): Promise<string> {
    const response = await apiClient.get<{ success: boolean; data: { redirect_url: string } }>(
      `/oauth/redirect/${provider}`,
      { requireAuth: false }
    )
    return response.data.redirect_url
  },

  async googleAuth(): Promise<string> {
    return this.getOAuthRedirectUrl('google')
  },

  async exchangeOAuthToken(provider: 'google' | 'facebook', accessToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `/oauth/token/${provider}`,
      { access_token: accessToken },
      { requireAuth: false }
    )
    
    if (response.success && response.data.token) {
      setStoredTokens({ accessToken: response.data.token, refreshToken: null })
    }
    
    return response
  },
}
