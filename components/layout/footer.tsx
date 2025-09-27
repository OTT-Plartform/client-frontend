"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer
      className="w-full bg-blue-900/95 backdrop-blur-sm border-t border-blue-700 font-nunito text-blue-100"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div className="flex flex-col space-y-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="UbiqEnt"
              width={140}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>
          <p className="text-sm text-blue-300">
            UbiqEnt is your gateway to African movies, TV shows, documentaries, and exclusive creators.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-blue-200 mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-blue-300 transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/movies" className="hover:text-blue-300 transition-colors">Movies</Link>
            </li>
            <li>
              <Link href="/series" className="hover:text-blue-300 transition-colors">TV Shows</Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-blue-300 transition-colors">Categories</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-blue-200 mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/help" className="hover:text-blue-300 transition-colors">Help Center</Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-blue-300 transition-colors">FAQ</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-300 transition-colors">Contact Us</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-blue-300 transition-colors">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-semibold text-blue-200 mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <Link href="https://facebook.com" target="_blank" className="hover:text-blue-300">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-blue-300">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="https://instagram.com" target="_blank" className="hover:text-blue-300">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="https://youtube.com" target="_blank" className="hover:text-blue-300">
              <Youtube className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-700 mt-8 py-4 text-center text-sm text-blue-300">
        © {new Date().getFullYear()} UbiqEnt. All rights reserved.
      </div>
    </footer>
  )
}
