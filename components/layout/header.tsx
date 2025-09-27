"use client"

import type React from "react"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/store/store"
import { logout } from "@/store/slices/authSlice"
import { setLanguage } from "@/store/slices/languageSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Home,
  Film,
  Tv,
  UserPlus,
  ChevronDown,
  Users,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { clearStoredTokens } from "@/lib/auth"
import { formatAvatarUrl, getUserDisplayName, getUserInitials } from "@/lib/avatar-utils"

// ...imports remain the same

export default function Header() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const language = useSelector((state: RootState) => state.language.selected)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    dispatch(logout())
    clearStoredTokens()
    localStorage.removeItem("userData")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLanguageChange = (lang: string) => {
    dispatch(setLanguage(lang))
  }

  const labels: Record<string, string> = (() => {
    switch (language) {
      case "Shona":
        return {
          home: "Musha",
          movies: "Mafirimu",
          series: "Zvirongwa",
          signIn: "Pinda",
          signUp: "Nyoresa",
          selectProfile: "Sarudza Profile",
          profile: "Profile",
          settings: "Zvirongwa",
          searchPlaceholder: "Tsvaga mafirimu, zvirongwa...",
        }
      case "French":
        return {
          home: "Accueil",
          movies: "Films",
          series: "Séries",
          signIn: "Se connecter",
          signUp: "S'inscrire",
          selectProfile: "Sélectionner le profil",
          profile: "Profil",
          settings: "Paramètres",
          searchPlaceholder: "Rechercher des films, séries...",
        }
      case "Zulu":
        return {
          home: "Ikhaya",
          movies: "Amafilimu",
          series: "Uchungechunge",
          signIn: "Ngena",
          signUp: "Bhalisa",
          selectProfile: "Khetha Iphrofayela",
          profile: "Iphrofayela",
          settings: "Izilungiselelo",
          searchPlaceholder: "Sesha amafilimu, uchungechunge...",
        }
      case "Portuguese":
        return {
          home: "Início",
          movies: "Filmes",
          series: "Séries",
          signIn: "Entrar",
          signUp: "Cadastrar",
          selectProfile: "Selecionar Perfil",
          profile: "Perfil",
          settings: "Configurações",
          searchPlaceholder: "Pesquisar filmes, séries...",
        }
      case "Swahili":
        return {
          home: "Nyumbani",
          movies: "Filamu",
          series: "Mfululizo",
          signIn: "Ingia",
          signUp: "Jiunge",
          selectProfile: "Chagua Profaili",
          profile: "Profaili",
          settings: "Mipangilio",
          searchPlaceholder: "Tafuta filamu, mfululizo...",
        }
      default: // English
        return {
          home: "Home",
          movies: "Movies",
          series: "TV Shows",
          signIn: "Sign In",
          signUp: "Sign Up",
          selectProfile: "Select Profile",
          profile: "Profile",
          settings: "Settings",
          searchPlaceholder: "Search movies, TV shows...",
        }
    }
  })()

  return (
    <header
      className="fixed top-0 w-full bg-blue-900/95 backdrop-blur-sm z-50 border-b border-blue-700 font-nunito"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="UbiqEnt" width={120} height={32} priority className="h-8 w-auto" />
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="flex items-center gap-2 text-blue-100 hover:text-blue-300 transition-colors">
                <Home className="w-4 h-4" /> {labels.home}
              </Link>
              <Link href="/movies" className="flex items-center gap-2 text-blue-100 hover:text-blue-300 transition-colors">
                <Film className="w-4 h-4" /> {labels.movies}
              </Link>
              <Link href="/series" className="flex items-center gap-2 text-blue-100 hover:text-blue-300 transition-colors">
                <Tv className="w-4 h-4" /> {labels.series}
              </Link>

              {/* Language Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-blue-100 hover:text-blue-300">
                    {language}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-blue-800 border-blue-700 text-blue-100" align="start">
                  {["English", "Shona", "French", "Zulu", "Portuguese", "Swahili"].map((lang) => (
                    <DropdownMenuItem
                      key={lang}
                      className="w-full px-2 py-1 hover:bg-blue-700 rounded cursor-pointer"
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
              <Input
                type="text"
                placeholder={labels.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-blue-800 border-blue-700 text-blue-100 placeholder-blue-400 focus:border-blue-400"
              />
            </div>
          </form>

          {/* User Menu */}
          {/* ...the rest of the user menu stays the same */}
        </div>
      </div>
    </header>
  )
}
