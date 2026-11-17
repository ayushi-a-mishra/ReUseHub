import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { campusConfig } from '@/config/campus'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  Recycle,
  Sparkles,
  ShieldCheck,
  Building,
  GraduationCap,
  HeartHandshake,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

export function AboutPage() {
  return (
    <div className="space-y-16 py-12 container max-w-5xl mx-auto px-4">
      {/* Hero Header */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
          <Recycle className="h-3.5 w-3.5 animate-pulse" />
          <span>IDEA Lab-1 &bull; Department of Information Technology</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
          Empowering Campus Circularity at{' '}
          <span className="bg-gradient-to-r from-primary via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {campusConfig.shortName}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
          ReUseHub is a student-led, faculty-backed circular exchange ecosystem designed to recirculate textbooks, electronic components, project modules, and dorm essentials across all eight engineering departments with <strong className="font-semibold text-slate-900 dark:text-white">zero currency exchanged</strong>.
        </p>
      </section>

      {/* Origin & Academic Context */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-hero border border-border/80 bg-card/80 p-8 shadow-elevation-1">
        <div className="space-y-4">
          <Badge variant="forest" className="text-xs uppercase font-bold tracking-wider">
            Academic Project Context
          </Badge>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Digital Empowerment for All
          </h2>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Conceived as part of the IDEA Lab-1 initiative within the Department of Information Technology at {campusConfig.name}, ReUseHub tackles campus waste at its root source.
          </p>
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            Every semester, senior students discard hundreds of usable textbooks, breadboards, sensor modules, drafters, and stationery, while incoming juniors struggle to afford them. By breaking departmental silos, ReUseHub connects givers and takers seamlessly.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-primary">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              100% Free Peer Handovers
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Strict Campus RLS Security
            </span>
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface-raised p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border/60 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-foreground">Institution Information</h3>
              <p className="text-xs text-text-muted">{campusConfig.name}</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-text-muted">Department</span>
              <span className="font-semibold text-foreground">Information Technology</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-text-muted">Innovation Hub</span>
              <span className="font-semibold text-foreground">IDEA Lab-1 (4th Floor)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-text-muted">Authorized Domain</span>
              <span className="font-semibold font-mono text-primary">@{campusConfig.emailDomain}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-text-muted">Office Hours</span>
              <span className="font-semibold text-foreground">Mon–Sat, 9:00 AM – 5:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Participating Engineering Departments */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            8 Participating Campus Departments
          </h2>
          <p className="text-xs text-text-muted">
            All academic disciplines share one centralized circular economy catalog
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {campusConfig.departments.map((dept) => (
            <motion.div
              key={dept.id}
              whileHover={{ y: -3 }}
              className="rounded-card border border-border/80 bg-card p-4 space-y-2 shadow-elevation-1 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {dept.code}
                </span>
                <GraduationCap className="h-4 w-4 text-text-muted" />
              </div>
              <h3 className="font-heading text-sm font-bold text-foreground line-clamp-1">
                {dept.name}
              </h3>
              <p className="text-[11px] text-text-muted flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0 text-primary" />
                <span className="truncate">{dept.building}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Principles Bento Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Our Core Campus Charter
          </h2>
          <p className="text-xs text-text-muted">
            The foundational non-negotiable rules governing every exchange on ReUseHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-card border border-border/80 bg-card p-6 space-y-3 shadow-elevation-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Strictly Zero Currency</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              No cash, UPI, tokens, or bartering are permitted. Every item listed is a gift to the campus community, recirculating knowledge and preserving student budgets.
            </p>
          </div>

          <div className="rounded-card border border-border/80 bg-card p-6 space-y-3 shadow-elevation-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Verified ID Handover</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Every member authenticates via their official campus email domain (@{campusConfig.emailDomain}). No external strangers or commercial resellers are ever admitted.
            </p>
          </div>

          <div className="rounded-card border border-border/80 bg-card p-6 space-y-3 shadow-elevation-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Strictly Cumulative Impact</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Every completed handover calculates estimated kilograms of solid waste diverted and rupees saved. Monthly impact metrics are strictly non-decreasing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="rounded-hero border border-primary/30 bg-gradient-to-r from-primary/15 via-emerald-500/10 to-teal-500/15 p-8 text-center space-y-4">
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
          Ready to give your usable gear a second life?
        </h2>
        <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto">
          Join hundreds of SLRTCE students and professors contributing to a greener, collaborative campus.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/browse">
            <Button className="font-bold text-xs">Browse Available Items</Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="outline" className="font-bold text-xs gap-1">
              <span>Read Step Guide</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
