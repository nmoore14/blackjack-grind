import { useState } from 'react'
import { Button } from '../components/Button'
import { ButtonGroup } from '../components/ButtonGroup'
import { Table, Info } from 'lucide-react'

type HandType = 'hard' | 'soft' | 'pairs'
type DealerCard = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 // 11 represents Ace
type Action = 'H' | 'S' | 'D' | 'P' | 'Rh' | 'Rs'

const actionMap: Record<Action, string> = {
  H: 'Hit',
  S: 'Stand',
  D: 'Double if allowed, otherwise Hit',
  P: 'Split',
  Rh: 'Surrender if allowed, otherwise Hit',
  Rs: 'Surrender if allowed, otherwise Stand',
}

const actionColors: Record<Action, string> = {
  H: 'bg-warning text-warning-foreground',
  S: 'bg-success text-success-foreground',
  D: 'bg-primary text-primary-foreground',
  P: 'bg-secondary text-secondary-foreground',
  Rh: 'bg-alert text-alert-foreground',
  Rs: 'bg-alert text-alert-foreground',
}

const dealerCards: DealerCard[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

export function Strategy() {
  const [selectedHandType, setSelectedHandType] = useState<HandType>('hard')
  const [showExplanation, setShowExplanation] = useState(false)
  const [highlightedColumn, setHighlightedColumn] = useState<number | null>(null)

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Basic Strategy Guide</h1>
            <p className="mt-4 text-lg text-secondary">
              Learn the optimal play for every possible blackjack hand. The basic strategy is a mathematically proven set of decisions that will minimize the house edge.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-2"
          >
            <Info className="h-4 w-4" />
            {showExplanation ? 'Hide' : 'Show'} Legend
          </Button>
        </div>

        {showExplanation && (
          <div className="mt-6 rounded-lg border border-primary bg-background p-6">
            <h2 className="text-xl font-semibold text-foreground">Strategy Legend</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(actionMap).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full ${actionColors[key as Action]} font-bold`}>
                    {key}
                  </span>
                  <span className="text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="hidden sm:flex sm:gap-4">
            <Button
              variant={selectedHandType === 'hard' ? 'primary' : 'secondary'}
              onClick={() => setSelectedHandType('hard')}
              className="flex items-center gap-2"
            >
              <Table className="h-4 w-4" />
              Hard Totals
            </Button>
            <Button
              variant={selectedHandType === 'soft' ? 'primary' : 'secondary'}
              onClick={() => setSelectedHandType('soft')}
              className="flex items-center gap-2"
            >
              <Table className="h-4 w-4" />
              Soft Totals
            </Button>
            <Button
              variant={selectedHandType === 'pairs' ? 'primary' : 'secondary'}
              onClick={() => setSelectedHandType('pairs')}
              className="flex items-center gap-2"
            >
              <Table className="h-4 w-4" />
              Pairs
            </Button>
          </div>

          <div className="sm:hidden">
            <ButtonGroup>
              <Button
                variant={selectedHandType === 'hard' ? 'primary' : 'secondary'}
                onClick={() => setSelectedHandType('hard')}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Table className="h-4 w-4" />
                Hard
              </Button>
              <Button
                variant={selectedHandType === 'soft' ? 'primary' : 'secondary'}
                onClick={() => setSelectedHandType('soft')}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Table className="h-4 w-4" />
                Soft
              </Button>
              <Button
                variant={selectedHandType === 'pairs' ? 'primary' : 'secondary'}
                onClick={() => setSelectedHandType('pairs')}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Table className="h-4 w-4" />
                Pairs
              </Button>
            </ButtonGroup>
          </div>

          <div className="mt-8 overflow-x-auto relative">
            <div className="absolute inset-y-0 left-0 w-[120px] bg-gradient-to-r from-background via-background to-transparent pointer-events-none z-10" />
            <table className="min-w-full divide-y divide-primary relative">
              <thead className="sticky top-0 z-20 bg-background">
                <tr>
                  <th className="sticky left-0 z-30 bg-background px-4 py-3 text-left text-sm font-semibold text-foreground min-w-[120px] shadow-[4px_0px_0px_0px_rgba(0,0,0,0.1)]">
                    Player's Hand
                  </th>
                  {dealerCards.map((card, index) => (
                    <th 
                      key={card} 
                      className={`bg-background px-4 py-3 text-center text-sm font-semibold text-foreground min-w-[60px] transition-colors duration-100
                        ${highlightedColumn === index ? 'bg-primary/5' : ''}`}
                      onMouseEnter={() => setHighlightedColumn(index)}
                      onMouseLeave={() => setHighlightedColumn(null)}
                    >
                      {card === 11 ? 'A' : card}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-primary bg-background">
                {selectedHandType === 'hard' && (
                  Array.from({ length: 12 }, (_, i) => 20 - i).map((total) => (
                    <tr key={total} className="group hover:bg-primary/5">
                      <td className="sticky left-0 z-10 whitespace-nowrap bg-background px-4 py-3 text-sm font-medium text-foreground min-w-[120px] shadow-[4px_0px_0px_0px_rgba(0,0,0,0.1)] group-hover:bg-primary/5">
                        {total}
                      </td>
                      {dealerCards.map((dealerCard, index) => {
                        const action = getHardTotalAction(total, dealerCard)
                        return (
                          <td 
                            key={dealerCard} 
                            className={`px-4 py-3 text-center min-w-[60px] transition-colors duration-100
                              ${highlightedColumn === index ? 'bg-primary/5' : ''}`}
                            onMouseEnter={() => setHighlightedColumn(index)}
                            onMouseLeave={() => setHighlightedColumn(null)}
                          >
                            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${actionColors[action]} text-sm font-bold`}>
                              {action}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))
                )}
                {selectedHandType === 'soft' && (
                  Array.from({ length: 8 }, (_, i) => 20 - i).map((total) => (
                    <tr key={total} className="group hover:bg-primary/5">
                      <td className="sticky left-0 z-10 whitespace-nowrap bg-background px-4 py-3 text-sm font-medium text-foreground min-w-[120px] shadow-[4px_0px_0px_0px_rgba(0,0,0,0.1)] group-hover:bg-primary/5">
                        A,{total - 11}
                      </td>
                      {dealerCards.map((dealerCard, index) => {
                        const action = getSoftTotalAction(total, dealerCard)
                        return (
                          <td 
                            key={dealerCard} 
                            className={`px-4 py-3 text-center min-w-[60px] transition-colors duration-100
                              ${highlightedColumn === index ? 'bg-primary/5' : ''}`}
                            onMouseEnter={() => setHighlightedColumn(index)}
                            onMouseLeave={() => setHighlightedColumn(null)}
                          >
                            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${actionColors[action]} text-sm font-bold`}>
                              {action}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))
                )}
                {selectedHandType === 'pairs' && (
                  ['A', 10, 9, 8, 7, 6, 5, 4, 3, 2].map((card) => (
                    <tr key={card} className="group hover:bg-primary/5">
                      <td className="sticky left-0 z-10 whitespace-nowrap bg-background px-4 py-3 text-sm font-medium text-foreground min-w-[120px] shadow-[4px_0px_0px_0px_rgba(0,0,0,0.1)] group-hover:bg-primary/5">
                        {card},{card}
                      </td>
                      {dealerCards.map((dealerCard, index) => {
                        const action = getPairAction(card.toString(), dealerCard)
                        return (
                          <td 
                            key={dealerCard} 
                            className={`px-4 py-3 text-center min-w-[60px] transition-colors duration-100
                              ${highlightedColumn === index ? 'bg-primary/5' : ''}`}
                            onMouseEnter={() => setHighlightedColumn(index)}
                            onMouseLeave={() => setHighlightedColumn(null)}
                          >
                            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${actionColors[action]} text-sm font-bold`}>
                              {action}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-primary bg-background p-6">
          <h2 className="text-xl font-semibold text-foreground">Tips & Notes</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-secondary">
            <li>Always play with perfect basic strategy to minimize the house edge</li>
            <li>Double down opportunities are valuable - take them when the strategy suggests</li>
            <li>Surrender is not available at all tables - use the alternative play when needed</li>
            <li>Card counting can help refine these basic strategy decisions</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Helper function to determine the correct play for hard totals
function getHardTotalAction(playerTotal: number, dealerCard: DealerCard): Action {
  if (playerTotal >= 17) return 'S'
  if (playerTotal <= 8) return 'H'
  if (playerTotal === 16 && dealerCard >= 9) return 'Rh'
  if (playerTotal === 15 && dealerCard === 10) return 'Rh'
  if (playerTotal >= 13 && dealerCard <= 6) return 'S'
  if (playerTotal === 11) return 'D'
  if (playerTotal === 10 && dealerCard <= 9) return 'D'
  if (playerTotal === 9 && dealerCard >= 3 && dealerCard <= 6) return 'D'
  return 'H'
}

// Helper function to determine the correct play for soft totals
function getSoftTotalAction(playerTotal: number, dealerCard: DealerCard): Action {
  if (playerTotal >= 20) return 'S'
  if (playerTotal === 19) return dealerCard === 6 ? 'D' : 'S'
  if (playerTotal === 18) {
    if (dealerCard >= 9) return 'H'
    if (dealerCard >= 7) return 'S'
    return 'D'
  }
  if (playerTotal === 17) return dealerCard >= 3 && dealerCard <= 6 ? 'D' : 'H'
  if (playerTotal === 16) return dealerCard >= 4 && dealerCard <= 6 ? 'D' : 'H'
  if (playerTotal === 15) return dealerCard >= 4 && dealerCard <= 6 ? 'D' : 'H'
  if (playerTotal === 14) return dealerCard >= 5 && dealerCard <= 6 ? 'D' : 'H'
  if (playerTotal === 13) return dealerCard >= 5 && dealerCard <= 6 ? 'D' : 'H'
  return 'H'
}

// Helper function to determine the correct play for pairs
function getPairAction(card: string, dealerCard: DealerCard): Action {
  if (card === 'A') return 'P'
  if (card === '10') return 'S'
  if (card === '9') return dealerCard === 7 || dealerCard >= 10 ? 'S' : 'P'
  if (card === '8') return 'P'
  if (card === '7') return dealerCard <= 7 ? 'P' : 'H'
  if (card === '6') return dealerCard <= 6 ? 'P' : 'H'
  if (card === '5') return dealerCard <= 9 ? 'D' : 'H'
  if (card === '4') return dealerCard === 5 || dealerCard === 6 ? 'P' : 'H'
  if (card === '3') return dealerCard <= 7 ? 'P' : 'H'
  if (card === '2') return dealerCard <= 7 ? 'P' : 'H'
  return 'H'
} 