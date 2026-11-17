import React, { useEffect, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

interface CountUpProps {
  end: number
  start?: number
  duration?: number // in seconds
  decimals?: number
  prefix?: string
  suffix?: string
  separator?: string
  className?: string
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  start = 0,
  duration = 1.4,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion()
  const [value, setValue] = useState(shouldReduceMotion ? end : start)
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1, margin: '150px 0px' })

  useEffect(() => {
    if (shouldReduceMotion) {
      setValue(end)
      return
    }

    if (!isInView) return

    let startTime: number | null = null
    let animationFrameId: number

    const easeOutQuad = (t: number) => t * (2 - t)

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const easedProgress = easeOutQuad(progress)

      const current = start + (end - start) * easedProgress
      setValue(current)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        setValue(end)
      }
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isInView, start, end, duration, shouldReduceMotion])

  const formattedValue = () => {
    const fixed = value.toFixed(decimals)
    const parts = fixed.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    return parts.join('.')
  }

  return (
    <span ref={ref} className={`tabular-nums inline-block ${className}`}>
      {prefix}
      {formattedValue()}
      {suffix}
    </span>
  )
}
