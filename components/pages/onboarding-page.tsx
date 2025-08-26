"use client"

import { useEffect, useState } from "react"
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
  CreditCard,
  Smartphone,
  CheckCircle,
} from "lucide-react"

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
  { id: "talk-shows", name: "Talk Shows", icon: "Mic" },
  { id: "podcasts", name: "Podcasts", icon: "Headphones" },
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

export default function OnboardingPage() {
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
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
  const [backendPlans, setBackendPlans] = useState<any[] | null>(null)
  const [selectedBackendPlanId, setSelectedBackendPlanId] = useState<number | null>(null)
  const [accountPassword, setAccountPassword] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const { api } = await import("@/lib/api")
        const plans = await api.onboardingGetPlans()
        setBackendPlans(plans)
        // Initialize mapping to backend plan id
        if (plans && plans.length > 0) {
          const localName = subscriptionPlans.find((p) => p.id === onboardingData.selectedPlan)?.name
          const match = plans.find((bp: any) => `${bp.name}`.toLowerCase() === `${localName}`.toLowerCase())
          setSelectedBackendPlanId(match ? match.id : plans[0].id)
        }
      } catch (_) {
        // ignore, fallback to static plans
      }
    })()
  }, [])

  useEffect(() => {
    if (!backendPlans || backendPlans.length === 0) return
    const localName = subscriptionPlans.find((p) => p.id === onboardingData.selectedPlan)?.name
    const match = backendPlans.find((bp: any) => `${bp.name}`.toLowerCase() === `${localName}`.toLowerCase())
    setSelectedBackendPlanId(match ? match.id : backendPlans[0].id)
  }, [onboardingData.selectedPlan, backendPlans])

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
    try {
      const { api } = await import("@/lib/api")
      // Step 1: start session if not started
      let currentSessionId = sessionId
      if (!currentSessionId) {
        const s1 = await api.onboardingStep1Personal({
          firstName: onboardingData.personalInfo.firstName,
          lastName: onboardingData.personalInfo.lastName,
          email: onboardingData.personalInfo.email,
          phoneNumber: onboardingData.personalInfo.phone,
          dateOfBirth: onboardingData.personalInfo.dateOfBirth || undefined,
          country: onboardingData.personalInfo.country,
          city: onboardingData.personalInfo.city,
          bio: onboardingData.personalInfo.bio || undefined,
        })
        currentSessionId = s1.sessionId
        setSessionId(currentSessionId)
      }

      if (!currentSessionId) throw new Error("No onboarding session")

      // Step 2: interests
      await api.onboardingStep2Interests(currentSessionId, { selectedGenres: onboardingData.interests })
      // Step 3: plan
      const selectedPlanData = subscriptionPlans.find((p) => p.id === onboardingData.selectedPlan)
      const backendPlanId = selectedBackendPlanId ?? (backendPlans && backendPlans[0]?.id)
      await api.onboardingStep3Plan(currentSessionId, {
        planId: backendPlanId ?? undefined,
        billingCycle: onboardingData.subscriptionPeriod,
      })
      // Step 4: payment
      await api.onboardingStep4Payment(currentSessionId, {
        paymentMethodId: onboardingData.paymentMethod || undefined,
      })
      // Step 5: complete with chosen password
      const auth = await api.onboardingStep5Complete(currentSessionId, { password: accountPassword || "Temp#Pass123" })
      dispatch(setUser(auth.user))
      localStorage.setItem("userData", JSON.stringify(auth.user))
      dispatch(showSnackbar({ message: `Welcome to ZIMUSHA!`, type: "success" }))
      window.location.href = "/"
    } catch (e: any) {
      let message = "Onboarding failed"
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
        <img src="/images/african-hero-1.png" alt="Background" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-4xl">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i + 1 <= currentStep ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {i + 1 < currentStep ? <Check className="w-5 h-5" /> : getStepIcon(i + 1)}
                  </div>
                  {i < totalSteps - 1 && (
                    <div className={`w-16 h-1 mx-2 ${i + 1 < currentStep ? "bg-blue-600" : "bg-gray-700"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-white text-sm">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>

          <Card className="bg-black/80 border-gray-800 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-white text-2xl font-bold">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Your Interests"}
                {currentStep === 3 && "Choose Your Plan"}
                {currentStep === 4 && "Payment Method"}
                {currentStep === 5 && "Complete Setup"}
              </CardTitle>
              <CardDescription className="text-gray-400">
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
                    <div className="space-y-2">
                      <Label className="text-white">First Name</Label>
                      <Input
                        placeholder="Enter your first name"
                        value={onboardingData.personalInfo.firstName}
                        onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Last Name</Label>
                      <Input
                        placeholder="Enter your last name"
                        value={onboardingData.personalInfo.lastName}
                        onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Email Address</Label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={onboardingData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Phone Number</Label>
                      <Input
                        placeholder="+263 77 123 4567"
                        value={onboardingData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Date of Birth</Label>
                      <Input
                        type="date"
                        value={onboardingData.personalInfo.dateOfBirth}
                        onChange={(e) => updatePersonalInfo("dateOfBirth", e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-white">Country</Label>
                      <select
                        value={onboardingData.personalInfo.country}
                        onChange={(e) => updatePersonalInfo("country", e.target.value)}
                        className="w-full h-12 bg-gray-800/50 border border-gray-700 text-white rounded-xl px-3"
                      >
                        <option value="Zimbabwe">Zimbabwe</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Botswana">Botswana</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Namibia">Namibia</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">City</Label>
                      <Input
                        placeholder="Enter your city"
                        value={onboardingData.personalInfo.city}
                        onChange={(e) => updatePersonalInfo("city", e.target.value)}
                        className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Bio (Optional)</Label>
                    <Textarea
                      placeholder="Tell us a bit about yourself..."
                      value={onboardingData.personalInfo.bio}
                      onChange={(e) => updatePersonalInfo("bio", e.target.value)}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 rounded-xl min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Interests */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <p className="text-gray-300 text-center">
                    Select your favorite genres to get personalized recommendations
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {interests.map((interest) => {
                      const isSelected = onboardingData.interests.includes(interest.id)
                      return (
                        <button
                          key={interest.id}
                          onClick={() => toggleInterest(interest.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-blue-600 bg-blue-600/20 text-white"
                              : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600"
                          }`}
                        >
                          <div className="text-center">
                            <div className="mb-2">
                              {/* Icon placeholder - you can add actual icons here */}
                              <div className="w-8 h-8 bg-gray-600 rounded-full mx-auto" />
                            </div>
                            <p className="font-medium">{interest.name}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-gray-400 text-sm text-center">
                    Selected: {onboardingData.interests.length} interests
                  </p>
                </div>
              )}

              {/* Step 3: Plan Selection */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subscriptionPlans.map((plan) => {
                      const isSelected = onboardingData.selectedPlan === plan.id
                      return (
                        <div
                          key={plan.id}
                          className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-blue-600 bg-blue-600/10"
                              : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                          } ${plan.popular ? "ring-2 ring-blue-600" : ""}`}
                          onClick={() => handlePlanSelect(plan.id)}
                        >
                          {plan.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                            </div>
                          )}

                          <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                              {plan.id === "free" && <Star className="w-8 h-8 text-white" />}
                              {plan.id === "basic" && <Play className="w-8 h-8 text-white" />}
                              {plan.id === "premium" && <Crown className="w-8 h-8 text-white" />}
                              {plan.id === "family" && <Users className="w-8 h-8 text-white" />}
                            </div>
                            <h3 className="text-white text-xl font-bold mb-2">{plan.name}</h3>
                            <div className="mb-4">
                              <span className="text-3xl font-bold text-white">${plan.price}</span>
                              <span className="text-gray-400">/{plan.period}</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                          </div>

                          <ul className="space-y-2 mb-4">
                            {plan.features.slice(0, 4).map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-gray-300 text-sm">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {isSelected && (
                            <div className="absolute top-4 right-4">
                              <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Subscription Period Toggle */}
                  <div className="flex justify-center">
                    <div className="bg-gray-800 rounded-xl p-1 flex">
                      <button
                        onClick={() => setOnboardingData((prev) => ({ ...prev, subscriptionPeriod: "monthly" }))}
                        className={`px-6 py-2 rounded-lg transition-all ${
                          onboardingData.subscriptionPeriod === "monthly"
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setOnboardingData((prev) => ({ ...prev, subscriptionPeriod: "yearly" }))}
                        className={`px-6 py-2 rounded-lg transition-all ${
                          onboardingData.subscriptionPeriod === "yearly"
                            ? "bg-blue-600 text-white"
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
                <div className="space-y-6">
                  {selectedPlan?.price === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-white text-xl font-bold mb-2">No Payment Required</h3>
                      <p className="text-gray-400">You've selected the free plan. You can upgrade anytime!</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                        <h3 className="text-white font-semibold mb-2">Plan Summary</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">
                            {selectedPlan?.name} Plan ({onboardingData.subscriptionPeriod})
                          </span>
                          <span className="text-white font-bold">
                            $
                            {onboardingData.subscriptionPeriod === "yearly"
                              ? (selectedPlan?.price * 12 * 0.8).toFixed(2)
                              : selectedPlan?.price}
                          </span>
                        </div>
                        {onboardingData.subscriptionPeriod === "yearly" && (
                          <p className="text-green-400 text-sm mt-1">You save 20% with yearly billing!</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paymentMethods.map((method) => {
                          const isSelected = onboardingData.paymentMethod === method.id
                          return (
                            <div
                              key={method.id}
                              className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? "border-blue-600 bg-blue-600/10"
                                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                              }`}
                              onClick={() => handlePaymentMethodSelect(method.id)}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                                  {method.type === "mobile_money" ? (
                                    <Smartphone className="w-6 h-6 text-white" />
                                  ) : (
                                    <CreditCard className="w-6 h-6 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-white font-semibold">{method.name}</h4>
                                  <p className="text-gray-400 text-sm">{method.description}</p>
                                  <p className="text-green-400 text-xs">{method.fees}</p>
                                </div>
                                {isSelected && <CheckCircle className="w-6 h-6 text-blue-600" />}
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
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">Almost Done!</h3>
                    <p className="text-gray-400">Review your information and complete your setup</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-2">Personal Information</h4>
                      <p className="text-gray-300">
                        {onboardingData.personalInfo.firstName} {onboardingData.personalInfo.lastName}
                      </p>
                      <p className="text-gray-400 text-sm">{onboardingData.personalInfo.email}</p>
                      <p className="text-gray-400 text-sm">{onboardingData.personalInfo.country}</p>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {onboardingData.interests.map((interestId) => {
                          const interest = interests.find((i) => i.id === interestId)
                          return (
                            <Badge key={interestId} variant="secondary" className="bg-blue-600/20 text-blue-400">
                              {interest?.name}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-2">Subscription Plan</h4>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white">{selectedPlan?.name} Plan</p>
                          <p className="text-gray-400 text-sm">{onboardingData.subscriptionPeriod} billing</p>
                        </div>
                        <p className="text-white font-bold">
                          $
                          {onboardingData.subscriptionPeriod === "yearly"
                            ? (selectedPlan?.price * 12 * 0.8).toFixed(2)
                            : selectedPlan?.price}
                        </p>
                      </div>
                    </div>

                    {selectedPlan?.price > 0 && (
                      <div className="bg-gray-800/50 rounded-xl p-4">
                        <h4 className="text-white font-semibold mb-2">Payment Method</h4>
                        <p className="text-white">{selectedPayment?.name}</p>
                        <p className="text-gray-400 text-sm">{selectedPayment?.description}</p>
                      </div>
                    )}

                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <h4 className="text-white font-semibold mb-2">Set Account Password</h4>
                      <p className="text-gray-400 text-sm mb-2">Minimum 8 characters</p>
                      <input
                        type="password"
                        value={accountPassword}
                        onChange={(e) => setAccountPassword(e.target.value)}
                        className="w-full h-12 bg-gray-900 border border-gray-700 rounded-xl px-3 text-white"
                        placeholder="Create a password"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
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
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={completeOnboarding}
                    disabled={isLoading || accountPassword.length < 8}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    {isLoading ? "Setting up..." : "Complete Setup"}
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
