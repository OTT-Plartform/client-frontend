"use client"

import Link from "next/link"
import { Monitor, Laptop, Tablet, Smartphone, CreditCard, Wallet, Banknote } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/30 sticky top-0 z-50">
        <h1 className="text-2xl font-extrabold tracking-wide">ZIMUSHA</h1>
        <div className="space-x-4">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-medium shadow-md"
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
              className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition text-lg font-semibold shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="px-6 py-16 bg-gradient-to-b from-black/80 to-blue-950">
        <h3 className="text-2xl font-bold text-center mb-12">Why Choose ZIMUSHA?</h3>
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
              Discover premium shows and movies only available on ZIMUSHA.
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

      {/* Payment Methods */}
      <section className="px-6 py-16 bg-gradient-to-b from-black to-blue-950 text-center">
        <h3 className="text-2xl font-bold mb-12">Flexible Payment Methods</h3>
        <div className="flex flex-wrap justify-center gap-8 text-blue-200">
          <div className="flex flex-col items-center p-6 bg-blue-900/40 rounded-xl shadow-lg hover:scale-105 transition">
            <CreditCard className="w-12 h-12 mb-3" />
            <p>Credit / Debit Cards</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-blue-900/40 rounded-xl shadow-lg hover:scale-105 transition">
            <Wallet className="w-12 h-12 mb-3" />
            <p>Mobile Wallets</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-blue-900/40 rounded-xl shadow-lg hover:scale-105 transition">
            <Banknote className="w-12 h-12 mb-3" />
            <p>Bank Transfers</p>
          </div>
        </div>
      </section>

      {/* Payment Plans */}
      <section className="px-6 py-20 bg-gradient-to-b from-blue-950 to-black text-center">
        <h3 className="text-2xl font-bold mb-12">Choose Your Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="p-8 bg-blue-900/40 rounded-xl shadow-lg hover:scale-105 transition">
            <h4 className="text-xl font-semibold mb-4">Basic</h4>
            <p className="text-3xl font-bold mb-4">$5<span className="text-lg">/mo</span></p>
            <ul className="text-blue-300 text-sm mb-6 space-y-2">
              <li>✔ 480p Quality</li>
              <li>✔ 1 Device</li>
              <li>✔ Unlimited Access</li>
            </ul>
            <Link
              href="/register"
              className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition font-medium shadow-md"
            >
              Choose Plan
            </Link>
          </div>

          {/* Standard Plan */}
          <div className="p-8 bg-blue-900/60 rounded-xl shadow-lg hover:scale-105 transition border-2 border-green-600">
            <h4 className="text-xl font-semibold mb-4">Standard</h4>
            <p className="text-3xl font-bold mb-4">$10<span className="text-lg">/mo</span></p>
            <ul className="text-blue-300 text-sm mb-6 space-y-2">
              <li>✔ 1080p Quality</li>
              <li>✔ 2 Devices</li>
              <li>✔ Unlimited Access</li>
            </ul>
            <Link
              href="/register"
              className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition font-medium shadow-md"
            >
              Choose Plan
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="p-8 bg-blue-900/40 rounded-xl shadow-lg hover:scale-105 transition">
            <h4 className="text-xl font-semibold mb-4">Premium</h4>
            <p className="text-3xl font-bold mb-4">$15<span className="text-lg">/mo</span></p>
            <ul className="text-blue-300 text-sm mb-6 space-y-2">
              <li>✔ 4K Ultra HD</li>
              <li>✔ 4 Devices</li>
              <li>✔ Unlimited Access</li>
            </ul>
            <Link
              href="/register"
              className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition font-medium shadow-md"
            >
              Choose Plan
            </Link>
          </div>
        </div>
      </section>

      {/* Call-to-Action Banner */}
      <section className="px-6 py-16 bg-gradient-to-r from-green-600 to-blue-600 text-center text-white">
        <h3 className="text-3xl font-bold mb-4">
          Join ZIMUSHA today and start streaming instantly
        </h3>
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

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-blue-300 border-t border-blue-800">
        © {new Date().getFullYear()} ZIMUSHA · All rights reserved
      </footer>
    </div>
  )
}
