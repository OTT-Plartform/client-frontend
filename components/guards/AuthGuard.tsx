"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { checkAuthStatus, fetchUserProfile } from "@/store/slices/authSlice"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = "/login" 
}: AuthGuardProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(checkAuthStatus())
  }, [dispatch])

  useEffect(() => {
    // Fetch user profile if authenticated but no user data
    if (isAuthenticated && !user && !isLoading) {
      dispatch(fetchUserProfile())
    }
  }, [isAuthenticated, user, isLoading, dispatch])

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        const currentPath = window.location.pathname
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
      } else if (!requireAuth && isAuthenticated) {
        router.push("/")
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router])

  // Show loading state
  if (isLoading || (requireAuth && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if auth requirements not met
  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (!requireAuth && isAuthenticated) {
    return null
  }

  return <>{children}</>
}
