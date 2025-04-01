import { Button } from '../components/Button'

export function MiniGames() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">Card Counting Mini-Games</h1>
        <p className="mt-4 text-lg text-secondary">Coming soon...</p>
        <div className="mt-8">
          <Button variant="primary" size="lg" disabled>
            Play Games
          </Button>
        </div>
      </div>
    </div>
  )
} 