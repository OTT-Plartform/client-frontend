"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight } from "lucide-react"

const registerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
})

type RegisterFormData = yup.InferType<typeof registerSchema>

interface RegisterFormProps {
  onSuccess?: () => void
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  })

  const password = watch("password")

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" }

    let strength = 0
    if (password.length >= 6) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/\d/)) strength++
    if (password.match(/[^a-zA-Z\d]/)) strength++

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Weak", color: "bg-red-500" },
      { strength: 2, label: "Fair", color: "bg-yellow-500" },
      { strength: 3, label: "Good", color: "bg-blue-500" },
      { strength: 4, label: "Strong", color: "bg-green-500" },
    ]

    return levels[strength]
  }

  const passwordStrength = getPasswordStrength(password)

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // For registration, we trigger onboarding
      setIsLoading(false)
      onSuccess?.() // This will trigger the onboarding flow
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white font-medium">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            className="pl-12 h-12 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 rounded-xl focus:border-red-600 focus:ring-red-600/20 transition-all duration-200"
            {...register("name")}
          />
        </div>
        {errors.name && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.name.message}
          </p>
        )}
      </div>

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
            placeholder="Create a password"
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

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${passwordStrength.color.replace("bg-", "text-")}`}>
                {passwordStrength.label}
              </span>
            </div>
          </div>
        )}

        {errors.password && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white font-medium">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            className="pl-12 pr-12 h-12 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 rounded-xl focus:border-red-600 focus:ring-red-600/20 transition-all duration-200"
            {...register("confirmPassword")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm flex items-center gap-1">
            <span className="w-1 h-1 bg-red-400 rounded-full" />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-600 focus:ring-2 mt-1"
          required
        />
        <label htmlFor="terms" className="text-gray-300 text-sm leading-relaxed">
          I agree to the{" "}
          <button type="button" className="text-red-400 hover:text-red-300 underline">
            Terms of Service
          </button>{" "}
          and{" "}
          <button type="button" className="text-red-400 hover:text-red-300 underline">
            Privacy Policy
          </button>
        </label>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            Create Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </form>
  )
}
