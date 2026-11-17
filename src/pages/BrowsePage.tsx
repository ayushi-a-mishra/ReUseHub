import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { mockStore } from '@/lib/mockStore'
import { Item, Category, Department } from '@/types'
import { ItemCard } from '@/features/items/components/ItemCard'
import { WishlistModal } from '@/features/items/components/WishlistModal'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import { campusConfig } from '@/config/campus'
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  PackageOpen,
  PlusCircle,
  Filter,
  Heart,
  LayoutGrid,
  List,
  Sparkles,
  MapPin,
  Building,
} from 'lucide-react'

const PAGE_SIZE = 12

const QUICK_SEARCH_PILLS = [
  'Arduino',
  'Textbook',
  'Calculus',
  'Lab Coat',
  'Drawing Board',
  'Multimeter',
  'Desk Lamp',
]

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || 'all'

  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter States
  const [search, setSearch] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedCondition, setSelectedCondition] = useState<string>('all')
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'title' | 'impact' | 'quantity'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      setItems(mockStore.getItems())
      setCategories(mockStore.getCategories())
      setDepartments(mockStore.getDepartments())
      setIsLoading(false)
    }
    update()
    return mockStore.subscribe(update)
  }, [])

  // Sync category param
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setSelectedCategory(cat)
    const q = searchParams.get('q')
    if (q) setSearch(q)
  }, [searchParams])

  // Filter and Sort Pipeline
  const filteredItems = useMemo(() => {
    let result = [...items]

    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.pickup_location.toLowerCase().includes(q) ||
          i.department?.name.toLowerCase().includes(q) ||
          i.category?.name.toLowerCase().includes(q)
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((i) => i.category?.slug === selectedCategory)
    }

    // Department filter
    if (selectedDepartment !== 'all') {
      result = result.filter((i) => i.department_id === selectedDepartment)
    }

    // Condition filter
    if (selectedCondition !== 'all') {
      result = result.filter((i) => i.condition === selectedCondition)
    }

    // Pickup Point filter
    if (selectedPickupPoint !== 'all') {
      result = result.filter((i) =>
        i.pickup_location.toLowerCase().includes(selectedPickupPoint.toLowerCase())
      )
    }

    // Status filter
    if (selectedStatus !== 'all') {
      result = result.filter((i) => i.status === selectedStatus)
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      }
      if (sortBy === 'quantity') {
        return b.quantity - a.quantity
      }
      if (sortBy === 'impact') {
        const aKg = (a.category?.avg_weight_kg || 1) * a.quantity
        const bKg = (b.category?.avg_weight_kg || 1) * b.quantity
        return bKg - aKg
      }
      return 0
    })

    return result
  }, [
    items,
    search,
    selectedCategory,
    selectedDepartment,
    selectedCondition,
    selectedPickupPoint,
    selectedStatus,
    sortBy,
  ])

  const visibleItems = filteredItems.slice(0, visibleCount)
  const hasMore = visibleCount < filteredItems.length

  const handleClearAllFilters = () => {
    setSearch('')
    setSelectedCategory('all')
    setSelectedDepartment('all')
    setSelectedCondition('all')
    setSelectedPickupPoint('all')
    setSelectedStatus('all')
    setSortBy('newest')
    setSearchParams({})
  }

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedDepartment !== 'all' ? 1 : 0) +
    (selectedCondition !== 'all' ? 1 : 0) +
    (selectedPickupPoint !== 'all' ? 1 : 0) +
    (selectedStatus !== 'all' ? 1 : 0) +
    (search.trim() ? 1 : 0)

  return (
    <div className="container py-8 pb-28 space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Zero-Currency Exchange · {campusConfig.shortName}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Explore Campus Materials
          </h1>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 max-w-2xl">
            Discover peer-listed textbooks, lab equipment, components, and dorm essentials across {campusConfig.name}.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            onClick={() => setIsWishlistOpen(true)}
            className="gap-2 text-xs font-medium"
          >
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500/20" />
            <span className="hidden sm:inline">Wishlist Alerts</span>
            <span className="sm:hidden">Alerts</span>
          </Button>
          <Link to="/add-item">
            <Button className="gap-2 text-xs font-semibold shadow-sm">
              <PlusCircle className="h-4 w-4" />
              <span>List an Item</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Sticky Filter & Search Bar */}
      <div className="sticky top-16 z-20 -mx-4 px-4 py-3 bg-background/90 backdrop-blur-xl border-y border-border/60 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="h-4 w-4 absolute left-3.5 top-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search textbooks, Arduino, lamps, drafting..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-9 h-11 bg-card text-xs sm:text-sm shadow-xs"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls: Sort, Filter Drawer, View Mode */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              {/* Sort Dropdown */}
              <div className="shrink-0">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-11 text-xs w-36 sm:w-40 bg-card"
                >
                  <option value="newest">Recently Listed</option>
                  <option value="title">Alphabetical (A-Z)</option>
                  <option value="impact">Highest Impact (kg)</option>
                  <option value="quantity">Largest Quantity</option>
                </Select>
              </div>

              {/* Filter Drawer Toggle */}
              <Button
                variant={isFilterDrawerOpen || activeFilterCount > 0 ? 'default' : 'outline'}
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                className="h-11 px-3 text-xs gap-1.5 shrink-0"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary text-[10px] font-bold ml-1">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {/* View Toggle (Grid / List) */}
              <div className="flex items-center border border-border rounded-xl bg-card p-1 shadow-xs shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  aria-label="List view"
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Search Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-muted-foreground shrink-0 font-medium mr-1">Popular:</span>
            {QUICK_SEARCH_PILLS.map((pill) => (
              <button
                key={pill}
                onClick={() => setSearch(pill)}
                className="rounded-full px-2.5 py-0.5 border border-border/80 bg-card hover:bg-primary/10 hover:border-primary/40 hover:text-primary text-muted-foreground font-medium transition-colors whitespace-nowrap shrink-0"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Category Horizontal Snap Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSearchParams(search ? { q: search } : {})
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-card border border-border text-slate-700 dark:text-slate-300 hover:border-primary/40 hover:text-foreground'
              }`}
            >
              All Materials ({items.length})
            </button>
            {categories.map((cat) => {
              const count = items.filter((i) => i.category_id === cat.id).length
              const isSelected = selectedCategory === cat.slug
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug)
                    setSearchParams(search ? { q: search, category: cat.slug } : { category: cat.slug })
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-card border border-border text-slate-700 dark:text-slate-300 hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Collapsible Filter Panel */}
      {isFilterDrawerOpen && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-primary" />
              Filter Materials
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block flex items-center gap-1">
                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                Department
              </label>
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="text-xs"
              >
                <option value="all">All Departments ({departments.length})</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Pickup Location
              </label>
              <Select
                value={selectedPickupPoint}
                onChange={(e) => setSelectedPickupPoint(e.target.value)}
                className="text-xs"
              >
                <option value="all">All Campus Locations</option>
                {campusConfig.pickupPoints.map((pp) => (
                  <option key={pp.id} value={pp.name}>
                    {pp.name} ({pp.building})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Condition</label>
              <Select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="text-xs"
              >
                <option value="all">Any Condition</option>
                <option value="new">Brand New</option>
                <option value="like_new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Availability</label>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs"
              >
                <option value="all">All Listings</option>
                <option value="available">Available Now</option>
                <option value="requested">Requested / In Review</option>
                <option value="reused">Reused (Archived)</option>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Pills Bar */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-muted-foreground font-medium">Applied filters:</span>
          {search.trim() && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold">
              Query: "{search}"
              <button onClick={() => setSearch('')} className="hover:text-primary-focus">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border text-foreground font-medium">
              Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-primary">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedDepartment !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border text-foreground font-medium">
              Dept: {departments.find((d) => d.id === selectedDepartment)?.code || selectedDepartment}
              <button onClick={() => setSelectedDepartment('all')} className="hover:text-primary">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedPickupPoint !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border text-foreground font-medium">
              Pickup: {selectedPickupPoint}
              <button onClick={() => setSelectedPickupPoint('all')} className="hover:text-primary">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedCondition !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border text-foreground font-medium">
              Condition: {selectedCondition}
              <button onClick={() => setSelectedCondition('all')} className="hover:text-primary">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedStatus !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted border border-border text-foreground font-medium">
              Status: {selectedStatus}
              <button onClick={() => setSelectedStatus('all')} className="hover:text-primary">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleClearAllFilters}
            className="text-xs text-primary hover:underline font-semibold ml-1"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results Meta */}
      <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-medium">
        <span>
          Showing <strong className="text-foreground">{visibleItems.length}</strong> of{' '}
          <strong className="text-foreground">{filteredItems.length}</strong> campus materials
        </span>
      </div>

      {/* Items Grid/List or Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-border p-4 space-y-3">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="h-16 w-16 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mx-auto">
            <PackageOpen className="h-8 w-8 opacity-60" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              No campus materials match your criteria
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              Try adjusting your search terms, clearing active filters, or list this material yourself to help a fellow student.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={handleClearAllFilters}>
              Reset Filters
            </Button>
            <Link to="/add-item">
              <Button size="sm">List New Material</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {visibleItems.map((item) => (
                <ItemCard key={item.id} item={item} layout="grid" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {visibleItems.map((item) => (
                <ItemCard key={item.id} item={item} layout="list" />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="font-medium text-xs px-8"
              >
                Load More Materials ({filteredItems.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </div>
  )
}
