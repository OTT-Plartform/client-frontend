"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setUser, setOAuthLoading } from "@/store/slices/authSlice"
import { showSnackbar } from "@/store/slices/uiSlice"
import { api } from "@/lib/api"
import { Mail, Lock, Home, Loader2, Play, Crown, Users } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import Link from "next/link"
import Image from "next/image"
import * as yup from "yup"

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { isOAuthLoading, oauthProvider } = useSelector((state: RootState) => state.auth)
  const [formData, setFormData] = useState({
      email: "",
    password: "",
    passwordConfirmation: ""
  })

  // Validation schema
  const validationSchema = yup.object({
    email: yup.string().email("Please enter a valid email address").required("Email is required"),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    passwordConfirmation: yup.string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Please confirm your password")
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({}) // Clear previous errors
    
    try {
      // Validate form data
      await validationSchema.validate(formData, { abortEarly: false })
      
      const { api } = await import("@/lib/api")
      const response = await api.register({
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.passwordConfirmation
      })
      
      if (response.success) {
        dispatch(setUser(response.data.user))
        dispatch(showSnackbar({ message: "Registration successful! Welcome to ZIMUSHA!", type: "success" }))
        router.push("/onboarding")
      }
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        // Yup validation errors
        const yupErrors: { [key: string]: string } = {}
        error.inner.forEach((err: any) => {
          yupErrors[err.path] = err.message
        })
        setErrors(yupErrors)
      } else if (error.message) {
        try {
          // Try to parse backend validation errors
          const parsedError = JSON.parse(error.message)
          if (parsedError.errors) {
            // Backend validation errors
            setErrors(parsedError.errors)
            dispatch(showSnackbar({ 
              message: parsedError.message || "Please fix the validation errors", 
              type: "error" 
            }))
          } else {
            // General backend error
            dispatch(showSnackbar({ 
              message: parsedError.message || "Registration failed", 
              type: "error" 
            }))
          }
        } catch {
          // Fallback to general error
          dispatch(showSnackbar({ 
            message: error.message || "Registration failed", 
            type: "error" 
          }))
        }
      } else {
        dispatch(showSnackbar({ message: "Registration failed", type: "error" }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    dispatch(setOAuthLoading({ loading: true, provider }))
    try {
      if (provider === 'google') {
        const googleAuthUrl = await api.googleAuth()
        window.location.href = googleAuthUrl
      } else if (provider === 'facebook') {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://ubiqent.com:8080/api"
        window.location.href = `${base}/auth/facebook`
      }
    } catch (error: any) {
      dispatch(setOAuthLoading({ loading: false, provider: undefined }))
      dispatch(showSnackbar({ 
        message: error.message || `Failed to initialize ${provider} login`, 
        type: "error" 
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1489599162163-3fb4b4b5b0b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="African Cinema Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Back to Home Button */}
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-white hover:bg-white/10 rounded-full px-4"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch h-full">
            {/* Left Side - Engaging Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <Image src="/logo.png" alt="UbiqEnt" width={140} height={36} />
                </div>
                <h1 className="text-white text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  Welcome to the Future of
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> African Entertainment</span>
                </h1>
                <p className="text-gray-300 text-lg lg:text-xl mb-6 leading-relaxed">
                  Join millions of viewers discovering the best African movies, series, and exclusive content from across the continent.
                </p>
              </div>



              {/* Feature Highlights */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white text-base font-semibold">Unlimited Streaming</h3>
                    <p className="text-gray-400 text-sm">Watch thousands of movies and TV shows anytime, anywhere</p>
                    </div>
                  </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white text-base font-semibold">Premium Content</h3>
                    <p className="text-gray-400 text-sm">Exclusive African content you won't find anywhere else</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                              </div>
                  <div className="text-left">
                    <h3 className="text-white text-base font-semibold">Family Friendly</h3>
                    <p className="text-gray-400 text-sm">Multiple profiles and parental controls for the whole family</p>
                  </div>
                </div>
                            </div>

              {/* Content Preview */}
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                <h3 className="text-white text-lg font-semibold mb-3">What You'll Discover</h3>
                <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mx-auto mb-1 flex items-center justify-center">
                      <span className="text-white text-lg">🎬</span>
                            </div>
                    <p className="text-gray-300 text-xs">African Cinema</p>
                            </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl mx-auto mb-1 flex items-center justify-center">
                      <span className="text-white text-lg">📺</span>
                          </div>
                    <p className="text-gray-300 text-xs">TV Series</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl mx-auto mb-1 flex items-center justify-center">
                      <span className="text-white text-lg">🎵</span>
                    </div>
                    <p className="text-gray-300 text-xs">Music & Shows</p>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center">
                  <div className="text-white text-xl font-bold">10K+</div>
                  <div className="text-gray-400 text-xs">Movies & Shows</div>
                </div>
                <div className="text-center">
                  <div className="text-white text-xl font-bold">50+</div>
                  <div className="text-gray-400 text-xs">African Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-white text-xl font-bold">1M+</div>
                  <div className="text-gray-400 text-xs">Happy Viewers</div>
                </div>
                      </div>
                    </div>

            {/* Right Side - Registration Form */}
            <div className="flex justify-center lg:justify-end h-full">
              <Card className="bg-black/40 border-white/20 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden w-full max-w-lg h-full flex flex-col">
                

            <CardContent className="px-8 pb-8 flex-1 flex flex-col justify-center mt-3">
              {/* OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button
                  onClick={() => handleOAuthLogin('google')}
                  disabled={isOAuthLoading}
                  className="w-full h-12 bg-white text-gray-900 hover:bg-gray-100 rounded-xl text-base font-semibold"
                >
                  {isOAuthLoading && oauthProvider === 'google' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
                  )}
                  Continue with Google
                </Button>
                <Button
                  onClick={() => handleOAuthLogin('facebook')}
                  disabled={isOAuthLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-base font-semibold"
                >
                  {isOAuthLoading && oauthProvider === 'facebook' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-4 h-4 mr-2" />
                  )}
                  Continue with Facebook
                </Button>
                                </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/40 px-2 text-gray-400">Or continue with email</span>
                              </div>
                            </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="space-y-3">
                  <Label className="text-white font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, email: e.target.value }))
                        if (errors.email) setErrors(prev => ({ ...prev, email: "" }))
                      }}
                      className={`h-12 pl-10 bg-white/10 text-white placeholder-gray-400 rounded-xl focus:ring-blue-500/20 transition-all duration-300 ${
                        errors.email 
                          ? "border-red-500 focus:border-red-500" 
                          : "border-white/20 focus:border-blue-500"
                      }`}
                      required
                    />
                      </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-white font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, password: e.target.value }))
                        if (errors.password) setErrors(prev => ({ ...prev, password: "" }))
                      }}
                      className={`h-12 pl-10 bg-white/10 text-white placeholder-gray-400 rounded-xl focus:ring-blue-500/20 transition-all duration-300 ${
                        errors.password 
                          ? "border-red-500 focus:border-red-500" 
                          : "border-white/20 focus:border-blue-500"
                      }`}
                      required
                      minLength={8}
                    />
                  </div>
                  {errors.password ? (
                    <p className="text-red-400 text-sm">{errors.password}</p>
                  ) : (
                    <p className="text-gray-400 text-sm">Minimum 8 characters</p>
                            )}
                          </div>

                <div className="space-y-3">
                  <Label className="text-white font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        type="password"
                      placeholder="Confirm your password"
                      value={formData.passwordConfirmation}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, passwordConfirmation: e.target.value }))
                        if (errors.passwordConfirmation) setErrors(prev => ({ ...prev, passwordConfirmation: "" }))
                      }}
                      className={`h-12 pl-10 bg-white/10 text-white placeholder-gray-400 rounded-xl focus:ring-blue-500/20 transition-all duration-300 ${
                        errors.passwordConfirmation 
                          ? "border-red-500 focus:border-red-500" 
                          : "border-white/20 focus:border-blue-500"
                      }`}
                      required
                    />
                  </div>
                  {errors.passwordConfirmation && (
                    <p className="text-red-400 text-sm">{errors.passwordConfirmation}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || Object.keys(errors).length > 0 || !formData.email || !formData.password || !formData.passwordConfirmation}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-semibold shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              {/* Already have account link */}
              <div className="text-center mt-8">
                <p className="text-gray-300">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
