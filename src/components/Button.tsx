import React from 'react'
import { cn } from '../lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'warning' | 'alert' | 'success'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full relative',
        'border-[3px] shadow-[4px_4px_0px_0px_var(--border-color)]',
        'transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--border-color)]',
        'active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        
        // Size variations
        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'md' && 'px-6 py-3 text-base',
        size === 'lg' && 'px-8 py-4 text-lg',
        
        // Width
        fullWidth && 'w-full',
        
        // Variant styles
        variant === 'primary' && [
          'bg-primary text-primary-foreground border-foreground',
          'hover:bg-primary/90',
          'focus:ring-primary/50',
          '[--border-color:hsl(var(--foreground))]',
        ],
        variant === 'secondary' && [
          'bg-secondary text-secondary-foreground border-foreground',
          'hover:bg-secondary/90',
          'focus:ring-secondary/50',
          '[--border-color:hsl(var(--foreground))]',
        ],
        variant === 'warning' && [
          'bg-warning text-warning-foreground border-foreground',
          'hover:bg-warning/90',
          'focus:ring-warning/50',
          '[--border-color:hsl(var(--foreground))]',
        ],
        variant === 'alert' && [
          'bg-alert text-alert-foreground border-foreground',
          'hover:bg-alert/90',
          'focus:ring-alert/50',
          '[--border-color:hsl(var(--foreground))]',
        ],
        variant === 'success' && [
          'bg-success text-success-foreground border-foreground',
          'hover:bg-success/90',
          'focus:ring-success/50',
          '[--border-color:hsl(var(--foreground))]',
        ],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
} 