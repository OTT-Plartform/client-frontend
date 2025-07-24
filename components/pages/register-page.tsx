"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { setUser } from "@/store/slices/authSlice"
import { showSnackbar } from "@/store/slices/uiSlice"
import {
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  Crown,
  Play,
  Star,
  Users,
  CheckCircle,
  CreditCard,
  Smartphone,
  Home,
} from "lucide-react"
import Link from "next/link"

// Subscription plans data
const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "month",
    description: "Get started with limited content",
    icon: "Star",
    features: [
      "Limited content library",
      "SD streaming quality",
      "Ads included",
      "1 device at a time",
      "Basic support",
    ],
    popular: false,
    hasAds: true,
    maxDevices: 1,
    quality: "SD",
    downloadLimit: 0,
  },
  {
    id: "basic",
    name: "Basic",
    price: 4.99,
    period: "month",
    description: "Perfect for casual viewers",
    icon: "Play",
    features: [
      "Full content library",
      "HD streaming quality",
      "Limited ads",
      "2 devices simultaneously",
      "Standard support",
      "5 downloads per month",
    ],
    popular: false,
    hasAds: true,
    maxDevices: 2,
    quality: "HD",
    downloadLimit: 5,
  },
  {
    id: "premium",
    name: "Premium",
    price: 9.99,
    period: "month",
    description: "Most popular choice",
    icon: "Crown",
    features: [
      "Full content library",
      "4K Ultra HD streaming",
      "No ads",
      "4 devices simultaneously",
      "Priority support",
      "Unlimited downloads",
      "Offline viewing",
      "Early access to new content",
    ],
    popular: true,
    hasAds: false,
    maxDevices: 4,
    quality: "4K",
    downloadLimit: -1, // unlimited
  },
  {
    id: "family",
    name: "Family",
    price: 14.99,
    period: "month",
    description: "Best for families",
    icon: "Users",
    features: [
      "Full content library",
      "4K Ultra HD streaming",
      "No ads",
      "6 devices simultaneously",
      "24/7 premium support",
      "Unlimited downloads",
      "Offline viewing",
      "Parental controls",
      "Multiple profiles (up to 6)",
      "Early access to new content",
    ],
    popular: false,
    hasAds: false,
    maxDevices: 6,
    quality: "4K",
    downloadLimit: -1, // unlimited
  },
]

const paymentMethods = [
  {
    id: "ecocash",
    name: "EcoCash",
    type: "mobile_money",
    icon: "Smartphone",
    description: "Pay with your EcoCash wallet",
    countries: ["Zimbabwe"],
    fees: "No fees",
  },
  {
    id: "onemoney",
    name: "OneMoney",
    type: "mobile_money",
    icon: "Smartphone",
    description: "Pay with your OneMoney account",
    countries: ["Zimbabwe"],
    fees: "No fees",
  },
  {
    id: "telecash",
    name: "TeleCash",
    type: "mobile_money",
    icon: "Smartphone",
    description: "Pay with your TeleCash wallet",
    countries: ["Zimbabwe"],
    fees: "No fees",
  },
  {
    id: "visa",
    name: "Visa",
    type: "card",
    icon: "CreditCard",
    description: "Pay with your Visa card",
    countries: ["Global"],
    fees: "Standard rates apply",
  },
  {
    id: "mastercard",
    name: "Mastercard",
    type: "card",
    icon: "CreditCard",
    description: "Pay with your Mastercard",
    countries: ["Global"],
    fees: "Standard rates apply",
  },
]

const interests = [
  { id: "drama", name: "Drama", icon: "Theater" },
  { id: "comedy", name: "Comedy", icon: "Laugh" },
  { id: "action", name: "Action", icon: "Zap" },
  { id: "romance", name: "Romance", icon: "Heart" },
  { id: "thriller", name: "Thriller", icon: "Eye" },
  { id: "documentary", name: "Documentary", icon: "Camera" },
  { id: "music", name: "Music", icon: "Music" },
  { id: "talk-show", name: "Talk Shows", icon: "Mic" },
  { id: "podcast", name: "Podcasts", icon: "Headphones" },
  { id: "spiritual", name: "Spiritual", icon: "Church" },
  { id: "cultural", name: "Cultural", icon: "Globe" },
  { id: "educational", name: "Educational", icon: "BookOpen" },
]

