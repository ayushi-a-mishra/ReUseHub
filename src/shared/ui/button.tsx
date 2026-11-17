import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98] rounded-button',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white shadow-elevation-1 hover:bg-green-700 hover:shadow-elevation-2',
        accent: 'bg-accent text-white shadow-elevation-1 hover:bg-orange-600 hover:shadow-elevation-2',
        forest: 'bg-forest text-white shadow-elevation-1 hover:bg-green-950 hover:shadow-elevation-2',
        secondary: 'bg-surface-raised text-foreground hover:bg-slate-200 dark:hover:bg-slate-800',
        outline: 'border border-border bg-surface text-foreground hover:bg-surface-raised hover:border-slate-300 dark:hover:border-slate-700 shadow-sm',
        ghost: 'hover:bg-surface-raised text-foreground',
        destructive: 'bg-destructive text-white hover:bg-red-700 shadow-sm',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'
