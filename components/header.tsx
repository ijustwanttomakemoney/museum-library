"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Globe, User, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface HeaderProps {
  isOverlay?: boolean
  textColor?: 'light' | 'dark' | 'auto'
}

export default function Header({ isOverlay = false, textColor = 'auto' }: HeaderProps) {
  const [language, setLanguage] = useState("fr")
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  const isHomePage = pathname === '/'

  useEffect(() => {
    if (!isHomePage) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setScrolled(scrollPosition > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  const toggleLanguage = () => {
    setLanguage(language === "fr" ? "en" : "fr")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Determine text color based on context
  const getTextColor = () => {
    if (textColor === 'light') return 'text-white'
    if (textColor === 'dark') return 'text-gray-900'
    
    // Auto mode
    if (isHomePage && !scrolled) {
      return 'text-white' // Light text on dark banner
    }
    return 'text-gray-900 dark:text-white' // Adaptive text for other pages
  }

  // Determine background based on context
  const getBackground = () => {
    if (isHomePage) {
      return scrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }
    return 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'
  }

  // Determine positioning
  const getPositioning = () => {
    return isHomePage ? 'absolute top-0 z-50 w-full' : 'sticky top-0 z-50 w-full'
  }

  const textColorClass = getTextColor()
  const backgroundClass = getBackground()
  const positionClass = getPositioning()

  return (
    <header className={`${positionClass} ${backgroundClass} transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-1"
            aria-label="Retour à l'accueil - MuséesFR"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className={`text-xl font-semibold ${textColorClass}`}>MuséesFR</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Navigation principale">
            <Link
              href="/"
              className={`${textColorClass} hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              Accueil
            </Link>
            <Link
              href="/museums"
              className={`${textColorClass} hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              Musées
            </Link>
            <Link
              href="/exhibits"
              className={`${textColorClass} hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              Expositions
            </Link>
            <Link
              href="/events"
              className={`${textColorClass} hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              Événements
            </Link>
            <Link
              href="/community"
              className={`${textColorClass} hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              Communauté
            </Link>
            <Link
              href="/search"
              className={`${textColorClass} hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              Recherche
            </Link>
            <Link
              href="/artworks"
              className={`${textColorClass} hover:text-blue-400 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              Œuvres d'art
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"}
              className={`${textColorClass} hover:bg-white/10 hover:text-blue-300`}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              aria-label={`Changer la langue vers ${language === "fr" ? "anglais" : "français"}`}
              className={`${textColorClass} hover:bg-white/10 hover:text-blue-300`}
            >
              <Globe className="h-4 w-4 mr-1" />
              {language.toUpperCase()}
            </Button>
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className={`${textColorClass} hover:bg-white/10 hover:text-blue-300`}
                aria-label="Accéder au profil utilisateur"
              >
                <User className="h-4 w-4 mr-1" />
                Profil
              </Button>
            </Link>
            <Button 
              size="sm" 
              className={
                isHomePage && !scrolled 
                  ? "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 shadow-sm hover:shadow-md"
                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md"
              }
            >
              Connexion
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`md:hidden ${textColorClass} hover:bg-white/10 hover:text-blue-300`}
                aria-label="Ouvrir le menu de navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col space-y-4 mt-8" role="navigation" aria-label="Navigation mobile">
                <Link href="/" className="text-lg font-medium hover:text-blue-600 transition-colors">
                  Accueil
                </Link>
                <Link href="/museums" className="text-lg font-medium hover:text-blue-600 transition-colors">
                  Musées
                </Link>
                <Link href="/exhibits" className="text-lg font-medium hover:text-blue-600 transition-colors">
                  Expositions
                </Link>
                <Link href="/events" className="text-lg font-medium hover:text-blue-600 transition-colors">
                  Événements
                </Link>
                <Link href="/community" className="text-lg font-medium hover:text-blue-600 transition-colors">
                  Communauté
                </Link>
                <Link href="/search" className="text-lg font-medium hover:text-blue-600 transition-colors">
                  Recherche
                </Link>
                <Link href="/artworks" className="text-lg font-medium hover:text-blue-600 transition-colors">
                  Œuvres d'art
                </Link>
                <hr className="my-4" />
                <Link href="/profile" className="text-lg font-medium hover:text-blue-600 transition-colors">
                  Profil
                </Link>
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  className="justify-start bg-transparent"
                  aria-label={theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {theme === "dark" ? "Mode clair" : "Mode sombre"}
                </Button>
                <Button
                  onClick={toggleLanguage}
                  variant="outline"
                  className="justify-start bg-transparent"
                  aria-label={`Changer la langue vers ${language === "fr" ? "anglais" : "français"}`}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {language === "fr" ? "English" : "Français"}
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">Connexion</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
