import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

// Types
const GameSettingsSchema = z.object({
  startingBank: z.number().min(100).max(100000),
  minBet: z.number().min(1).max(1000),
  maxBet: z.number().min(1).max(10000),
  decks: z.number().min(1).max(8),
  dealerHitsSoft17: z.boolean(),
  surrenderAllowed: z.boolean(),
  doubleAfterSplit: z.boolean(),
})

const SessionStatsSchema = z.object({
  handsPlayed: z.number(),
  handsWon: z.number(),
  handsLost: z.number(),
  handsPushed: z.number(),
  profitLoss: z.number(),
  maxProfit: z.number(),
  maxLoss: z.number(),
})

type GameSettings = z.infer<typeof GameSettingsSchema>
type SessionStats = z.infer<typeof SessionStatsSchema>

// API functions
const getGameSettings = async (): Promise<GameSettings> => {
  // TODO: Replace with actual API call
  return {
    startingBank: 1000,
    minBet: 5,
    maxBet: 500,
    decks: 6,
    dealerHitsSoft17: true,
    surrenderAllowed: true,
    doubleAfterSplit: true,
  }
}

const updateGameSettings = async (settings: GameSettings): Promise<GameSettings> => {
  // TODO: Replace with actual API call
  return settings
}

const getSessionStats = async (): Promise<SessionStats> => {
  // TODO: Replace with actual API call
  return {
    handsPlayed: 0,
    handsWon: 0,
    handsLost: 0,
    handsPushed: 0,
    profitLoss: 0,
    maxProfit: 0,
    maxLoss: 0,
  }
}

// Query keys
const queryKeys = {
  gameSettings: ['gameSettings'] as const,
  sessionStats: ['sessionStats'] as const,
}

// Hooks
export function useGameSettings() {
  return useQuery({
    queryKey: queryKeys.gameSettings,
    queryFn: getGameSettings,
  })
}

export function useUpdateGameSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateGameSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.gameSettings, data)
    },
  })
}

export function useSessionStats() {
  return useQuery({
    queryKey: queryKeys.sessionStats,
    queryFn: getSessionStats,
  })
}

export function useUpdateSessionStats() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (stats: SessionStats) => {
      // TODO: Replace with actual API call
      return Promise.resolve(stats)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.sessionStats, data)
    },
  })
} 