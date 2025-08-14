"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setUser } from "@/store/slices/authSlice"
import { showSnackbar } from "@/store/slices/uiSlice"
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

type LoginFormData = yup.InferType<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    setTimeout(() => {
      const mockUser = {
        id: "1",
        name: "John Doe",
        email: data.email,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        subscription: "Premium",
        interests: ["drama", "action", "comedy"],
        country: "Zimbabwe",
        city: "Harare",
      }

      dispatch(setUser(mockUser))
      dispatch(showSnackbar({ message: "Welcome back! Login successful", type: "success" }))
      localStorage.setItem("authToken", "mock-jwt-token")
      localStorage.setItem("userData", JSON.stringify(mockUser))

      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1489599162163-3fb4b4b5b0b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="African Cinema"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 opacity-60">
          <img
            src="https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="African Culture"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-900/70 to-indigo-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-700/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
          <div className="max-w-lg">
            <div className="mb-8">
              <h1 className="text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
                Welcome Back to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  Afristream
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Your gateway to authentic African entertainment. Discover stories that inspire, educate, and entertain.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: "Premium African Content",
                  text: "Access exclusive movies, series, and documentaries",
                  from: "from-blue-500",
                  to: "to-blue-700",
                },
                {
                  title: "Multi-Device Streaming",
                  text: "Watch on any device, anywhere, anytime",
                  from: "from-blue-600",
                  to: "to-indigo-700",
                },
                {
                  title: "Personalized Experience",
                  text: "Get recommendations based on your interests",
                  from: "from-indigo-500",
                  to: "to-blue-800",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${item.from} ${item.to} rounded-full flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-lg">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-gray-300 text-sm italic">
                "Afristream has revolutionized how we consume African content. The quality and variety is unmatched!"
              </p>
              <div className="flex items-center gap-3 mt-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80"
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-white font-medium text-sm">Sarah Mwangi</p>
                  <p className="text-gray-400 text-xs">Premium Subscriber</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
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

            <Card className="bg-black/40 border-white/20 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-8 pt-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">Afristream</span>
                </div>
                <CardTitle className="text-white text-3xl font-bold mb-2">Sign In</CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Welcome back! Please sign in to your account
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
                        className="pl-14 h-14 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-2xl text-lg focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-blue-400 text-sm flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full" />
                        {errors.email.message}
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
                        className="pl-14 pr-14 h-14 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-2xl text-lg focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                        {...register("password")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-blue-400 text-sm flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Remember me */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-600 focus:ring-2"
                      />
                      <span className="text-gray-300 text-sm">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold text-lg rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
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
                        <ArrowRight className="w-6 h-6 ml-3" />
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-4">
                    <p className="text-gray-300">
                      Don't have an account?{" "}
                      <Link
                        href="/register"
                        className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                      >
                        Create Account
                      </Link>
                    </p>
                  </div>
                </form>

                {/* Social logins remain unchanged */}
              </CardContent>
            </Card>

            <div className="lg:hidden mt-8 text-center">
              <p className="text-gray-400 text-sm">Your gateway to authentic African entertainment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
