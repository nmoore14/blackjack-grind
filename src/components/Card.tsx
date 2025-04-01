import { motion } from 'framer-motion'
import { Card as CardType, Suit } from '../lib/game'

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

const SUIT_COLORS: Record<Suit, string> = {
  hearts: 'text-red-500',
  diamonds: 'text-red-500',
  clubs: 'text-black',
  spades: 'text-black',
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
      className={`w-24 h-36 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center relative ${
        isDealer && index === 1 ? 'bg-blue-50' : ''
      }`}
    >
      <div className={`absolute top-2 left-2 ${SUIT_COLORS[card.suit]}`}>
        {card.rank}
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div className={`text-4xl ${SUIT_COLORS[card.suit]}`}>
        {SUIT_SYMBOLS[card.suit]}
      </div>
      <div className={`absolute bottom-2 right-2 ${SUIT_COLORS[card.suit]}`}>
        {card.rank}
        {SUIT_SYMBOLS[card.suit]}
      </div>
    </motion.div>
  )
} 