"use client"

import AuthGuard from "@/components/guards/AuthGuard"
import LoginPage from "@/components/pages/login-page"

export default function Login() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/">
      <LoginPage />
    </AuthGuard>
  )
}
