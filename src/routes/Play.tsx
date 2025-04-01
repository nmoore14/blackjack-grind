import { Button } from '../components/Button'
import { Settings } from 'lucide-react'
import { useGameSettings, useSessionStats } from '../hooks/useGame'
import { useNavigate } from '@tanstack/react-router'
import { BlackjackGame } from '../components/BlackjackGame'

export function Play() {
  const navigate = useNavigate()
  const { data: settings, isLoading: isLoadingSettings } = useGameSettings()
  const { data: sessionStats, isLoading: isLoadingStats } = useSessionStats()

  if (isLoadingSettings || isLoadingStats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg text-secondary">Loading...</div>
      </div>
    )
  }

  if (!settings || !sessionStats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg text-warning">Error loading game data</div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-foreground">Play Blackjack</h1>
          <Button 
            variant="secondary" 
            className="flex items-center gap-2"
            onClick={() => navigate({ to: '/play/settings' })}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Button>
        </div>

        <div className="mt-8 flex w-full">
          {/* Main Game Area */}
          <div className="w-full rounded-lg border border-primary bg-background p-6">
            <BlackjackGame />
          </div>
        </div>
      </div>
    </div>
  )
} 