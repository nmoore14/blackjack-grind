import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

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

  const variantStyles = {
    success: 'bg-success text-success-foreground border-success/50',
    warning: 'bg-warning text-warning-foreground border-warning/50',
    alert: 'bg-alert text-alert-foreground border-alert/50',
  }

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
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg px-6 py-3 shadow-lg border-2 ${variantStyles[variant]}`}
        >
          <span className="text-xl font-bold">{message}</span>
          <button
            onClick={onClose}
            type="button"
            className="rounded-full p-1 hover:bg-black/10"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 