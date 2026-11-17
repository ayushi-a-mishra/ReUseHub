import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Sparkles,
  Recycle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Cpu,
  PenTool,
  Monitor,
  Armchair,
  Trophy,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { campusConfig } from '@/config/campus'
import { Button } from '@/shared/ui/button'

const INTEREST_OPTIONS = [
  { id: 'cat-books', label: 'Books & Syllabi', icon: BookOpen },
  { id: 'cat-lab-hardware', label: 'Lab & IoT Hardware', icon: Cpu },
  { id: 'cat-stationery', label: 'Drawing & Stationery', icon: PenTool },
  { id: 'cat-electronics', label: 'PC & Peripherals', icon: Monitor },
  { id: 'cat-dorm', label: 'Dorm Essentials', icon: Armchair },
  { id: 'cat-sports', label: 'Sports & Fitness', icon: Trophy },
]

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, completeOnboarding, user } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedDept, setSelectedDept] = useState(user?.department_id || campusConfig.departments[0].id)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'cat-books',
    'cat-lab-hardware',
  ])

  if (!showOnboarding) return null

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleFinish = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#16A34A', '#22C55E', '#F97316', '#4ADE80'],
    })
    completeOnboarding(selectedInterests, selectedDept)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
        className="relative w-full max-w-xl overflow-hidden rounded-hero border border-border bg-card text-card-foreground shadow-elevation-3"
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-surface-raised/40">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Recycle className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {campusConfig.shortName} Campus Circular Tour
              </span>
              <p className="text-xs text-text-muted">Step {step} of 3</p>
            </div>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-6 bg-primary'
                    : s < step
                    ? 'w-3 bg-primary/40'
                    : 'w-3 bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>IDEA Lab-1 &bull; Department of IT</span>
                </div>

                <div className="space-y-2">
                  <h2 className="font-heading text-2xl font-bold tracking-tight">
                    Welcome to {campusConfig.logoText}
                  </h2>
                  <p className="text-sm text-text-muted leading-relaxed">
                    A peer-to-peer campus circular economy designed for students and faculty.
                    Exchange project hardware, lab kits, reference books, and essentials with{' '}
                    <strong className="text-primary font-semibold">zero financial transactions</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-card border border-green-200/60 dark:border-green-900/60 bg-green-50/50 dark:bg-green-950/20 p-4">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">100% Free</div>
                    <div className="text-xs text-text-muted mt-0.5">Strictly peer-to-peer campus reuse</div>
                  </div>
                  <div className="rounded-card border border-orange-200/60 dark:border-orange-900/60 bg-orange-50/50 dark:bg-orange-950/20 p-4">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">Impact Meter</div>
                    <div className="text-xs text-text-muted mt-0.5">Measures kg waste avoided & INR saved</div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={() => setStep(2)} className="gap-2">
                    <span>How It Works</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-heading text-xl font-bold">The 4-Step Handover Cycle</h2>
                  <p className="text-xs text-text-muted">How items move safely across campus</p>
                </div>

                <div className="grid gap-3">
                  {[
                    {
                      num: '1',
                      title: 'List in <60 Seconds',
                      desc: 'Upload clear photos, select condition and designate an official campus pickup point.',
                    },
                    {
                      num: '2',
                      title: 'Peer Discovers & Requests',
                      desc: 'A classmate sends a request with an intended use note. You approve the best match.',
                    },
                    {
                      num: '3',
                      title: 'Campus Coordination Chat',
                      desc: 'Coordinate meet-up time at IDEA Lab, Library, or Workshop with zero phone exposure.',
                    },
                    {
                      num: '4',
                      title: 'Dual-Confirm or Scan QR',
                      desc: 'Both confirm exchange. Waste diverted (kg) is instantly added to your college impact profile!',
                    },
                  ].map((item) => (
                    <div
                      key={item.num}
                      className="flex items-start gap-3 rounded-card border border-border/80 bg-surface p-3"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {item.num}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{item.title}</div>
                        <div className="text-xs text-text-muted leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(1)} size="sm">
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="gap-2">
                    <span>Personalize Profile</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-heading text-xl font-bold">Academic Department & Interests</h2>
                  <p className="text-xs text-text-muted">
                    We tailor recommended listings and department circular metrics for you.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold flex items-center gap-1.5 text-text-primary">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Select Department
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="flex h-10 w-full rounded-input border border-input bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  >
                    {campusConfig.departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code}) &bull; {dept.building}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-primary">
                    What materials are you looking for?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {INTEREST_OPTIONS.map((item) => {
                      const Icon = item.icon
                      const isSelected = selectedInterests.includes(item.id)
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleInterest(item.id)}
                          className={`flex items-center gap-2 rounded-card border px-3 py-2.5 text-xs font-medium transition-all duration-120 text-left ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary font-semibold'
                              : 'border-border bg-surface text-text-muted hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                          {isSelected && <CheckCircle2 className="h-3.5 w-3.5 ml-auto text-primary" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Button variant="ghost" onClick={() => setStep(2)} size="sm">
                    Back
                  </Button>
                  <Button onClick={handleFinish} variant="accent" className="gap-2">
                    <span>Enter ReUseHub</span>
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
