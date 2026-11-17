import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { mockStore } from '@/lib/mockStore'
import { campusConfig } from '@/config/campus'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { useToast } from '@/shared/ui/toast'
import {
  HelpCircle,
  Search,
  ChevronDown,
  ShieldAlert,
  MapPin,
  Clock,
  Mail,
  Send,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCheck2,
  Sparkles,
  HeartHandshake,
  Lock,
  PhoneCall,
  X,
} from 'lucide-react'

const ticketSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid campus email'),
  topic: z.string().min(1, 'Please select a topic'),
  isUrgent: z.boolean().default(false),
  message: z.string().min(15, 'Please provide at least 15 characters describing your inquiry'),
})

type TicketFormData = z.infer<typeof ticketSchema>

const FAQ_CATEGORIES = [
  'All',
  'General',
  'Giving Items',
  'Receiving Items',
  'Safety & Policies',
  'Impact & Badges',
] as const

export function SupportPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const faqs = mockStore.getFAQs()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-01')
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      name: user?.full_name || '',
      email: user?.email || '',
      topic: 'Campus Pickup Spot Suggestion',
      isUrgent: false,
      message: '',
    },
  })

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'All' || faq.category.toLowerCase() === selectedCategory.toLowerCase()
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [faqs, selectedCategory, searchQuery])

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id))
  }

  const onSubmitTicket = (data: TicketFormData) => {
    setIsSubmitting(true)
    setTimeout(() => {
      try {
        const newMsg = mockStore.addContactMessage({
          name: data.name,
          email: data.email,
          topic: data.isUrgent ? `[URGENT] ${data.topic}` : data.topic,
          message: data.message,
        })
        setSubmittedTicketId(newMsg.id)
        toast({
          title: 'Ticket Submitted! 🎫',
          description: `Support inquiry registered as #${newMsg.id}. The Sustainability Cell will respond shortly.`,
          type: 'success',
        })
        reset()
      } catch (err) {
        console.error(err)
        toast({
          title: 'Submission Failed',
          description: 'Could not send message. Please try again.',
          type: 'error',
        })
      } finally {
        setIsSubmitting(false)
      }
    }, 400)
  }

  return (
    <div className="container py-8 max-w-6xl space-y-12 pb-24 sm:pb-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="default" className="gap-1.5 font-bold tracking-wide">
          <HelpCircle className="h-3.5 w-3.5 text-accent" />
          <span>Campus Safety & Support Center</span>
        </Badge>
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
          How Can We Help You?
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Official circular exchange policies, verified campus handover points, community rules, and direct assistance for {campusConfig.name}.
        </p>
      </div>

      {/* Campus Office & Physical Verification Nodes Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 sm:p-6 shadow-card border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 space-y-3">
          <div className="flex items-center gap-2.5 text-primary">
            <Building2 className="h-5 w-5" />
            <span className="font-heading font-bold text-sm text-foreground">Physical Office</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {campusConfig.officeAddress}
          </p>
          <div className="pt-2 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">IDEA Lab-1 & Dept. of IT</span>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 shadow-card border-emerald-500/20 bg-gradient-to-br from-card via-card to-emerald-500/5 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
            <Clock className="h-5 w-5" />
            <span className="font-heading font-bold text-sm text-foreground">Support Hours</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {campusConfig.officeHours}
          </p>
          <div className="pt-2 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{campusConfig.supportEmail}</span>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 shadow-card border-amber-500/20 bg-gradient-to-br from-card via-card to-amber-500/5 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
            <PhoneCall className="h-5 w-5" />
            <span className="font-heading font-bold text-sm text-foreground">Security Intercom</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Campus Main Security Desk: Ext. 4022 (Gate #1) · CCTV Monitored Exchange Hub
          </p>
          <div className="pt-2 border-t border-border/40 flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>24x7 Security Patrol</span>
          </div>
        </Card>
      </div>

      {/* Prohibited Materials Callout Banner */}
      <Card className="p-5 sm:p-6 border-red-500/30 bg-red-500/5 shadow-card space-y-3">
        <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <h2 className="font-heading text-base font-bold text-foreground">
            Strictly Prohibited Items & Safety Restrictions
          </h2>
          <Badge variant="destructive" className="ml-auto text-[10px]">Zero Tolerance</Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          To maintain a safe, trusted, and compliant collegiate environment at {campusConfig.shortName}, the following items are strictly forbidden from being listed or exchanged:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-card border border-red-500/15">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <span>Hazardous lab chemicals, toxic solvents, or volatile reagents.</span>
          </div>
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-card border border-red-500/15">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <span>Damaged lithium batteries or exposed bare-wire power supplies.</span>
          </div>
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-card border border-red-500/15">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <span>Commercial merchant goods, monetized sales, or cash transactions.</span>
          </div>
        </div>
      </Card>

      {/* Searchable FAQs Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                  Frequently Asked Questions
                </h2>
                <Badge variant="outline" className="text-xs font-bold text-primary border-primary/30">
                  {filteredFaqs.length} Q&amp;As
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Everything you need to know about listing, requesting, and zero-currency handovers
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions or keywords…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-muted/60 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/70 text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <Card className="p-8 text-center space-y-2 border-dashed">
              <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-foreground">No matching questions found</p>
              <p className="text-xs text-muted-foreground">
                Try searching with different terms or submit a ticket below.
              </p>
            </Card>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id
              return (
                <Card
                  key={faq.id}
                  className="shadow-card border-border/80 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                      <span className="font-heading text-sm sm:text-base font-bold text-foreground">
                        {faq.question}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className="hidden sm:inline-flex text-[10px]">
                        {faq.category}
                      </Badge>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                          isExpanded ? 'rotate-180 text-primary' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 bg-muted/10">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </Card>
              )
            })
          )}
        </div>
      </div>

      {/* Support & Moderation Ticket Submission Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        <div className="lg:col-span-5 space-y-4">
          <Badge variant="outline" className="text-primary border-primary/30">
            Direct Helpdesk
          </Badge>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Contact Support & Moderation
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Have a question not covered in the FAQ? Need to report an issue or suggest a new physical pickup locker? Send a direct dispatch to the Sustainability Cell and IDEA Lab-1 team.
          </p>

          <Card className="p-4 space-y-3 bg-muted/40 border-border/60">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <FileCheck2 className="h-4 w-4 text-primary" />
              <span>Response Commitment</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Inquiries submitted during campus operating hours are reviewed within 4 hours by the faculty coordinator or peer moderation team.
            </p>
          </Card>
        </div>

        <Card className="lg:col-span-7 p-6 shadow-card border-primary/20">
          {submittedTicketId ? (
            <div className="text-center py-8 space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Inquiry Successfully Logged!
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Your support ticket <strong className="text-foreground">#{submittedTicketId}</strong> has been assigned to the campus helpdesk. We will reply to your registered campus email.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(submittedTicketId)
                    toast({
                      title: 'Copied!',
                      description: `Ticket ID #${submittedTicketId} copied to clipboard.`,
                      type: 'info',
                    })
                  }}
                  className="text-xs"
                >
                  Copy Ticket ID
                </Button>
                <Button
                  size="sm"
                  onClick={() => setSubmittedTicketId(null)}
                  className="text-xs font-bold"
                >
                  Submit Another Inquiry
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitTicket)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Full Name</label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.name && <p className="text-[10px] text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Campus Email</label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder={`e.g. roll@${campusConfig.emailDomain}`}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {errors.email && <p className="text-[10px] text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Topic Category</label>
                  <select
                    {...register('topic')}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Campus Pickup Spot Suggestion">Campus Pickup Spot Suggestion</option>
                    <option value="Handover Conduct Concern">Handover Conduct Concern</option>
                    <option value="Listing Inaccuracy / Report">Listing Inaccuracy / Report</option>
                    <option value="Bulk Department Donation">Bulk Department Donation</option>
                    <option value="Technical Bug or Glitch">Technical Bug or Glitch</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isUrgent"
                    {...register('isUrgent')}
                    className="h-4 w-4 rounded border-border text-primary accent-primary"
                  />
                  <label htmlFor="isUrgent" className="text-xs font-medium text-foreground cursor-pointer">
                    Flag as Urgent Safety / Moderation
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Detailed Description</label>
                <textarea
                  rows={4}
                  {...register('message')}
                  placeholder="Explain your question or incident in detail (pickup spot, item title, or specific concern)…"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
                {errors.message && <p className="text-[10px] text-destructive">{errors.message.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full gap-2 text-xs font-bold h-10 shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Logging Ticket…' : 'Submit Support Ticket'}</span>
              </Button>
            </form>
          )}
        </Card>
      </div>

      {/* Community Circularity Code of Conduct Pledge */}
      <Card className="p-6 bg-gradient-to-r from-emerald-950/10 via-primary/5 to-accent/5 border-primary/20 shadow-card space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <HeartHandshake className="h-5 w-5" />
          <h2 className="font-heading text-base font-bold text-foreground">
            The {campusConfig.shortName} Circularity Pledge
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-card/80 border border-border/60 space-y-1">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Honest Listings
            </span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Accurately describe item conditions and photograph any real flaws or missing accessories.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-card/80 border border-border/60 space-y-1">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Punctual Meetups
            </span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Arrive on time at designated campus pickup points and notify your peer if delayed.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-card/80 border border-border/60 space-y-1">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              Zero Money Exchanged
            </span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Never request, offer, or accept currency. Keep circular exchange free and accessible for all.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-card/80 border border-border/60 space-y-1">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              Caring Handover
            </span>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Treat shared materials with respect so they may serve many collegiate cohorts to come.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
