import { motion } from 'framer-motion'
import type { Card as CardType, Suit } from '../lib/game'
import { cn } from '../lib/utils'

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

interface CardProps {
  card: CardType
  index: number
  isDealer?: boolean
}

export function Card({ card, index, isDealer = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, rotateY: 180 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'card',
        isDealer && index === 1 && 'card-dealer'
      )}
    >
      <div className={cn('card-rank card-rank-top', `card-suit-${card.suit}`)}>
        {card.rank}
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div className={cn('card-suit', `card-suit-${card.suit}`)}>
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div className={cn('card-rank card-rank-bottom', `card-suit-${card.suit}`)}>
        {card.rank}
        {SUIT_SYMBOLS[card.suit]}
      </div>
    </motion.div>
  )
} 