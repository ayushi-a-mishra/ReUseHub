import { Transition, Variants } from 'framer-motion'

/**
 * ReUseHub Design Constitution - Motion Tokens & Easing
 */

export const MOTION_DURATIONS = {
  instant: 0.12, // 120ms - micro-feedback, clicks, toggles
  fast: 0.2,     // 200ms - hover states, chip sliding, tooltips
  normal: 0.32,  // 320ms - modals, drawers, cards, list reflow
  slow: 0.6,     // 600ms - hero reveals, page transitions, path drawing
} as const

export const MOTION_EASINGS = {
  // standard cubic-bezier(0.2, 0, 0, 1)
  standard: [0.2, 0, 0, 1] as const,
  // playful spring for active tabs, hearts, badges
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  } as Transition,
  // gentle bounce for celebration and completion checks
  bounce: {
    type: 'spring',
    stiffness: 300,
    damping: 18,
  } as Transition,
  // smooth drag / magnetic pull
  magnetic: {
    type: 'spring',
    stiffness: 250,
    damping: 20,
    mass: 0.5,
  } as Transition,
}

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.standard,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.standard,
    },
  },
}

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.standard,
    },
  },
}

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: MOTION_DURATIONS.normal,
      ease: MOTION_EASINGS.standard,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: MOTION_DURATIONS.fast,
      ease: MOTION_EASINGS.standard,
    },
  },
}
