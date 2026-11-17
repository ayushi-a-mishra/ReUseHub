import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Clock } from 'lucide-react'

interface ActivityItem {
  id: string
  actor: string
  action: string
  item: string
  dept: string
  timeAgo: string
  impact: string
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    actor: 'Priya S.',
    action: 'requested',
    item: 'Arduino Uno R3 Kit',
    dept: 'COMP',
    timeAgo: '3m ago',
    impact: '0.4 kg diverted',
  },
  {
    id: '2',
    actor: 'Prof. Arvind Kulkarni',
    action: 'listed',
    item: 'Mini Drafter with Scales',
    dept: 'MECH',
    timeAgo: '12m ago',
    impact: 'Free Handover',
  },
  {
    id: '3',
    actor: 'Rajesh V.',
    action: 'completed handover of',
    item: 'CLRS Algorithms 3rd Ed',
    dept: 'IT',
    timeAgo: '28m ago',
    impact: '₹950 saved',
  },
  {
    id: '4',
    actor: 'Ananya M.',
    action: 'listed',
    item: 'Pure Cotton Lab Apron',
    dept: 'APPLIED',
    timeAgo: '45m ago',
    impact: '0.3 kg diverted',
  },
  {
    id: '5',
    actor: 'Vikram D.',
    action: 'claimed',
    item: 'Raspberry Pi 4 (4GB RAM)',
    dept: 'ECS',
    timeAgo: '1h ago',
    impact: '₹3,200 saved',
  },
]

export const LiveActivityTicker: React.FC = () => {
  const [activities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [activities.length])

  const active = activities[currentIndex]

  return (
    <div className="container max-w-5xl mx-auto px-4 py-2">
      <div className="flex items-center justify-between rounded-full border border-border/70 bg-card/80 px-4 py-2 text-xs shadow-xs backdrop-blur-md">
        <div className="flex items-center gap-2 truncate">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>

          <span className="hidden sm:inline-flex items-center gap-1 font-bold uppercase text-[10px] tracking-wider text-primary shrink-0">
            <Activity className="h-3 w-3" />
            <span>Campus Live</span>
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1.5 truncate text-foreground"
            >
              <span className="font-semibold">{active.actor}</span>
              <span className="text-text-muted">{active.action}</span>
              <span className="font-bold text-primary truncate max-w-[140px] sm:max-w-none">
                {active.item}
              </span>
              <span className="rounded bg-surface-raised px-1 py-0.2 text-[9px] font-bold text-text-muted hidden md:inline">
                {active.dept}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="hidden sm:inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
            {active.impact}
          </span>
          <span className="text-[10px] text-text-muted flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{active.timeAgo}</span>
          </span>
        </div>
      </div>
    </div>
  )
}
