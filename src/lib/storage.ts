import type { GameState, Hand } from './game'

const STORAGE_KEYS = {
  GAME_STATE: 'blackjack_game_state',
  STATS: 'blackjack_stats',
} as const

export interface StoredStats {
  hands: Hand[]
  bets: number[]
  payouts: number[]
  lastUpdated: string
}

export function saveGameState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save game state:', error)
  }
}

export function loadGameState(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.GAME_STATE)
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('Failed to load game state:', error)
    return null
  }
}

export function saveStats(stats: StoredStats) {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats))
  } catch (error) {
    console.error('Failed to save stats:', error)
  }
}

export function loadStats(): StoredStats | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.STATS)
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    console.error('Failed to load stats:', error)
    return null
  }
} 