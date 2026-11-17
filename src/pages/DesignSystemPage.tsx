import { useState } from 'react'
import {
  Sparkles,
  Layers,
  Palette,
  Type,
  MousePointer,
  Box,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { useToast } from '@/shared/ui/toast'
import { Reveal, StaggerGroup, StaggerItem, CountUp, Magnetic, TiltCard } from '@/shared/motion'
import { campusConfig } from '@/config/campus'

export function DesignSystemPage() {
  const { toast } = useToast()
  const [testInput, setTestInput] = useState('')
  const [testError, setTestError] = useState(false)
  const [staggerKey, setStaggerKey] = useState(0)
  const [countUpKey, setCountUpKey] = useState(0)

  return (
    <div className="container max-w-6xl py-12 space-y-16">
      {/* Header */}
      <Reveal direction="down" className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
          <Sparkles className="h-4 w-4" />
          <span>Design Constitution & Motion Tokens</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tight text-foreground">
          ReUseHub Design System
        </h1>
        <p className="text-base text-text-muted max-w-2xl leading-relaxed">
          The foundational atomic tokens, elevation geometry, motion primitives, and CVA components governing the {campusConfig.name} circular economy experience.
        </p>
      </Reveal>

      {/* 1. Color Palette Scales */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Palette className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-2xl font-bold">11-Step Color Token Scales</h2>
        </div>

        {/* Primary Green Scale */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Brand Primary Green Scale (#16A34A & Deep Forest #14532D)
            </span>
            <span className="text-xs text-text-muted">WCAG AA Compliant</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-11 gap-2">
            {[
              { step: '50', hex: '#F0FDF4', bg: 'bg-green-50', text: 'text-green-950' },
              { step: '100', hex: '#DCFCE7', bg: 'bg-green-100', text: 'text-green-950' },
              { step: '200', hex: '#BBF7D0', bg: 'bg-green-200', text: 'text-green-950' },
              { step: '300', hex: '#86EFAC', bg: 'bg-green-300', text: 'text-green-950' },
              { step: '400', hex: '#4ADE80', bg: 'bg-green-400', text: 'text-green-950' },
              { step: '500', hex: '#22C55E', bg: 'bg-green-500', text: 'text-white' },
              { step: '600', hex: '#16A34A', bg: 'bg-green-600', text: 'text-white', badge: 'Primary' },
              { step: '700', hex: '#15803D', bg: 'bg-green-700', text: 'text-white' },
              { step: '800', hex: '#166534', bg: 'bg-green-800', text: 'text-white' },
              { step: '900', hex: '#14532D', bg: 'bg-green-900', text: 'text-white', badge: 'Forest' },
              { step: '950', hex: '#052E16', bg: 'bg-green-950', text: 'text-white' },
            ].map((c) => (
              <div key={c.step} className="flex flex-col items-center gap-1">
                <div
                  className={`${c.bg} ${c.text} w-full rounded-button p-2.5 shadow-elevation-1 flex flex-col justify-between h-16 transition-transform hover:scale-105`}
                >
                  <span className="text-xs font-bold">{c.step}</span>
                  <span className="text-[10px] font-mono font-semibold">{c.hex}</span>
                </div>
                {c.badge ? (
                  <span className="w-full text-center text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/25 whitespace-nowrap">
                    {c.badge}
                  </span>
                ) : (
                  <span className="text-[9px] py-0.5 invisible select-none">--</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Accent Orange Scale */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">
              Brand Accent Orange Scale (#F97316 for Primary CTA & Highlights)
            </span>
            <span className="text-xs text-text-muted">High Contrast</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-11 gap-2">
            {[
              { step: '50', hex: '#FFF7ED', bg: 'bg-orange-50', text: 'text-orange-950' },
              { step: '100', hex: '#FFEDD5', bg: 'bg-orange-100', text: 'text-orange-950' },
              { step: '200', hex: '#FED7AA', bg: 'bg-orange-200', text: 'text-orange-950' },
              { step: '300', hex: '#FDBA74', bg: 'bg-orange-300', text: 'text-orange-950' },
              { step: '400', hex: '#FB923C', bg: 'bg-orange-400', text: 'text-orange-950' },
              { step: '500', hex: '#F97316', bg: 'bg-orange-500', text: 'text-white', badge: 'Accent' },
              { step: '600', hex: '#EA580C', bg: 'bg-orange-600', text: 'text-white' },
              { step: '700', hex: '#C2410C', bg: 'bg-orange-700', text: 'text-white' },
              { step: '800', hex: '#9A3412', bg: 'bg-orange-800', text: 'text-white' },
              { step: '900', hex: '#7C2D12', bg: 'bg-orange-900', text: 'text-white' },
              { step: '950', hex: '#431407', bg: 'bg-orange-950', text: 'text-white' },
            ].map((c) => (
              <div key={c.step} className="flex flex-col items-center gap-1">
                <div
                  className={`${c.bg} ${c.text} w-full rounded-button p-2.5 shadow-elevation-1 flex flex-col justify-between h-16 transition-transform hover:scale-105`}
                >
                  <span className="text-xs font-bold">{c.step}</span>
                  <span className="text-[10px] font-mono font-semibold">{c.hex}</span>
                </div>
                {c.badge ? (
                  <span className="w-full text-center text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/25 whitespace-nowrap">
                    {c.badge}
                  </span>
                ) : (
                  <span className="text-[9px] py-0.5 invisible select-none">--</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Typography Scale (Ratio 1.25) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Type className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-2xl font-bold">Type Scale (Ratio 1.25)</h2>
        </div>

        <div className="space-y-4 rounded-card border border-border bg-card p-6 shadow-elevation-1">
          <div className="flex flex-col gap-4 border-b border-border/60 pb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono text-text-muted">5xl (61px) / Plus Jakarta Sans 800</span>
              <span className="text-xs text-text-muted">Hero Headlines</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight">Give it a second life.</h1>
          </div>

          <div className="flex flex-col gap-3 border-b border-border/60 pb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono text-text-muted">4xl (49px) / Plus Jakarta Sans 800</span>
              <span className="text-xs text-text-muted">Section Headlines</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">Campus Circular Economy Platform</h2>
          </div>

          <div className="flex flex-col gap-2 border-b border-border/60 pb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono text-text-muted">3xl (39px) / Plus Jakarta Sans 700</span>
              <span className="text-xs text-text-muted">Feature Titles</span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight">Zero Currency. Maximum Environmental Impact.</h3>
          </div>

          <div className="flex flex-col gap-2 border-b border-border/60 pb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono text-text-muted">2xl (31px) / Plus Jakarta Sans 700</span>
              <span className="text-xs text-text-muted">Card Headers</span>
            </div>
            <h4 className="text-2xl font-bold tracking-tight">IDEA Lab-1 &bull; Department of Information Technology</h4>
          </div>

          <div className="flex flex-col gap-2 border-b border-border/60 pb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono text-text-muted">xl (25px) / Plus Jakarta Sans 600</span>
              <span className="text-xs text-text-muted">Sub-Headers</span>
            </div>
            <h5 className="text-xl font-semibold">Over 1,200 kg of solid waste diverted from regional landfills.</h5>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-mono text-text-muted">base (16/24px) / Inter / Max 65 characters</span>
              <span className="text-xs text-text-muted">Prose Body</span>
            </div>
            <p className="text-base text-text-muted leading-relaxed max-w-prose">
              Students and professors can easily exchange functional laboratory components, reference textbooks, and dorm furnishings without commercial intermediaries. Every exchange records tangible metrics.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Elevation & Radius Scale */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Box className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-2xl font-bold">Elevation Geometry & Radius System</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-card border border-border bg-card p-6 shadow-elevation-1 space-y-2">
            <Badge variant="success">Level 1</Badge>
            <h3 className="font-heading font-bold text-base">Elevation-1 (Subtle Lift)</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Applied to standard list cards, inputs, and resting chips. Tinted with brand green at 8% opacity.
            </p>
            <code className="text-[10px] block font-mono bg-surface-raised p-2 rounded">
              0 2px 8px -1px rgba(22, 163, 74, 0.08)
            </code>
          </div>

          <div className="rounded-card border border-border bg-card p-6 shadow-elevation-2 space-y-2">
            <Badge variant="accent">Level 2</Badge>
            <h3 className="font-heading font-bold text-base">Elevation-2 (Active Float)</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Applied to hovered cards, dropdown menus, and sticky action sheets.
            </p>
            <code className="text-[10px] block font-mono bg-surface-raised p-2 rounded">
              0 8px 24px -4px rgba(22, 163, 74, 0.08)
            </code>
          </div>

          <div className="rounded-card border border-border bg-card p-6 shadow-elevation-3 space-y-2">
            <Badge variant="forest">Level 3</Badge>
            <h3 className="font-heading font-bold text-base">Elevation-3 (Modal Overlay)</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Applied to dialogs, bottom sheets, and the main hero impact panels.
            </p>
            <code className="text-[10px] block font-mono bg-surface-raised p-2 rounded">
              0 20px 48px -8px rgba(22, 163, 74, 0.10)
            </code>
          </div>
        </div>

        {/* Radius standards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
          <div className="rounded-input border border-border bg-surface-raised p-4 text-center">
            <span className="text-xs font-bold block">8px</span>
            <span className="text-[10px] text-text-muted">Inputs & Textareas</span>
          </div>
          <div className="rounded-button border border-border bg-surface-raised p-4 text-center">
            <span className="text-xs font-bold block">12px</span>
            <span className="text-[10px] text-text-muted">Buttons & Triggers</span>
          </div>
          <div className="rounded-card border border-border bg-surface-raised p-4 text-center">
            <span className="text-xs font-bold block">16px</span>
            <span className="text-[10px] text-text-muted">Cards & Panels</span>
          </div>
          <div className="rounded-hero border border-border bg-surface-raised p-4 text-center">
            <span className="text-xs font-bold block">24px</span>
            <span className="text-[10px] text-text-muted">Hero Bento Boxes</span>
          </div>
          <div className="rounded-full border border-border bg-surface-raised p-4 text-center">
            <span className="text-xs font-bold block">9999px</span>
            <span className="text-[10px] text-text-muted">Chips & Avatars</span>
          </div>
        </div>
      </section>

      {/* 4. Interactive UI Components Showcase */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-2xl font-bold">CVA UI Component Kit</h2>
        </div>

        {/* Buttons */}
        <div className="rounded-card border border-border bg-card p-6 space-y-4 shadow-elevation-1">
          <h3 className="font-heading font-bold text-base">Buttons & Variants</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="default">Primary (#16A34A)</Button>
            <Button variant="accent">Accent CTA (#F97316)</Button>
            <Button variant="forest">Forest (#14532D)</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button isLoading>Processing</Button>
          </div>
        </div>

        {/* Badges */}
        <div className="rounded-card border border-border bg-card p-6 space-y-4 shadow-elevation-1">
          <h3 className="font-heading font-bold text-base">Status & Tag Badges</h3>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="default">Default Green</Badge>
            <Badge variant="success">Available</Badge>
            <Badge variant="warning">Requested</Badge>
            <Badge variant="info">Reserved</Badge>
            <Badge variant="accent">Wishlist Match</Badge>
            <Badge variant="forest">SLRTCE Verified</Badge>
            <Badge variant="destructive">Prohibited</Badge>
          </div>
        </div>

        {/* Form Controls */}
        <div className="rounded-card border border-border bg-card p-6 space-y-4 shadow-elevation-1">
          <h3 className="font-heading font-bold text-base">Interactive Form Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Standard Text Input</label>
              <Input
                placeholder="e.g. Arduino Uno R3"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                helperText="Enter full model name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Input with Error State</label>
              <Input
                placeholder="Invalid campus email"
                defaultValue="student@gmail.com"
                error={testError ? `Domain must be @${campusConfig.emailDomain}` : undefined}
              />
              <button
                type="button"
                onClick={() => setTestError(!testError)}
                className="text-[11px] text-primary hover:underline mt-1"
              >
                Toggle error validation state
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Custom Select Component</label>
              <Select defaultValue="idea-lab">
                {campusConfig.pickupPoints.map((pp) => (
                  <option key={pp.id} value={pp.id}>
                    {pp.name} ({pp.floor})
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Central Motion System Demos */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <MousePointer className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-2xl font-bold">Central Motion System Demos</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Magnetic CTA Demo */}
          <div className="rounded-card border border-border bg-card p-6 flex flex-col items-center justify-center text-center shadow-elevation-1 space-y-4">
            <Badge variant="forest">Magnetic Physics</Badge>
            <div>
              <h4 className="font-heading font-bold text-sm">Magnetic Cursor Attraction</h4>
              <p className="text-xs text-text-muted mt-1">Hover near the button to feel elastic pull</p>
            </div>
            <Magnetic strength={0.4}>
              <Button
                variant="accent"
                onClick={() => toast({ title: 'Magnetic Click', description: 'Smooth spring release executed.', type: 'success' })}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Hover Me
              </Button>
            </Magnetic>
          </div>

          {/* 3D Tilt Card with Glare */}
          <TiltCard glare className="rounded-card border border-border bg-card p-6 shadow-elevation-1 space-y-3 cursor-pointer">
            <Badge variant="default">3D Interactive Tilt</Badge>
            <h4 className="font-heading font-bold text-sm">3D Card Tilt + Green Glare</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Move your mouse across this card to trigger spring-backed 3D matrix rotation and dynamic specular glare.
            </p>
            <div className="h-10 rounded-button bg-green-500/10 flex items-center justify-center text-xs font-semibold text-primary">
              Interactive Perspective Card
            </div>
          </TiltCard>

          {/* Animated CountUp Demo */}
          <div className="rounded-card border border-border bg-card p-6 flex flex-col justify-between text-center shadow-elevation-1 space-y-3">
            <div className="flex items-center justify-between w-full">
              <Badge variant="success">CountUp Animation</Badge>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 text-[10px] px-2 text-primary hover:bg-primary/10 gap-1"
                onClick={() => setCountUpKey((k) => k + 1)}
              >
                <RotateCcw className="h-3 w-3" />
                <span>Replay</span>
              </Button>
            </div>

            <div key={countUpKey} className="space-y-3 py-1">
              <div>
                <div className="text-3xl font-black text-primary">
                  <CountUp end={1480} prefix="₹" duration={1.6} separator="," />
                </div>
                <p className="text-xs text-text-muted mt-0.5">Estimated student budget saved this week</p>
              </div>

              <div className="pt-2 border-t border-border/50">
                <div className="text-2xl font-bold text-forest">
                  <CountUp end={284.5} suffix=" kg" decimals={1} duration={1.8} />
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">Landfill waste avoided</p>
              </div>
            </div>
          </div>
        </div>

        {/* StaggerGroup Demo with 6 Sample Chips & Replay */}
        <div className="rounded-card border border-border bg-card p-6 space-y-4 shadow-elevation-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="font-heading font-bold text-sm">StaggerGroup & StaggerItem Entrance</h4>
              <p className="text-xs text-text-muted mt-0.5">
                6 sample chips staggering in with 80ms sequential cascade & spring physics
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-8 gap-1.5 font-semibold text-primary border-primary/40 hover:bg-primary/10"
              onClick={() => setStaggerKey((k) => k + 1)}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Replay Animation</span>
            </Button>
          </div>

          <StaggerGroup key={staggerKey} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
            {[
              { id: '1', title: 'Arduino Uno R3 Kit', category: 'Hardware', condition: 'Like New', dept: 'COMP' },
              { id: '2', title: 'Engineering Mechanics', category: 'Textbook', condition: 'Good', dept: 'MECH' },
              { id: '3', title: 'Mini Drafter & T-Square', category: 'Drafting', condition: 'Like New', dept: 'CIVIL' },
              { id: '4', title: 'Pure Cotton Lab Apron', category: 'Apparel', condition: 'Good', dept: 'APPLIED' },
              { id: '5', title: 'Raspberry Pi 4 (4GB)', category: 'Hardware', condition: 'Fair', dept: 'IT' },
              { id: '6', title: '60W Soldering Station', category: 'Tools', condition: 'Like New', dept: 'EXTC' },
            ].map((chip) => (
              <StaggerItem key={chip.id}>
                <div className="rounded-card border border-border bg-surface p-3 space-y-2 hover:border-primary/60 transition-all shadow-xs flex flex-col justify-between h-full group hover:shadow-elevation-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-wider text-primary">
                      {chip.category}
                    </span>
                    <span className="font-semibold text-text-muted bg-surface-raised px-1 py-0.2 rounded text-[9px]">
                      {chip.dept}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {chip.title}
                  </div>

                  <div className="pt-1.5 border-t border-border/40 flex items-center justify-between text-[10px]">
                    <Badge variant="success" className="text-[9px] px-1.5 py-0">
                      {chip.condition}
                    </Badge>
                    <span className="font-bold text-primary">Free</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </div>
  )
}
