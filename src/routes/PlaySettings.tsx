import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '../components/Button'
import { useGameSettings, useUpdateGameSettings } from '../hooks/useGame'

export function PlaySettings() {
  const navigate = useNavigate()
  const { data: settings, isLoading } = useGameSettings()
  const { mutate: updateSettings, isPending } = useUpdateGameSettings()

  const resetGame = () => {
    // Clear all game-related storage
    localStorage.removeItem('blackjack_game_state')
    localStorage.removeItem('blackjack_stats')
    
    // Navigate back to play page
    navigate({ to: '/play' })
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg text-secondary">Loading...</div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg text-warning">Error loading settings</div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-foreground">Game Settings</h1>
          <Button 
            variant="secondary" 
            onClick={() => navigate({ to: '/play' })}
          >
            Back to Game
          </Button>
        </div>

        <div className="mt-8 max-w-2xl space-y-8">
          {/* Bank Settings */}
          <div className="rounded-lg border border-primary bg-background p-6">
            <h2 className="text-xl font-semibold text-foreground">Bank Settings</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="startingBank" className="block text-sm font-medium text-secondary">
                  Starting Bank
                </label>
                <input
                  type="number"
                  id="startingBank"
                  min="100"
                  max="100000"
                  value={settings.startingBank}
                  onChange={(e) => updateSettings({ ...settings, startingBank: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border border-primary bg-background px-3 py-2 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="minBet" className="block text-sm font-medium text-secondary">
                  Minimum Bet
                </label>
                <input
                  type="number"
                  id="minBet"
                  min="1"
                  max="1000"
                  value={settings.minBet}
                  onChange={(e) => updateSettings({ ...settings, minBet: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border border-primary bg-background px-3 py-2 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="maxBet" className="block text-sm font-medium text-secondary">
                  Maximum Bet
                </label>
                <input
                  type="number"
                  id="maxBet"
                  min="1"
                  max="10000"
                  value={settings.maxBet}
                  onChange={(e) => updateSettings({ ...settings, maxBet: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border border-primary bg-background px-3 py-2 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>
          </div>

          {/* Game Rules */}
          <div className="rounded-lg border border-primary bg-background p-6">
            <h2 className="text-xl font-semibold text-foreground">Game Rules</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="decks" className="block text-sm font-medium text-secondary">
                  Number of Decks
                </label>
                <input
                  type="number"
                  id="decks"
                  min="1"
                  max="8"
                  value={settings.decks}
                  onChange={(e) => updateSettings({ ...settings, decks: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border border-primary bg-background px-3 py-2 text-foreground shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="dealerHitsSoft17" className="text-sm font-medium text-secondary">
                    Dealer Hits on Soft 17
                  </label>
                  <input
                    type="checkbox"
                    id="dealerHitsSoft17"
                    checked={settings.dealerHitsSoft17}
                    onChange={(e) => updateSettings({ ...settings, dealerHitsSoft17: e.target.checked })}
                    className="h-4 w-4 rounded border-primary text-accent focus:ring-accent"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="surrenderAllowed" className="text-sm font-medium text-secondary">
                    Surrender Allowed
                  </label>
                  <input
                    type="checkbox"
                    id="surrenderAllowed"
                    checked={settings.surrenderAllowed}
                    onChange={(e) => updateSettings({ ...settings, surrenderAllowed: e.target.checked })}
                    className="h-4 w-4 rounded border-primary text-accent focus:ring-accent"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="doubleAfterSplit" className="text-sm font-medium text-secondary">
                    Double After Split
                  </label>
                  <input
                    type="checkbox"
                    id="doubleAfterSplit"
                    checked={settings.doubleAfterSplit}
                    onChange={(e) => updateSettings({ ...settings, doubleAfterSplit: e.target.checked })}
                    className="h-4 w-4 rounded border-primary text-accent focus:ring-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-secondary/20">
            <h2 className="text-xl font-semibold mb-4">Reset Game</h2>
            <p className="text-secondary mb-4">
              This will clear all game progress, statistics, and return your bank to the starting amount.
            </p>
            <Button 
              variant="alert" 
              onClick={resetGame}
            >
              Reset Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 