import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '../lib/utils'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  variant?: 'success' | 'warning' | 'alert'
}

export function Toast({ message, isVisible, onClose, variant = 'success' }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className={cn(
            'toast',
            `toast-${variant}`
          )}
        >
          <span className="text-xl font-bold">{message}</span>
          <button
            onClick={onClose}
            type="button"
            className="toast-close"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 