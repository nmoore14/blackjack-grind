import { Link } from 'react-router-dom'
import { BookOpen, Brain, Gamepad } from 'lucide-react'
import { Button } from '../components/Button'

const features = [
  {
    name: 'Basic Strategy Guide',
    description: 'Learn the optimal playing strategy for every possible blackjack hand.',
    icon: BookOpen,
    href: '/strategy',
  },
  {
    name: 'Card Counting Tutorial',
    description: 'Master the art of card counting with our comprehensive guide.',
    icon: Brain,
    href: '/counting',
  },
  {
    name: 'Play Blackjack',
    description: 'Put your skills to the test in our customizable blackjack game.',
    icon: Gamepad,
    href: '/play',
  },
]

export function Home() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Welcome to BlackJack Grind
          </h1>
          <p className="mt-4 text-lg text-secondary">
            Your comprehensive platform for mastering blackjack strategy and card counting.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/play" className="inline-flex">
              <Button variant="primary" size="lg" className="w-full">
                Play Now
              </Button>
            </Link>
            <Link to="/strategy" className="inline-flex">
              <Button variant="secondary" size="lg" className="w-full">
                Learn Strategy
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20">
          <div className="flex flex-wrap justify-center items-center gap-8">
            {features.map((feature) => (
              <Link
                key={feature.name}
                to={feature.href}
                className="group relative rounded-lg border border-primary bg-background p-6 transition-all hover:border-accent hover:bg-primary/5 max-w-sm flex-1"
              >
                <div className="flex items-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <h3 className="ml-3 text-lg font-medium text-foreground group-hover:text-accent">{feature.name}</h3>
                </div>
                <p className="mt-2 text-sm text-secondary">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 