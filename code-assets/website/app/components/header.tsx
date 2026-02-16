"use client"

import { Menu, X, Home, Building2, Cpu, Brain, LogIn, LogOut, User, Mail, BarChart3 } from "lucide-react"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import SearchDropdown from "./search-dropdown"
import LoginModal from "./login-modal"
import { useUser } from "../contexts/user-context"
import { siteConfig } from "@/website/lib/config"

// Icon mapping for navigation items
const iconMap = {
  Home,
  Building2,
  Cpu,
  Brain,
  Mail,
  BarChart3
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, login, logout } = useUser()

  const handleLogin = (email: string) => {
    login(email)
    setIsLoginModalOpen(false)
  }

  const handleSubscribeClick = () => {
    router.push('/subscribe')
  }

  // Render authentication skeleton while loading
  const renderAuthSkeleton = () => (
    <div className="flex items-center space-x-2">
      <div className="w-20 h-8 bg-gray-200 rounded-md animate-pulse"></div>
    </div>
  )

  // Render authentication content
  const renderAuthContent = () => {
    if (isLoading) {
      return renderAuthSkeleton()
    }

    if (user) {
      return (
        <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{user.email}</span>
          <button
            onClick={logout}
            className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )
    }

    // Unauthenticated: show Subscribe and Login buttons
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleSubscribeClick}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary-hover rounded-md transition-colors"
        >
          Subscribe
        </button>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-brand-primary border border-brand-primary bg-white hover:bg-gray-50 rounded-md transition-colors"
        >
          Login
        </button>
      </div>
    )
  }

  // Render mobile authentication content
  const renderMobileAuthContent = () => {
    if (isLoading) {
      return (
        <div className="px-3 py-2 border-t">
          <div className="space-y-2">
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      )
    }

    if (user) {
      return (
        <div className="px-3 py-2 border-t">
          <div className="space-y-2">
            <div className="flex items-center px-3 py-2 text-sm text-gray-700">
              <User className="h-4 w-4 mr-3" />
              <span>{user.email}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="px-3 py-2 border-t">
        <button
          onClick={() => {
            handleSubscribeClick()
            setIsMenuOpen(false)
          }}
          className="flex items-center w-full px-3 py-2 text-base font-medium text-white bg-brand-primary hover:bg-brand-primary-hover rounded-md transition-colors"
        >
          <LogIn className="h-4 w-4 mr-3" />
          Subscribe
        </button>
      </div>
    )
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-screen-xl mx-auto px-2 md:px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center text-2xl font-bold text-brand-primary hover:text-brand-primary-hover transition-colors">
                <svg 
                  className="w-8 h-8 mr-2" 
                  viewBox="0 0 32 32" 
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11" cy="15.5" r="1.5"/>
                  <path d="M12,12H10V8h2a2,2,0,0,0,0-4H10A2.0023,2.0023,0,0,0,8,6v.5H6V6a4.0045,4.0045,0,0,1,4-4h2a4,4,0,0,1,0,8Z" transform="translate(0 0)"/>
                  <path d="M22.4479,21.0337A10.971,10.971,0,0,0,19.9211,4.7446l-.999,1.73A8.9967,8.9967,0,1,1,5,14H3a10.9916,10.9916,0,0,0,18.0338,8.4478L28.5859,30,30,28.5859Z" transform="translate(0 0)"/>
                </svg>
                {siteConfig.brand.name}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              {siteConfig.navigation.mainMenu.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap] || Home
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex flex-col items-center px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? "border-b-2 border-brand-primary text-brand-primary" : "text-gray-700 hover:text-gray-600"
                    }`}
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Search Box and Login */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              {siteConfig.features.search && (
              <div className="hidden md:block">
                <SearchDropdown />
              </div>
              )}

              {/* User Menu */}
              {siteConfig.features.userAccounts && renderAuthContent()}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
                {siteConfig.navigation.mainMenu.map((item) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap] || Home
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-base font-medium transition-colors ${
                        isActive ? "bg-brand-primary/10 text-brand-primary" : "text-gray-700 hover:text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}

                {/* Mobile Search */}
                {siteConfig.features.search && (
                <div className="px-3 py-2">
                  <SearchDropdown />
                </div>
                )}

                {/* Mobile Login/Logout */}
                {siteConfig.features.userAccounts && renderMobileAuthContent()}
              </div>
            </div>
          )}
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </>
  )
}
