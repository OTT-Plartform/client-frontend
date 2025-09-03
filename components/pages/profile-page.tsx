"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import Header from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Heart, 
  Crown, 
  Smartphone, 
  CreditCard, 
  Camera, 
  Settings,
  Bell,
  Shield,
  Globe,
  LogOut,
  Plus,
  ArrowRight,
  Mail,
  MapPin,
  Calendar,
  Edit3
} from "lucide-react";

import { useRouter } from "next/navigation"
import EditProfileModal from "@/components/modals/edit-profile-modal"

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, router])

  // Derive profile data from Redux user without additional fetches
  const profileData: any = user || {}
  const favoriteGenres: any[] = profileData.favorite_genres || []
  const currentSubscription: any = profileData.current_subscription || null
  const subscriptionHistory: any[] = profileData.subscription_history || []
  const paymentMethodsUsed: any[] = profileData.payment_methods_used || []

  const handleLogout = () => {
    localStorage.removeItem("userData")
    localStorage.removeItem("accessToken")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Profile Card */}
          <Card className="lg:col-span-1 bg-gray-900/80 border-gray-700 shadow-lg rounded-2xl backdrop-blur-md">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={user?.avatar || "/placeholder-user.jpg"} alt={user?.full_name || "U"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-3xl font-semibold">
                      {(user?.full_name || "U")?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 bg-white hover:bg-gray-50 text-gray-700 rounded-full w-10 h-10 shadow-md"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold text-white">
                    {user?.full_name || "User Name"}
                  </h1>
                  <p className="text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email || "user@example.com"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span>{user?.city || "Unknown"}, {user?.country || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric',
                      day: 'numeric'
                    }) : 'Unknown'}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/80 border-gray-700 shadow-lg rounded-2xl backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Active Plan</p>
                    <p className="text-2xl font-semibold text-white">
                      {currentSubscription?.plan?.name || "No Plan"}
                    </p>
                    <Badge className={`mt-2 ${currentSubscription?.is_active ? "bg-green-600 text-white" : "bg-gray-600 text-white"}`}>
                      {currentSubscription?.status || "Inactive"}
                    </Badge>
                  </div>
                  <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/80 border-gray-700 shadow-lg rounded-2xl backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Connected Devices</p>
                    <p className="text-2xl font-semibold text-white">3</p>
                    <p className="text-sm text-gray-300 mt-1">2 active sessions</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/80 border-gray-700 shadow-lg rounded-2xl backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Payment Methods</p>
                    <p className="text-2xl font-semibold text-white">{paymentMethodsUsed.length}</p>
                    <p className="text-sm text-gray-300 mt-1">
                      {paymentMethodsUsed.length > 0 ? `${paymentMethodsUsed[0]?.label}` : "None added"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/80 border-gray-700 shadow-lg rounded-2xl backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">Interests</p>
                    <p className="text-2xl font-semibold text-white">{favoriteGenres.length}</p>
                    <p className="text-sm text-gray-300 mt-1">Categories selected</p>
                    </div>
                  <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full justify-between bg-transparent border-0 rounded-2xl shadow-none p-0 mb-8 gap-4">
              <TabsTrigger
                value="personal"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 rounded-xl px-6 py-3 transition-all text-white border border-gray-300 hover:bg-white hover:text-gray-900 flex-1"
              >
                <User className="w-4 h-4" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="interests"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 rounded-xl px-6 py-3 transition-all text-white border border-gray-300 hover:bg-white hover:text-gray-900 flex-1"
              >
                <Heart className="w-4 h-4" />
                Interests
              </TabsTrigger>
              <TabsTrigger
                value="subscription"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 rounded-xl px-6 py-3 transition-all text-white border border-gray-300 hover:bg-white hover:text-gray-900 flex-1"
              >
                <Crown className="w-4 h-4" />
                Subscription
              </TabsTrigger>
              <TabsTrigger
                value="devices"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 rounded-xl px-6 py-3 transition-all text-white border border-gray-300 hover:bg-white hover:text-gray-900 flex-1"
              >
                <Smartphone className="w-4 h-4" />
                Devices
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-gray-900 rounded-xl px-6 py-3 transition-all text-white border border-gray-300 hover:bg-white hover:text-gray-900 flex-1"
              >
                <CreditCard className="w-4 h-4" />
                Payment
              </TabsTrigger>
            </TabsList>

            {/* Personal Info Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="bg-gray-900/80 border-gray-700 shadow-lg rounded-2xl backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Personal Information</CardTitle>
                  <CardDescription className="text-gray-300">View your personal details and profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-400">Full Name</p>
                        <p className="text-white text-lg">{user?.full_name || "Not provided"}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-400">Email</p>
                        <p className="text-white text-lg">{user?.email || "Not provided"}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-400">Phone Number</p>
                        <p className="text-white text-lg">{user?.phone_number || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Location & Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Location & Personal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-400">Date of Birth</p>
                        <p className="text-white text-lg">
                          {user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : "Not provided"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-400">Country</p>
                        <p className="text-white text-lg">{user?.country || "Not provided"}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-400">City</p>
                        <p className="text-white text-lg">{user?.city || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">About</h3>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-400">Bio</p>
                      <p className="text-white text-lg leading-relaxed">{user?.bio || "No bio provided"}</p>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-400">Provider</p>
                        <p className="text-white text-lg capitalize">{user?.provider || "Not provided"}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-400">Member Since</p>
                        <p className="text-white text-lg">
                          {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : "Not provided"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-400">Last Updated</p>
                        <p className="text-white text-lg">
                          {user?.updated_at ? new Date(user.updated_at).toLocaleDateString('en-US', { 
                            weekday: 'long',
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Interests Tab */}
            <TabsContent value="interests" className="space-y-6">
              <Card className="bg-gray-900/80 border-gray-700 shadow-lg rounded-2xl backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Your Interests</CardTitle>
                  <CardDescription className="text-gray-300">Manage your content preferences and genres</CardDescription>
                </CardHeader>
                <CardContent>
                  {favoriteGenres.length === 0 ? (
                    <p className="text-gray-400">No interests selected yet.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {favoriteGenres.map((genre) => (
                        <div key={genre.id} className="p-4 border-2 border-gray-600 rounded-xl text-center bg-gray-800/50">
                          <p className="font-medium text-white">{genre.name}</p>
                          {genre.description && (
                            <p className="text-xs text-gray-400 mt-1">{genre.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="space-y-6">
              <Card className="bg-gray-900/80 border-gray-700 shadow-lg rounded-2xl backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Current Plan</CardTitle>
                  <CardDescription className="text-gray-300">Your active subscription and plan details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Plan Display */}
                  {currentSubscription ? (
                    <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 p-6 rounded-2xl border border-blue-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <Crown className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{currentSubscription.plan?.name}</h3>
                            <p className="text-gray-300">
                              {currentSubscription.plan?.currency} {currentSubscription.plan?.price}/{currentSubscription.plan?.billing_cycle}
                            </p>
                            <Badge className={`mt-2 ${currentSubscription.is_active ? "bg-green-600 text-white" : "bg-gray-600 text-white"}`}>
                              {currentSubscription.status}
                            </Badge>
                          </div>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
                          Upgrade Plan
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">No active subscription.</p>
                  )}

                  {/* Plan Features */}
                  {currentSubscription?.plan?.features?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {currentSubscription.plan.features.map((f: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-white">{f.label}: {f.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Subscription History */}
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold">Subscription History</h4>
                    {subscriptionHistory.length === 0 ? (
                      <p className="text-gray-400">No previous subscriptions.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {subscriptionHistory.map((s: any) => (
                          <div key={s.id} className="p-4 rounded-xl border border-gray-700 bg-gray-800/50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-medium">{s.status}</p>
                                <p className="text-gray-400 text-sm">Plan ID: {s.plan_id} • {s.payment_method}</p>
                              </div>
                              <Badge className={`${s.is_active ? "bg-green-600" : "bg-gray-600"} text-white`}>{s.is_active ? "Active" : "Inactive"}</Badge>
                            </div>
                            <div className="mt-2 space-y-1">
                              <p className="text-gray-400 text-xs">
                                <span className="text-gray-300">From:</span> {s.starts_at ? new Date(s.starts_at).toLocaleDateString('en-US', { 
                                  day: 'numeric',
                                  month: 'short', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'Unknown'}
                              </p>
                              <p className="text-gray-400 text-xs">
                                <span className="text-gray-300">To:</span> {s.ends_at ? new Date(s.ends_at).toLocaleDateString('en-US', { 
                                  day: 'numeric',
                                  month: 'short', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) : 'Unknown'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Devices Tab */}
            <TabsContent value="devices" className="space-y-6">
              <Card className="bg-gray-900/80 border-gray-700 shadow-lg rounded-2xl backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Connected Devices</CardTitle>
                  <CardDescription className="text-gray-300">Manage devices connected to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "iPhone 14 Pro", location: "Harare, ZW", lastActive: "2 minutes ago", current: true },
                    { name: "MacBook Pro", location: "Harare, ZW", lastActive: "1 hour ago", current: false },
                    { name: "Samsung TV", location: "Harare, ZW", lastActive: "3 days ago", current: false }
                  ].map((device, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-600 rounded-xl bg-gray-800/50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-gray-300" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{device.name}</h4>
                          <p className="text-sm text-gray-300">{device.location} • {device.lastActive}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {device.current && (
                          <Badge className="bg-green-600 text-white">Current</Badge>
                        )}
                        <Button variant="outline" size="sm" className="text-red-400 border-red-500 hover:bg-red-900/20">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-6">
              <Card className="bg-gray-900/80 border-gray-700 shadow-lg rounded-2xl backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Payment Methods</CardTitle>
                  <CardDescription className="text-gray-300">Manage your payment options and billing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethodsUsed.length === 0 ? (
                    <p className="text-gray-400">No payment methods used yet.</p>
                  ) : (
                    paymentMethodsUsed.map((pm: any, index: number) => (
                      <div key={`${pm.key}-${index}`} className="flex items-center justify-between p-4 border border-gray-600 rounded-xl bg-gray-800/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                                                  <div>
                          <h4 className="font-medium text-white">{pm.label}</h4>
                          {pm.last_used && (
                            <p className="text-sm text-gray-300">
                              Last used: {new Date(pm.last_used).toLocaleDateString('en-US', { 
                                day: 'numeric',
                                month: 'short', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:bg-gray-700">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                  <Button className="w-full border-2 border-dashed border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400 py-4 rounded-xl bg-gray-800/50">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Payment Method
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Settings Section */}
          <Card className="bg-gray-900/80 border-gray-700 shadow-lg rounded-2xl mt-8 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Settings & Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Bell, title: "Notifications", description: "Manage your notification preferences" },
                  { icon: Shield, title: "Privacy Shortcuts", description: "Control your privacy settings" },
                  { icon: Globe, title: "Languages", description: "Change your language preference" },
                  { icon: LogOut, title: "Log Out", description: "Sign out of your account", action: handleLogout, danger: true }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 border border-gray-600 rounded-xl cursor-pointer hover:border-gray-500 transition-colors bg-gray-800/50 ${
                      item.danger ? "hover:border-red-500" : ""
                    }`}
                    onClick={item.action}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      item.danger ? "bg-red-900/50 text-red-400" : "bg-gray-700 text-gray-300"
                    }`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${item.danger ? "text-red-400" : "text-white"}`}>
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-300">{item.description}</p>
                    </div>
                    <ArrowRight className={`w-5 h-5 ${item.danger ? "text-red-400" : "text-gray-400"}`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  )
}
