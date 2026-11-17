import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'rounded' | 'text'
  shimmer?: boolean
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rounded',
  shimmer = true,
  ...props
}) => {
  const variantStyles = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-card',
    text: 'rounded-md h-4 w-full',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-slate-200/80 dark:bg-slate-800/80',
        variantStyles[variant],
        shimmer &&
          'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.8s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/20 dark:after:via-white/10 after:to-transparent',
        className
      )}
      {...props}
    />
  )
}
