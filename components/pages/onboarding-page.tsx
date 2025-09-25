"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Stepper } from "@/components/ui/stepper"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { setUser } from "@/store/slices/authSlice"
import { showSnackbar } from "@/store/slices/uiSlice"
import {
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  Crown,
  Play,
  Users,
  CheckCircle,
  CreditCard,
  Smartphone,
  Home,
  Phone,
  Globe,
  MapPin,
  Heart,
  Loader2,
} from "lucide-react"

// Fallback subscription plans (will be replaced by backend data)
const fallbackPlans = [
  {
    id: 1,
    name: "Basic",
    price: "4.99",
    period: "month",
    description: "Perfect for casual viewers",
    features: [
      "Full content library",
      "HD streaming quality",
      "No ads",
      "2 devices simultaneously",
      "Standard support",
      "5 downloads per month",
    ],
    popular: false,
    maxDevices: 2,
    quality: "HD",
  },
  {
    id: 2,
    name: "Premium",
    price: "9.99",
    period: "month",
    description: "Most popular choice",
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
    maxDevices: 4,
    quality: "4K",
  },
  {
    id: 3,
    name: "Family",
    price: "14.99",
    period: "month",
    description: "Best for families",
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
    maxDevices: 6,
    quality: "4K",
  },
]

// African countries with phone codes
const africanCountries = [
  { code: "DZ", name: "Algeria", phoneCode: "+213" },
  { code: "AO", name: "Angola", phoneCode: "+244" },
  { code: "BJ", name: "Benin", phoneCode: "+229" },
  { code: "BW", name: "Botswana", phoneCode: "+267" },
  { code: "BF", name: "Burkina Faso", phoneCode: "+226" },
  { code: "BI", name: "Burundi", phoneCode: "+257" },
  { code: "CM", name: "Cameroon", phoneCode: "+237" },
  { code: "CV", name: "Cape Verde", phoneCode: "+238" },
  { code: "CF", name: "Central African Republic", phoneCode: "+236" },
  { code: "TD", name: "Chad", phoneCode: "+235" },
  { code: "KM", name: "Comoros", phoneCode: "+269" },
  { code: "CG", name: "Congo", phoneCode: "+242" },
  { code: "CD", name: "DR Congo", phoneCode: "+243" },
  { code: "DJ", name: "Djibouti", phoneCode: "+253" },
  { code: "EG", name: "Egypt", phoneCode: "+20" },
  { code: "GQ", name: "Equatorial Guinea", phoneCode: "+240" },
  { code: "ER", name: "Eritrea", phoneCode: "+291" },
  { code: "ET", name: "Ethiopia", phoneCode: "+251" },
  { code: "GA", name: "Gabon", phoneCode: "+241" },
  { code: "GM", name: "Gambia", phoneCode: "+220" },
  { code: "GH", name: "Ghana", phoneCode: "+233" },
  { code: "GN", name: "Guinea", phoneCode: "+224" },
  { code: "GW", name: "Guinea-Bissau", phoneCode: "+245" },
  { code: "KE", name: "Kenya", phoneCode: "+254" },
  { code: "LS", name: "Lesotho", phoneCode: "+266" },
  { code: "LR", name: "Liberia", phoneCode: "+231" },
  { code: "LY", name: "Libya", phoneCode: "+218" },
  { code: "MG", name: "Madagascar", phoneCode: "+261" },
  { code: "MW", name: "Malawi", phoneCode: "+265" },
  { code: "ML", name: "Mali", phoneCode: "+223" },
  { code: "MR", name: "Mauritania", phoneCode: "+222" },
  { code: "MU", name: "Mauritius", phoneCode: "+230" },
  { code: "MA", name: "Morocco", phoneCode: "+212" },
  { code: "MZ", name: "Mozambique", phoneCode: "+258" },
  { code: "NA", name: "Namibia", phoneCode: "+264" },
  { code: "NE", name: "Niger", phoneCode: "+227" },
  { code: "NG", name: "Nigeria", phoneCode: "+234" },
  { code: "RW", name: "Rwanda", phoneCode: "+250" },
  { code: "ST", name: "São Tomé and Príncipe", phoneCode: "+239" },
  { code: "SN", name: "Senegal", phoneCode: "+220" },
  { code: "SC", name: "Seychelles", phoneCode: "+248" },
  { code: "SL", name: "Sierra Leone", phoneCode: "+232" },
  { code: "SO", name: "Somalia", phoneCode: "+252" },
  { code: "ZA", name: "South Africa", phoneCode: "+27" },
  { code: "SS", name: "South Sudan", phoneCode: "+211" },
  { code: "SD", name: "Sudan", phoneCode: "+249" },
  { code: "SZ", name: "Eswatini", phoneCode: "+268" },
  { code: "TZ", name: "Tanzania", phoneCode: "+255" },
  { code: "TG", name: "Togo", phoneCode: "+228" },
  { code: "TN", name: "Tunisia", phoneCode: "+216" },
  { code: "UG", name: "Uganda", phoneCode: "+238" },
  { code: "ZM", name: "Zambia", phoneCode: "+260" },
  { code: "ZW", name: "Zimbabwe", phoneCode: "+263" },
]

