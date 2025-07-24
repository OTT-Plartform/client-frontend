"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "@/components/forms/login-form"
import RegisterForm from "@/components/forms/register-form"

export default function AuthPage() {
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">OTT Streaming</h1>
            <p className="text-gray-400">Your gateway to African entertainment</p>
          </div>

          <Card className="bg-black/80 border-gray-800 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-white text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-gray-400">Sign in to your account or create a new one</CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800 mb-6">
                  <TabsTrigger value="login" className="text-white data-[state=active]:bg-red-600">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-white data-[state=active]:bg-red-600">
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>

                <TabsContent value="register">
                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
