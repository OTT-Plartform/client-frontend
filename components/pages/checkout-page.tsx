"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { setUser } from "@/store/slices/authSlice"
import { showSnackbar } from "@/store/slices/uiSlice"
import PaymentSuccess from "@/components/animations/payment-success"
import {
  Check,
  Crown,
  Play,
  Users,
  CreditCard,
  Smartphone,
  Home,
  Loader2,
  ArrowLeft,
  Shield,
  Clock,
  Star,
} from "lucide-react"

interface CheckoutData {
  planId: number
  period: "monthly" | "yearly"
  paymentMethod: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<any>(null)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)

  useEffect(() => {
    // Get data from URL params
    const planId = searchParams.get('plan')
    const period = searchParams.get('period') as "monthly" | "yearly"
    const payment = searchParams.get('payment')

    if (planId && period && payment) {
      setCheckoutData({
        planId: parseInt(planId),
        period,
        paymentMethod: payment
      })
    } else {
      // Redirect back to onboarding if data is missing
      router.push('/onboarding')
    }
  }, [searchParams, router])

  useEffect(() => {
    // Fetch plan and payment method details
    const fetchCheckoutData = async () => {
      if (!checkoutData) return

      try {
        const { api } = await import("@/lib/api")
        
        // Fetch subscription plans
        const plansResponse = await api.getSubscriptionPlans()
        if (plansResponse.success && plansResponse.data?.subscription_plans) {
          const plan = plansResponse.data.subscription_plans.find((p: any) => p.id === checkoutData.planId)
          setSelectedPlan(plan)
        }
        
        // Fetch payment methods
        const paymentResponse = await api.getPaymentMethods()
        if (paymentResponse.success && paymentResponse.data?.methods) {
          const method = paymentResponse.data.methods.find((m: any) => m.key === checkoutData.paymentMethod)
          setPaymentMethod(method)
        }
      } catch (error) {
        console.error("Failed to fetch checkout data:", error)
        dispatch(showSnackbar({ message: "Failed to load checkout data", type: "error" }))
        router.push('/onboarding')
      }
    }
    
    fetchCheckoutData()
  }, [checkoutData, dispatch, router])

  const getPlanIcon = (planId: number) => {
    if (planId === 1) return <Play className="w-10 h-10 text-white" />
    if (planId === 2) return <Crown className="w-10 h-10 text-white" />
    return <Users className="w-10 h-10 text-white" />
  }

  const getPaymentIcon = (methodKey: string) => {
    if (methodKey === "ecocash" || methodKey === "inbucks") {
      return <Smartphone className="w-6 h-6 text-white" />
    }
    return <CreditCard className="w-6 h-6 text-white" />
  }

  const calculateTotal = () => {
    if (!selectedPlan) return { subtotal: 0, tax: 0, total: 0 }
    
    const basePrice = parseFloat(selectedPlan.price)
    const multiplier = checkoutData?.period === "yearly" ? 12 : 1
    const discount = checkoutData?.period === "yearly" ? 0.2 : 0 // 20% discount for yearly
    
    const subtotal = basePrice * multiplier * (1 - discount)
    const tax = subtotal * 0.15 // 15% tax
    const total = subtotal + tax
    
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    }
  }

  const handlePayment = async () => {
    if (!checkoutData || !selectedPlan) return
    
    setIsLoading(true)
    try {
      const { api } = await import("@/lib/api")
      
      // Save subscription
      await api.saveSubscription({
        planId: checkoutData.planId,
        billingCycle: checkoutData.period,
        paymentMethod: checkoutData.paymentMethod,
      })

      // Get updated user profile
      const profileResponse = await api.getProfile()
      if (profileResponse.success) {
        dispatch(setUser(profileResponse.data.user))
        // Show payment success animation
        setShowPaymentSuccess(true)
      }
    } catch (e: any) {
      let message = "Payment failed"
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

  const handlePaymentSuccessComplete = () => {
    router.push("/")
  }

  if (!checkoutData || !selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading checkout...</p>
        </div>
      </div>
    )
  }

  const totals = calculateTotal()

  // Show payment success animation
  if (showPaymentSuccess) {
    return (
      <PaymentSuccess 
        amount={totals.total} 
        planName={selectedPlan.name} 
        onComplete={handlePaymentSuccessComplete} 
      />
    )
  }

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
          {/* Back to Onboarding Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/onboarding")}
              className="text-white hover:bg-white/10 rounded-full px-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Onboarding
            </Button>
          </div>

          <Card className="bg-black/40 border-white/20 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-6 pt-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-white text-3xl font-bold mb-2">
                Complete Your Subscription
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Review your plan and complete payment to start streaming
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Plan Details */}
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-semibold">Selected Plan</h3>
                  
                  {/* Plan Card */}
                  <div className="border-2 border-blue-600 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl p-6">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        {getPlanIcon(selectedPlan.id)}
                      </div>
                      <h4 className="text-white text-2xl font-bold mb-2">{selectedPlan.name}</h4>
                      <p className="text-gray-300 mb-4">{selectedPlan.description}</p>
                      
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-white">${selectedPlan.price}</span>
                        <span className="text-gray-400 text-lg">/{selectedPlan.billing_cycle || 'month'}</span>
                      </div>
                    </div>

                    {/* Plan Features */}
                    {selectedPlan.features && selectedPlan.features.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="text-white font-semibold text-center mb-3">Plan Features</h5>
                        {selectedPlan.features.map((feature: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 text-gray-300">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm">
                              <span className="font-medium">{feature.label}:</span> {feature.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="space-y-6">
                  <h3 className="text-white text-xl font-semibold">Order Summary</h3>
                  
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/20">
                    {/* Plan & Billing */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">{selectedPlan.name}</p>
                        <p className="text-gray-400 text-sm">
                          {checkoutData.period === "yearly" ? "Yearly billing (12 months)" : "Monthly billing"}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-semibold">${selectedPlan.price}</span>
                        <p className="text-gray-400 text-sm">
                          {checkoutData.period === "yearly" ? "× 12 months" : "× 1 month"}
                        </p>
                      </div>
                    </div>

                    {/* Tax */}
                    <div className="flex items-center justify-between mb-6 p-3 bg-white/5 rounded-xl">
                      <span className="text-white font-medium">Tax (15%)</span>
                      <span className="text-white font-semibold">${totals.tax}</span>
                    </div>

                    {/* Total */}
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-xl font-bold">Total</span>
                        <span className="text-white text-2xl font-bold">${totals.total}</span>
                      </div>
                      <p className="text-gray-400 text-sm text-center">
                        {checkoutData.period === "yearly" ? "Billed annually" : "Billed monthly"}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <h4 className="text-white text-lg font-semibold">Payment Method</h4>
                    <div className="border border-white/20 rounded-2xl p-4 bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                          {getPaymentIcon(paymentMethod?.key || '')}
                        </div>
                        <div>
                          <h5 className="text-white font-semibold">{paymentMethod?.label || 'Payment Method'}</h5>
                          <p className="text-gray-400 text-sm">Secure payment processing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <div className="mt-8 text-center">
                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-12 py-4 rounded-2xl text-xl font-semibold shadow-lg w-full max-w-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6 mr-3" />
                      Pay ${totals.total} & Start Streaming
                    </>
                  )}
                </Button>
                
                <p className="text-gray-400 text-sm mt-3">
                  By clicking "Pay", you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
