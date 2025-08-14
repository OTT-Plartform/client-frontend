"use client"

import type React from "react"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import type { RootState } from "@/store/store"
import { logout } from "@/store/slices/authSlice"
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
import { Search, Bell, User, Settings, LogOut, Home, Film, Tv, UserPlus, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header
      className="fixed top-0 w-full bg-blue-900/95 backdrop-blur-sm z-50 border-b border-blue-700 font-nunito"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-200 transition-colors">
              AfriStream
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-blue-100 hover:text-blue-300 transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/movies"
                className="flex items-center gap-2 text-blue-100 hover:text-blue-300 transition-colors"
              >
                <Film className="w-4 h-4" />
                Movies
              </Link>
              <Link
                href="/series"
                className="flex items-center gap-2 text-blue-100 hover:text-blue-300 transition-colors"
              >
                <Tv className="w-4 h-4" />
                TV Shows
              </Link>

              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-blue-100 hover:text-blue-300">
                    Categories
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="bg-blue-800 border-blue-700 text-blue-100"
                  align="start"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/movies" className="w-full px-2 py-1 hover:bg-blue-700 rounded">
                      Comedy: Skits & Rising Talent
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/movies" className="w-full px-2 py-1 hover:bg-blue-700 rounded">
                      Agriculture Shows
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/series" className="w-full px-2 py-1 hover:bg-blue-700 rounded">
                      Diaspora Stories
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/series" className="w-full px-2 py-1 hover:bg-blue-700 rounded">
                      Afrimation (African Animation)
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/series" className="w-full px-2 py-1 hover:bg-blue-700 rounded">
                      Documentaries
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/movies" className="w-full px-2 py-1 hover:bg-blue-700 rounded">
                      Real Estate & Property
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/series" className="w-full px-2 py-1 hover:bg-blue-700 rounded">
                      Exclusive Creators
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/movies" className="w-full px-2 py-1 hover:bg-blue-700 rounded">
                      African Classics
                    </Link>
                  </DropdownMenuItem>
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
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-blue-800 border-blue-700 text-blue-100 placeholder-blue-400 focus:border-blue-400"
              />
            </div>
          </form>

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
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-blue-800 border-blue-700"
                    align="end"
                    forceMount
                  >
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-blue-100">{user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-blue-300">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-blue-700" />
                    <DropdownMenuItem asChild className="text-blue-100 hover:bg-blue-700">
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="text-blue-100 hover:bg-blue-700">
                      <Link href="/settings" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
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
                  <Button variant="ghost" className="text-blue-100 hover:bg-blue-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
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
