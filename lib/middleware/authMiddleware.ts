import { getStoredTokens } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Protected routes that require authentication
 */
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/settings",
  "/onboarding",
  "/watch",
  "/favorites",
  "/history",
]

/**
 * Public routes that redirect to home if authenticated
 */
const AUTH_ROUTES = ["/login", "/register", "/signup"]

/**
 * Routes that don't require any validation
 */
const PUBLIC_ROUTES = ["/", "/about", "/pricing", "/terms", "/privacy"]

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route)

  // Get token from cookies or localStorage (for SSR)
  const tokenFromCookie = request.cookies.get("accessToken")?.value
  
  // If it's a protected route and no token, redirect to login
  if (isProtectedRoute && !tokenFromCookie) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If it's an auth route and user is authenticated, redirect to home
  if (isAuthRoute && tokenFromCookie) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

/**
 * Client-side route guard hook
 */
export function useAuthGuard() {
  if (typeof window === "undefined") return { isAuthenticated: false }
  
  const { accessToken } = getStoredTokens()
  return { isAuthenticated: !!accessToken }
}
