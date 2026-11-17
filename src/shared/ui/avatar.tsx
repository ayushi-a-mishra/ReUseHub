import * as React from 'react'
import { cn } from '@/lib/utils'

export function Avatar({
  src,
  alt,
  fallback,
  className,
  size = 'md',
}: {
  src?: string | null
  alt?: string
  fallback: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  const [imageFailed, setImageFailed] = React.useState(false)

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg font-bold',
  }

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/80 bg-muted font-semibold text-foreground shadow-sm',
        sizeClasses[size],
        className
      )}
    >
      {src && !imageFailed ? (
        <img
          src={src}
          alt={alt || fallback}
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-primary font-bold">{fallback.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  )
}
