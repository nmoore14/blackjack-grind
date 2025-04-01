import { useState, useEffect } from 'react'
import { Button } from './Button'
import { Card } from './Card'
import { GameStats } from './GameStats'
import {
  type Card as CardType,
  type Hand,
  type GameState,
  createDeck,
  calculateHandScore,
  canSplit,
  canDouble,
  canSurrender,
  getPayout,
  splitHand,
} from '../lib/game'
import { saveGameState, loadGameState, saveStats, loadStats, type StoredStats } from '../lib/storage'
import { motion } from 'framer-motion'
import { Toast } from './Toast'

const INITIAL_GAME_STATE: GameState = {
  deck: createDeck(),
  playerHands: [],
  dealerHand: { cards: [], score: 0, isSoft: false, isBust: false, isBlackjack: false },
  currentBet: 0,
  bank: 1000,
  gamePhase: 'betting',
  canHit: false,
  canStand: false,
  canDouble: false,
  canSplit: false,
  canSurrender: false,
  activeHandIndex: 0,
}

const createHandFromCards = (cards: CardType[]): Hand => ({
  cards,
  score: 0,
  isSoft: false,
  isBust: false,
  isBlackjack: false,
})

export function BlackjackGame() {
  const [isLoading, setIsLoading] = useState(true)
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE)
  const [stats, setStats] = useState<StoredStats>({
    hands: [],
    bets: [],
    payouts: [],
    lastUpdated: new Date().toISOString(),
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    const loadSavedState = () => {
      const savedGameState = loadGameState()
      const savedStats = loadStats()

      if (savedGameState) {
        setGameState(savedGameState)
      } else {
        setGameState({
          ...INITIAL_GAME_STATE,
          deck: createDeck(),
        })
      }

      if (savedStats) {
        setStats(savedStats)
      }

      setIsLoading(false)
    }

    loadSavedState()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      saveGameState(gameState)
    }
  }, [gameState, isLoading])

  useEffect(() => {
    if (!isLoading) {
      saveStats(stats)
    }
  }, [stats, isLoading])

  const startNewGame = () => {
    setGameState({
      ...INITIAL_GAME_STATE,
      deck: createDeck(),
    })
  }

  const placeBet = (amount: number) => {
    if (gameState.bank >= amount) {
      setGameState((prev) => ({
        ...prev,
        currentBet: amount,
        bank: prev.bank - amount,
        gamePhase: 'dealing',
        deck: prev.deck.length < 4 ? createDeck() : prev.deck,
      }))
      dealInitialCards()
    }
  }

  const drawCard = (deck: CardType[]): [CardType | undefined, CardType[]] => {
    const newDeck = [...deck]
    const card = newDeck.pop()
    return [card, newDeck]
  }

  const dealInitialCards = () => {
    let newDeck = [...gameState.deck]
    const [card1, deck1] = drawCard(newDeck)
    const [card2, deck2] = drawCard(deck1)
    const [card3, deck3] = drawCard(deck2)
    const [card4, deck4] = drawCard(deck3)

    if (!card1 || !card2 || !card3 || !card4) {
      // Reshuffle if we run out of cards
      newDeck = createDeck()
      const [newCard1, newDeck1] = drawCard(newDeck)
      const [newCard2, newDeck2] = drawCard(newDeck1)
      const [newCard3, newDeck3] = drawCard(newDeck2)
      const [newCard4, newDeck4] = drawCard(newDeck3)
      
      const playerCards = [newCard1, newCard2] as CardType[]
      const dealerCards = [newCard3, newCard4] as CardType[]
      newDeck = newDeck4
      
      const playerHand = calculateHandScore(createHandFromCards(playerCards))
      setGameState((prev) => ({
        ...prev,
        deck: newDeck,
        playerHands: [playerHand],
        dealerHand: calculateHandScore(createHandFromCards(dealerCards)),
        gamePhase: 'playerTurn',
        canHit: true,
        canStand: true,
        canDouble: canDouble(prev.bank, prev.currentBet),
        canSplit: canSplit(playerHand, prev.bank, prev.currentBet),
        canSurrender: canSurrender('playerTurn'),
        activeHandIndex: 0,
      }))
      return
    }

    const playerCards = [card1, card2] as CardType[]
    const dealerCards = [card3, card4] as CardType[]
    newDeck = deck4

    const playerHand = calculateHandScore(createHandFromCards(playerCards))

    setGameState((prev) => ({
      ...prev,
      deck: newDeck,
      playerHands: [playerHand],
      dealerHand: calculateHandScore(createHandFromCards(dealerCards)),
      gamePhase: 'playerTurn',
      canHit: true,
      canStand: true,
      canDouble: canDouble(prev.bank, prev.currentBet),
      canSplit: canSplit(playerHand, prev.bank, prev.currentBet),
      canSurrender: canSurrender('playerTurn'),
      activeHandIndex: 0,
    }))
  }

  const hit = () => {
    let newDeck = [...gameState.deck]
    let drawnCard: CardType
    const [newCard, updatedDeck] = drawCard(newDeck)
    if (!newCard) {
      newDeck = createDeck()
      const [card, freshDeck] = drawCard(newDeck)
      if (!card) return // Should never happen with fresh deck
      newDeck = freshDeck
      drawnCard = card
    } else {
      newDeck = updatedDeck
      drawnCard = newCard
    }

    const newPlayerHands = [...gameState.playerHands]
    const currentHand = newPlayerHands[gameState.activeHandIndex]
    const updatedHand = calculateHandScore(createHandFromCards([...currentHand.cards, drawnCard]))
    newPlayerHands[gameState.activeHandIndex] = updatedHand

    if (updatedHand.isBust) {
      setGameState((prev) => ({
        ...prev,
        deck: newDeck,
        playerHands: newPlayerHands,
        gamePhase: 'dealerTurn',
        canHit: false,
        canStand: false,
        canDouble: false,
        canSplit: false,
        canSurrender: false,
      }))
    } else {
      setGameState((prev) => ({
        ...prev,
        deck: newDeck,
        playerHands: newPlayerHands,
        canHit: true,
        canStand: true,
        canDouble: false,
        canSplit: false,
        canSurrender: false,
      }))
    }
  }

  const stand = () => {
    if (gameState.activeHandIndex < gameState.playerHands.length - 1) {
      setGameState((prev) => ({
        ...prev,
        activeHandIndex: prev.activeHandIndex + 1,
        canHit: true,
        canStand: true,
        canDouble: canDouble(prev.bank, prev.currentBet),
        canSplit: false,
      }))
    } else {
      setGameState((prev) => ({
        ...prev,
        gamePhase: 'dealerTurn',
        canHit: false,
        canStand: false,
        canDouble: false,
        canSplit: false,
        canSurrender: false,
      }))
    }
  }

  const double = () => {
    if (gameState.bank >= gameState.currentBet) {
      let newDeck = [...gameState.deck]
      let drawnCard: CardType
      const [newCard, updatedDeck] = drawCard(newDeck)
      if (!newCard) {
        newDeck = createDeck()
        const [card, freshDeck] = drawCard(newDeck)
        if (!card) return // Should never happen with fresh deck
        newDeck = freshDeck
        drawnCard = card
      } else {
        newDeck = updatedDeck
        drawnCard = newCard
      }

      const newPlayerHands = [...gameState.playerHands]
      const currentHand = newPlayerHands[gameState.activeHandIndex]
      newPlayerHands[gameState.activeHandIndex] = calculateHandScore(createHandFromCards([...currentHand.cards, drawnCard]))

      setGameState((prev) => ({
        ...prev,
        deck: newDeck,
        playerHands: newPlayerHands,
        currentBet: prev.currentBet * 2,
        bank: prev.bank - prev.currentBet,
        gamePhase: 'dealerTurn',
        canHit: false,
        canStand: false,
        canDouble: false,
        canSplit: false,
        canSurrender: false,
      }))
      dealerPlay()
    }
  }

  const split = () => {
    const newDeck = [...gameState.deck]
    const currentHand = gameState.playerHands[gameState.activeHandIndex]
    const [hand1, hand2] = splitHand(currentHand, newDeck)

    setGameState((prev) => ({
      ...prev,
      deck: newDeck,
      playerHands: [
        ...prev.playerHands.slice(0, prev.activeHandIndex),
        hand1,
        hand2,
        ...prev.playerHands.slice(prev.activeHandIndex + 1),
      ],
      currentBet: prev.currentBet * 2,
      bank: prev.bank - prev.currentBet,
      canHit: true,
      canStand: true,
      canDouble: canDouble(prev.bank, prev.currentBet),
      canSplit: false,
    }))
  }

  const surrender = () => {
    const payout = getPayout(
      gameState.playerHands[gameState.activeHandIndex],
      gameState.dealerHand,
      gameState.currentBet,
      true
    )
    setGameState((prev) => ({
      ...prev,
      bank: prev.bank + payout,
      gamePhase: 'complete',
      canHit: false,
      canStand: false,
      canDouble: false,
      canSplit: false,
      canSurrender: false,
    }))
  }

  const dealerPlay = () => {
    let currentDealerHand = { ...gameState.dealerHand }
    let newDeck = [...gameState.deck]

    const drawNextCard = () => {
      // Check if dealer should draw another card
      if (currentDealerHand.score < 17 || (currentDealerHand.isSoft && currentDealerHand.score === 17)) {
        const [newCard, updatedDeck] = drawCard(newDeck)
        if (!newCard) {
          newDeck = createDeck()
          const [card, freshDeck] = drawCard(newDeck)
          if (!card) return finishDealerTurn() // Should never happen with fresh deck
          newDeck = freshDeck
          currentDealerHand = calculateHandScore(createHandFromCards([...currentDealerHand.cards, card]))
          
          // Update state with new card
          setGameState((prev) => ({
            ...prev,
            deck: newDeck,
            dealerHand: currentDealerHand,
          }))

          // Schedule next card draw after delay
          setTimeout(drawNextCard, 1000)
        } else {
          newDeck = updatedDeck
          currentDealerHand = calculateHandScore(createHandFromCards([...currentDealerHand.cards, newCard]))
          
          // Update state with new card
          setGameState((prev) => ({
            ...prev,
            deck: newDeck,
            dealerHand: currentDealerHand,
          }))

          // Schedule next card draw after delay
          setTimeout(drawNextCard, 1000)
        }
      } else {
        finishDealerTurn()
      }
    }

    const finishDealerTurn = () => {
      const payouts = gameState.playerHands.map((hand) => {
        // If player wins, return original bet plus winnings
        if (hand.isBlackjack && !currentDealerHand.isBlackjack) return gameState.currentBet * 2.5 // Original bet + 1.5x for blackjack
        if (!hand.isBust && (currentDealerHand.isBust || hand.score > currentDealerHand.score)) return gameState.currentBet * 2 // Original bet + 1x for win
        if (!hand.isBust && hand.score === currentDealerHand.score) return gameState.currentBet // Push returns original bet
        return 0 // Loss
      })

      const totalPayout = payouts.reduce((sum, payout) => sum + payout, 0)

      // Show winning toast if player won
      if (totalPayout > 0) {
        const winAmount = totalPayout - (gameState.currentBet * gameState.playerHands.length)
        setToastMessage(`You won $${winAmount}!`)
        setShowToast(true)
      }

      setStats((prev) => ({
        hands: [...prev.hands, ...gameState.playerHands],
        bets: [...prev.bets, gameState.currentBet],
        payouts: [...prev.payouts, ...payouts],
        lastUpdated: new Date().toISOString(),
      }))

      setGameState((prev) => ({
        ...prev,
        deck: newDeck,
        dealerHand: currentDealerHand,
        bank: prev.bank + totalPayout,
        gamePhase: 'complete',
        canHit: false,
        canStand: false,
        canDouble: false,
        canSplit: false,
        canSurrender: false,
      }))
    }

    // Start the dealer's turn animation
    drawNextCard()
  }

  const resetForNewHand = () => {
    setGameState((prev) => ({
      ...prev,
      playerHands: [],
      dealerHand: { cards: [], score: 0, isSoft: false, isBust: false, isBlackjack: false },
      currentBet: 0,
      gamePhase: 'betting',
      canHit: false,
      canStand: false,
      canDouble: false,
      canSplit: false,
      canSurrender: false,
      activeHandIndex: 0,
      deck: prev.deck.length < 52 ? createDeck() : prev.deck,
    }))
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-lg text-secondary">Loading game...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Toast component */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Game Area */}
      <div className="flex flex-col gap-8">
        {/* Cards Area */}
        <div className="space-y-8">
          {/* Dealer's Hand */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-foreground">Dealer's Hand</h2>
            <div className="flex gap-4 justify-center">
              {gameState.dealerHand.cards.map((card, index) => (
                (gameState.gamePhase === 'dealerTurn' || gameState.gamePhase === 'complete' || index === 0) ? (
                  <motion.div
                    key={`dealer-${card.suit}-${card.rank}`}
                    animate={gameState.gamePhase === 'complete' ? {
                      scale: [1, 1.1, 1],
                      transition: { duration: 0.5, times: [0, 0.5, 1] }
                    } : {}}
                  >
                    <Card
                      card={card}
                      index={index}
                      isDealer={true}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`dealer-hidden-${index}`}
                    className="w-24 h-36 rounded-lg border-2 border-primary bg-background flex items-center justify-center"
                  >
                    <span className="text-3xl text-primary">?</span>
                  </motion.div>
                )
              ))}
            </div>
            {(gameState.gamePhase === 'dealerTurn' || gameState.gamePhase === 'complete') && (
              <div className="mt-4 text-lg font-semibold text-secondary text-center">
                Score: {gameState.dealerHand.score}
                {gameState.dealerHand.isBust && <span className="text-alert ml-2">(Bust)</span>}
                {gameState.dealerHand.isBlackjack && <span className="text-success ml-2">(Blackjack!)</span>}
              </div>
            )}
          </div>

          {/* Player's Hands */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-foreground">Your Hands</h2>
            <div className="space-y-6">
              {gameState.playerHands.map((hand, handIndex) => (
                <div
                  key={`hand-${hand.cards.map(c => `${c.suit}-${c.rank}`).join('-')}`}
                  className={`p-6 rounded-lg border ${
                    handIndex === gameState.activeHandIndex
                      ? 'border-primary bg-primary/10'
                      : 'border-secondary/20'
                  }`}
                >
                  <div className="flex gap-4 justify-center">
                    {hand.cards.map((card, cardIndex) => (
                      <motion.div
                        key={`player-${card.suit}-${card.rank}`}
                        animate={gameState.gamePhase === 'complete' && !hand.isBust ? {
                          scale: [1, 1.1, 1],
                          transition: { duration: 0.5, times: [0, 0.5, 1] }
                        } : {}}
                      >
                        <Card
                          card={card}
                          index={cardIndex}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 text-lg font-semibold text-secondary text-center">
                    Score: {hand.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Game Actions */}
        <div className="flex justify-center gap-4">
          {gameState.gamePhase === 'betting' ? (
            <>
              <Button onClick={() => placeBet(10)}>Bet $10</Button>
              <Button onClick={() => placeBet(25)}>Bet $25</Button>
              <Button onClick={() => placeBet(50)}>Bet $50</Button>
              <Button onClick={() => placeBet(100)}>Bet $100</Button>
            </>
          ) : gameState.gamePhase === 'playerTurn' ? (
            <>
              <Button onClick={hit} disabled={!gameState.canHit}>
                Hit
              </Button>
              <Button onClick={stand} disabled={!gameState.canStand}>
                Stand
              </Button>
              <Button onClick={double} disabled={!gameState.canDouble}>
                Double
              </Button>
              <Button onClick={split} disabled={!gameState.canSplit}>
                Split
              </Button>
              <Button onClick={surrender} disabled={!gameState.canSurrender}>
                Surrender
              </Button>
            </>
          ) : gameState.gamePhase === 'dealerTurn' ? (
            <Button onClick={dealerPlay}>Continue</Button>
          ) : gameState.gamePhase === 'complete' ? (
            <>
              <Button onClick={resetForNewHand}>Place New Bet</Button>
              <Button onClick={startNewGame} variant="secondary">Reset Game</Button>
            </>
          ) : null}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bank Status */}
          <div className="p-6 rounded-lg border border-secondary/20">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Bank Status</h3>
            <div className="text-2xl font-bold text-foreground">
              ${gameState.bank}
            </div>
          </div>

          {/* Session Statistics */}
          <div className="p-6 rounded-lg border border-secondary/20">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Session Statistics</h3>
            <GameStats hands={stats.hands} bets={stats.bets} payouts={stats.payouts} />
          </div>

          {/* Hand Results */}
          <div className="p-6 rounded-lg border border-secondary/20">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Hand Results</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-secondary">Current Bet:</span>
                <span className="font-semibold">${gameState.currentBet}</span>
              </div>
              {gameState.gamePhase === 'complete' && (
                <div className="flex justify-between">
                  <span className="text-secondary">Last Payout:</span>
                  <span className="font-semibold">${stats.payouts[stats.payouts.length - 1] || 0}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 