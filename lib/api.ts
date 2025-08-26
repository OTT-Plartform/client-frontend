// lib/api.ts
import { clearStoredTokens, getStoredTokens, setStoredTokens } from "./auth"

const DEFAULT_BASE_URL = "http://localhost:3001/api/v1"

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
      const res = await fetch(`${getBaseUrl()}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })
      if (!res.ok) throw new Error("Refresh failed")
      const data = await res.json()
      const newAccess: string | undefined = data?.accessToken
      const newRefresh: string | undefined = data?.refreshToken
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

async function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}, retry = true): Promise<Response> {
  const { accessToken } = getStoredTokens()
  const headers: HeadersInit = {
    ...(init.headers || {}),
  }
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }
  headers["Content-Type"] = headers["Content-Type"] || "application/json"

  const response = await fetch(input, { ...init, headers })
  if (response.status !== 401 || !retry) return response

  const newAccess = await refreshAccessToken()
  if (!newAccess) return response

  const retryHeaders: HeadersInit = {
    ...(init.headers || {}),
    Authorization: `Bearer ${newAccess}`,
    "Content-Type": headers["Content-Type"],
  }
  return fetch(input, { ...init, headers: retryHeaders })
}

export interface AuthResponseDto {
  accessToken: string
  refreshToken?: string
  user: any
  expiresIn?: number
}

export const api = {
  baseUrl: getBaseUrl(),

  async login(payload: { email: string; password: string }): Promise<AuthResponseDto> {
    const res = await fetch(`${getBaseUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(await res.text())
    const data = (await res.json()) as AuthResponseDto
    setStoredTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken ?? null })
    return data
  },

  async register(payload: { name: string; email: string; password: string }): Promise<AuthResponseDto> {
    const res = await fetch(`${getBaseUrl()}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(await res.text())
    const data = (await res.json()) as AuthResponseDto
    setStoredTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken ?? null })
    return data
  },

  async me(): Promise<any> {
    const res = await authorizedFetch(`${getBaseUrl()}/auth/profile`, { method: "GET" })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  // Onboarding APIs
  async onboardingStep1Personal(body: any): Promise<any> {
    const res = await fetch(`${getBaseUrl()}/onboarding/step1/personal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async onboardingStep2Interests(sessionId: string, body: any): Promise<any> {
    const res = await fetch(`${getBaseUrl()}/onboarding/step2/interests/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async onboardingStep3Plan(sessionId: string, body: any): Promise<any> {
    const res = await fetch(`${getBaseUrl()}/onboarding/step3/plan/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async onboardingStep4Payment(sessionId: string, body: any): Promise<any> {
    const res = await fetch(`${getBaseUrl()}/onboarding/step4/payment/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },

  async onboardingStep5Complete(sessionId: string, body: any): Promise<AuthResponseDto> {
    const res = await fetch(`${getBaseUrl()}/onboarding/step5/complete/${sessionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(await res.text())
    const data = (await res.json()) as AuthResponseDto
    setStoredTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken ?? null })
    return data
  },

  async onboardingGetPlans(params?: { featured?: boolean }): Promise<any[]> {
    const url = new URL(`${getBaseUrl()}/onboarding/plans`)
    if (params?.featured) url.searchParams.set("featured", "true")
    const res = await fetch(url.toString(), { method: "GET" })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
}


