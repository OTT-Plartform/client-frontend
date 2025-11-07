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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // Get token from cookies
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

  // Add security headers
  const response = NextResponse.next()
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
}


