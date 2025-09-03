"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { setUser, logout } from "@/store/slices/authSlice"
import { RootState } from "@/store/store"
import { Loader2 } from "lucide-react"

// Routes that require authentication
const PROTECTED_ROUTES = ["/profile", "/movies", "/series", "/movie", "/series"]

// Routes that should redirect to home if user is already authenticated
const AUTH_ROUTES = ["/login", "/register"]

// Routes that should redirect to onboarding if user is not profile complete
const ONBOARDING_ROUTES = ["/onboarding"]

export default function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  const isOnboardingDone = Boolean((user as any)?.onboarding_completed)
  const isProfileDone = Boolean((user as any)?.profile_completed)
  const isSubscribed = (user as any)?.is_subscribed !== false

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user data exists in localStorage
        const userData = localStorage.getItem("userData")
        const accessToken = localStorage.getItem("accessToken")

        if (userData && accessToken) {
          try {
            // Verify token is still valid by making an API call
            const { api } = await import("@/lib/api")
            const profileResponse = await api.getProfile()
            
            if (profileResponse.success && profileResponse.data?.user) {
              dispatch(setUser(profileResponse.data.user))
            } else {
              // Token is invalid, clear everything
              localStorage.removeItem("userData")
              localStorage.removeItem("accessToken")
              dispatch(logout())
            }
          } catch (error) {
            // API call failed, clear everything
            localStorage.removeItem("userData")
            localStorage.removeItem("accessToken")
            dispatch(logout())
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error)
        dispatch(logout())
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [dispatch])

  useEffect(() => {
    if (isLoading) return

    // Handle route protection
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }
    }

    // Handle auth routes (redirect if already authenticated)
    if (AUTH_ROUTES.includes(pathname)) {
      if (isAuthenticated) {
        if (!isOnboardingDone) {
          router.push("/onboarding")
        } else if (!isProfileDone) {
          router.push("/profile")
        } else if (!isSubscribed) {
          router.push("/onboarding?step=3")
        } else {
          router.push("/")
        }
        return
      }
    }

    // Handle onboarding route
    if (ONBOARDING_ROUTES.includes(pathname)) {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }
      if (!isOnboardingDone) {
        // stay on onboarding
      } else if (!isProfileDone) {
        router.push("/profile")
        return
      } else if (!isSubscribed) {
        router.push("/onboarding?step=3")
        return
      } else {
        router.push("/")
        return
      }
    }

    // Handle home route redirects
    if (pathname === "/") {
      if (isAuthenticated) {
        if (!isOnboardingDone) {
          router.push("/onboarding")
          return
        }
        if (!isProfileDone) {
          router.push("/profile")
          return
        }
        if (!isSubscribed) {
          router.push("/onboarding?step=3")
          return
        }
      }
    }
  }, [pathname, isAuthenticated, isOnboardingDone, isProfileDone, isSubscribed, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}


