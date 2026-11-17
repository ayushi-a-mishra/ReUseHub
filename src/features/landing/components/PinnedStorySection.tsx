import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MessageSquare,
  MapPin,
  QrCode,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'

interface StoryStep {
  step: number
  title: string
  subtitle: string
  description: string
  icon: React.ElementType
  badgeText: string
  highlight: string
  mockup: {
    title: string
    sub: string
    tag: string
  }
}

const STEPS: StoryStep[] = [
  {
    step: 1,
    title: 'Discover Campus Materials',
    subtitle: 'Browse usable gear listed by fellow students & lab coordinators',
    description:
      'Filter through textbooks, microcontroller dev kits, mini drafters, dorm accessories, and project hardware without paying a single rupee.',
    icon: Search,
    badgeText: 'Step 1: Discover',
    highlight: 'Zero commercial listing fees',
    mockup: {
      title: 'Arduino Uno R3 + 37 Sensors Kit',
      sub: 'Listed by IT Dept • Available for immediate pickup',
      tag: 'Hardware',
    },
  },
  {
    step: 2,
    title: 'Request & Direct Peer Chat',
    subtitle: 'Send a polite request with project details & campus availability',
    description:
      'The owner reviews your request and approves the handover. Coordinate directly inside ReUseHub private chat without sharing personal phone numbers.',
    icon: MessageSquare,
    badgeText: 'Step 2: Coordinate',
    highlight: 'Protected phone privacy',
    mockup: {
      title: 'Priya Sharma (Student, Year 3)',
      sub: '"Hey! I can meet outside IDEA Lab-1 around 3 PM today."',
      tag: 'Approved',
    },
  },
  {
    step: 3,
    title: 'Meet at Campus Pickup Points',
    subtitle: '5 designated, safe academic handoff zones across SLRTCE',
    description:
      'Meet during operating hours at verified pickup spots like IDEA Lab-1 (4th Floor), Central Library, or the Mechanical Workshop with CCTV coverage.',
    icon: MapPin,
    badgeText: 'Step 3: Meet Safe',
    highlight: '100% On-Campus Only',
    mockup: {
      title: 'IDEA Lab-1 & IoT Makerspace',
      sub: 'Main Academic Building, 4th Floor • Mon-Sat 9AM-5PM',
      tag: 'Verified Spot',
    },
  },
  {
    step: 4,
    title: 'Scan QR or Dual Confirmation',
    subtitle: 'Frictionless handoff record with instant identity check',
    description:
      'The giver scans the taker’s item QR code on their phone screen, or both parties tap "Confirm Handover" in app to finalize the peer exchange.',
    icon: QrCode,
    badgeText: 'Step 4: Verify',
    highlight: 'Instant QR Handover',
    mockup: {
      title: 'Handover Verified Successfully',
      sub: 'Both parties authenticated via college ID cards',
      tag: 'Completed',
    },
  },
  {
    step: 5,
    title: 'Record Real Environmental Impact',
    subtitle: 'Track your kilograms of landfill waste diverted and money saved',
    description:
      'The item is archived into your permanent campus reuse resume. Watch department leaderboards climb as cumulative sustainability grows.',
    icon: TrendingUp,
    badgeText: 'Step 5: Impact',
    highlight: 'Strictly Cumulative Metrics',
    mockup: {
      title: '+1.5 kg Solid Waste Avoided',
      sub: '₹850 Student Budget Saved • Added to Department Score',
      tag: 'Eco Impact',
    },
  },
]

export const PinnedStorySection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const current = STEPS[activeStep]
  const Icon = current.icon

  return (
    <section className="container max-w-5xl mx-auto px-4 py-16 space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>The Campus Circular Loop</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          How ReUseHub Works in 5 Easy Steps
        </h2>
        <p className="text-sm text-text-muted leading-relaxed">
          From dormant drawer clutter to peer graduation projects. Zero cash transactions. Built specifically for Shree L. R. Tiwari College of Engineering.
        </p>
      </div>

      {/* Stepper Navigation Pills */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
        {STEPS.map((step, idx) => (
          <button
            key={step.step}
            onClick={() => setActiveStep(idx)}
            className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-bold transition-all ${
              activeStep === idx
                ? 'bg-primary text-white shadow-elevation-1 scale-105'
                : 'bg-card border border-border/80 text-text-muted hover:border-primary/40 hover:text-foreground'
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                activeStep === idx ? 'bg-white/20 text-white' : 'bg-surface-raised text-text-muted'
              }`}
            >
              {step.step}
            </span>
            <span className="hidden sm:inline">{step.badgeText.split(': ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-hero border border-border/80 bg-card/75 p-6 sm:p-10 shadow-elevation-2 backdrop-blur-xl">
        {/* Left Column: Narrative Content */}
        <div className="lg:col-span-7 space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-xs uppercase font-bold tracking-wider">
                  {current.badgeText}
                </Badge>
                <span className="text-xs font-semibold text-accent flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {current.highlight}
                </span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                {current.title}
              </h3>

              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                {current.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                {current.description}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Button
                  size="sm"
                  onClick={() => setActiveStep((prev) => (prev + 1) % STEPS.length)}
                  className="text-xs font-bold gap-1.5"
                >
                  <span>{activeStep === STEPS.length - 1 ? 'Start Again' : 'Next Step'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs text-text-muted">
                  Step {activeStep + 1} of {STEPS.length}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: Visual Stage / Step Preview */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.step}
              initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotate: -2 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm rounded-card border-2 border-primary/30 bg-surface-raised p-6 shadow-elevation-2 space-y-4 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-emerald-500 text-white shadow-elevation-1">
                <Icon className="h-8 w-8 stroke-[2.2]" />
              </div>

              <div className="space-y-1.5">
                <Badge variant="forest" className="text-[10px] uppercase font-bold">
                  {current.mockup.tag}
                </Badge>
                <h4 className="font-heading text-base font-bold text-foreground">
                  {current.mockup.title}
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  {current.mockup.sub}
                </p>
              </div>

              <div className="rounded-lg bg-card/80 p-3 border border-border/60 flex items-center justify-center gap-2 text-xs font-semibold text-primary">
                <CheckCircle2 className="h-4 w-4" />
                <span>SLRTCE IDEA Lab-1 Verified Protocol</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
