import { Link, Outlet } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Home, BookOpen, Brain, Gamepad, Menu, X, Sun, Moon } from 'lucide-react'
import { Button } from './Button'
import { cn } from '../lib/utils'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Basic Strategy', href: '/strategy', icon: BookOpen },
  { name: 'Card Counting', href: '/counting', icon: Brain },
  { name: 'Play Blackjack', href: '/play', icon: Gamepad },
]

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Add preload class to prevent transitions on page load
    document.documentElement.classList.add('preload')

    // Check if user prefers dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }

    // Remove preload class after a short delay
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('preload')
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }

  return (
    <div className="layout-container">
      <div className="layout-header">
        <div className="layout-content">
          <div className="layout-nav">
            <div className="flex flex-shrink-0 items-center">
              <h1 className="layout-title">BlackJack Grind</h1>
            </div>
            <nav className="hidden sm:flex sm:items-center sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="nav-link"
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="theme-toggle"
              >
                <span className="sr-only">Toggle theme</span>
                {isDark ? (
                  <Sun className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Moon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <div className="sm:hidden">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="!p-2"
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main>
        <div className="layout-content">
          <Outlet />
        </div>
      </main>

      {/* Mobile menu - moved outside header */}
      <div
        className={cn(
          'layout-mobile-menu sm:hidden',
          mobileMenuOpen ? 'layout-mobile-menu-open' : 'layout-mobile-menu-closed'
        )}
      >
        <button
          type="button"
          className="layout-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        />
        <div className="layout-mobile-panel">
          <div className="flex items-center justify-between">
            <h2 className="layout-title">Menu</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="!p-2"
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
          <nav className="layout-mobile-nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="nav-link flex items-center w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-6 w-6 mr-3" />
                <span className="text-lg">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
} 