import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '../components/Button'
import { Timer, Play, RotateCcw, Check, X } from 'lucide-react'

type Card = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'
type CountValue = -1 | 0 | 1

const cardValues: Record<Card, CountValue> = {
  '2': 1,
  '3': 1,
  '4': 1,
  '5': 1,
  '6': 1,
  '7': 0,
  '8': 0,
  '9': 0,
  '10': -1,
  'J': -1,
  'Q': -1,
  'K': -1,
  'A': -1,
}

const allCards: Card[] = Object.keys(cardValues) as Card[]

interface GameStats {
  totalCards: number
  correctAnswers: number
  incorrectAnswers: number
  averageResponseTime: number
}

const GAME_DURATION = 30 // seconds

export function Practice() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [runningCount, setRunningCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [stats, setStats] = useState<GameStats>({
    totalCards: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    averageResponseTime: 0,
  })
  const [lastResponseTime, setLastResponseTime] = useState<number | null>(null)
  const [cardStartTime, setCardStartTime] = useState<number | null>(null)
  const [gameOver, setGameOver] = useState(false)

  const drawCard = useCallback(() => {
    const newCard = allCards[Math.floor(Math.random() * allCards.length)]
    setCurrentCard(newCard)
    setCardStartTime(Date.now())
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false)
            setGameOver(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      if (!currentCard) {
        drawCard()
      }
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentCard, drawCard])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPlaying || !currentCard) return

      const responseTime = Date.now() - (cardStartTime || Date.now())
      const correctCount = cardValues[currentCard]
      let increment: CountValue

      switch (event.key) {
        case 'ArrowLeft':
          increment = 1
          break
        case 'ArrowRight':
          increment = -1
          break
        case 'ArrowDown':
          increment = 0
          break
        default:
          return
      }

      const isCorrect = increment === correctCount

      setStats((prev) => ({
        totalCards: prev.totalCards + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1),
        averageResponseTime: (prev.averageResponseTime * prev.totalCards + responseTime) / (prev.totalCards + 1),
      }))

      setRunningCount((prev) => prev + correctCount)
      setUserCount((prev) => prev + increment)
      setLastResponseTime(responseTime)
      drawCard()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, currentCard, cardStartTime, drawCard])

  const startGame = () => {
    setIsPlaying(true)
    setTimeRemaining(GAME_DURATION)
    setRunningCount(0)
    setUserCount(0)
    setStats({
      totalCards: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      averageResponseTime: 0,
    })
    setGameOver(false)
    drawCard()
  }

  const resetGame = () => {
    setIsPlaying(false)
    setTimeRemaining(GAME_DURATION)
    setCurrentCard(null)
    setRunningCount(0)
    setUserCount(0)
    setStats({
      totalCards: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      averageResponseTime: 0,
    })
    setGameOver(false)
  }

  const handleCountChange = (increment: -1 | 0 | 1) => {
    if (!isPlaying || !currentCard) return

    const responseTime = Date.now() - (cardStartTime || Date.now())
    const correctCount = cardValues[currentCard]
    const isCorrect = increment === correctCount

    setStats((prev) => ({
      totalCards: prev.totalCards + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      incorrectAnswers: prev.incorrectAnswers + (isCorrect ? 0 : 1),
      averageResponseTime: (prev.averageResponseTime * prev.totalCards + responseTime) / (prev.totalCards + 1),
    }))

    setRunningCount((prev) => prev + correctCount)
    setUserCount((prev) => prev + increment)
    setLastResponseTime(responseTime)
    drawCard()
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-foreground">Card Counting Practice</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Timer className="h-5 w-5" />
              {timeRemaining}s
            </div>
            {!isPlaying && !gameOver ? (
              <Button variant="primary" onClick={startGame} className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Start
              </Button>
            ) : null}
            <Button variant="secondary" onClick={resetGame} className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="col-span-2 rounded-lg border border-primary bg-background p-6">
            {gameOver ? (
              <div className="flex flex-col items-center justify-center space-y-6 p-8">
                <h2 className="text-2xl font-bold text-foreground">Time's Up!</h2>
                <div className="grid gap-4 text-center">
                  <div>
                    <div className="text-4xl font-bold text-success">
                      {stats.totalCards > 0
                        ? `${Math.round((stats.correctAnswers / stats.totalCards) * 100)}%`
                        : '0%'}
                    </div>
                    <div className="text-sm text-secondary">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-primary">{stats.totalCards}</div>
                    <div className="text-sm text-secondary">Cards Per Minute</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-accent">
                      {stats.averageResponseTime > 0
                        ? `${Math.round(stats.averageResponseTime)}ms`
                        : '-'}
                    </div>
                    <div className="text-sm text-secondary">Average Response Time</div>
                  </div>
                </div>
                <Button variant="primary" onClick={startGame} className="mt-4">
                  Play Again
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {currentCard ? (
                  <>
                    <div className="flex h-48 w-32 items-center justify-center rounded-lg border-4 border-primary bg-white text-6xl font-bold text-gray-900">
                      {currentCard}
                    </div>
                    <div className="mt-8 grid w-full grid-cols-3 gap-4">
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => handleCountChange(1)}
                        className="text-xl font-bold relative"
                        disabled={!isPlaying}
                      >
                        +1
                        <span className="absolute bottom-1 right-2 text-xs text-secondary">←</span>
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => handleCountChange(0)}
                        className="text-xl font-bold relative"
                        disabled={!isPlaying}
                      >
                        0
                        <span className="absolute bottom-1 right-2 text-xs text-secondary">↓</span>
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => handleCountChange(-1)}
                        className="text-xl font-bold relative"
                        disabled={!isPlaying}
                      >
                        -1
                        <span className="absolute bottom-1 right-2 text-xs text-secondary">→</span>
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex h-48 w-32 items-center justify-center rounded-lg border border-primary bg-background text-center text-lg text-secondary">
                    Press Start to begin
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-primary bg-background p-6">
              <h2 className="text-xl font-semibold text-foreground">Statistics</h2>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-secondary">Accuracy</span>
                  <span className="font-medium text-foreground">
                    {stats.totalCards > 0
                      ? `${Math.round((stats.correctAnswers / stats.totalCards) * 100)}%`
                      : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Cards Seen</span>
                  <span className="font-medium text-foreground">{stats.totalCards}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Avg Response Time</span>
                  <span className="font-medium text-foreground">
                    {stats.averageResponseTime > 0
                      ? `${Math.round(stats.averageResponseTime)}ms`
                      : '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-primary bg-background p-6">
              <h2 className="text-xl font-semibold text-foreground">Running Count</h2>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-secondary">True Count</div>
                  <div className="text-2xl font-bold text-foreground">{runningCount}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-secondary">Your Count</div>
                  <div className="text-2xl font-bold text-foreground">{userCount}</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2">
                  {runningCount === userCount ? (
                    <Check className="h-6 w-6 text-success" />
                  ) : (
                    <X className="h-6 w-6 text-warning" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 