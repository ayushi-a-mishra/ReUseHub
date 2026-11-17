import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MOTION_DURATIONS, MOTION_EASINGS } from './config'

interface RevealProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = MOTION_DURATIONS.normal,
  className = '',
  once = true,
}) => {
  const shouldReduceMotion = useReducedMotion()

  const getInitialPosition = () => {
    if (shouldReduceMotion || direction === 'none') return { x: 0, y: 0 }
    switch (direction) {
      case 'up':
        return { x: 0, y: 20 }
      case 'down':
        return { x: 0, y: -20 }
      case 'left':
        return { x: 24, y: 0 }
      case 'right':
        return { x: -24, y: 0 }
    }
  }

  const initial = {
    opacity: 0,
    ...getInitialPosition(),
  }

  return (
    <motion.div
      initial={initial}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once, margin: '-40px' }}
      transition={{
        duration: shouldReduceMotion ? 0.05 : duration,
        delay,
        ease: MOTION_EASINGS.standard,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