interface OnboardingData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    country: string
    city: string
    bio: string
  }
  interests: string[]
  selectedPlan: string
  paymentMethod: string
  subscriptionPeriod: "monthly" | "yearly"
}

export default function RegisterPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      country: "Zimbabwe",
      city: "",
      bio: "",
    },
    interests: [],
    selectedPlan: "free",
    paymentMethod: "",
    subscriptionPeriod: "monthly",
  })

  const totalSteps = 5

  const updatePersonalInfo = (field: string, value: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }

  const toggleInterest = (interestId: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId],
    }))
  }

  const handlePlanSelect = (planId: string) => {
    setOnboardingData((prev) => ({ ...prev, selectedPlan: planId }))
  }

  const handlePaymentMethodSelect = (methodId: string) => {
    setOnboardingData((prev) => ({ ...prev, paymentMethod: methodId }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const selectedPlanData = subscriptionPlans.find((p) => p.id === onboardingData.selectedPlan)

      const mockUser = {
        id: "1",
        name: `${onboardingData.personalInfo.firstName} ${onboardingData.personalInfo.lastName}`,
        email: onboardingData.personalInfo.email,
        phone: onboardingData.personalInfo.phone,
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
        subscription: selectedPlanData?.name || "Free",
        country: onboardingData.personalInfo.country,
        city: onboardingData.personalInfo.city,
        bio: onboardingData.personalInfo.bio,
        interests: onboardingData.interests,
        plan: selectedPlanData,
        paymentMethod: onboardingData.paymentMethod,
        needsOnboarding: false, // Mark as completed
      }

      dispatch(setUser(mockUser))
      dispatch(
        showSnackbar({
          message: `Welcome to OTT Streaming! Your ${selectedPlanData?.name} plan is now active.`,
          type: "success",
        }),
      )

      // Store in localStorage
      localStorage.setItem("authToken", "mock-jwt-token")
      localStorage.setItem("userData", JSON.stringify(mockUser))

      setIsLoading(false)

      // Redirect to home
      router.push("/")
    }, 2000)
  }

  const getStepIcon = (step: number) => {
    const icons = [User, Star, Crown, CreditCard, CheckCircle]
    const Icon = icons[step - 1]
    return <Icon className="w-5 h-5" />
  }

  const selectedPlan = subscriptionPlans.find((p) => p.id === onboardingData.selectedPlan)
  const selectedPayment = paymentMethods.find((p) => p.id === onboardingData.paymentMethod)

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

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Back to Home Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-white hover:bg-white/10 rounded-full px-4"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      i + 1 <= currentStep
                        ? "bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {i + 1 < currentStep ? <Check className="w-6 h-6" /> : getStepIcon(i + 1)}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all duration-300 ${
                        i + 1 < currentStep ? "bg-gradient-to-r from-red-600 to-purple-600" : "bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-white text-lg font-medium">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>

          <Card className="bg-black/40 border-white/20 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">OTT</span>
              </div>
              <CardTitle className="text-white text-3xl font-bold mb-2">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Your Interests"}
                {currentStep === 3 && "Choose Your Plan"}
                {currentStep === 4 && "Payment Method"}
                {currentStep === 5 && "Complete Setup"}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "What content do you enjoy?"}
                {currentStep === 3 && "Select the perfect plan for you"}
                {currentStep === 4 && "How would you like to pay?"}
                {currentStep === 5 && "Review and confirm your choices"}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-white font-medium text-lg">First Name</Label>
                      <Input
                        placeholder="Enter your first name"
                        value={onboardingData.personalInfo.firstName}
                        onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                        className="h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl text-lg focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white font-medium text-lg">Last Name</Label>
                      <Input
                        placeholder="Enter your last name"
                        value={onboardingData.personalInfo.lastName}
                        onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                        className="h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl text-lg focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white font-medium text-lg">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={onboardingData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      className="h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl text-lg focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-white font-medium text-lg">Phone Number</Label>
                      <Input
                        placeholder="+263 77 123 4567"
                        value={onboardingData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                        className="h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl text-lg focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white font-medium text-lg">Date of Birth</Label>
                      <Input
                        type="date"
                        value={onboardingData.personalInfo.dateOfBirth}
                        onChange={(e) => updatePersonalInfo("dateOfBirth", e.target.value)}
                        className="h-12 bg-white/10 border-white/20 text-white rounded-xl text-lg focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-white font-medium text-lg">Country</Label>
                      <select
                        value={onboardingData.personalInfo.country}
                        onChange={(e) => updatePersonalInfo("country", e.target.value)}
                        className="w-full h-12 bg-white/10 border border-white/20 text-white rounded-xl px-4 text-lg focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                      >
                        <option value="Zimbabwe">Zimbabwe</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Botswana">Botswana</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Namibia">Namibia</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white font-medium text-lg">City</Label>
                      <Input
                        placeholder="Enter your city"
                        value={onboardingData.personalInfo.city}
                        onChange={(e) => updatePersonalInfo("city", e.target.value)}
                        className="h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl text-lg focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white font-medium text-lg">Bio (Optional)</Label>
                    <Textarea
                      placeholder="Tell us a bit about yourself..."
                      value={onboardingData.personalInfo.bio}
                      onChange={(e) => updatePersonalInfo("bio", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl min-h-[120px] text-lg focus:border-red-500 focus:ring-red-500/20 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Interests */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <p className="text-gray-300 text-center text-lg">
                    Select your favorite genres to get personalized recommendations
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {interests.map((interest) => {
                      const isSelected = onboardingData.interests.includes(interest.id)
                      return (
                        <button
                          key={interest.id}
                          onClick={() => toggleInterest(interest.id)}
                          className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                            isSelected
                              ? "border-red-600 bg-gradient-to-br from-red-600/20 to-purple-600/20 text-white shadow-lg"
                              : "border-white/20 bg-white/5 text-gray-300 hover:border-white/40 hover:bg-white/10"
                          }`}
                        >
                          <div className="text-center">
                            <div className="mb-3">
                              <div
                                className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                                  isSelected ? "bg-gradient-to-r from-red-500 to-purple-600" : "bg-gray-600"
                                }`}
                              >
                                <span className="text-white text-lg">🎭</span>
                              </div>
                            </div>
                            <p className="font-semibold text-lg">{interest.name}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-gray-400 text-center">Selected: {onboardingData.interests.length} interests</p>
                </div>
              )}

              {/* Step 3: Plan Selection */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subscriptionPlans.map((plan) => {
                      const isSelected = onboardingData.selectedPlan === plan.id
                      return (
                        <div
                          key={plan.id}
                          className={`relative border-2 rounded-3xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            isSelected
                              ? "border-red-600 bg-gradient-to-br from-red-600/10 to-purple-600/10 shadow-xl"
                              : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                          } ${plan.popular ? "ring-2 ring-red-600" : ""}`}
                          onClick={() => handlePlanSelect(plan.id)}
                        >
                          {plan.popular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                              <Badge className="bg-gradient-to-r from-red-600 to-purple-600 text-white px-4 py-1 text-sm">
                                Most Popular
                              </Badge>
                            </div>
                          )}

                          <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                              {plan.id === "free" && <Star className="w-10 h-10 text-white" />}
                              {plan.id === "basic" && <Play className="w-10 h-10 text-white" />}
                              {plan.id === "premium" && <Crown className="w-10 h-10 text-white" />}
                              {plan.id === "family" && <Users className="w-10 h-10 text-white" />}
                            </div>
                            <h3 className="text-white text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="mb-4">
                              <span className="text-4xl font-bold text-white">${plan.price}</span>
                              <span className="text-gray-400 text-lg">/{plan.period}</span>
                            </div>
                            <p className="text-gray-400 mb-6">{plan.description}</p>
                          </div>

                          <ul className="space-y-3 mb-6">
                            {plan.features.slice(0, 4).map((feature, index) => (
                              <li key={index} className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {isSelected && (
                            <div className="absolute top-4 right-4">
                              <CheckCircle className="w-8 h-8 text-red-600" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Subscription Period Toggle */}
                  <div className="flex justify-center">
                    <div className="bg-white/10 rounded-2xl p-2 flex backdrop-blur-sm">
                      <button
                        onClick={() => setOnboardingData((prev) => ({ ...prev, subscriptionPeriod: "monthly" }))}
                        className={`px-8 py-3 rounded-xl transition-all text-lg font-medium ${
                          onboardingData.subscriptionPeriod === "monthly"
                            ? "bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setOnboardingData((prev) => ({ ...prev, subscriptionPeriod: "yearly" }))}
                        className={`px-8 py-3 rounded-xl transition-all text-lg font-medium ${
                          onboardingData.subscriptionPeriod === "yearly"
                            ? "bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Yearly (Save 20%)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment Method */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  {selectedPlan?.price === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-white text-2xl font-bold mb-4">No Payment Required</h3>
                      <p className="text-gray-400 text-lg">You've selected the free plan. You can upgrade anytime!</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                        <h3 className="text-white font-semibold text-xl mb-4">Plan Summary</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-lg">
                            {selectedPlan?.name} Plan ({onboardingData.subscriptionPeriod})
                          </span>
                          <span className="text-white font-bold text-xl">
                            $
                            {onboardingData.subscriptionPeriod === "yearly"
                              ? (selectedPlan?.price * 12 * 0.8).toFixed(2)
                              : selectedPlan?.price}
                          </span>
                        </div>
                        {onboardingData.subscriptionPeriod === "yearly" && (
                          <p className="text-green-400 mt-2">You save 20% with yearly billing!</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paymentMethods.map((method) => {
                          const isSelected = onboardingData.paymentMethod === method.id
                          return (
                            <div
                              key={method.id}
                              className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                                isSelected
                                  ? "border-red-600 bg-gradient-to-br from-red-600/10 to-purple-600/10 shadow-lg"
                                  : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                              }`}
                              onClick={() => handlePaymentMethodSelect(method.id)}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center">
                                  {method.type === "mobile_money" ? (
                                    <Smartphone className="w-8 h-8 text-white" />
                                  ) : (
                                    <CreditCard className="w-8 h-8 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-white font-semibold text-lg">{method.name}</h4>
                                  <p className="text-gray-400">{method.description}</p>
                                  <p className="text-green-400 text-sm">{method.fees}</p>
                                </div>
                                {isSelected && <CheckCircle className="w-8 h-8 text-red-600" />}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-white text-2xl font-bold mb-4">Almost Done!</h3>
                    <p className="text-gray-400 text-lg">Review your information and complete your setup</p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                      <h4 className="text-white font-semibold text-lg mb-4">Personal Information</h4>
                      <div className="space-y-2">
                        <p className="text-gray-300 text-lg">
                          {onboardingData.personalInfo.firstName} {onboardingData.personalInfo.lastName}
                        </p>
                        <p className="text-gray-400">{onboardingData.personalInfo.email}</p>
                        <p className="text-gray-400">{onboardingData.personalInfo.country}</p>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                      <h4 className="text-white font-semibold text-lg mb-4">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {onboardingData.interests.map((interestId) => {
                          const interest = interests.find((i) => i.id === interestId)
                          return (
                            <Badge
                              key={interestId}
                              variant="secondary"
                              className="bg-gradient-to-r from-red-600/20 to-purple-600/20 text-red-400 border-red-400/30"
                            >
                              {interest?.name}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                      <h4 className="text-white font-semibold text-lg mb-4">Subscription Plan</h4>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white text-lg">{selectedPlan?.name} Plan</p>
                          <p className="text-gray-400">{onboardingData.subscriptionPeriod} billing</p>
                        </div>
                        <p className="text-white font-bold text-xl">
                          $
                          {onboardingData.subscriptionPeriod === "yearly"
                            ? (selectedPlan?.price * 12 * 0.8).toFixed(2)
                            : selectedPlan?.price}
                        </p>
                      </div>
                    </div>

                    {selectedPlan?.price > 0 && (
                      <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <h4 className="text-white font-semibold text-lg mb-4">Payment Method</h4>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                            {selectedPayment?.type === "mobile_money" ? (
                              <Smartphone className="w-6 h-6 text-white" />
                            ) : (
                              <CreditCard className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-white text-lg">{selectedPayment?.name}</p>
                            <p className="text-gray-400">{selectedPayment?.description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-12">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent px-8 py-3 rounded-xl text-lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg"
                    disabled={
                      (currentStep === 1 &&
                        (!onboardingData.personalInfo.firstName ||
                          !onboardingData.personalInfo.lastName ||
                          !onboardingData.personalInfo.email)) ||
                      (currentStep === 2 && onboardingData.interests.length === 0) ||
                      (currentStep === 4 && selectedPlan?.price > 0 && !onboardingData.paymentMethod)
                    }
                  >
                    Next
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={completeOnboarding}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg"
                  >
                    {isLoading ? "Setting up..." : "Complete Setup"}
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>

              {/* Already have account link */}
              <div className="text-center mt-8">
                <p className="text-gray-300">
                  Already have an account?{" "}
                  <Link href="/login" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
                    Sign In
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
