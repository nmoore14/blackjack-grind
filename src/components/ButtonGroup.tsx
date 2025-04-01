import React from 'react'
import { cn } from '../lib/utils'

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  vertical?: boolean
}

export function ButtonGroup({ children, vertical = false, className, ...props }: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex rounded-full border-[3px] border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]',
        vertical ? 'flex-col' : 'flex-row',
        '[&>*:not(:last-child)]:border-r-0',
        '[&>*:not(:first-child)]:rounded-l-none',
        '[&>*:not(:last-child)]:rounded-r-none',
        '[&>*]:border-foreground',
        '[&>*]:shadow-none',
        '[&>*]:transform-none',
        '[&>*:hover]:shadow-none',
        '[&>*:active]:shadow-none',
        'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_hsl(var(--foreground))]',
        'active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
        'transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
} 