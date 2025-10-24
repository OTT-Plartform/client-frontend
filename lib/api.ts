// lib/api.ts
import { clearStoredTokens, getStoredTokens, setStoredTokens } from "./auth"

const DEFAULT_BASE_URL = "https://ubiqent.com/backend/api"

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || DEFAULT_BASE_URL
}

let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise
  isRefreshing = true
  const { refreshToken } = getStoredTokens()
  if (!refreshToken) {
    isRefreshing = false
    return null
  }
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/refresh`, {
        method: "POST",
        headers: { 
          "Accept": "application/json",
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ refreshToken }),
      })
      if (!res.ok) throw new Error("Refresh failed")
      const data = await res.json()
      const newAccess: string | undefined = data?.data?.token
      const newRefresh: string | undefined = data?.data?.refreshToken
      if (newAccess) setStoredTokens({ accessToken: newAccess, refreshToken: newRefresh ?? null })
      return newAccess ?? null
    } catch (err) {
      clearStoredTokens()
      return null
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()
  return refreshPromise
}

let activeProfileId: number | null = null

export function setActiveProfileId(profileId: number | null) {
  activeProfileId = profileId
  if (typeof window !== "undefined") {
    if (profileId) localStorage.setItem("activeProfileId", String(profileId))
    else localStorage.removeItem("activeProfileId")
    try {
      if (profileId) {
        document.cookie = `activeProfileId=${String(profileId)}; Path=/; SameSite=Lax`
      } else {
        document.cookie = `activeProfileId=; Path=/; Max-Age=0; SameSite=Lax`
      }
    } catch {}
  }
}

function getActiveProfileIdFromStorage(): number | null {
  if (activeProfileId !== null) return activeProfileId
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("activeProfileId")
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

async function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}, retry = true): Promise<Response> {
  const { accessToken } = getStoredTokens()
  const headers: Record<string, string> = {
    "Accept": "application/json",
    ...(init.headers as Record<string, string> || {}),
  }
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }
  const profileId = getActiveProfileIdFromStorage()
  if (profileId) {
    headers["X-Profile-Id"] = String(profileId)
  }
  
  // Don't set Content-Type for FormData, let the browser set it with boundary
  if (!(init.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json"
  }

  const response = await fetch(input, { ...init, headers })
  if (response.status !== 401 || !retry) return response

  const newAccess = await refreshAccessToken()
  if (!newAccess) return response

  const retryHeaders: Record<string, string> = {
    "Accept": "application/json",
    ...(init.headers as Record<string, string> || {}),
    "Authorization": `Bearer ${newAccess}`,
  }
  
  // Don't set Content-Type for FormData in retry either
  if (!(init.body instanceof FormData)) {
    retryHeaders["Content-Type"] = headers["Content-Type"] || "application/json"
  }
  
  return fetch(input, { ...init, headers: retryHeaders })
}

export interface AuthResponseDto {
  success: boolean
  message: string
  data: {
    token: string
    user: any
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

export const api = {
  baseUrl: getBaseUrl(),

  async login(payload: { email: string; password: string; device_name?: string; device_type?: string; device_identifier?: string; device_model?: string; os_name?: string; os_version?: string; app_version?: string; device_metadata?: Record<string, any>; profile_id?: number }): Promise<AuthResponseDto> {
    const res = await fetch(`${getBaseUrl()}/login`, {
      method: "POST",
      headers: { 
        "Accept": "application/json",
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(await res.text())
    const data = (await res.json()) as AuthResponseDto
    if (data.success && data.data.token) {
      setStoredTokens({ accessToken: data.data.token, refreshToken: null })
      try {
        if (typeof document !== "undefined") {
          document.cookie = `accessToken=${encodeURIComponent(data.data.token)}; Path=/; SameSite=Lax`
        }
      } catch {}
    }
    const currentProfileId = (data as any)?.data?.current_profile_id
    if (currentProfileId) setActiveProfileId(Number(currentProfileId))
    return data
  },

  async register(payload: { email: string; password: string; password_confirmation: string }): Promise<AuthResponseDto> {
    const res = await fetch(`${getBaseUrl()}/register`, {
      method: "POST",
      headers: { 
        "Accept": "application/json",
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(await res.text())
    const data = (await res.json()) as AuthResponseDto
    if (data.success && data.data.token) {
      setStoredTokens({ accessToken: data.data.token, refreshToken: null })
    }
    return data
  },

  async oauthRedirect(provider: 'google' | 'facebook'): Promise<string> {
    const res = await fetch(`${getBaseUrl()}/oauth/redirect/${provider}`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    })
    if (!res.ok) throw new Error(await res.text())
    const data = await res.json()
    return data.redirect_url || data.url
  },

  // Google OAuth specific methods
  async googleAuth(): Promise<string> {
    try {
      // Call backend to get the redirect URL
      const res = await fetch(`${getBaseUrl()}/oauth/redirect/google`, {
        method: "GET",
        headers: { "Accept": "application/json" },
      })
      
      if (!res.ok) throw new Error("Failed to get Google OAuth redirect URL")
      
      const data = await res.json()
      
      if (data.success && data.data?.redirect_url) {
        return data.data.redirect_url
      } else {
        throw new Error(data.message || "Invalid redirect URL response")
      }
    } catch (error) {
      console.error("Google OAuth redirect error:", error)
      throw new Error("Failed to initialize Google OAuth")
    }
  },

  async oauthTokenExchange(provider: 'google' | 'facebook', accessToken: string): Promise<AuthResponseDto> {
    const res = await fetch(`${getBaseUrl()}/oauth/token/${provider}`, {
      method: "POST",
      headers: { 
        "Accept": "application/json",
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ access_token: accessToken }),
    })
    if (!res.ok) throw new Error(await res.text())
    const data = (await res.json()) as AuthResponseDto
    if (data.success && data.data.token) {
      setStoredTokens({ accessToken: data.data.token, refreshToken: null })
    }
    return data
  },

  async logout(): Promise<ApiResponse> {
    const res = await authorizedFetch(`${getBaseUrl()}/logout`, { method: "POST" })
    if (!res.ok) throw new Error(await res.text())
    clearStoredTokens()
    return res.json()
  },

  async getProfile(): Promise<ApiResponse> {
    const res = await authorizedFetch(`${getBaseUrl()}/profile`, { method: "GET" })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async updateProfile(payload: FormData): Promise<ApiResponse> {
    const res = await authorizedFetch(`${getBaseUrl()}/profile`, { 
      method: "PUT",
      body: payload
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Onboarding APIs
  async savePersonalInfo(body: {
    firstName: string
    lastName: string
    phoneNumber: string
    dateOfBirth: string
    country: string
    city: string
    bio?: string
  }): Promise<ApiResponse> {
    const res = await authorizedFetch(`${getBaseUrl()}/onboarding/personal-info`, {
      method: "POST",
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async saveGenres(body: { genre_ids: number[] }): Promise<ApiResponse> {
    const res = await authorizedFetch(`${getBaseUrl()}/onboarding/genres`, {
      method: "POST",
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async saveSubscription(body: {
    planId: number
    billingCycle: "monthly" | "yearly"
    paymentMethod?: string
  }): Promise<ApiResponse> {
    const res = await authorizedFetch(`${getBaseUrl()}/onboarding/subscription`, {
      method: "POST",
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Public Data APIs
  async getGenres(): Promise<ApiResponse> {
    const res = await fetch(`${getBaseUrl()}/genres`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async getSubscriptionPlans(): Promise<ApiResponse> {
    const res = await fetch(`${getBaseUrl()}/subscription-plans`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async getPaymentMethods(): Promise<ApiResponse> {
    const res = await authorizedFetch(`${getBaseUrl()}/payments/methods`, { method: "GET" })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Profiles API
  async listProfiles(): Promise<ApiResponse<{ profiles: any[] }>> {
    const res = await authorizedFetch(`${getBaseUrl()}/profiles`, { method: "GET" })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async createProfile(body: any): Promise<ApiResponse<{ profile: any }>> {
    const res = await authorizedFetch(`${getBaseUrl()}/profiles`, { method: "POST", body: JSON.stringify(body) })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async getProfileById(profileId: number): Promise<ApiResponse<{ profile: any }>> {
    const res = await authorizedFetch(`${getBaseUrl()}/profiles/${profileId}`, { method: "GET" })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async updateProfileById(profileId: number, body: any): Promise<ApiResponse<{ profile: any }>> {
    const res = await authorizedFetch(`${getBaseUrl()}/profiles/${profileId}`, { method: "PUT", body: JSON.stringify(body) })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async deleteProfile(profileId: number): Promise<ApiResponse> {
    const res = await authorizedFetch(`${getBaseUrl()}/profiles/${profileId}`, { method: "DELETE" })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async setPrimaryProfile(profileId: number): Promise<ApiResponse> {
    const res = await authorizedFetch(`${getBaseUrl()}/profiles/${profileId}/set-primary`, { method: "POST" })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async getProfileWatchHistory(profileId: number): Promise<ApiResponse> {
    const res = await authorizedFetch(`${getBaseUrl()}/profiles/${profileId}/watch-history`, { method: "GET" })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Devices API
  async registerDevice(body: any): Promise<ApiResponse<{ device: any }>> {
    const res = await authorizedFetch(`${getBaseUrl()}/devices/register`, { method: "POST", body: JSON.stringify(body) })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async listDevices(): Promise<ApiResponse<{ devices: any[] }>> {
    const res = await authorizedFetch(`${getBaseUrl()}/devices`, { method: "GET" })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async updateDevice(deviceId: number, body: any): Promise<ApiResponse<{ device: any }>> {
    const res = await authorizedFetch(`${getBaseUrl()}/devices/${deviceId}`, { method: "PUT", body: JSON.stringify(body) })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async deactivateDevice(deviceId: number, body: { device_identifier: string }): Promise<ApiResponse> {
    const res = await authorizedFetch(`${getBaseUrl()}/devices/${deviceId}`, { method: "DELETE", body: JSON.stringify(body) })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async getDeviceStats(): Promise<ApiResponse<{ stats: any }>> {
    const res = await authorizedFetch(`${getBaseUrl()}/devices/stats`, { method: "GET" })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Legacy onboarding methods for backward compatibility
  async onboardingStep1Personal(body: any): Promise<any> {
    return this.savePersonalInfo(body)
  },

  async onboardingStep2Interests(sessionId: string, body: any): Promise<any> {
    return this.saveGenres(body)
  },

  async onboardingStep3Plan(sessionId: string, body: any): Promise<any> {
    return this.saveSubscription(body)
  },

  async onboardingStep4Payment(sessionId: string, body: any): Promise<any> {
    // Payment step is now handled in subscription
    return Promise.resolve({ success: true })
  },

  async onboardingStep5Complete(sessionId: string, body: any): Promise<AuthResponseDto> {
    // Onboarding is now complete after subscription
    return Promise.resolve({ 
      success: true, 
      message: "Onboarding completed", 
      data: { token: "", user: {} } 
    })
  },

  async onboardingGetPlans(): Promise<any[]> {
    const response = await this.getSubscriptionPlans()
    return response.data?.subscription_plans || []
  },
}


