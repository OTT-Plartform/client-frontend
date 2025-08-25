"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setUser } from "@/store/slices/authSlice"
import HomePage from "@/components/pages/home-page"
import WelcomePage from "@/components/pages/welcome-page" // new component

export default function Home() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token on app load
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("userData")

    if (token && userData) {
      const parsedUser = JSON.parse(userData)
      dispatch(setUser(parsedUser))
    }

    setIsLoading(false)
  }, [dispatch])

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  // If authenticated → show HomePage
  if (isAuthenticated) {
    return <HomePage />
  }

  // If not authenticated → show WelcomePage
  return <WelcomePage />
}
