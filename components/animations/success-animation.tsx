"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Sparkles, Star, Heart } from "lucide-react"

interface SuccessAnimationProps {
  title: string
  message: string
  redirectMessage?: string
  onComplete?: () => void
}

export default function SuccessAnimation({ 
  title, 
  message, 
  redirectMessage = "Redirecting...",
  onComplete 
}: SuccessAnimationProps) {
  const [showCheckmark, setShowCheckmark] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showRedirect, setShowRedirect] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowCheckmark(true), 300)
    const timer2 = setTimeout(() => setShowSparkles(true), 600)
    const timer3 = setTimeout(() => setShowMessage(true), 900)
    const timer4 = setTimeout(() => setShowRedirect(true), 1200)
    const timer5 = setTimeout(() => onComplete?.(), 3000)

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
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* Success Checkmark */}
        <div className="relative mb-8">
          <div className={`w-32 h-32 mx-auto transition-all duration-1000 ${
            showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}>
            <div className="w-full h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-20 h-20 text-white animate-pulse" />
            </div>
          </div>
          
          {/* Sparkles Animation */}
          {showSparkles && (
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <Sparkles
                  key={i}
                  className="absolute w-6 h-6 text-yellow-400 animate-ping"
                  style={{
                    left: `${20 + (i * 10)}%`,
                    top: `${20 + (i * 5)}%`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className={`text-4xl font-bold text-white mb-4 transition-all duration-1000 ${
          showMessage ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {title}
        </h1>

        {/* Message */}
        <p className={`text-xl text-gray-300 mb-8 transition-all duration-1000 delay-300 ${
          showMessage ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {message}
        </p>

        {/* Redirect Message */}
        <div className={`transition-all duration-1000 delay-600 ${
          showRedirect ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
          </div>
          <p className="text-gray-400">{redirectMessage}</p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 text-yellow-400/30 animate-spin">
          <Star className="w-full h-full" />
        </div>
        <div className="absolute -bottom-10 -right-10 w-16 h-16 text-pink-400/30 animate-pulse">
          <Heart className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}
