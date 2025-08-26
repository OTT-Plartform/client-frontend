// lib/auth.ts
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
}


