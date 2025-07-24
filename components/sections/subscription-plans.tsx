"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { showSnackbar } from "@/store/slices/uiSlice"
import { Check, Crown, Star, Zap } from "lucide-react"

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 8.99,
    period: "month",
    description: "Perfect for casual viewers",
    icon: Star,
    features: ["HD streaming", "1 device at a time", "Limited content library", "Standard support"],
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 15.99,
    period: "month",
    description: "Most popular choice",
    icon: Crown,
    features: [
      "4K Ultra HD streaming",
      "4 devices simultaneously",
      "Full content library",
      "Priority support",
      "Offline downloads",
      "No ads",
    ],
    popular: true,
  },
  {
    id: "family",
    name: "Family",
    price: 22.99,
    period: "month",
    description: "Best for families",
    icon: Zap,
    features: [
      "4K Ultra HD streaming",
      "6 devices simultaneously",
      "Full content library",
      "24/7 premium support",
      "Offline downloads",
      "No ads",
      "Parental controls",
      "Multiple profiles",
    ],
    popular: false,
  },
]

export default function SubscriptionPlans() {
  const dispatch = useDispatch()
  const [currentPlan, setCurrentPlan] = useState("premium")
  const [isLoading, setIsLoading] = useState(false)

  const handlePlanChange = async (planId: string) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setCurrentPlan(planId)
      dispatch(
        showSnackbar({
          message: `Successfully switched to ${subscriptionPlans.find((p) => p.id === planId)?.name} plan!`,
          type: "success",
        }),
      )
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Current Subscription</CardTitle>
          <CardDescription className="text-gray-400">
            You are currently on the {subscriptionPlans.find((p) => p.id === currentPlan)?.name} plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  {subscriptionPlans.find((p) => p.id === currentPlan)?.name} Plan
                </h3>
                <p className="text-gray-400">${subscriptionPlans.find((p) => p.id === currentPlan)?.price}/month</p>
              </div>
            </div>
            <Badge className="bg-green-600 text-white">Active</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = plan.id === currentPlan

          return (
            <Card
              key={plan.id}
              className={`relative bg-gray-900 border-gray-800 ${plan.popular ? "ring-2 ring-red-600" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-red-600 text-white">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    isCurrentPlan
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                  disabled={isCurrentPlan || isLoading}
                  onClick={() => handlePlanChange(plan.id)}
                >
                  {isCurrentPlan ? "Current Plan" : `Switch to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
