import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MOTION_DURATIONS, MOTION_EASINGS } from './config'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: MOTION_DURATIONS.fast,
        ease: MOTION_EASINGS.standard,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
