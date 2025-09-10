"use client"

import { useEffect, useState } from "react"
import { CreditCard, CheckCircle, Sparkles, Star, Crown, Play } from "lucide-react"

interface PaymentSuccessProps {
  amount: string
  planName: string
  onComplete?: () => void
}

export default function PaymentSuccess({ amount, planName, onComplete }: PaymentSuccessProps) {
  const [showCheckmark, setShowCheckmark] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showRedirect, setShowRedirect] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowCheckmark(true), 300)
    const timer2 = setTimeout(() => setShowSparkles(true), 600)
    const timer3 = setTimeout(() => setShowMessage(true), 900)
    const timer4 = setTimeout(() => setShowRedirect(true), 1200)
    const timer5 = setTimeout(() => onComplete?.(), 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
    }
  }, [onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-green-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-yellow-500/20 rounded-full blur-xl animate-pulse delay-1500" />
      </div>

      {/* Floating Money/Star Particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {i % 3 === 0 ? (
              <Star className="w-3 h-3 text-yellow-400" />
            ) : i % 3 === 1 ? (
              <Crown className="w-3 h-3 text-purple-400" />
            ) : (
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            )}
          </div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        {/* Success Checkmark with Payment Icon */}
        <div className="relative mb-8">
          <div className={`w-36 h-36 mx-auto transition-all duration-1000 ${
            showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}>
            <div className="w-full h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl relative">
              <CheckCircle className="w-24 h-24 text-white animate-pulse" />
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          {/* Sparkles Animation */}
          {showSparkles && (
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <Sparkles
                  key={i}
                  className="absolute w-8 h-8 text-yellow-400 animate-ping"
                  style={{
                    left: `${15 + (i * 7)}%`,
                    top: `${15 + (i * 4)}%`,
                    animationDelay: `${i * 0.15}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className={`text-5xl font-bold text-white mb-4 transition-all duration-1000 ${
          showMessage ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          Payment Successful!
        </h1>

        {/* Amount and Plan */}
        <div className={`mb-6 transition-all duration-1000 delay-200 ${
          showMessage ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <p className="text-3xl font-bold text-green-400 mb-2">${amount}</p>
          <p className="text-xl text-gray-300">{planName} Plan</p>
        </div>

        {/* Welcome Message */}
        <p className={`text-xl text-gray-300 mb-8 transition-all duration-1000 delay-400 ${
          showMessage ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          Welcome to ZIMUSHA! Your premium streaming experience starts now.
        </p>

        {/* Features Preview */}
        <div className={`grid grid-cols-3 gap-4 mb-8 transition-all duration-1000 delay-500 ${
          showMessage ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <Play className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Unlimited Movies</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <Crown className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">Premium Content</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-white text-sm font-medium">HD Quality</p>
          </div>
        </div>

        {/* Redirect Message */}
        <div className={`transition-all duration-1000 delay-600 ${
          showRedirect ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-100" />
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-200" />
          </div>
          <p className="text-gray-400">Taking you to your streaming dashboard...</p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-24 h-24 text-yellow-400/20 animate-spin">
          <Star className="w-full h-full" />
        </div>
        <div className="absolute -bottom-20 -right-20 w-20 h-20 text-purple-400/20 animate-pulse">
          <Crown className="w-full h-full" />
        </div>
        <div className="absolute top-1/4 -right-10 w-16 h-16 text-green-400/20 animate-bounce">
          <Play className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}
