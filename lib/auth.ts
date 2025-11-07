// lib/auth.ts
import { clearDeviceIdentifier } from "./deviceUtils"

export const ACCESS_TOKEN_KEY = "accessToken"
export const REFRESH_TOKEN_KEY = "refreshToken"

export interface StoredTokens {
  accessToken: string | null
  refreshToken: string | null
}

export function getStoredTokens(): StoredTokens {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null }
  }
  // Backwards compatibility with previous mock key
  const legacyAccess = localStorage.getItem("authToken")
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || legacyAccess
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  return { accessToken, refreshToken }
}

export function setStoredTokens(tokens: { accessToken: string; refreshToken?: string | null }) {
  if (typeof window === "undefined") return
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  if (tokens.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  }
}

export function clearStoredTokens() {
  if (typeof window === "undefined") return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  // Clean legacy keys
  localStorage.removeItem("authToken")
  // Clear device identifier on logout
  clearDeviceIdentifier()
  // Clear active profile
  clearActiveProfileId()
}

// Active Profile Management
let activeProfileId: number | null = null

export function setActiveProfileId(profileId: number | null) {
  activeProfileId = profileId
  if (typeof window !== "undefined") {
    if (profileId) {
      localStorage.setItem("activeProfileId", String(profileId))
    } else {
      localStorage.removeItem("activeProfileId")
    }
    try {
      if (profileId) {
        document.cookie = `activeProfileId=${String(profileId)}; Path=/; SameSite=Lax`
      } else {
        document.cookie = `activeProfileId=; Path=/; Max-Age=0; SameSite=Lax`
      }
    } catch {}
  }
}

export function getActiveProfileId(): number | null {
  if (activeProfileId !== null) return activeProfileId
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem("activeProfileId")
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

export function clearActiveProfileId() {
  activeProfileId = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("activeProfileId")
    try {
      document.cookie = `activeProfileId=; Path=/; Max-Age=0; SameSite=Lax`
    } catch {}
  }
}

// Token Refresh
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

export async function refreshAccessToken(baseUrl: string): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise
  isRefreshing = true
  const { refreshToken } = getStoredTokens()
  if (!refreshToken) {
    isRefreshing = false
    return null
  }
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${baseUrl}/refresh`, {
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


