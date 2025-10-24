"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Monitor, Laptop, Tablet, Smartphone, CreditCard, Wallet, Banknote, Check, Shield, Play, Crown, Users, CheckCircle } from "lucide-react"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Footer from "@/components/layout/footer"

export default function WelcomePage() {
  const [plans, setPlans] = useState<any[]>([])
  const [plansLoading, setPlansLoading] = useState(true)
  const [paymentMethods, setPaymentMethods] = useState<Array<{ key: string; label: string }>>([])
  const [paymentsLoading, setPaymentsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Fetch subscription plans (public)
    ;(async () => {
      try {
        const res = await api.getSubscriptionPlans()
        if (!isMounted) return
        const fetched = res?.data?.subscription_plans || []
        setPlans(fetched)
      } catch (_) {
        // fallback to empty -> show nothing
        if (isMounted) setPlans([])
      } finally {
        if (isMounted) setPlansLoading(false)
      }
    })()

    // Fetch payment methods (may require auth) – fallback to generic
    ;(async () => {
      try {
        const res = await api.getPaymentMethods()
        if (!isMounted) return
        const methodsRaw = res?.data?.methods || res?.data?.payment_methods || res?.data || []
        if (Array.isArray(methodsRaw) && methodsRaw.length > 0) {
          setPaymentMethods(methodsRaw.map((m: any) => ({ key: m.key ?? m.code ?? m.id ?? m.label, label: m.label ?? m.name ?? String(m.key ?? m.code ?? m.id ?? "Method"), description: m.description })))
        } else {
          setPaymentMethods([
            { key: "card", label: "Credit / Debit Cards" },
            { key: "wallet", label: "Mobile Wallets" },
            { key: "bank", label: "Bank Transfers" },
          ])
        }
      } catch (_) {
        setPaymentMethods([
          { key: "card", label: "Credit / Debit Cards" },
          { key: "wallet", label: "Mobile Wallets" },
          { key: "bank", label: "Bank Transfers" },
        ])
      } finally {
        if (isMounted) setPaymentsLoading(false)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/30 sticky top-0 z-50">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="UbiqEnt" width={140} height={36} priority className="h-9 w-auto" />
        </Link>
        <div className="space-x-4">
          <Link
            href="/login"
            className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition font-medium shadow-md"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative h-[70vh] flex items-center justify-center text-center">
        <img
          src="/hero-banner.jpg"
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        <div className="relative z-10 px-6">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Unlimited Movies, Series & More
          </h2>
          <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto mb-6">
            Watch anywhere. Cancel anytime. Ready to watch? Join us today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 transition text-lg font-semibold shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="px-6 py-16 bg-gradient-to-b from-black/80 to-blue-950">
        <h3 className="text-2xl font-bold text-center mb-12">Why Choose UbiqEnt?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-blue-900/40 rounded-xl shadow-lg hover:scale-105 transition">
            <h4 className="font-semibold text-lg mb-2">📺 Unlimited Streaming</h4>
            <p className="text-blue-300 text-sm">
              Access thousands of movies and series anytime, anywhere.
            </p>
          </div>
          <div className="p-6 bg-blue-900/40 rounded-xl shadow-lg hover:scale-105 transition">
            <h4 className="font-semibold text-lg mb-2">💻 Watch Anywhere</h4>
            <p className="text-blue-300 text-sm">
              Enjoy on your phone, tablet, laptop, or smart TV.
            </p>
          </div>
          <div className="p-6 bg-blue-900/40 rounded-xl shadow-lg hover:scale-105 transition">
            <h4 className="font-semibold text-lg mb-2">🚫 Cancel Anytime</h4>
            <p className="text-blue-300 text-sm">
              No commitments. Start or stop your membership whenever you like.
            </p>
          </div>
          <div className="p-6 bg-blue-900/40 rounded-xl shadow-lg hover:scale-105 transition">
            <h4 className="font-semibold text-lg mb-2">🔥 Exclusive Content</h4>
            <p className="text-blue-300 text-sm">
              Discover premium shows and movies only available on UbiqEnt.
            </p>
          </div>
        </div>
      </section>

      {/* Devices Section */}
      <section className="px-6 py-20 bg-gradient-to-b from-blue-950 to-black text-center">
        <h3 className="text-2xl font-bold mb-12">Watch Anywhere</h3>
        <p className="text-blue-300 max-w-2xl mx-auto mb-12">
          Stream on your phone, tablet, laptop, or TV. With one account, you’re always connected.
        </p>
        <div className="flex flex-wrap justify-center gap-12 text-blue-200">
          <div className="flex flex-col items-center">
            <Monitor className="w-16 h-16 mb-4" />
            <p>TV</p>
          </div>
          <div className="flex flex-col items-center">
            <Laptop className="w-16 h-16 mb-4" />
            <p>Laptop</p>
          </div>
          <div className="flex flex-col items-center">
            <Tablet className="w-16 h-16 mb-4" />
            <p>Tablet</p>
          </div>
          <div className="flex flex-col items-center">
            <Smartphone className="w-16 h-16 mb-4" />
            <p>Phone</p>
          </div>
        </div>
      </section>

      {/* Payment Methods (from backend with images) */}
      <section className="px-6 py-16 bg-gradient-to-b from-black to-blue-950">
        <h3 className="text-2xl font-bold mb-12 text-center">Flexible Payment Methods</h3>
        {paymentsLoading ? (
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="border-2 rounded-2xl p-3 border-white/10 bg-white/5 w-[220px]">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/10 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {Array.from(
              new Map(
                paymentMethods.map((m: any) => [
                  (m.key || m.label || "").toString().toLowerCase(),
                  m,
                ]),
              ).values(),
            ).map((method: any) => {
              const key = (method.key || "").toString().toLowerCase()
              const label = method.label || "Payment Method"
              // removed description text from UI per request

              const getMethodImage = () => {
                if (key.includes("paypal")) return "/methods/paypal.svg"
                if (key.includes("eco")) return "/methods/EcoCash_logo.png"
                if (key.includes("inbucks") || key.includes("inbux")) return "/methods/inbucks.png"
                if (key.includes("card") || key.includes("visa") || key.includes("master")) return "/methods/credic_card.jpeg"
                return null
              }

              const imageSrc = getMethodImage()

              return (
                <div key={key || label} className="border-2 rounded-2xl p-3 transition-all duration-300 hover:scale-[1.02] border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 w-[220px]">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center overflow-hidden ${
                      key.includes("inbucks") || key.includes("inbux")
                        ? "bg-[#13294B]"
                        : key.includes("eco") || key.includes("paypal")
                        ? "bg-white ring-1 ring-gray-300"
                        : "bg-gradient-to-r from-gray-600 to-gray-700"
                    }`}>
                      {imageSrc ? (
                        <Image src={imageSrc} alt={label} width={56} height={56} className="object-contain w-12 h-12" />
                      ) : key.includes("bank") ? (
                        <Banknote className="w-7 h-7 text-white" />
                      ) : key.includes("wallet") || key.includes("mtn") || key.includes("airtel") ? (
                        <Wallet className="w-7 h-7 text-white" />
                      ) : key.includes("card") ? (
                        <CreditCard className="w-7 h-7 text-white" />
                      ) : (
                        <Shield className="w-7 h-7 text-white" />
                      )}
                    </div>
                    <div className="flex-1"><h4 className="text-white font-semibold truncate">{label}</h4></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Payment Plans (from backend) */}
      <section className="px-6 py-20 bg-gradient-to-b from-blue-950 to-black text-center">
        <h3 className="text-2xl font-bold mb-12">Choose Your Plan</h3>
        {plansLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="relative border-2 rounded-3xl p-6 border-white/10 bg-white/5">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 mx-auto mb-4 animate-pulse" />
                  <div className="h-6 w-40 bg-white/10 rounded mx-auto mb-3 animate-pulse" />
                  <div className="h-5 w-32 bg-white/10 rounded mx-auto mb-6 animate-pulse" />
                </div>
                <ul className="space-y-3 mb-6">
                  {Array.from({ length: 4 }).map((__, li) => (
                    <li key={li} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded bg-white/10 animate-pulse" />
                      <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
                    </li>
                  ))}
                </ul>
                <div className="h-10 w-36 bg-white/10 rounded-full mx-auto animate-pulse" />
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-blue-300">Plans will be available soon.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan: any) => {
              const isSelected = false
              return (
                <div
                  key={plan.id}
                  className={`relative border-2 rounded-3xl p-6 transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? "border-blue-600 bg-gradient-to-br from-blue-600/10 to-purple-600/10 shadow-xl"
                      : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                  } ${plan.is_popular ? "ring-2 ring-blue-600" : ""}`}
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
                      {![1,2,3].includes(Number(plan.id)) && <Crown className="w-10 h-10 text-white" />}
                    </div>
                    <h3 className="text-white text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">${Number(plan.price ?? 0).toFixed(2)}</span>
                      <span className="text-gray-400 text-lg">/{plan.billing_cycle || "month"}</span>
                    </div>
                    <p className="text-gray-400 mb-6">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {Array.isArray(plan.features) && plan.features.length > 0 ? (
                      plan.features.slice(0, 4).map((feature: any, index: number) => (
                        <li key={index} className="flex items-center gap-3 text-gray-300">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature.label}: {feature.value}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 text-sm text-center">No features listed</li>
                    )}
                  </ul>

                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                    </div>
                  )}

                  <Link
                    href={`/register?plan=${encodeURIComponent(plan.id)}`}
                    className="inline-block px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition font-medium shadow-md"
                  >
                    Choose Plan
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Call-to-Action Banner */}
      <section className="px-6 py-16 bg-gradient-to-r from-green-600 to-blue-600 text-center text-white">
        <h3 className="text-3xl font-bold mb-4">Join UbiqEnt today and start streaming instantly</h3>
        <p className="text-blue-100 mb-6">
          No contracts, no hassle. Just endless entertainment.
        </p>
        <Link
          href="/register"
          className="px-6 py-3 rounded-xl bg-black hover:bg-gray-900 transition text-lg font-semibold shadow-lg"
        >
          Sign Up Now
        </Link>
      </section>

      {/* 👇 Footer at bottom */}
      <Footer />
    </div>
  )
}
