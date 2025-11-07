"use client"

import { useState, useEffect } from "react"
import { FaApple, FaGoogle, FaFacebookF, FaTwitter, FaGithub } from "react-icons/fa"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { loginUser, initiateOAuth, clearError, clearFieldError } from "@/store/slices/authSlice"
import { showSnackbar } from "@/store/slices/uiSlice"
import { getDeviceInfo } from "@/lib/deviceUtils"
import LoginSuccess from "@/components/animations/login-success"
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
})

type LoginFormData = yup.InferType<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { isLoading, isOAuthLoading, oauthProvider, error, validationErrors, user } = useAppSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [showLoginSuccess, setShowLoginSuccess] = useState(false)
  const [userName, setUserName] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  })

  // Handle OAuth errors from URL parameters
  useEffect(() => {
    const oauthError = searchParams.get('error')
    if (oauthError === 'oauth_failed') {
      dispatch(showSnackbar({ 
        message: "OAuth authentication failed. Please try again.", 
        type: "error" 
      }))
      // Clear the error parameter from URL
      const url = new URL(window.location.href)
      url.searchParams.delete('error')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams, dispatch])

  // Show error snackbar when error changes
  useEffect(() => {
    if (error) {
      dispatch(showSnackbar({ message: error, type: "error" }))
    }
  }, [error, dispatch])

  // Handle successful login
  useEffect(() => {
    if (user && !showLoginSuccess) {
      const displayName = user.full_name || user.email || 'User'
      setUserName(displayName)
      setShowLoginSuccess(true)
    }
  }, [user, showLoginSuccess])

  const onSubmit = async (data: LoginFormData) => {
    dispatch(clearError())
    
    try {
      const deviceInfo = getDeviceInfo()
      
      await dispatch(loginUser({ 
        email: data.email, 
        password: data.password,
        ...deviceInfo
      })).unwrap()
      
      // Success handling is done in useEffect above
    } catch (err) {
      // Error is already in Redux state and displayed via useEffect
    }
  }

  // OAuth handlers
  const handleGoogleLogin = async () => {
    try {
      const result = await dispatch(initiateOAuth('google')).unwrap()
      
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl
      }
    } catch (error: any) {
      // Error is already in Redux state
    }
  }

  const handleFacebookLogin = async () => {
    try {
      const result = await dispatch(initiateOAuth('facebook')).unwrap()
      
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl
      }
    } catch (error: any) {
      // Error is already in Redux state
    }
  }

  const handleAppleLogin = () => {
    dispatch(showSnackbar({ 
      message: "Apple login coming soon", 
      type: "info" 
    }))
  }

  const handleTwitterLogin = () => {
    dispatch(showSnackbar({ 
      message: "Twitter login coming soon", 
      type: "info" 
    }))
  }

  const handleGithubLogin = () => {
    dispatch(showSnackbar({ 
      message: "GitHub login coming soon", 
      type: "info" 
    }))
  }

  // Clear field error when user starts typing
  const handleInputChange = (field: string) => {
    if (validationErrors[field]) {
      dispatch(clearFieldError(field))
    }
  }

  const handleLoginSuccessComplete = () => {
    if (!user) {
      router.push("/")
      return
    }

    // Determine redirect based on user state
    const onboardingCompleted = (user as any).onboarding_completed
    const isSubscribed = (user as any).is_subscribed
    const activeProfileId = localStorage.getItem("activeProfileId")

    if (!onboardingCompleted) {
      router.push("/onboarding")
    } else if (isSubscribed === false) {
      router.push("/onboarding?step=2")
    } else if (!activeProfileId) {
      router.push("/profiles")
    } else {
      const redirectPath = searchParams.get('redirect')
      router.push(redirectPath || "/")
    }
  }

  // Show login success animation
  if (showLoginSuccess) {
    return <LoginSuccess userName={userName} onComplete={handleLoginSuccessComplete} />
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/loginback.png"
          alt="African Cinema"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-black/90" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Login Form */}
        <div className="w-full flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="text-white hover:bg-white/10 rounded-full px-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>

            <Card className="bg-black/50 border-white/20 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="flex justify-center mb-3">
                  <Image src="/logo.png" alt="UbiqEnt" width={120} height={32} />
                </div>
                <CardTitle className="text-white text-3xl font-bold mb-2">
                  Sign In
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Welcome back! Please sign in to your UbiqEnt account
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-white font-medium text-lg">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        className={`pl-14 h-14 bg-white/10 text-white placeholder-gray-400 rounded-2xl text-lg transition-all duration-300 ${
                          (errors.email || validationErrors.email) 
                            ? "border-red-500 focus:border-red-500" 
                            : "border-white/20 focus:border-blue-500"
                        }`}
                        {...register("email")}
                        onChange={(e) => {
                          register("email").onChange(e)
                          handleInputChange("email")
                        }}
                      />
                    </div>
                    {(errors.email || validationErrors.email) && (
                      <p className="text-red-400 text-sm">
                        {validationErrors.email || errors.email?.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-white font-medium text-lg">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`pl-14 pr-14 h-14 bg-white/10 text-white placeholder-gray-400 rounded-2xl text-lg transition-all duration-300 ${
                          (errors.password || validationErrors.password) 
                            ? "border-red-500 focus:border-red-500" 
                            : "border-white/20 focus:border-blue-500"
                        }`}
                        {...register("password")}
                        onChange={(e) => {
                          register("password").onChange(e)
                          handleInputChange("password")
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-6 h-6" />
                        ) : (
                          <Eye className="w-6 h-6" />
                        )}
                      </Button>
                    </div>
                    {(errors.password || validationErrors.password) && (
                      <p className="text-red-400 text-sm">
                        {validationErrors.password || errors.password?.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-6 h-6 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-white/20" />
                  <span className="px-4 text-gray-400 text-sm">OR</span>
                  <div className="flex-1 h-px bg-white/20" />
                </div>

                {/* Social Logins */}
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-full bg-white text-gray-900 hover:bg-gray-100"
                    onClick={handleGoogleLogin}
                    disabled={isOAuthLoading && oauthProvider === 'google'}
                  >
                    {isOAuthLoading && oauthProvider === 'google' ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FaGoogle className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-full bg-[#1877F2] text-white hover:opacity-90 border-0"
                    onClick={handleFacebookLogin}
                    disabled={isOAuthLoading && oauthProvider === 'facebook'}
                  >
                    {isOAuthLoading && oauthProvider === 'facebook' ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <FaFacebookF className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-full bg-black text-white hover:bg-gray-900"
                    onClick={handleAppleLogin}
                    disabled={isOAuthLoading}
                  >
                    <FaApple className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-full bg-[#1DA1F2] text-white hover:opacity-90 border-0"
                    onClick={handleTwitterLogin}
                    disabled={isOAuthLoading}
                  >
                    <FaTwitter className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 rounded-full bg-gray-800 text-white hover:bg-gray-700"
                    onClick={handleGithubLogin}
                    disabled={isOAuthLoading}
                  >
                    <FaGithub className="h-5 w-5" />
                  </Button>
                </div>

                <div className="text-center pt-6">
                  <p className="text-gray-300">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/register"
                      className="text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      Create Account
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
