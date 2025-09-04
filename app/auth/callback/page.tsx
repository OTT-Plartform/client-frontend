"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { setUser, setOAuthLoading } from "@/store/slices/authSlice"
import { showSnackbar } from "@/store/slices/uiSlice"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { setStoredTokens } from "@/lib/auth"
import LoginSuccess from "@/components/animations/login-success"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [message, setMessage] = useState('Processing authentication...')
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get URL parameters
        const token = searchParams.get('token')
        const userId = searchParams.get('user_id')
        const success = searchParams.get('success')
        const error = searchParams.get('error')
        const provider = searchParams.get('provider') || 'google'
        
        // Decode the token if it's URL encoded
        const decodedToken = token ? decodeURIComponent(token) : null

        // Clear OAuth loading state
        dispatch(setOAuthLoading({ loading: false, provider: undefined }))

        if (success === '1' && decodedToken && userId) {
          // OAuth success
          setStatus('success')
          setMessage('Authentication successful!')

          // Store authentication token properly
          setStoredTokens({ accessToken: decodedToken })

          // Get additional user info from URL parameters
          const isNewUser = searchParams.get('is_new_user') === '1'
          const requiresProfileCompletion = searchParams.get('requires_profile_completion') === '1'

          // Create a basic user object from the available data
          const basicUser = {
            id: parseInt(userId),
            auth_type: provider,
            onboarding_completed: !requiresProfileCompletion,
            profile_completed: !requiresProfileCompletion,
            is_subscribed: true, // Default to true, will be updated when profile is fetched
            is_new_user: isNewUser
          }

          // Store basic user data immediately
          dispatch(setUser(basicUser))
          localStorage.setItem('userData', JSON.stringify(basicUser))
          
          // Debug logging
          console.log('OAuth Callback - Stored user data:', basicUser)
          console.log('OAuth Callback - Stored token:', decodedToken)

          // Set user name for animation
          setUserName(basicUser.full_name || `User ${basicUser.id}`)

          // Try to fetch complete user profile, but don't block on it
          try {
            const { api } = await import("@/lib/api")
            const profileResponse = await api.getProfile()
            
            if (profileResponse.success && profileResponse.data?.user) {
              // Update Redux with complete user data
              dispatch(setUser(profileResponse.data.user))
              localStorage.setItem('userData', JSON.stringify(profileResponse.data.user))
            }
          } catch (profileError) {
            console.error('Profile fetch error:', profileError)
            // Continue with basic user data
          }

          // Set success status to show animation
          setStatus('success')
        } else {
          // OAuth error
          setStatus('error')
          const errorMessage = error || 'Authentication failed'
          setMessage(`Authentication failed: ${errorMessage}`)
          
          dispatch(showSnackbar({ 
            message: `${provider} authentication failed`, 
            type: "error" 
          }))

          // Redirect to login after showing error
          setTimeout(() => {
            router.push("/login?error=oauth_failed")
          }, 3000)
        }
      } catch (err: any) {
        console.error('OAuth callback error:', err)
        setStatus('error')
        setMessage('An unexpected error occurred during authentication')
        
        dispatch(setOAuthLoading({ loading: false, provider: undefined }))
        dispatch(showSnackbar({ 
          message: "Authentication failed", 
          type: "error" 
        }))

        setTimeout(() => {
          router.push("/login?error=oauth_failed")
        }, 3000)
      }
    }

    handleOAuthCallback()
  }, [searchParams, dispatch, router])

  const handleAnimationComplete = () => {
    // Get the basic user data to determine redirect
    const userData = localStorage.getItem('userData')
    if (userData) {
      const user = JSON.parse(userData)
      if (!user.onboarding_completed) {
        router.push("/onboarding")
      } else if (user.is_subscribed === false) {
        router.push("/onboarding?step=3")
      } else {
        // Go to home page for all other cases (including incomplete profile)
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'border-blue-500'
      case 'success':
        return 'border-green-500'
      case 'error':
        return 'border-red-500'
    }
  }

  // Show success animation for successful OAuth
  if (status === 'success') {
    return <LoginSuccess userName={userName} onComplete={handleAnimationComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className={`w-full max-w-md bg-black/50 border-white/20 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden ${getStatusColor()}`}>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {getStatusIcon()}
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            {status === 'processing' && 'Processing Authentication'}
            {status === 'error' && 'Authentication Failed'}
          </h1>
          
          <p className="text-gray-300 text-lg mb-6">
            {message}
          </p>
          
          {status === 'processing' && (
            <div className="space-y-2">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-gray-400 text-sm">Please wait while we complete your authentication...</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-4">
              <p className="text-red-400 text-sm">Redirecting you back to login...</p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
