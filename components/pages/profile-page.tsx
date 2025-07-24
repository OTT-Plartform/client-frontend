"use client"
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

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth)

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Subscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription className="text-gray-400">
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
