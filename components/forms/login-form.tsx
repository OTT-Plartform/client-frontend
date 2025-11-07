"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { loginUser, initiateOAuth, clearError, clearFieldError } from "@/store/slices/authSlice"
import { showSnackbar } from "@/store/slices/uiSlice"
import { getDeviceInfo } from "@/lib/deviceUtils"
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from "lucide-react"
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
  const dispatch = useAppDispatch()
  const { isLoading, isOAuthLoading, oauthProvider, error, validationErrors } = useAppSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  })

  // Show error snackbar when error changes
  useEffect(() => {
    if (error) {
      dispatch(showSnackbar({ message: error, type: "error" }))
    }
  }, [error, dispatch])

  const onSubmit = async (data: LoginFormData) => {
    dispatch(clearError())
    
    try {
      const deviceInfo = getDeviceInfo()
      
      await dispatch(loginUser({ 
        email: data.email, 
        password: data.password,
        ...deviceInfo
      })).unwrap()
      
      dispatch(showSnackbar({ 
        message: "Welcome back! Login successful", 
        type: "success" 
      }))
      
      onSuccess?.()
    } catch (err) {
      // Error is already in Redux state, no need to handle here
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
            className={`pl-12 h-12 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 rounded-xl transition-all duration-200 ${
              validationErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'focus:border-red-600 focus:ring-red-600/20'
            }`}
            {...register("email")}
            onChange={(e) => {
              register("email").onChange(e)
              handleInputChange("email")
            }}
          />
        </div>
        {(errors.email || validationErrors.email) && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full" />
            {validationErrors.email || errors.email?.message}
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
            className={`pl-12 pr-12 h-12 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 rounded-xl transition-all duration-200 ${
              validationErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'focus:border-red-600 focus:ring-red-600/20'
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
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </Button>
        </div>
        {(errors.password || validationErrors.password) && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full" />
            {validationErrors.password || errors.password?.message}
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

      {/* Social Login Buttons */}
      <div className="flex items-center justify-center gap-3">
        <Button 
          type="button" 
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
          type="button" 
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
          type="button" 
          variant="outline" 
          size="icon" 
          className="h-11 w-11 rounded-full bg-black text-white hover:bg-gray-900" 
          onClick={handleAppleLogin}
          disabled={isOAuthLoading}
        >
          <FaApple className="h-5 w-5" />
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          className="h-11 w-11 rounded-full bg-[#1DA1F2] text-white hover:opacity-90 border-0" 
          onClick={handleTwitterLogin}
          disabled={isOAuthLoading}
        >
          <FaTwitter className="h-5 w-5" />
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          className="h-11 w-11 rounded-full bg-gray-800 text-white hover:bg-gray-700" 
          onClick={handleGithubLogin}
          disabled={isOAuthLoading}
        >
          <FaGithub className="h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}
