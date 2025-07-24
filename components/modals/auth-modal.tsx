"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

interface AuthModalProps {
  onClose: () => void
  onAuthSuccess: () => void
}

export default function AuthModal({ onClose, onAuthSuccess }: AuthModalProps) {
  const router = useRouter()

  const handleLoginRedirect = () => {
    onClose()
    router.push("/login")
  }

  const handleRegisterRedirect = () => {
    onClose()
    router.push("/register")
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-12 right-0 text-white hover:bg-white/10 rounded-full z-10"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>

        <Card className="bg-black/90 border-gray-800 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-2xl">OTT</span>
            </div>
            <CardTitle className="text-white text-2xl font-bold">Join OTT Streaming</CardTitle>
            <CardDescription className="text-gray-400">Sign in to access premium content and features</CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8 space-y-4">
            <Button
              onClick={handleLoginRedirect}
              className="w-full h-12 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-semibold rounded-xl"
            >
              Sign In to Your Account
            </Button>

            <Button
              onClick={handleRegisterRedirect}
              variant="outline"
              className="w-full h-12 border-white/20 text-white hover:bg-white/10 bg-transparent rounded-xl"
            >
              Create New Account
            </Button>

            <div className="text-center pt-4">
              <p className="text-gray-400 text-sm">Join thousands of users enjoying premium African content</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