const paymentMethods = [
  {
    id: "ecocash",
    name: "EcoCash",
    type: "mobile_money",
    description: "Pay with your EcoCash wallet",
    fees: "No fees",
  },
  {
    id: "inbucks",
    name: "InBucks",
    type: "mobile_money",
    description: "Pay with your InBucks account",
    fees: "No fees",
  },
  {
    id: "credit_card",
    name: "Credit Card",
    type: "card",
    description: "Pay with your credit card",
    fees: "Standard rates apply",
  },
  {
    id: "paypal",
    name: "PayPal",
    type: "digital_wallet",
    description: "Pay with your PayPal account",
    fees: "Standard rates apply",
  },
]

interface OnboardingData {
  personalInfo: {
    firstName: string
    lastName: string
    phoneNumber: string
    dateOfBirth: string
    country: string
    city: string
    bio: string
  }
  interests: number[]
  selectedPlan: number
  paymentMethod: string
  subscriptionPeriod: "monthly" | "yearly"
}

export default function OnboardingPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dateOfBirth: "",
      country: "ZW",
      city: "",
      bio: "",
    },
    interests: [],
    selectedPlan: 2, // Default to Premium
    paymentMethod: "",
    subscriptionPeriod: "monthly",
  })
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(africanCountries.find(c => c.code === "ZW") || africanCountries[0])
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [backendPlans, setBackendPlans] = useState<any[] | null>(null)
  const [backendPaymentMethods, setBackendPaymentMethods] = useState<any[] | null>(null)

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const { api } = await import("@/lib/api")
        
        // Fetch subscription plans
        const plansResponse = await api.getSubscriptionPlans()
        if (plansResponse.success && plansResponse.data?.subscription_plans) {
          setBackendPlans(plansResponse.data.subscription_plans)
        }
        
        // Fetch payment methods
        const paymentResponse = await api.getPaymentMethods()
        if (paymentResponse.success && paymentResponse.data?.methods) {
          setBackendPaymentMethods(paymentResponse.data.methods)
        }
      } catch (error) {
        console.error("Failed to fetch onboarding data:", error)
        // Fallback to static data
      }
    }
    
    fetchData()
  }, [])

  const totalSteps = 2

  const updatePersonalInfo = (field: string, value: string) => {
    setOnboardingData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }

  // Interests step removed

  const handlePlanSelect = (planId: number) => {
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
      
      // Step 1: Save personal info
      await api.savePersonalInfo({
          firstName: onboardingData.personalInfo.firstName,
          lastName: onboardingData.personalInfo.lastName,
        phoneNumber: onboardingData.personalInfo.phoneNumber,
        dateOfBirth: onboardingData.personalInfo.dateOfBirth,
          country: onboardingData.personalInfo.country,
          city: onboardingData.personalInfo.city,
          bio: onboardingData.personalInfo.bio || undefined,
        })

      // Redirect to checkout with selected plan data
      router.push(`/checkout?plan=${onboardingData.selectedPlan}&period=${onboardingData.subscriptionPeriod}&payment=${onboardingData.paymentMethod}`)
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



  const selectedPlan = (backendPlans || fallbackPlans).find((p: any) => p.id === onboardingData.selectedPlan)
  const selectedPayment = (backendPaymentMethods || paymentMethods).find((p: any) => p.key === onboardingData.paymentMethod)
  const getStepIcon = (step: number) => {
    const icons = [User, Crown]
    const Icon = icons[step - 1]
    return <Icon className="w-5 h-5" />
  }
  // Interests step removed

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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
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

          {/* Custom Stepper */}
          <div className="mb-8">
            <div className="relative mb-6">
              {/* Background connecting line */}
              <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-700">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {Array.from({ length: totalSteps }, (_, i) => {
                  const stepNumber = i + 1
                  const isCompleted = stepNumber < currentStep
                  const isCurrent = stepNumber === currentStep
                  const stepLabels = ["Personal Info", "Choose Plan"]

                  return (
                    <div key={i} className="flex flex-col items-center">
                      {/* Step Circle */}
                      <div
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                          isCompleted
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                            : isCurrent
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg ring-4 ring-blue-600/30 scale-110"
                              : "bg-gray-700 text-gray-400 border-2 border-gray-600"
                        }`}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : getStepIcon(stepNumber)}
                      </div>

                      {/* Step Label */}
                      <div className="mt-3 text-center">
                        <p
                          className={`text-sm font-medium transition-colors duration-300 ${
                            isCompleted || isCurrent ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {stepLabels[i]}
                        </p>
                        <p
                          className={`text-xs mt-1 transition-colors duration-300 ${
                            isCompleted || isCurrent ? "text-blue-300" : "text-gray-500"
                          }`}
                        >
                          Step {stepNumber}
                        </p>
                      </div>
                  </div>
                  )
                })}
                </div>
            </div>

            {/* Current Step Indicator */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse" />
                <p className="text-white text-sm font-medium">
                Step {currentStep} of {totalSteps}
              </p>
              </div>
            </div>
          </div>

          <Card className="bg-black/40 border-white/20 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-6 pt-8">
              {/* <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">ZIMUSHA</span>
              </div> */}
              <CardTitle className="text-white text-3xl font-bold mb-2">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Choose Your Plan"}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                {currentStep === 1 && "Tell us about yourself"}
                {currentStep === 2 && "Select the perfect plan for you"}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-white font-medium text-lg">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Enter your first name"
                        value={onboardingData.personalInfo.firstName}
                        onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                          className="h-12 pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl text-lg focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                      />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white font-medium text-lg">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Enter your last name"
                        value={onboardingData.personalInfo.lastName}
                        onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                          className="h-12 pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl text-lg focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                      />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-white font-medium text-lg">Phone Number</Label>
                      <div className="flex gap-2">
                        <Select value={selectedPhoneCountry.code} onValueChange={(code) => {
                          const country = africanCountries.find(c => c.code === code)
                          if (country) setSelectedPhoneCountry(country)
                        }}>
                          <SelectTrigger className="w-24 h-12 bg-white/10 border-white/20 text-white rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            {africanCountries.map((country) => (
                              <SelectItem key={country.code} value={country.code} className="text-white hover:bg-gray-700">
                                {country.phoneCode}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      <Input
                          placeholder="77 123 4567"
                          value={onboardingData.personalInfo.phoneNumber}
                          onChange={(e) => updatePersonalInfo("phoneNumber", e.target.value)}
                          className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl text-lg focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white font-medium text-lg">Date of Birth</Label>
                      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl text-lg justify-start"
                          >
                            {onboardingData.personalInfo.dateOfBirth ? (
                              new Date(onboardingData.personalInfo.dateOfBirth).toLocaleDateString()
                            ) : (
                              "Select date"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                          <Calendar
                            mode="single"
                            selected={onboardingData.personalInfo.dateOfBirth ? new Date(onboardingData.personalInfo.dateOfBirth) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                updatePersonalInfo("dateOfBirth", date.toISOString().split('T')[0])
                                setDatePickerOpen(false)
                              }
                            }}
                            className="bg-gray-800 text-white"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-white font-medium text-lg">Country</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl text-lg justify-start"
                          >
                            <Globe className="mr-2 h-4 w-4" />
                            {africanCountries.find(c => c.code === onboardingData.personalInfo.country)?.name || "Select country"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0 bg-gray-800 border-gray-700">
                          <Command className="bg-gray-800">
                            <CommandInput placeholder="Search country..." className="text-white" />
                            <CommandEmpty className="text-gray-400">No country found.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {africanCountries.map((country) => (
                                  <CommandItem
                                    key={country.code}
                                    value={country.name}
                                    onSelect={() => {
                                      updatePersonalInfo("country", country.code)
                                    }}
                                    className="text-white hover:bg-gray-700 cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm">{country.phoneCode}</span>
                                      <span>{country.name}</span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-white font-medium text-lg">City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Enter your city"
                        value={onboardingData.personalInfo.city}
                        onChange={(e) => updatePersonalInfo("city", e.target.value)}
                          className="h-12 pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl text-lg focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                      />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white font-medium text-lg">Bio (Optional)</Label>
                    <Textarea
                      placeholder="Tell us a bit about yourself..."
                      value={onboardingData.personalInfo.bio}
                      onChange={(e) => updatePersonalInfo("bio", e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400 rounded-xl min-h-[120px] text-lg focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Plan Selection */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(backendPlans || fallbackPlans).map((plan: any) => {
                      const isSelected = onboardingData.selectedPlan === plan.id
                      return (
                        <div
                          key={plan.id}
                          className={`relative border-2 rounded-3xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            isSelected
                              ? "border-blue-600 bg-gradient-to-br from-blue-600/10 to-purple-600/10 shadow-xl"
                              : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                          } ${plan.is_popular ? "ring-2 ring-blue-600" : ""}`}
                          onClick={() => handlePlanSelect(plan.id)}
                        >
                          {plan.is_popular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 text-sm">
                                Most Popular
                              </Badge>
                            </div>
                          )}

                          <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                              {plan.id === 1 && <Play className="w-10 h-10 text-white" />}
                              {plan.id === 2 && <Crown className="w-10 h-10 text-white" />}
                              {plan.id === 3 && <Users className="w-10 h-10 text-white" />}
                            </div>
                            <h3 className="text-white text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="mb-4">
                              <span className="text-4xl font-bold text-white">${plan.price}</span>
                              <span className="text-gray-400 text-lg">/{plan.billing_cycle || 'month'}</span>
                            </div>
                            <p className="text-gray-400 mb-6">{plan.description}</p>
                          </div>

                          <ul className="space-y-3 mb-6">
                            {plan.features ? plan.features.slice(0, 4).map((feature: any, index: number) => (
                              <li key={index} className="flex items-center gap-3 text-gray-300">
                                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                <span className="text-sm">{feature.label}: {feature.value}</span>
                              </li>
                            )) : (
                              <li className="text-gray-400 text-sm text-center">No features listed</li>
                            )}
                          </ul>

                          {isSelected && (
                            <div className="absolute top-4 right-4">
                              <CheckCircle className="w-8 h-8 text-blue-600" />
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
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setOnboardingData((prev) => ({ ...prev, subscriptionPeriod: "yearly" }))}
                        className={`px-8 py-3 rounded-xl transition-all text-lg font-medium ${
                          onboardingData.subscriptionPeriod === "yearly"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Yearly (Save 20%)
                      </button>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold text-xl text-center">Payment Method</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(backendPaymentMethods || paymentMethods).map((method: any) => {
                        const methodKey = method.key || method.id
                        const methodLabel = method.label || method.name
                        const isSelected = onboardingData.paymentMethod === methodKey
                          return (
                            <div
                            key={methodKey}
                            className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                                isSelected
                                ? "border-blue-600 bg-gradient-to-br from-blue-600/10 to-purple-600/10 shadow-lg"
                                : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                            }`}
                            onClick={() => handlePaymentMethodSelect(methodKey)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                                {(method.type === "mobile_money" || methodKey === "ecocash" || methodKey === "inbucks") ? (
                                    <Smartphone className="w-6 h-6 text-white" />
                                  ) : (
                                    <CreditCard className="w-6 h-6 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                <h4 className="text-white font-semibold">{methodLabel}</h4>
                                <p className="text-gray-400 text-sm">{method.description || "Secure payment method"}</p>
                                </div>
                                {isSelected && <CheckCircle className="w-6 h-6 text-blue-600" />}
                              </div>
                            </div>
                          )
                        })}
                    </div>
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg"
                    disabled={
                      (currentStep === 1 &&
                        (!onboardingData.personalInfo.firstName ||
                          !onboardingData.personalInfo.lastName ||
                          !onboardingData.personalInfo.phoneNumber ||
                          !onboardingData.personalInfo.dateOfBirth ||
                          !onboardingData.personalInfo.country ||
                          !onboardingData.personalInfo.city)) ||
                      (currentStep === 2 && !onboardingData.paymentMethod)
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
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Completing Setup...
                      </>
                    ) : (
                      "Complete Setup"
                    )}
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
