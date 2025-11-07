// lib/api.ts
import { 
  getStoredTokens, 
  getActiveProfileId, 
  refreshAccessToken as refreshToken 
} from "./auth"

const DEFAULT_BASE_URL = "https://ubiqent.com/backend/api"

export function getBaseUrl() {
  return DEFAULT_BASE_URL
}

export async function refreshAccessToken(): Promise<string | null> {
  return refreshToken(getBaseUrl())
}

export async function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}, retry = true): Promise<Response> {
  const { accessToken } = getStoredTokens()
  const headers: Record<string, string> = {
    "Accept": "application/json",
    ...(init.headers as Record<string, string> || {}),
  }
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }
  const profileId = getActiveProfileId()
  if (profileId) {
    headers["X-Profile-Id"] = String(profileId)
  }
  
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
  
  if (!(init.body instanceof FormData)) {
    retryHeaders["Content-Type"] = headers["Content-Type"] || "application/json"
  }
  
  return fetch(input, { ...init, headers: retryHeaders })
}

// Common types
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


