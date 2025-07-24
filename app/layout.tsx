import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ReduxProvider } from "@/store/provider"
import Snackbar from "@/components/ui/snackbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OTT Streaming - Premium Streaming Platform",
  description: "Your premium OTT streaming experience with unlimited movies and TV shows",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
          <Snackbar />
        </ReduxProvider>
      </body>
    </html>
  )
}
