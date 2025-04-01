import { Hand } from '../lib/game'

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
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h3 className="text-xl font-bold">Session Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Total Hands</p>
          <p className="text-2xl font-bold">{totalHands}</p>
        </div>
        <div>
          <p className="text-gray-600">Blackjacks</p>
          <p className="text-2xl font-bold text-green-600">{blackjacks}</p>
        </div>
        <div>
          <p className="text-gray-600">Wins</p>
          <p className="text-2xl font-bold text-green-600">{wins}</p>
        </div>
        <div>
          <p className="text-gray-600">Losses</p>
          <p className="text-2xl font-bold text-red-600">{losses}</p>
        </div>
        <div>
          <p className="text-gray-600">Pushes</p>
          <p className="text-2xl font-bold text-gray-600">{pushes}</p>
        </div>
        <div>
          <p className="text-gray-600">Win Rate</p>
          <p className="text-2xl font-bold">
            {totalHands > 0 ? ((wins / totalHands) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Total Bet</p>
            <p className="text-2xl font-bold">${totalBet}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Payout</p>
            <p className="text-2xl font-bold">${totalPayout}</p>
          </div>
          <div>
            <p className="text-gray-600">Profit/Loss</p>
            <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${profit}
            </p>
          </div>
          <div>
            <p className="text-gray-600">ROI</p>
            <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalBet > 0 ? ((profit / totalBet) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 