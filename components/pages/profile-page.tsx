"use client"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import Header from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileForm from "@/components/forms/profile-form"
import PaymentMethods from "@/components/sections/payment-methods"
import SubscriptionPlans from "@/components/sections/subscription-plans"
import { User, CreditCard, Crown } from "lucide-react"
import DevicesList from "@/components/profile/devices-list"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-blue-900 text-blue-100">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-blue-200">Account Settings</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-blue-800 rounded-md">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 text-blue-100 data-[state=active]:bg-blue-700 data-[state=active]:text-white rounded-md"
              >
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="flex items-center gap-2 text-blue-100 data-[state=active]:bg-blue-700 data-[state=active]:text-white rounded-md"
              >
                <CreditCard className="w-4 h-4" />
                Payment
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="flex items-center gap-2 text-blue-100 data-[state=active]:bg-blue-700 data-[state=active]:text-white rounded-md"
              >
                <Crown className="w-4 h-4" />
                Subscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="bg-blue-800 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-blue-100">Profile Information</CardTitle>
                  <CardDescription className="text-blue-300">
                    Update your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                  {/* Devices Section */}
                  <div className="mt-10">
                    <DevicesList />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="mt-6">
              <PaymentMethods />
            </TabsContent>

            <TabsContent value="subscription" className="mt-6">
              <SubscriptionPlans />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
