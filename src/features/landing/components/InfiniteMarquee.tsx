import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { BookOpen, Cpu, Ruler, Sparkles, Shirt, Laptop, Package, HeartHandshake } from 'lucide-react'

const MARQUEE_ITEMS = [
  { label: 'Engineering Textbooks', icon: BookOpen, count: '14+ active' },
  { label: 'Arduino & Microcontrollers', icon: Cpu, count: '8+ active' },
  { label: 'Mini Drafters & T-Squares', icon: Ruler, count: '5+ active' },
  { label: 'Lab Aprons & Safety Goggles', icon: Shirt, count: '12+ active' },
  { label: 'Raspberry Pi & Dev Boards', icon: Laptop, count: '6+ active' },
  { label: 'Dorm Racks & Desk Lamps', icon: Package, count: '7+ active' },
  { label: 'Peer Handover Stations', icon: HeartHandshake, count: '5 spots' },
  { label: 'Zero Currency Exchanged', icon: Sparkles, count: '100% Free' },
]

export const InfiniteMarquee: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative w-full overflow-hidden py-4 border-y border-border/60 bg-surface/50 select-none">
      {/* Edge gradient fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="flex whitespace-nowrap">
        <motion.div
          animate={shouldReduceMotion ? undefined : { x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 25,
              ease: 'linear',
            },
          }}
          className="flex items-center gap-4 shrink-0"
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-3.5 py-1.5 shadow-xs backdrop-blur-sm hover:border-primary/50 transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-foreground">{item.label}</span>
                <span className="text-[10px] font-semibold text-text-muted bg-surface-raised px-1.5 py-0.2 rounded">
                  {item.count}
                </span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
