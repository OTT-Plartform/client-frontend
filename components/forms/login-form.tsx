"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setUser } from "@/store/slices/authSlice"
import { showSnackbar } from "@/store/slices/uiSlice"
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, LogIn } from "lucide-react"
import { FaGoogle, FaFacebookF, FaApple, FaTwitter, FaGithub } from "react-icons/fa"

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

type LoginFormData = yup.InferType<typeof loginSchema>

interface LoginFormProps {
  onSuccess?: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
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
    try {
      const { api } = await import("@/lib/api")
      const res = await api.login({ email: data.email, password: data.password })
      dispatch(setUser(res.user))
      localStorage.setItem("userData", JSON.stringify(res.user))
      dispatch(showSnackbar({ message: "Welcome back! Login successful", type: "success" }))
      onSuccess?.()
    } catch (e: any) {
      let message = "Login failed"
      const raw = e?.message ?? ""
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          const serverMsg = Array.isArray(parsed?.message)
            ? parsed.message.join(", ")
            : parsed?.message || parsed?.error
          if (serverMsg) message = serverMsg
        } catch {
          message = raw
        }
      }
      dispatch(showSnackbar({ message, type: "error" }))
    } finally {
      setIsLoading(false)
    }
  }

  // Placeholder auth handlers
  const handleGoogleLogin = () => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
    window.location.href = `${base}/auth/google`
  }

  const handleFacebookLogin = () => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
    window.location.href = `${base}/auth/facebook`
  }

  const handleAppleLogin = () => dispatch(showSnackbar({ message: "Apple login not configured", type: "info" }))
  const handleTwitterLogin = () => dispatch(showSnackbar({ message: "Twitter login not configured", type: "info" }))
  const handleGithubLogin = () => dispatch(showSnackbar({ message: "GitHub login not configured", type: "info" }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="pl-12 h-12 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 rounded-xl focus:border-red-600 focus:ring-red-600/20 transition-all duration-200"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white font-medium">Password</Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pl-12 pr-12 h-12 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 rounded-xl focus:border-red-600 focus:ring-red-600/20 transition-all duration-200"
            {...register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </Button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-600 focus:ring-2"
          />
          <span className="text-gray-300 text-sm">Remember me</span>
        </label>
        <button type="button" className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-black px-2 text-gray-400">Or continue with</span>
        </div>
      </div>

      {/* Social Login Buttons (circular icons) */}
      <div className="flex items-center justify-center gap-3">
        <Button type="button" variant="outline" size="icon" className="h-11 w-11 rounded-full bg-white text-gray-900 hover:bg-gray-100" onClick={handleGoogleLogin}>
          <FaGoogle className="h-5 w-5" />
        </Button>
        <Button type="button" variant="outline" size="icon" className="h-11 w-11 rounded-full bg-[#1877F2] text-white hover:opacity-90 border-0" onClick={handleFacebookLogin}>
          <FaFacebookF className="h-5 w-5" />
        </Button>
        <Button type="button" variant="outline" size="icon" className="h-11 w-11 rounded-full bg-black text-white hover:bg-gray-900" onClick={handleAppleLogin}>
          <FaApple className="h-5 w-5" />
        </Button>
        <Button type="button" variant="outline" size="icon" className="h-11 w-11 rounded-full bg-[#1DA1F2] text-white hover:opacity-90 border-0" onClick={handleTwitterLogin}>
          <FaTwitter className="h-5 w-5" />
        </Button>
        <Button type="button" variant="outline" size="icon" className="h-11 w-11 rounded-full bg-gray-800 text-white hover:bg-gray-700" onClick={handleGithubLogin}>
          <FaGithub className="h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}
