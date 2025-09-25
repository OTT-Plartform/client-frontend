import { NextResponse, type NextRequest } from "next/server"

// Paths that do not require an active profile
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/onboarding",
  "/auth",
  "/api",
  "/_next",
  "/favicon.ico",
  "/profiles", // allow hitting profiles page itself
]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Read tokens and active profile from cookies
  const accessToken = req.cookies.get("accessToken")?.value || ""
  const activeProfileId = req.cookies.get("activeProfileId")?.value || ""

  // If not logged in, let existing auth guards handle redirect (pages already check)
  if (!accessToken) {
    return NextResponse.next()
  }

  // If profile is present, continue
  if (activeProfileId) {
    return NextResponse.next()
  }

  // No active profile: redirect to profiles selector
  const url = req.nextUrl.clone()
  url.pathname = "/profiles"
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    // Run on all app routes except static and api
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}


