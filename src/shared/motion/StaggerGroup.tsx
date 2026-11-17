import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { staggerItemVariants } from './config'

interface StaggerGroupProps {
  children: React.ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
  once?: boolean
}

export const StaggerGroup: React.FC<StaggerGroupProps> = ({
  children,
  className = '',
  delay = 0.05,
  staggerDelay = 0.08,
  once = true,
}) => {
  const shouldReduceMotion = useReducedMotion()

  const customContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: delay,
      },
    },
  }

  return (
    <motion.div
      variants={customContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1, margin: '100px 0px' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ children, className = '' }) => {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  )
}
