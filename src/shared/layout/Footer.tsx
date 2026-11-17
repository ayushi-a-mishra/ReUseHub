import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Recycle, Heart, ShieldCheck, Leaf, Send, CheckCircle2 } from 'lucide-react'
import { campusConfig } from '@/config/campus'
import { Button } from '@/shared/ui/button'

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail) return
    const current = JSON.parse(localStorage.getItem('reusehub_newsletter') || '[]')
    current.push({ email: newsletterEmail, subscribed_at: new Date().toISOString() })
    localStorage.setItem('reusehub_newsletter', JSON.stringify(current))
    setNewsletterSubscribed(true)
    setNewsletterEmail('')
  }

  return (
    <footer className="border-t border-border/80 bg-card/70 backdrop-blur-md pt-12 pb-24 md:pb-12 text-sm text-text-muted transition-colors">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-5">
        {/* Brand & Mission Col */}
        <div className="md:col-span-2 space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-button bg-primary text-white shadow-elevation-1">
              <Recycle className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading text-base font-bold text-foreground">
                ReUse<span className="text-primary">Hub</span>
              </span>
              <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                @{campusConfig.shortName}
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed max-w-sm">
            Empowering students, faculty, and academic labs of {campusConfig.name} to recirculate usable textbooks, electronics, components, and dorm gear. Zero currency, 100% circular impact.
          </p>

          <div className="rounded-card border border-border/80 bg-surface-raised/50 p-3 text-xs space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-primary" />
              <span>{campusConfig.sponsoringLab} &bull; {campusConfig.departmentName}</span>
            </div>
            <p className="text-[11px] text-text-muted">
              Theme: <strong className="text-foreground font-medium">"{campusConfig.theme}"</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-foreground pt-1">
            <span className="flex items-center gap-1 text-primary">
              <Leaf className="h-3.5 w-3.5" /> Zero Waste Campus
            </span>
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="h-3.5 w-3.5" /> ID Verified Peer Handover
            </span>
          </div>
        </div>

        {/* Platform Navigation */}
        <div>
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground mb-3">
            Platform
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/browse" className="hover:text-primary transition-colors">
                Browse Campus Materials
              </Link>
            </li>
            <li>
              <Link to="/impact" className="hover:text-primary transition-colors">
                Environmental & Cost Impact
              </Link>
            </li>
            <li>
              <Link to="/requests" className="hover:text-primary transition-colors">
                My Requests & Handovers
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-primary transition-colors">
                How Circular Handover Works
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">
                About IDEA Lab-1 Initiative
              </Link>
            </li>
            <li>
              <Link to="/design-system" className="hover:text-primary transition-colors text-primary font-medium">
                Design System Showcase
              </Link>
            </li>
          </ul>
        </div>

        {/* Help & Guidelines */}
        <div>
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground mb-3">
            Support & Safety
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/support" className="hover:text-primary transition-colors">
                Campus FAQs & Helpdesk
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-primary transition-colors">
                Community Guidelines & Safety
              </Link>
            </li>
            <li>
              <span className="text-[11px] text-text-muted block mt-2">Support Email:</span>
              <a href={`mailto:${campusConfig.supportEmail}`} className="text-primary hover:underline font-mono text-[11px]">
                {campusConfig.supportEmail}
              </a>
            </li>
            <li>
              <span className="text-[11px] text-text-muted block mt-1">Official Hours:</span>
              <span className="text-foreground text-[11px] font-medium">{campusConfig.officeHours}</span>
            </li>
          </ul>
        </div>

        {/* Newsletter & Campus Updates */}
        <div className="space-y-3">
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground mb-1">
            Eco-Digest Newsletter
          </h4>
          <p className="text-xs text-text-muted leading-relaxed">
            Bi-weekly digest of newly listed lab rigs, textbooks, and campus circularity drives.
          </p>

          {newsletterSubscribed ? (
            <div className="flex items-center gap-1.5 text-xs text-primary font-semibold py-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Subscribed successfully!</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder={`name@${campusConfig.emailDomain}`}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full rounded-input border border-input bg-surface px-3 py-2 text-xs text-foreground placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  required
                />
              </div>
              <Button type="submit" size="sm" variant="accent" className="w-full text-xs gap-1.5">
                <Send className="h-3 w-3" />
                <span>Join Circular Digest</span>
              </Button>
            </form>
          )}

          <div className="pt-2">
            <span className="text-[11px] text-text-muted">Tagline:</span>
            <p className="text-xs font-semibold text-accent italic">"{campusConfig.tagline}"</p>
          </div>
        </div>
      </div>

      <div className="container mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>&copy; {new Date().getFullYear()} {campusConfig.logoText}. All rights reserved.</p>
        <p className="flex items-center gap-1 text-text-muted">
          Crafted with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for {campusConfig.shortName} sustainability
        </p>
      </div>
    </footer>
  )
}
