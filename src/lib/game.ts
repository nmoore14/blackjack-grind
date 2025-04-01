export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  suit: Suit
  rank: Rank
  value: number
}

export interface Hand {
  cards: Card[]
  score: number
  isSoft: boolean
  isBust: boolean
  isBlackjack: boolean
}

export interface GameState {
  deck: Card[]
  playerHands: Hand[]
  dealerHand: Hand
  currentBet: number
  bank: number
  gamePhase: 'betting' | 'dealing' | 'playerTurn' | 'dealerTurn' | 'payout' | 'complete'
  canHit: boolean
  canStand: boolean
  canDouble: boolean
  canSplit: boolean
  canSurrender: boolean
  activeHandIndex: number
}

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export function createDeck(numDecks = 6): Card[] {
  const deck = []
  for (let i = 0; i < numDecks; i++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({
          suit,
          rank,
          value: getCardValue(rank),
        })
      }
    }
  }
  return shuffleDeck(deck)
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getCardValue(rank: Rank): number {
  if (rank === 'A') return 11
  if (['K', 'Q', 'J'].includes(rank)) return 10
  return Number.parseInt(rank)
}

export function calculateHandScore(hand: Hand): Hand {
  let score = 0
  let aces = 0
  let isSoft = false

  // First pass: count non-aces
  for (const card of hand.cards) {
    if (card.rank === 'A') {
      aces++
    } else {
      score += getCardValue(card.rank)
    }
  }

  // Second pass: count aces optimally
  for (let i = 0; i < aces; i++) {
    if (score + 11 + (aces - 1) <= 21) {
      score += 11
      isSoft = true
    } else {
      score += 1
    }
  }

  return {
    cards: hand.cards,
    score,
    isSoft,
    isBust: score > 21,
    isBlackjack: score === 21 && hand.cards.length === 2,
  }
}

export function dealInitialCards(deck: Card[]): {
  playerHand: Hand
  dealerHand: Hand
  remainingDeck: Card[]
} {
  const playerHand = {
    cards: [deck[0], deck[2]],
    score: 0,
    isSoft: false,
    isBust: false,
    isBlackjack: false,
  } as Hand

  const dealerHand = {
    cards: [deck[1], deck[3]],
    score: 0,
    isSoft: false,
    isBust: false,
    isBlackjack: false,
  } as Hand

  // Calculate initial scores
  const playerScore = calculateHandScore(playerHand)
  const dealerScore = calculateHandScore({
    ...dealerHand,
    cards: [dealerHand.cards[0]],
    score: 0,
    isSoft: false,
    isBust: false,
    isBlackjack: false,
  } as Hand) // Only use first card for dealer

  playerHand.score = playerScore.score
  playerHand.isSoft = playerScore.isSoft
  playerHand.isBlackjack = playerScore.score === 21 && playerHand.cards.length === 2

  dealerHand.score = dealerScore.score
  dealerHand.isSoft = dealerScore.isSoft
  dealerHand.isBlackjack = dealerScore.score === 21 && dealerHand.cards.length === 2

  return {
    playerHand,
    dealerHand,
    remainingDeck: deck.slice(4),
  }
}

export function startNewGame(state: GameState): GameState {
  const deck = createDeck()
  const { playerHand, dealerHand, remainingDeck } = dealInitialCards(deck)

  return {
    ...state,
    deck: remainingDeck,
    playerHands: [playerHand],
    dealerHand,
    currentBet: 0,
    gamePhase: 'betting',
    canHit: false,
    canStand: false,
    canDouble: false,
    canSplit: false,
    canSurrender: false,
    activeHandIndex: 0,
  }
}

export function canSplit(hand: Hand, bank: number, currentBet: number): boolean {
  return (
    hand.cards.length === 2 &&
    hand.cards[0].value === hand.cards[1].value &&
    bank >= currentBet
  )
}

function drawCard(deck: Card[]): [Card | undefined, Card[]] {
  const newDeck = [...deck]
  const card = newDeck.pop()
  return [card, newDeck]
}

export function splitHand(hand: Hand, deck: Card[]): [Hand, Hand, Card[]] {
  const card1 = hand.cards[0]
  const card2 = hand.cards[1]
  
  const [newCard1, deck1] = drawCard(deck)
  const [newCard2, deck2] = drawCard(deck1)
  
  if (!newCard1 || !newCard2) {
    throw new Error('Not enough cards in deck')
  }

  return [
    calculateHandScore(createHandFromCards([card1, newCard1])),
    calculateHandScore(createHandFromCards([card2, newCard2])),
    deck2
  ]
}

function createHandFromCards(cards: Card[]): Hand {
  return {
    cards,
    score: 0,
    isSoft: false,
    isBust: false,
    isBlackjack: false,
  }
}

export function canDouble(bank: number, currentBet: number): boolean {
  return bank >= currentBet
}

export function canSurrender(gamePhase: GameState['gamePhase']): boolean {
  return gamePhase === 'playerTurn'
}

export function getPayout(
  playerHand: Hand,
  dealerHand: Hand,
  bet: number,
  isSurrendered = false
): number {
  if (isSurrendered) return bet / 2

  if (playerHand.isBust) return 0
  if (playerHand.isBlackjack && !dealerHand.isBlackjack) return bet * 1.5
  if (playerHand.score > dealerHand.score) return bet * 2
  if (playerHand.score === dealerHand.score) return bet
  return 0
} 