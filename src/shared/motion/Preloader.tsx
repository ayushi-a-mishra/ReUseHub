import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Recycle } from 'lucide-react'
import { campusConfig } from '@/config/campus'

interface PreloaderProps {
  onComplete?: () => void
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    // Only run if not previously shown in this session
    const hasLoaded = sessionStorage.getItem('reusehub_preloader_done')
    if (hasLoaded) {
      setIsDone(true)
      onComplete?.()
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsDone(true)
            sessionStorage.setItem('reusehub_preloader_done', 'true')
            onComplete?.()
          }, 400)
          return 100
        }
        const diff = Math.floor(Math.random() * 20) + 10
        return Math.min(prev + diff, 100)
      })
    }, 90)

    return () => clearInterval(interval)
  }, [onComplete])

  if (isDone) return null

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white"
        >
          {/* Subtle radial glow */}
          <div className="absolute h-96 w-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center space-y-6 text-center px-4">
            {/* Spinning/Drawing Logo Ring */}
            <div className="relative flex h-20 w-20 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-slate-800"
                  fill="none"
                />
                <motion.circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#16A34A"
                  strokeWidth="3"
                  strokeDasharray="226"
                  strokeDashoffset={226 - (226 * progress) / 100}
                  strokeLinecap="round"
                  fill="none"
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                />
              </svg>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 text-white shadow-elevation-2"
              >
                <Recycle className="h-6 w-6 stroke-[2.5]" />
              </motion.div>
            </div>

            {/* Brand Title with Masked Reveal */}
            <div className="space-y-1">
              <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight">
                ReUse<span className="text-primary">Hub</span>
              </h2>
              <p className="text-xs text-slate-400 tracking-wide font-medium">
                {campusConfig.name} &bull; IDEA Lab-1
              </p>
            </div>

            {/* Percentage Counter */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-emerald-400">
                {progress}%
              </span>
              <span className="text-xs text-slate-500">initializing campus node</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
