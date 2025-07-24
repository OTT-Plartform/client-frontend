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
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from "lucide-react"

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

    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: "1",
        name: "John Doe",
        email: data.email,
        avatar: "/placeholder.svg?height=40&width=40",
        subscription: "Premium",
        interests: ["drama", "action", "comedy"],
        country: "Zimbabwe",
        city: "Harare",
      }

      dispatch(setUser(mockUser))
      dispatch(showSnackbar({ message: "Welcome back! Login successful", type: "success" }))

      // Store in localStorage
      localStorage.setItem("authToken", "mock-jwt-token")
      localStorage.setItem("userData", JSON.stringify(mockUser))

      setIsLoading(false)
      onSuccess?.()
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white font-medium">
          Email Address
        </Label>
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

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white font-medium">
          Password
        </Label>
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
    </form>
  )
}
