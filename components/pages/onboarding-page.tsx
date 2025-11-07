"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { savePersonalInfo, setPersonalInfoField, setSelectedPlan, setPaymentMethod, setSubscriptionPeriod } from "@/store/slices/onboardingSlice"
import { fetchPlans, fetchPaymentMethods } from "@/store/slices/subscriptionSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
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
  Globe,
  MapPin,
  Loader2,
} from "lucide-react"
import AFRICAN_COUNTRIES from "@/lib/countries"

// Fallback subscription plans (will be replaced by backend data)



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
  const dispatch = useAppDispatch()
  const authUser = useAppSelector((s) => s.auth.user)
  const {
    onboardingData,
    isLoading: onboardingLoading,
    error: onboardingError,
  } = useAppSelector((s) => s.onboarding)

  // Use subscription slice data
  const {
    plans: backendPlans,
    paymentMethods: backendPaymentMethods,
    isLoading: subscriptionLoading,
  } = useAppSelector((s) => s.subscription)

  // local UI state kept for date picker and visual phone selection
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number>(2000)
  const [selectedMonth, setSelectedMonth] = useState<number>(0)
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(
    AFRICAN_COUNTRIES.find(c => c.code === onboardingData.personalInfo.country) || AFRICAN_COUNTRIES[0]
  )

  useEffect(() => {
    // Only fetch if data doesn't exist yet
    if (!backendPlans) {
      dispatch(fetchPlans())
    }
    if (!backendPaymentMethods) {
      dispatch(fetchPaymentMethods())
    }
  }, [dispatch, backendPlans, backendPaymentMethods])

  useEffect(() => {
    // Default to the first plan if plans are loaded and none is selected
    if (backendPlans && backendPlans.length > 0 && onboardingData.selectedPlan === 0) {
      dispatch(setSelectedPlan(backendPlans[0].id))
    }
  }, [backendPlans, onboardingData.selectedPlan, dispatch])

  useEffect(() => {
    if (onboardingError) {
      dispatch(showSnackbar({ message: onboardingError, type: "error" }))
    }
  }, [onboardingError, dispatch])

  useEffect(() => {
    // Initialize year and month from existing date
    if (onboardingData.personalInfo.dateOfBirth) {
      const date = new Date(onboardingData.personalInfo.dateOfBirth)
      setSelectedYear(date.getFullYear())
      setSelectedMonth(date.getMonth())
    }
  }, [onboardingData.personalInfo.dateOfBirth])

  const totalSteps = 2

  const updatePersonalInfo = (field: string, value: string) => {
    dispatch(setPersonalInfoField({ field: field as any, value }))
    if (field === "country") {
      const c = AFRICAN_COUNTRIES.find(cc => cc.code === value)
      if (c) setSelectedPhoneCountry(c)
    }
  }

  const handlePlanSelect = (planId: number) => {
    dispatch(setSelectedPlan(planId))
  }

  const handlePaymentMethodSelect = (methodId: string) => {
    dispatch(setPaymentMethod(methodId))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const completeOnboarding = async () => {
    setIsLoading(true)
    try {
      // dispatch savePersonalInfo thunk with data from slice
      const resp: any = await dispatch(savePersonalInfo(onboardingData.personalInfo)).unwrap()
      // if thunk succeeded navigate to checkout
      router.push(`/checkout?plan=${onboardingData.selectedPlan}&period=${onboardingData.subscriptionPeriod}&payment=${onboardingData.paymentMethod}`)
    } catch (e: any) {
      const msg = e?.message || "Onboarding failed"
      dispatch(showSnackbar({ message: msg, type: "error" }))
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPlan = (backendPlans || []).find((p: any) => p.id === onboardingData.selectedPlan)
  const selectedPayment = (backendPaymentMethods || []).find((p: any) => p.key === onboardingData.paymentMethod || p.id === onboardingData.paymentMethod)
  const getStepIcon = (step: number) => {
    const icons = [User, Crown]
    const Icon = icons[step - 1]
    return <Icon className="w-5 h-5" />
  }

  // Generate year options (from 1924 to current year - 13 for age restriction)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: currentYear - 1924 }, (_, i) => currentYear - 13 - i)
  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <img
          src="/loginback.png"
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
                        className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${isCompleted
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
                          className={`text-sm font-medium transition-colors duration-300 ${isCompleted || isCurrent ? "text-white" : "text-gray-400"
                            }`}
                        >
                          {stepLabels[i]}
                        </p>
                        <p
                          className={`text-xs mt-1 transition-colors duration-300 ${isCompleted || isCurrent ? "text-blue-300" : "text-gray-500"
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
                          const country = AFRICAN_COUNTRIES.find(c => c.code === code)
                          if (country) setSelectedPhoneCountry(country)
                        }}>
                          <SelectTrigger className="w-24 h-12 bg-white/10 border-white/20 text-white rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            {AFRICAN_COUNTRIES.map((country) => (
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
                          <div className="p-4 space-y-4">
                            {/* Year and Month Selectors */}
                            <div className="flex gap-2">
                              <Select
                                value={selectedYear.toString()}
                                onValueChange={(value) => setSelectedYear(parseInt(value))}
                              >
                                <SelectTrigger className="flex-1 bg-gray-700 border-gray-600 text-white">
                                  <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border-gray-600 text-white max-h-[200px]">
                                  {yearOptions.map((year) => (
                                    <SelectItem key={year} value={year.toString()} className="text-white hover:bg-gray-600">
                                      {year}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select
                                value={selectedMonth.toString()}
                                onValueChange={(value) => setSelectedMonth(parseInt(value))}
                              >
                                <SelectTrigger className="flex-1 bg-gray-700 border-gray-600 text-white">
                                  <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                  {monthOptions.map((month, index) => (
                                    <SelectItem key={index} value={index.toString()} className="text-white hover:bg-gray-600">
                                      {month}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {/* Calendar for Day Selection */}
                            <Calendar
                              mode="single"
                              selected={onboardingData.personalInfo.dateOfBirth ? new Date(onboardingData.personalInfo.dateOfBirth) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  updatePersonalInfo("dateOfBirth", date.toISOString().split('T')[0])
                                  setDatePickerOpen(false)
                                }
                              }}
                              month={new Date(selectedYear, selectedMonth)}
                              onMonthChange={(date) => {
                                setSelectedYear(date.getFullYear())
                                setSelectedMonth(date.getMonth())
                              }}
                              className="bg-gray-800 text-white rounded-lg"
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            />
                          </div>
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
                            {AFRICAN_COUNTRIES.find(c => c.code === onboardingData.personalInfo.country)?.name || "Select country"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0 bg-gray-800 border-gray-700">
                          <Command className="bg-gray-800">
                            <CommandInput placeholder="Search country..." className="text-white" />
                            <CommandEmpty className="text-gray-400">No country found.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {AFRICAN_COUNTRIES.map((country) => (
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
                    {(backendPlans || []).map((plan: any) => {
                      const isSelected = onboardingData.selectedPlan === plan.id
                      return (
                        <div
                          key={plan.id}
                          className={`relative border-2 rounded-3xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${isSelected
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
                        onClick={() => dispatch(setSubscriptionPeriod("monthly"))}
                        className={`px-8 py-3 rounded-xl transition-all text-lg font-medium ${onboardingData.subscriptionPeriod === "monthly"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-400 hover:text-white"
                          }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => dispatch(setSubscriptionPeriod("yearly"))}
                        className={`px-8 py-3 rounded-xl transition-all text-lg font-medium ${onboardingData.subscriptionPeriod === "yearly"
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
                      {(backendPaymentMethods || []).map((method: any) => {
                        const methodKey = method.key || method.id
                        const methodLabel = method.label || method.name
                        const isSelected = onboardingData.paymentMethod === methodKey
                        return (
                          <div
                            key={methodKey}
                            className={`border-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${isSelected
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
