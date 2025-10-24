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
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="text-blue-100 hover:bg-blue-700">
                  <Bell className="w-5 h-5" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={formatAvatarUrl(user?.avatar) || "/placeholder.svg"}
                          alt={getUserDisplayName(user)}
                        />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-blue-800 border-blue-700" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={formatAvatarUrl(user?.avatar) || "/placeholder.svg"}
                          alt={getUserDisplayName(user)}
                        />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-blue-100">{getUserDisplayName(user)}</p>
                        <p className="w-[200px] truncate text-sm text-blue-300">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-blue-700" />
                    <DropdownMenuItem asChild className="text-blue-100 hover:bg-blue-700">
                      <Link href="/profiles" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {labels.selectProfile}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-blue-700" />
                    <DropdownMenuItem asChild className="text-blue-100 hover:bg-blue-700">
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {labels.profile}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="text-blue-100 hover:bg-blue-700">
                      <Link href="/settings" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        {labels.settings}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-blue-700" />
                    <DropdownMenuItem
                      className="text-blue-100 hover:bg-blue-700 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-blue-100 hover:bg-blue-700 rounded-full px-5">
                    {labels.signIn}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5">
                    <UserPlus className="w-4 h-4 mr-2" />
                    {labels.signUp}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
  }
