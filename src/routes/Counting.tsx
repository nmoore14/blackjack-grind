import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Calculator, Brain, TrendingUp, ChevronDown, ChevronRight, Play } from 'lucide-react'

type CountingCard = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'A' | 'J' | 'Q' | 'K'
type CountValue = -1 | 0 | 1 

const rollingCountValues: Record<CountingCard, CountValue> = {
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 0,
  8: 0,
  9: 0,
  10: -1,
  'A': -1,
  'J': -1,
  'Q': -1,
  'K': -1,
}

export function Counting() {
  const [showGuide, setShowGuide] = useState(true)

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">Card Counting Tutorial</h1>
          <Link to="/practice" className="inline-flex">
            <Button
              variant="primary"
              size="lg"
              className="flex items-center gap-2 whitespace-nowrap w-full"
            >
              <Play className="h-5 w-5" />
              Practice Now
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-lg text-secondary">
          Learn the Rolling Count system - a powerful and balanced counting method that's easy to learn and effective in practice.
        </p>

        <div className="mt-8 rounded-lg border border-primary bg-background p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              The Rolling Count System
            </h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-2"
            >
              {showGuide ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              {showGuide ? 'Hide' : 'Show'} Guide
            </Button>
          </div>

          {showGuide && (
            <div className="mt-6 space-y-8">
              <div>
                <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Count Values
                </h3>
                <p className="mt-2 text-secondary">
                  The Rolling Count assigns values to each card. Keep a running total as cards are dealt - this is your "running count".
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
                  {Object.entries(rollingCountValues).map(([card, value]) => (
                    <div key={card} className="flex items-center justify-between rounded-lg border border-primary p-3">
                      <span className="text-xl font-bold text-foreground">{card}</span>
                      <span className={`text-lg font-semibold ${value > 0 ? 'text-success' : value < 0 ? 'text-warning' : 'text-secondary'}`}>
                        {value > 0 ? `+${value}` : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Using the Count
                </h3>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-lg border border-primary p-4">
                    <h4 className="font-medium text-foreground">Positive Count (+)</h4>
                    <ul className="mt-2 list-disc list-inside space-y-2 text-secondary">
                      <li>Increase your bets - the deck is rich in high cards</li>
                      <li>Higher chance of getting blackjacks</li>
                      <li>Insurance becomes profitable at +3 or higher</li>
                      <li>Consider deviating from basic strategy:
                        <ul className="ml-6 mt-1 list-disc list-inside space-y-1 text-secondary">
                          <li>Stand on 16 vs dealer 10 at +4 or higher</li>
                          <li>Stand on 15 vs dealer 10 at +4 or higher</li>
                          <li>Take insurance at +3 or higher</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-primary p-4">
                    <h4 className="font-medium text-foreground">Negative Count (-)</h4>
                    <ul className="mt-2 list-disc list-inside space-y-2 text-secondary">
                      <li>Decrease your bets - the deck is rich in low cards</li>
                      <li>Higher chance of busting when hitting</li>
                      <li>Never take insurance</li>
                      <li>Strategy adjustments:
                        <ul className="ml-6 mt-1 list-disc list-inside space-y-1 text-secondary">
                          <li>Hit 16 vs dealer 10 (basic strategy)</li>
                          <li>Hit 15 vs dealer 10 (basic strategy)</li>
                          <li>Be more cautious with doubles and splits</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-primary/5 p-6">
                <h3 className="text-lg font-medium text-foreground">Tips for Success</h3>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-foreground">Getting Started</h4>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-secondary">
                      <li>Start counting at the beginning of a new shoe</li>
                      <li>Practice with one deck first, then move to multiple decks</li>
                      <li>Count pairs of cards to build speed</li>
                      <li>Practice at home before trying in a casino</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Advanced Tips</h4>
                    <ul className="mt-2 list-disc list-inside space-y-1 text-secondary">
                      <li>Convert to true count by dividing by decks remaining</li>
                      <li>Vary your bets in small increments to avoid detection</li>
                      <li>Keep counting even when not at the table</li>
                      <li>Stay focused and maintain your count accuracy</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-alert/20 bg-alert/5 p-4">
                <h4 className="font-medium text-alert">Important Notice</h4>
                <p className="mt-2 text-secondary">
                  While card counting is not illegal, casinos reserve the right to refuse service to anyone they suspect of counting cards. 
                  Be discrete with your counting and betting patterns. This information is provided for educational purposes only.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 