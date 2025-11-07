import { clearStoredTokens, getStoredTokens, setStoredTokens } from "./auth"

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "https://ubiqent.com/backend/api"
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
      const newAccess = data?.data?.token
      const newRefresh = data?.data?.refreshToken
      
      if (newAccess) {
        setStoredTokens({ accessToken: newAccess, refreshToken: newRefresh ?? null })
      }
      
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

export interface ApiClientConfig {
  headers?: Record<string, string>
  requireAuth?: boolean
  retry?: boolean
}

class ApiClient {
  private baseUrl: string
  private activeProfileId: number | null = null

  constructor() {
    this.baseUrl = getBaseUrl()
  }

  setActiveProfileId(profileId: number | null) {
    this.activeProfileId = profileId
    if (typeof window !== "undefined") {
      if (profileId) {
        localStorage.setItem("activeProfileId", String(profileId))
        document.cookie = `activeProfileId=${String(profileId)}; Path=/; SameSite=Lax`
      } else {
        localStorage.removeItem("activeProfileId")
        document.cookie = `activeProfileId=; Path=/; Max-Age=0; SameSite=Lax`
      }
    }
  }

  getActiveProfileId(): number | null {
    if (this.activeProfileId !== null) return this.activeProfileId
    if (typeof window === "undefined") return null
    
    const raw = localStorage.getItem("activeProfileId")
    if (!raw) return null
    
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : null
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    config: ApiClientConfig = {}
  ): Promise<T> {
    const { requireAuth = true, retry = true } = config
    
    const headers: Record<string, string> = {
      "Accept": "application/json",
      ...config.headers,
      ...(options.headers as Record<string, string> || {}),
    }

    if (requireAuth) {
      const { accessToken } = getStoredTokens()
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`
      }
    }

    const profileId = this.getActiveProfileId()
    if (profileId) {
      headers["X-Profile-Id"] = String(profileId)
    }

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = headers["Content-Type"] || "application/json"
    }

    const url = `${this.baseUrl}${endpoint}`
    let response = await fetch(url, { ...options, headers })

    // Handle 401 with token refresh
    if (response.status === 401 && retry && requireAuth) {
      const newAccess = await refreshAccessToken()
      
      if (newAccess) {
        headers["Authorization"] = `Bearer ${newAccess}`
        response = await fetch(url, { ...options, headers })
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || `Request failed with status ${response.status}`)
    }

    return response.json()
  }

  async get<T = any>(endpoint: string, config?: ApiClientConfig): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" }, config)
  }

  async post<T = any>(endpoint: string, data?: any, config?: ApiClientConfig): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return this.request<T>(endpoint, { method: "POST", body }, config)
  }

  async put<T = any>(endpoint: string, data?: any, config?: ApiClientConfig): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return this.request<T>(endpoint, { method: "PUT", body }, config)
  }

  async patch<T = any>(endpoint: string, data?: any, config?: ApiClientConfig): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data)
    return this.request<T>(endpoint, { method: "PATCH", body }, config)
  }

  async delete<T = any>(endpoint: string, data?: any, config?: ApiClientConfig): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined
    return this.request<T>(endpoint, { method: "DELETE", body }, config)
  }
}

export const apiClient = new ApiClient()
