import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { campusConfig } from '@/config/campus'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  Sparkles,
  Users,
  GraduationCap,
  ShieldCheck,
  MapPin,
  Clock,
  QrCode,
  MessageSquare,
  Search,
  ChevronDown,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'

export function HowItWorksPage() {
  const [activePersona, setActivePersona] = useState<'student' | 'faculty' | 'admin'>('student')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: 'Is there any fee or payment allowed for items on ReUseHub?',
      a: 'Never. ReUseHub strictly prohibits cash, online UPI payments, or bartering. All items are 100% free peer exchanges within Shree L. R. Tiwari College of Engineering.',
    },
    {
      q: 'Where do handovers take place?',
      a: 'All handovers must occur at one of our 5 designated campus pickup points (e.g. IDEA Lab-1 on 4th Floor, Central Library, or the Central Workshop) during campus operating hours.',
    },
    {
      q: 'How does the Handover QR Code verification work?',
      a: 'Once a request is accepted, the taker generates an encrypted item QR code on their phone screen. The giver scans this QR code using their camera to instantly complete the handover and credit environmental impact to both profiles.',
    },
    {
      q: 'Can external non-college members create an account?',
      a: 'No. Sign-ups are restricted to allow-listed campus email addresses ending with @' + campusConfig.emailDomain + '. All members are verified students, faculty, or staff.',
    },
    {
      q: 'What should I do if an item is damaged or not as described?',
      a: 'You can decline the handover during physical inspection at the pickup point. Once confirmed, you can also leave an honest 1-5 star review to help maintain campus trust.',
    },
    {
      q: 'How is environmental impact calculated?',
      a: 'Every item category has an estimated solid waste mass (kg) and replacement cost (INR). When a handover completes, these values are added to campus cumulative metrics which are strictly non-decreasing.',
    },
  ]

  return (
    <div className="space-y-16 py-12 container max-w-5xl mx-auto px-4">
      {/* Header */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Step-by-Step Campus Protocol</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
          How ReUseHub Operates
        </h1>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
          A seamless 4-stage circular exchange lifecycle designed for safe, transparent handovers across {campusConfig.shortName}.
        </p>
      </section>

      {/* Persona Toggle */}
      <section className="space-y-8">
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-border bg-card p-1 shadow-elevation-1">
            <button
              onClick={() => setActivePersona('student')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                activePersona === 'student'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-muted hover:text-foreground'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>For Students</span>
            </button>
            <button
              onClick={() => setActivePersona('faculty')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                activePersona === 'faculty'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-muted hover:text-foreground'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>For Faculty & Labs</span>
            </button>
            <button
              onClick={() => setActivePersona('admin')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                activePersona === 'admin'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-muted hover:text-foreground'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>For Eco Cell Admins</span>
            </button>
          </div>
        </div>

        {/* Persona Workflow Cards */}
        {activePersona === 'student' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            {[
              {
                step: '01',
                title: 'List or Discover',
                desc: 'Upload 1-4 photos of unused textbooks or hardware in under 60 seconds with condition rating.',
                icon: Search,
              },
              {
                step: '02',
                title: 'Request with Note',
                desc: 'Takers send a polite request explaining their project needs. No personal phone numbers shared.',
                icon: MessageSquare,
              },
              {
                step: '03',
                title: 'Campus Pickup',
                desc: 'Meet at a verified campus spot like IDEA Lab-1 during scheduled operating hours.',
                icon: MapPin,
              },
              {
                step: '04',
                title: 'QR Handover Scan',
                desc: 'Scan the item QR code to verify identity, record impact, and unlock peer review stars.',
                icon: QrCode,
              },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-card border border-border/80 bg-card p-5 space-y-3 shadow-elevation-1 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-black text-primary/40">{s.step}</span>
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground">{s.title}</h3>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activePersona === 'faculty' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-card border border-border bg-card p-8 space-y-6 shadow-elevation-1"
          >
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest/15 text-forest">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Faculty & Departmental Surplus Protocol
                </h3>
                <p className="text-xs text-text-muted">
                  Batch list retired lab rigs, surplus development boards, and academic reference sets
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-text-muted leading-relaxed">
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-foreground">1. Departmental Badge</h4>
                <p>
                  Faculty listings receive an official department verification badge (e.g. "IT Dept Lab"), guaranteeing authenticity and high equipment grade for student capstone teams.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-foreground">2. Lab Incharge Custody</h4>
                <p>
                  Specify designated lab pickup points such as IDEA Lab-1 or Central Workshop where lab assistants verify student identity before releasing equipment.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-foreground">3. Institutional Auditing</h4>
                <p>
                  All recirculated equipment is logged for Departmental NAAC and NBA sustainability documentation, proving institutional circular economy compliance.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activePersona === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-card border border-border bg-card p-8 space-y-6 shadow-elevation-1"
          >
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Eco Cell & Moderation Governance
                </h3>
                <p className="text-xs text-text-muted">
                  Automated checks, prohibited item detection, and monthly sustainability reporting
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-text-muted leading-relaxed">
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-foreground">1. Moderation Queue</h4>
                <p>
                  Any listings flagged for commercial resale, prohibited materials (hazardous chemicals, broken screens), or disputes are routed to the Admin Dashboard.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-foreground">2. Cumulative Impact Integrity</h4>
                <p>
                  Admin dashboard monitors strictly non-decreasing monthly cumulative curves for kg diverted and INR saved, downloadable as formatted PDF audit certificates.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-foreground">3. Leaderboard Recognition</h4>
                <p>
                  Awards automated digital badges ("Zero Waste Champion", "Master Giver") to top students and departments during annual college technical symposiums.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* 5 Designated Campus Pickup Points */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            5 Designated Campus Pickup Points
          </h2>
          <p className="text-xs text-text-muted">
            All peer exchanges must happen at one of these monitored academic locations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {campusConfig.pickupPoints.map((point) => (
            <div
              key={point.id}
              className="rounded-card border border-border/80 bg-card p-5 space-y-3 shadow-elevation-1 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="success" className="text-[10px] uppercase font-bold">
                    {point.floor}
                  </Badge>
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-heading text-sm font-bold text-foreground">
                  {point.name}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">{point.instructions}</p>
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center gap-1.5 text-[11px] text-text-muted">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>{point.activeHours}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prohibited Items Warning Banner */}
      <section className="rounded-card border border-amber-300/80 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>Strictly Prohibited Items</span>
        </div>
        <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
          We strictly forbid: commercial merchandise, weapons, hazardous chemicals, counterfeit ID cards, broken non-functional items dumped as mixed trash, or any item requesting monetary remuneration. Violators face permanent campus domain account suspension.
        </p>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-text-muted">
            Everything you need to know about campus circularity at SLRTCE
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-card border border-border/80 bg-card overflow-hidden shadow-elevation-1"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="flex w-full items-center justify-between p-4 text-left font-heading text-sm font-bold text-foreground hover:bg-muted/40 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-primary shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-text-muted leading-relaxed border-t border-border/40 bg-surface/30">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center space-y-3 pt-4">
        <h3 className="font-heading text-xl font-bold text-foreground">Have more questions?</h3>
        <p className="text-xs text-text-muted">
          Visit the IDEA Lab-1 on the 4th floor or email us at {campusConfig.supportEmail}
        </p>
        <Link to="/browse">
          <Button className="mt-2 font-bold text-xs gap-1.5">
            <span>Explore Campus Listings</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </section>
    </div>
  )
}
