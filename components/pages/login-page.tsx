"use client"

import { useState } from "react"
import { FaApple } from "react-icons/fa"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
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
import { setUser } from "@/store/slices/authSlice"
import { showSnackbar } from "@/store/slices/uiSlice"
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
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
        subscription: "Premium",
        interests: ["drama", "action", "comedy"],
        country: "Zimbabwe",
        city: "Harare",
      }

      dispatch(setUser(mockUser))
      dispatch(
        showSnackbar({
          message: "Welcome back! Login successful",
          type: "success",
        })
      )
      localStorage.setItem("authToken", "mock-jwt-token")
      localStorage.setItem("userData", JSON.stringify(mockUser))

      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1489599162163-3fb4b4b5b0b3?auto=format&fit=crop&w=1920&q=80"
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
                <CardTitle className="text-white text-3xl font-bold mb-2">
                  Sign In
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Welcome back! Please sign in to your ZIMUSHA account
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Email */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-white font-medium text-lg"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        className="pl-14 h-14 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-2xl text-lg"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-blue-400 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="password"
                      className="text-white font-medium text-lg"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-14 pr-14 h-14 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-2xl text-lg"
                        {...register("password")}
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
                    {errors.password && (
                      <p className="text-blue-400 text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold text-lg rounded-2xl shadow-lg"
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
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-white/20" />
                  <span className="px-4 text-gray-400 text-sm">OR</span>
                  <div className="flex-1 h-px bg-white/20" />
                </div>

                {/* Social Logins */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 rounded-xl"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-3 h-12 rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 transition"
                  >
                  <FaApple className="w-6 h-6" />
                    Continue with Apple
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
