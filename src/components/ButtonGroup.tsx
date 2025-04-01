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
        'btn-group',
        vertical ? 'btn-group-vertical' : 'btn-group-horizontal',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<{ className?: string }>(child)) {
          return React.cloneElement(child, {
            className: cn('btn-group-item', child.props.className),
          })
        }
        return child
      })}
    </div>
  )
} 