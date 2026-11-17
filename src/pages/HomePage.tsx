import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { campusConfig } from '@/config/campus'
import { mockStore } from '@/lib/mockStore'
import { Item, Category } from '@/types'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { CountUp } from '@/shared/motion/CountUp'
import { Skeleton } from '@/shared/motion/Skeleton'
import { Preloader } from '@/shared/motion/Preloader'
import { HeroFloatingCluster } from '@/features/landing/components/HeroFloatingCluster'
import { PinnedStorySection } from '@/features/landing/components/PinnedStorySection'
import { InfiniteMarquee } from '@/features/landing/components/InfiniteMarquee'
import { LiveActivityTicker } from '@/features/landing/components/LiveActivityTicker'
import {
  Recycle,
  Sparkles,
  Search,
  ArrowRight,
  Leaf,
  MapPin,
  ChevronRight,
  BookOpen,
  Cpu,
  X,
} from 'lucide-react'

const SEARCH_PLACEHOLDERS = [
  'Search books, Arduino, lamps…',
  'Search calculators, drafter…',
  'Search ESP32, textbooks…',
  'Search monitors, chair…',
  'Search badminton, lab coat…',
]

export function HomePage() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  const [isLoading, setIsLoading] = useState(true)
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [impact, setImpact] = useState(mockStore.getImpactMetrics())
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const chipsScrollRef = useRef<HTMLDivElement>(null)
  const activeChipRef = useRef<HTMLButtonElement>(null)

  // Rotating placeholder effect every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // Subscribe to mock data
  useEffect(() => {
    const update = () => {
      setItems(mockStore.getItems())
      setCategories(mockStore.getCategories())
      setImpact(mockStore.getImpactMetrics())
      setIsLoading(false)
    }
    update()
    return mockStore.subscribe(update)
  }, [])

  // Auto-scroll active category chip into view
  useEffect(() => {
    if (activeChipRef.current) {
      activeChipRef.current.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [selectedCategory, shouldReduceMotion])

  const availableItems = items.filter((i) => i.status === 'available')
  const filteredItems = availableItems.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category?.slug === selectedCategory
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pickup_location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  // 5 "Just Listed" items for the top viewport carousel
  const justListedItems = availableItems.slice(0, 5)

  // Per-word headline tokens
  const headlineWords = [
    { text: 'Give', isHighlight: false },
    { text: 'campus', isHighlight: false },
    { text: 'materials', isHighlight: false },
    { text: 'a', isHighlight: true },
    { text: 'second', isHighlight: true },
    { text: 'life.', isHighlight: true },
  ]

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      <Preloader />

      {/* HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 pb-6 overflow-hidden">
        {/* Floating Background Particles (Leaves, Books, Chips) with gentle drift and zero text collision */}
        {!shouldReduceMotion && (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
            {/* Far Left Leaf */}
            <motion.div
              animate={{
                y: [0, -14, 0],
                x: [0, 6, 0],
                rotate: [0, 8, -6, 0],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-6 -left-1 sm:left-[6%] text-primary/15 sm:text-primary/20"
            >
              <Leaf className="h-7 w-7 sm:h-9 sm:w-9" />
            </motion.div>

            {/* Far Right Book */}
            <motion.div
              animate={{
                y: [0, -18, 0],
                x: [0, -8, 0],
                rotate: [0, -10, 8, 0],
              }}
              transition={{ duration: 8.5, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-12 -right-1 sm:right-[7%] text-accent/15 sm:text-accent/20"
            >
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />
            </motion.div>

            {/* Mid Left CPU */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                x: [0, 5, 0],
                rotate: [0, 6, -5, 0],
              }}
              transition={{ duration: 6.5, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden sm:block absolute top-48 left-[12%] text-emerald-500/15"
            >
              <Cpu className="h-6 w-6" />
            </motion.div>

            {/* Mid Right Sparkle */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                x: [0, -6, 0],
              }}
              transition={{ duration: 9, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden sm:block absolute top-44 right-[14%] text-amber-500/15"
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
          </div>
        )}

        <div className="container relative z-10 max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Headline, Search, Chips, Counters */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-5">
              {/* Badge pill: shortened to "SLRTCE • Campus Circular Economy" with small animated leaf */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-green-800 dark:text-green-300 backdrop-blur-sm whitespace-nowrap shadow-elevation-1"
              >
                <Leaf className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span>{campusConfig.shortName} &bull; Campus Circular Economy</span>
              </motion.div>

              {/* Main Title: text-wrap balance + per-word masked reveal animation */}
              <h1
                style={{ textWrap: 'balance' }}
                className="font-heading text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]"
              >
                {headlineWords.map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden mr-1.5 sm:mr-2 align-bottom">
                    <motion.span
                      initial={shouldReduceMotion ? false : { y: '100%', opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.45,
                        delay: i * 0.07,
                        ease: [0.2, 0, 0, 1],
                      }}
                      className={`inline-block ${
                        word.isHighlight
                          ? 'bg-gradient-to-r from-primary via-emerald-600 to-teal-600 bg-clip-text text-transparent font-black'
                          : ''
                      }`}
                    >
                      {word.text}
                    </motion.span>
                  </span>
                ))}
              </h1>

              {/* Subtitle with High Contrast WCAG AA (text-slate-700 / dark:text-slate-200) */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-sm sm:text-base lg:text-lg text-slate-700 dark:text-slate-200 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Pass down textbooks, lab hardware, dorm essentials, and electronics to peers.{' '}
                <strong className="font-semibold text-slate-900 dark:text-white">Zero money involved.</strong>{' '}
                Verified campus handovers only.
              </motion.p>

              {/* Search Bar with Rotating Placeholder & Clear Action */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="max-w-xl mx-auto lg:mx-0 pt-1"
              >
                <div className="relative flex items-center rounded-button border border-border/90 bg-card p-1 shadow-elevation-1 focus-within:shadow-elevation-2 focus-within:border-primary transition-all">
                  <Search className="h-4 w-4 text-text-muted ml-3 shrink-0" />
                  <input
                    type="text"
                    placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        navigate(`/browse?q=${encodeURIComponent(searchQuery)}`)
                      }
                    }}
                    className="w-full bg-transparent px-2.5 py-2 text-xs sm:text-sm text-foreground placeholder:text-text-muted focus:outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-full text-text-muted hover:text-foreground hover:bg-muted transition-colors mr-1"
                      aria-label="Clear search query"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => navigate(`/browse?q=${encodeURIComponent(searchQuery)}`)}
                    className="rounded-button px-3.5 sm:px-4 shrink-0 text-xs font-semibold h-8"
                  >
                    Search
                  </Button>
                </div>
              </motion.div>

              {/* Horizontally Scrollable Category Chips (Snap scrolling + fade edges) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="relative max-w-xl mx-auto lg:mx-0 pt-1"
              >
                {/* Fade edge masks */}
                <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />

                <div
                  ref={chipsScrollRef}
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-4 pr-8 py-1.5"
                >
                  <button
                    ref={selectedCategory === 'all' ? activeChipRef : null}
                    onClick={() => setSelectedCategory('all')}
                    className={`relative snap-start shrink-0 min-h-[38px] rounded-full px-4 py-2 text-xs font-semibold transition-all duration-120 active:scale-95 ${
                      selectedCategory === 'all'
                        ? 'text-white'
                        : 'bg-card border border-border/80 text-text-muted hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    {selectedCategory === 'all' && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 rounded-full bg-primary shadow-sm"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">All Items ({availableItems.length})</span>
                  </button>

                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.slug
                    return (
                      <button
                        key={cat.id}
                        ref={isSelected ? activeChipRef : null}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`relative snap-start shrink-0 min-h-[38px] rounded-full px-4 py-2 text-xs font-semibold transition-all duration-120 active:scale-95 ${
                          isSelected
                            ? 'text-white'
                            : 'bg-card border border-border/80 text-text-muted hover:border-primary/50 hover:text-foreground'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="activeCategoryPill"
                            className="absolute inset-0 rounded-full bg-primary shadow-sm"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{cat.name}</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>

              {/* THREE LIVE IMPACT COUNTERS */}
              <div className="pt-2">
                {isLoading ? (
                  <div className="grid grid-cols-3 gap-2.5 max-w-xl mx-auto lg:mx-0">
                    <Skeleton className="h-16 rounded-card" />
                    <Skeleton className="h-16 rounded-card" />
                    <Skeleton className="h-16 rounded-card" />
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto lg:mx-0 rounded-card border border-green-200/60 dark:border-green-900/40 bg-surface/85 backdrop-blur-md p-2.5 sm:p-3 shadow-elevation-1"
                  >
                    <div className="flex flex-col items-center justify-center p-1 border-r border-border/60">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                        <Recycle className="h-3 w-3" />
                        <span>Reused</span>
                      </div>
                      <div className="font-heading text-lg sm:text-2xl font-black text-foreground">
                        <CountUp end={impact.total_items_reused} duration={1.5} />
                      </div>
                      <span className="text-[10px] text-text-muted">items</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-1 border-r border-border/60">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <Leaf className="h-3 w-3" />
                        <span>Diverted</span>
                      </div>
                      <div className="font-heading text-lg sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">
                        <CountUp end={impact.total_kg_waste_avoided} decimals={1} suffix=" kg" duration={1.8} />
                      </div>
                      <span className="text-[10px] text-text-muted">waste</span>
                    </div>

                    <div className="flex flex-col items-center justify-center p-1">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-accent">
                        <Sparkles className="h-3 w-3" />
                        <span>Saved</span>
                      </div>
                      <div className="font-heading text-lg sm:text-2xl font-black text-accent">
                        <CountUp end={impact.total_inr_saved} prefix="₹" separator="," duration={2.0} />
                      </div>
                      <span className="text-[10px] text-text-muted">student funds</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* HORIZONTALLY SWIPEABLE "JUST LISTED" CAROUSEL (< lg ONLY) */}
              <div className="lg:hidden pt-4 text-left space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Just Listed on Campus
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                    <span>Swipe</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>

                {isLoading ? (
                  <div className="flex gap-3 overflow-hidden px-1">
                    {[1, 2, 3].map((s) => (
                      <Skeleton key={s} className="h-56 w-[220px] shrink-0 rounded-card" />
                    ))}
                  </div>
                ) : (
                  <div className="relative -mx-4 px-4">
                    <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 pt-1">
                      {justListedItems.map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx, duration: 0.35 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                          onClick={() => navigate(`/items/${item.id}`)}
                          className="snap-start shrink-0 w-[220px] sm:w-[240px] cursor-pointer rounded-card border border-border/80 bg-card p-2.5 shadow-elevation-1 hover:shadow-elevation-2 hover:border-primary/40 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-surface-raised mb-2">
                              <img
                                src={item.images[0]}
                                alt={item.title}
                                onError={(e) => {
                                  ;(e.target as HTMLElement).style.display = 'none'
                                }}
                                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                              />
                              <Badge
                                variant="success"
                                className="absolute top-2 left-2 text-[9px] px-2 py-0.2 uppercase font-bold shadow-xs backdrop-blur-md bg-card/90"
                              >
                                {item.condition.replace('_', ' ')}
                              </Badge>
                              <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs">
                                {item.department?.code || 'CAMPUS'}
                              </span>
                            </div>

                            <h4 className="font-heading text-xs font-bold line-clamp-2 text-foreground leading-tight">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-text-muted flex items-center gap-1 mt-1 truncate">
                              <MapPin className="h-3 w-3 shrink-0 text-primary" />
                              <span className="truncate">{item.pickup_location}</span>
                            </p>
                          </div>

                          <div className="pt-2 border-t border-border/50 mt-2 flex items-center justify-between">
                            <span className="text-[10px] text-text-muted font-medium">Free reuse</span>
                            <Button
                              size="sm"
                              className="h-7 px-2.5 text-[10px] font-bold rounded-lg"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/items/${item.id}`)
                              }}
                            >
                              Request
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Desktop Floating Cluster (>= lg) */}
            <div className="hidden lg:block lg:col-span-5">
              <HeroFloatingCluster items={availableItems} />
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 2: REALTIME CAMPUS ACTIVITY STREAM */}
      <LiveActivityTicker />

      {/* PHASE 2: DUAL RIBBON CATEGORY MARQUEE */}
      <InfiniteMarquee />

      {/* PHASE 2: PINNED 5-STEP CIRCULAR STORY LINE */}
      <PinnedStorySection />

      {/* REST OF DISCOVERY GRID */}
      <section className="container max-w-5xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
              {selectedCategory === 'all'
                ? 'All Available Campus Gear'
                : categories.find((c) => c.slug === selectedCategory)?.name || 'Materials'}
            </h2>
            <p className="text-xs text-text-muted">
              {filteredItems.length} active usable items ready for immediate campus handover
            </p>
          </div>

          <Link to="/browse">
            <Button variant="outline" size="sm" className="text-xs gap-1">
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {filteredItems.length === 0 ? (
          <div className="rounded-card border border-dashed border-border p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-heading font-bold text-base">No matching items found</h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Be the first to list usable components or textbooks in this category!
            </p>
            <Button onClick={() => navigate('/add-item')} size="sm" variant="accent">
              List an Item Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/items/${item.id}`)}
                className="cursor-pointer rounded-card border border-border/80 bg-card overflow-hidden shadow-elevation-1 hover:shadow-elevation-2 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-raised">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <Badge variant="success" className="absolute top-1.5 left-1.5 text-[8px] sm:text-[10px] px-1.5 py-0.2 uppercase font-bold shadow-xs">
                      {item.condition.replace('_', ' ')}
                    </Badge>
                    <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1 py-0.2 text-[8px] sm:text-[9px] font-bold text-white backdrop-blur-xs">
                      {item.department?.code || 'CAMPUS'}
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3.5 space-y-1">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-primary">
                      {item.category?.name}
                    </span>
                    <h3 className="font-heading text-xs sm:text-sm font-bold line-clamp-2 text-foreground leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-text-muted line-clamp-2 leading-relaxed hidden sm:block">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3.5 pt-0 border-t border-border/40 flex items-center justify-between text-[11px] sm:text-xs text-text-muted">
                  <span className="flex items-center gap-1 truncate max-w-[95px] sm:max-w-[140px]">
                    <MapPin className="h-3 w-3 shrink-0 text-primary" />
                    <span className="truncate">{item.pickup_location}</span>
                  </span>
                  <span className="font-semibold text-primary text-[11px] sm:text-xs">Free</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
