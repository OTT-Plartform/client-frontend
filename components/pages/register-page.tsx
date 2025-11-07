"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { registerUser, initiateOAuth, clearError, clearFieldError } from "@/store/slices/authSlice"
import { showSnackbar } from "@/store/slices/uiSlice"
import { Mail, Lock, Home, Loader2, Play, Crown, Users, Check, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

const schema = yup.object({
  email: yup.string().email("Please enter a valid email address").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
}).required()

type FormValues = yup.InferType<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, isOAuthLoading, oauthProvider, error, validationErrors, user } = useAppSelector((state) => state.auth)

  const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting, touchedFields } } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "", passwordConfirmation: "" },
  })

  // Watch fields for password strength and clearing backend errors
  const watchedEmail = watch("email")
  const watchedPassword = watch("password")
  const watchedPasswordConfirmation = watch("passwordConfirmation")

  useEffect(() => {
    if (validationErrors.email && watchedEmail !== undefined) {
      dispatch(clearFieldError("email"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedEmail])

  useEffect(() => {
    if (validationErrors.password && watchedPassword !== undefined) {
      dispatch(clearFieldError("password"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedPassword])

  useEffect(() => {
    if (validationErrors.passwordConfirmation && watchedPasswordConfirmation !== undefined) {
      dispatch(clearFieldError("passwordConfirmation"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedPasswordConfirmation])

  // Show server/global errors
  useEffect(() => {
    if (error) {
      dispatch(showSnackbar({ message: error, type: "error" }))
    }
  }, [error, dispatch])

  // Redirect on success (authSlice sets user)
  useEffect(() => {
    if (user) {
      dispatch(showSnackbar({ message: "Registration successful! Welcome!", type: "success" }))
      router.push("/onboarding")
    }
  }, [user, router, dispatch])

  // Password strength helper
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    const labels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"]
    const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-blue-500"]
    return { strength, label: labels[strength], color: colors[strength] }
  }

  const passwordStrength = getPasswordStrength(watchedPassword || "")

  const onSubmit = async (data: FormValues) => {
    dispatch(clearError())
    try {
      await dispatch(registerUser({
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      })).unwrap()
      // success handled by effect
    } catch {
      // errors injected into Redux state by thunk -> displayed via validationErrors / global error
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    try {
      const result = await dispatch(initiateOAuth(provider)).unwrap()
      if (result.redirectUrl) window.location.href = result.redirectUrl
    } catch {
      // handled in slice
    }
  }

  const fieldError = (field: keyof FormValues) => {
    return (validationErrors && (validationErrors as any)[field]) || (errors as any)[field]?.message || ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <img
          src="/loginback.png"
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
                      Google
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
                      Facebook
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
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          {...register("email")}
                          type="email"
                          placeholder="Enter your email"
                          className={`h-12 pl-10 pr-10 bg-white/10 text-white placeholder-gray-400 rounded-xl transition-all duration-300 ${fieldError("email") ? "border-red-500" : "border-white/20 focus:border-blue-500"}`}
                        />
                      </div>
                      {fieldError("email") && <p className="text-red-400 text-sm flex items-center gap-1"><X className="w-3 h-3" />{fieldError("email")}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          {...register("password")}
                          type="password"
                          placeholder="Create a password"
                          className={`h-12 pl-10 pr-10 bg-white/10 text-white placeholder-gray-400 rounded-xl transition-all duration-300 ${fieldError("password") ? "border-red-500" : "border-white/20 focus:border-blue-500"}`}
                        />
                      </div>

                      {/* Password Strength Indicator */}
                      {watchedPassword && (
                        <div className="space-y-2">
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(level => (
                              <div key={level} className={`h-1 flex-1 rounded-full ${level <= passwordStrength.strength ? passwordStrength.color : "bg-gray-600"}`} />
                            ))}
                          </div>
                          {passwordStrength.label && <p className="text-xs text-gray-400">Strength: <span className="text-white">{passwordStrength.label}</span></p>}
                        </div>
                      )}

                      {fieldError("password") && <p className="text-red-400 text-sm flex items-center gap-1"><X className="w-3 h-3" />{fieldError("password")}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                      <Label className="text-white font-medium">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          {...register("passwordConfirmation")}
                          type="password"
                          placeholder="Confirm your password"
                          className={`h-12 pl-10 pr-10 bg-white/10 text-white placeholder-gray-400 rounded-xl transition-all duration-300 ${fieldError("passwordConfirmation") ? "border-red-500" : "border-white/20 focus:border-blue-500"}`}
                        />
                      </div>
                      {fieldError("passwordConfirmation") && <p className="text-red-400 text-sm flex items-center gap-1"><X className="w-3 h-3" />{fieldError("passwordConfirmation")}</p>}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || isSubmitting || !isValid}
                      className={`w-full h-12 text-white rounded-full text-lg font-semibold shadow-lg transition-all ${isValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 cursor-not-allowed"}`}
                    >
                      {isLoading || isSubmitting ? (<><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating Account...</>) : "Create Account"}
                    </Button>
                  </form>

                  {/* Already have account link */}
                  <div className="text-center mt-6">
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
