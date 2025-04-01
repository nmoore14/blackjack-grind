import { Link, Outlet } from '@tanstack/react-router'
import { useState } from 'react'
import { Home, BookOpen, Brain, Gamepad, Menu, X } from 'lucide-react'
import { Button } from './Button'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Basic Strategy', href: '/strategy', icon: BookOpen },
  { name: 'Card Counting', href: '/counting', icon: Brain },
  { name: 'Play Blackjack', href: '/play', icon: Gamepad },
]

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex flex-shrink-0 items-center">
              <h1 className="text-2xl font-bold text-primary">BlackJack Grind</h1>
            </div>
            <nav className="hidden sm:flex sm:items-center sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="nav-link inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="flex items-center sm:hidden">
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

        {/* Mobile menu */}
        <div
          className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } sm:hidden`}
        >
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-background px-4 py-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Menu</h2>
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
            <nav className="mt-8">
              <div className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="nav-link flex items-center rounded-lg px-4 py-3 text-base font-medium hover:bg-primary/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
} 