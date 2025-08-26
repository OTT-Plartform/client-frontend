"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setUser, logout } from "@/store/slices/authSlice"
import { getStoredTokens, clearStoredTokens } from "@/lib/auth"
import { api } from "@/lib/api"

export default function AuthBootstrap() {
  const dispatch = useDispatch()

  useEffect(() => {
    const { accessToken } = getStoredTokens()
    if (!accessToken) return

    let cancelled = false
    ;(async () => {
      try {
        const me = await api.me()
        if (!cancelled) {
          dispatch(setUser(me))
          localStorage.setItem("userData", JSON.stringify(me))
        }
      } catch (e) {
        clearStoredTokens()
        if (!cancelled) dispatch(logout())
      }
    })()
    return () => {
      cancelled = true
    }
  }, [dispatch])

  return null
}


