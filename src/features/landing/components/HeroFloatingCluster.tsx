import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Item } from '@/types'
import { Badge } from '@/shared/ui/badge'
import { MapPin, Sparkles, CheckCircle2 } from 'lucide-react'

interface HeroFloatingClusterProps {
  items: Item[]
}

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%2316a34a" opacity="0.15"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2316a34a" font-family="sans-serif" font-weight="bold" font-size="14">Campus Usable Item</text></svg>'

export const HeroFloatingCluster: React.FC<HeroFloatingClusterProps> = ({ items }) => {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const sampleItems = items.length >= 5 ? items.slice(0, 5) : items

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 })
  }

  if (sampleItems.length < 3) return null

  const item1 = sampleItems[0]
  const item2 = sampleItems[1]
  const item3 = sampleItems[2]
  const item4 = sampleItems[3]
  const item5 = sampleItems[4] || sampleItems[0]

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[480px] select-none"
      aria-hidden="true"
    >
      {/* Ambient cluster glow behind cards */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-72 w-72 rounded-full bg-gradient-to-tr from-primary/20 via-accent/15 to-emerald-400/20 blur-3xl opacity-60 dark:opacity-30" />
      </div>

      {/* CARD 1: Top-Left (Tilted -6deg, Parallax Layer 1) */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: mousePos.x * -18,
                y: mousePos.y * -18 + [0, -8, 0][1],
                rotate: -6,
              }
        }
        transition={{
          x: { type: 'spring', stiffness: 150, damping: 15 },
          y: { type: 'spring', stiffness: 150, damping: 15 },
          rotate: { duration: 0.3 },
        }}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.05, rotate: -2, zIndex: 30 }}
        onClick={() => navigate(`/items/${item1.id}`)}
        className="absolute top-2 left-4 w-48 cursor-pointer rounded-card border border-border/80 bg-card/95 p-2 shadow-elevation-2 backdrop-blur-md transition-shadow hover:shadow-elevation-3 hover:border-primary/60 z-10"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-tr from-emerald-100 to-teal-50 dark:from-emerald-950/40 dark:to-teal-900/20 mb-1.5 flex items-center justify-center">
          <img
            src={item1.images[0]}
            alt={item1.title}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
            }}
            className="h-full w-full object-cover"
          />
          <Badge
            variant="success"
            className="absolute top-1.5 left-1.5 text-[8px] px-1.5 py-0 uppercase font-bold shadow-xs bg-card/90 backdrop-blur-sm"
          >
            {item1.condition.replace('_', ' ')}
          </Badge>
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1 py-0.2 text-[8px] font-bold text-white">
            {item1.department?.code || 'CAMPUS'}
          </span>
        </div>
        <h4 className="font-heading text-xs font-bold line-clamp-1 text-foreground leading-tight">
          {item1.title}
        </h4>
        <div className="flex items-center justify-between text-[10px] text-text-muted mt-1">
          <span className="truncate max-w-[100px]">{item1.pickup_location.split('(')[0]}</span>
          <span className="font-bold text-primary">Free</span>
        </div>
      </motion.div>

      {/* CARD 2: Top-Right (Tilted +5deg, Parallax Layer 2) */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: mousePos.x * 22,
                y: mousePos.y * 20,
                rotate: 5,
              }
        }
        transition={{
          x: { type: 'spring', stiffness: 120, damping: 18 },
          y: { type: 'spring', stiffness: 120, damping: 18 },
        }}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.05, rotate: 2, zIndex: 30 }}
        onClick={() => navigate(`/items/${item2.id}`)}
        className="absolute top-6 right-2 w-48 cursor-pointer rounded-card border border-border/80 bg-card/95 p-2 shadow-elevation-2 backdrop-blur-md transition-shadow hover:shadow-elevation-3 hover:border-primary/60 z-10"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-tr from-amber-100 to-orange-50 dark:from-amber-950/40 dark:to-orange-900/20 mb-1.5 flex items-center justify-center">
          <img
            src={item2.images[0]}
            alt={item2.title}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
            }}
            className="h-full w-full object-cover"
          />
          <Badge
            variant="success"
            className="absolute top-1.5 left-1.5 text-[8px] px-1.5 py-0 uppercase font-bold shadow-xs bg-card/90 backdrop-blur-sm"
          >
            {item2.condition.replace('_', ' ')}
          </Badge>
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1 py-0.2 text-[8px] font-bold text-white">
            {item2.department?.code || 'CAMPUS'}
          </span>
        </div>
        <h4 className="font-heading text-xs font-bold line-clamp-1 text-foreground leading-tight">
          {item2.title}
        </h4>
        <div className="flex items-center justify-between text-[10px] text-text-muted mt-1">
          <span className="truncate max-w-[100px]">{item2.pickup_location.split('(')[0]}</span>
          <span className="font-bold text-primary">Free</span>
        </div>
      </motion.div>

      {/* CARD 3: Center Hero Anchor (Largest Foreground, Tilted -1deg) */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: mousePos.x * -10,
                y: mousePos.y * -10,
                rotate: -1,
              }
        }
        transition={{
          x: { type: 'spring', stiffness: 200, damping: 20 },
          y: { type: 'spring', stiffness: 200, damping: 20 },
        }}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.04, rotate: 0, zIndex: 40 }}
        onClick={() => navigate(`/items/${item3.id}`)}
        className="absolute top-36 left-1/2 -translate-x-1/2 w-56 cursor-pointer rounded-card border-2 border-primary/40 bg-card p-3 shadow-elevation-3 backdrop-blur-xl transition-all hover:border-primary z-20"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-tr from-emerald-200 via-primary/20 to-teal-100 dark:from-emerald-900/40 dark:to-teal-950 mb-2 flex items-center justify-center">
          <img
            src={item3.images[0]}
            alt={item3.title}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
            }}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <Badge variant="success" className="text-[9px] px-2 py-0 uppercase font-black shadow-xs bg-card/95">
              Available Now
            </Badge>
          </div>
          <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white">
            {item3.department?.code || 'CAMPUS'}
          </span>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          {item3.category?.name}
        </span>
        <h4 className="font-heading text-xs font-bold line-clamp-1 text-foreground leading-tight mt-0.5">
          {item3.title}
        </h4>
        <p className="text-[10px] text-text-muted flex items-center gap-1 mt-1 truncate">
          <MapPin className="h-3 w-3 shrink-0 text-primary" />
          <span className="truncate">{item3.pickup_location}</span>
        </p>

        <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between">
          <span className="text-[10px] font-medium text-text-muted">Zero currency</span>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
            Instant Request
          </span>
        </div>
      </motion.div>

      {/* CARD 4: Bottom-Left (Tilted -4deg, Parallax Layer 3) */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: mousePos.x * 24,
                y: mousePos.y * -16,
                rotate: -4,
              }
        }
        transition={{
          x: { type: 'spring', stiffness: 100, damping: 14 },
          y: { type: 'spring', stiffness: 100, damping: 14 },
        }}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.05, rotate: 0, zIndex: 30 }}
        onClick={() => navigate(`/items/${item4.id}`)}
        className="absolute bottom-4 left-6 w-44 cursor-pointer rounded-card border border-border/80 bg-card/95 p-2 shadow-elevation-2 backdrop-blur-md transition-shadow hover:shadow-elevation-3 hover:border-primary/60 z-10"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-tr from-blue-100 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-900/20 mb-1.5 flex items-center justify-center">
          <img
            src={item4.images[0]}
            alt={item4.title}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
            }}
            className="h-full w-full object-cover"
          />
          <Badge
            variant="success"
            className="absolute top-1.5 left-1.5 text-[8px] px-1.5 py-0 uppercase font-bold shadow-xs bg-card/90"
          >
            {item4.condition.replace('_', ' ')}
          </Badge>
        </div>
        <h4 className="font-heading text-xs font-bold line-clamp-1 text-foreground leading-tight">
          {item4.title}
        </h4>
        <div className="flex items-center justify-between text-[10px] text-text-muted mt-1">
          <span className="truncate max-w-[90px]">{item4.pickup_location.split('(')[0]}</span>
          <span className="font-bold text-primary">Free</span>
        </div>
      </motion.div>

      {/* CARD 5: Bottom-Right (Tilted +6deg, Live Handover Pill) */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: mousePos.x * -20,
                y: mousePos.y * 18,
                rotate: 6,
              }
        }
        transition={{
          x: { type: 'spring', stiffness: 140, damping: 16 },
          y: { type: 'spring', stiffness: 140, damping: 16 },
        }}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.05, rotate: 2, zIndex: 30 }}
        onClick={() => navigate(`/items/${item5.id}`)}
        className="absolute bottom-2 right-4 w-44 cursor-pointer rounded-card border border-border/80 bg-card/95 p-2 shadow-elevation-2 backdrop-blur-md transition-shadow hover:shadow-elevation-3 hover:border-primary/60 z-10"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-tr from-purple-100 to-pink-50 dark:from-purple-950/40 dark:to-pink-900/20 mb-1.5 flex items-center justify-center">
          <img
            src={item5.images[0]}
            alt={item5.title}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
            }}
            className="h-full w-full object-cover"
          />
          <span className="absolute top-1.5 right-1.5 rounded bg-black/60 px-1 py-0.2 text-[8px] font-bold text-white">
            {item5.department?.code || 'CAMPUS'}
          </span>
        </div>
        <h4 className="font-heading text-xs font-bold line-clamp-1 text-foreground leading-tight">
          {item5.title}
        </h4>
        <div className="flex items-center justify-between text-[10px] text-text-muted mt-1">
          <span className="truncate max-w-[90px]">{item5.pickup_location.split('(')[0]}</span>
          <span className="font-bold text-primary">Free</span>
        </div>
      </motion.div>

      {/* Verified Peer Handover Floating Pill */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -6, 0],
              }
        }
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-32 right-0 rounded-full border border-primary/30 bg-surface/90 px-3 py-1 shadow-elevation-1 backdrop-blur-md flex items-center gap-1.5 text-[11px] font-bold text-primary z-20 pointer-events-none"
      >
        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
        <span>Verified Campus Handover</span>
      </motion.div>

      {/* Zero Currency Floating Pill */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, 6, 0],
              }
        }
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-28 left-0 rounded-full border border-accent/30 bg-surface/90 px-3 py-1 shadow-elevation-1 backdrop-blur-md flex items-center gap-1.5 text-[11px] font-bold text-accent z-20 pointer-events-none"
      >
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        <span>Zero Currency Allowed</span>
      </motion.div>
    </div>
  )
}
