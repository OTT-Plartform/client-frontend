"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { setUser } from "@/store/slices/authSlice"
import { showSnackbar } from "@/store/slices/uiSlice"
import { User, ArrowRight, ArrowLeft, Check, Crown, Play, Star, Users, CheckCircle } from "lucide-react"

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
    country: string
    city: string
    bio: string
  }
  interests: string[]
  selectedPlan: string
}

interface OnboardingContentProps {
  onComplete: () => void
}

export default function OnboardingContent({ onComplete }: OnboardingContentProps) {
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "Zimbabwe",
      city: "",
      bio: "",
    },
    interests: [],
    selectedPlan: "free",
  })

  const totalSteps = 3

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
      onComplete()
    }, 2000)
  }

  const getStepIcon = (step: number) => {
    const icons = [User, Star, Crown]
    const Icon = icons[step - 1]
    return <Icon className="w-5 h-5" />
  }

  const selectedPlan = subscriptionPlans.find((p) => p.id === onboardingData.selectedPlan)

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    i + 1 <= currentStep ? "bg-red-600 text-white" : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {i + 1 < currentStep ? <Check className="w-5 h-5" /> : getStepIcon(i + 1)}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-16 h-1 mx-2 ${i + 1 < currentStep ? "bg-red-600" : "bg-gray-700"}`} />
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
            </CardTitle>
            <CardDescription className="text-gray-400">
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "What content do you enjoy?"}
              {currentStep === 3 && "Select the perfect plan for you"}
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
                            ? "border-red-600 bg-red-600/20 text-white"
                            : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600"
                        }`}
                      >
                        <div className="text-center">
                          <div className="mb-2">
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
                            ? "border-red-600 bg-red-600/10"
                            : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                        } ${plan.popular ? "ring-2 ring-red-600" : ""}`}
                        onClick={() => handlePlanSelect(plan.id)}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-red-600 text-white">Most Popular</Badge>
                          </div>
                        )}

                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                            <CheckCircle className="w-6 h-6 text-red-600" />
                          </div>
                        )}
                      </div>
                    )
                  })}
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
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                  disabled={
                    (currentStep === 1 &&
                      (!onboardingData.personalInfo.firstName ||
                        !onboardingData.personalInfo.lastName ||
                        !onboardingData.personalInfo.email)) ||
                    (currentStep === 2 && onboardingData.interests.length === 0)
                  }
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={completeOnboarding}
                  disabled={isLoading}
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
  )
}
