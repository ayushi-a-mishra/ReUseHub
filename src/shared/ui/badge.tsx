import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none',
  {
    variants: {
      variant: {
        default: 'bg-green-100 text-green-800 dark:bg-green-950/70 dark:text-green-300 border border-green-200 dark:border-green-800',
        success: 'bg-green-100 text-green-800 dark:bg-green-950/70 dark:text-green-300 border border-green-200 dark:border-green-800',
        forest: 'bg-forest/15 text-green-900 dark:text-emerald-300 border border-green-800/20',
        secondary: 'bg-surface-raised text-foreground border border-border',
        outline: 'border border-border text-foreground bg-transparent',
        destructive: 'bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20',
        warning: 'bg-amber-500/15 text-amber-850 dark:text-amber-300 border border-amber-500/25',
        info: 'bg-blue-500/15 text-blue-800 dark:text-blue-300 border border-blue-500/20',
        accent: 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />
}
