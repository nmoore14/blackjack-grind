import type { Hand } from '../lib/game'
import { cn } from '../lib/utils'

interface GameStatsProps {
  hands: Hand[]
  bets: number[]
  payouts: number[]
}

export function GameStats({ hands, bets, payouts }: GameStatsProps) {
  const totalHands = hands.length
  const blackjacks = hands.filter((h) => h.isBlackjack).length
  const wins = hands.filter((h) => h.score <= 21 && h.score > 0).length
  const losses = hands.filter((h) => h.isBust).length
  const pushes = hands.filter((h) => h.score > 0 && !h.isBust && h.score <= 21).length - wins

  const totalBet = bets.reduce((sum, bet) => sum + bet, 0)
  const totalPayout = payouts.reduce((sum, payout) => sum + payout, 0)
  const profit = totalPayout - totalBet

  return (
    <div className="stats-container">
      <h3 className="text-xl font-bold">Session Statistics</h3>
      <div className="stats-grid">
        <div>
          <p className="stats-label">Total Hands</p>
          <p className="stats-value">{totalHands}</p>
        </div>
        <div>
          <p className="stats-label">Blackjacks</p>
          <p className="stats-value stats-value-success">{blackjacks}</p>
        </div>
        <div>
          <p className="stats-label">Wins</p>
          <p className="stats-value stats-value-success">{wins}</p>
        </div>
        <div>
          <p className="stats-label">Losses</p>
          <p className="stats-value stats-value-error">{losses}</p>
        </div>
        <div>
          <p className="stats-label">Pushes</p>
          <p className="stats-value">{pushes}</p>
        </div>
        <div>
          <p className="stats-label">Win Rate</p>
          <p className="stats-value">
            {totalHands > 0 ? ((wins / totalHands) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>
      <div className="stats-divider">
        <div className="stats-grid">
          <div>
            <p className="stats-label">Total Bet</p>
            <p className="stats-value">${totalBet}</p>
          </div>
          <div>
            <p className="stats-label">Total Payout</p>
            <p className="stats-value">${totalPayout}</p>
          </div>
          <div>
            <p className="stats-label">Profit/Loss</p>
            <p className={cn('stats-value', profit >= 0 ? 'stats-value-success' : 'stats-value-error')}>
              ${profit}
            </p>
          </div>
          <div>
            <p className="stats-label">ROI</p>
            <p className={cn('stats-value', profit >= 0 ? 'stats-value-success' : 'stats-value-error')}>
              {totalBet > 0 ? ((profit / totalBet) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 