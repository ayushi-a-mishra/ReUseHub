import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom'
import { mockStore } from '@/lib/mockStore'
import { Item, ItemStatus } from '@/types'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Avatar } from '@/shared/ui/avatar'
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog'
import { Textarea } from '@/shared/ui/textarea'
import { Select } from '@/shared/ui/select'
import { RoleBadge } from '@/features/auth/components/RoleBadge'
import { ItemCard } from '@/features/items/components/ItemCard'
import { useToast } from '@/shared/ui/toast'
import { formatCurrencyINR, formatWeightKg, formatDate } from '@/lib/utils'
import { campusConfig } from '@/config/campus'
import { QRCodeSVG } from 'qrcode.react'
import {
  MapPin,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Sparkles,
  Building,
  CheckCircle2,
  AlertCircle,
  Package,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  X,
  Flag,
  Clock,
  Copy,
  Check,
  Calendar,
  Layers,
  Trash2,
  CheckCircle,
} from 'lucide-react'

const CONDITION_DESCRIPTIONS: Record<string, { title: string; desc: string }> = {
  new: {
    title: 'Brand New',
    desc: 'Never used, original packaging, zero signs of wear or defects.',
  },
  like_new: {
    title: 'Like New',
    desc: 'Pre-owned but looks practically unused. No pen marks, scratches, or wear.',
  },
  good: {
    title: 'Good Condition',
    desc: 'Minor normal wear from regular semester use. Fully functional with all critical parts intact.',
  },
  fair: {
    title: 'Fair Condition',
    desc: 'Well-used with cosmetic wear, highlights, or scuffs, but 100% operational.',
  },
}

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2316a34a" opacity="0.15"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2316a34a" font-family="sans-serif" font-weight="bold" font-size="22">ReUseHub · Campus Material</text></svg>'

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { onOpenAuth } = useOutletContext<{ onOpenAuth: () => void }>()
  const { toast } = useToast()

  const [item, setItem] = useState<Item | undefined>(undefined)
  const [selectedImg, setSelectedImg] = useState<number>(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Request form state
  const [requestMessage, setRequestMessage] = useState('')
  const [preferredSlot, setPreferredSlot] = useState('Morning (9:30 AM – 12:00 PM)')
  const [pledgeChecked, setPledgeChecked] = useState(false)
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false)

  // Report form state
  const [reportReason, setReportReason] = useState('commercial')
  const [reportDetails, setReportDetails] = useState('')

  const [relatedItems, setRelatedItems] = useState<Item[]>([])

  // Lightbox keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false)
      } else if (e.key === 'ArrowLeft' && item?.images) {
        setSelectedImg((prev) => (prev > 0 ? prev - 1 : item.images.length - 1))
      } else if (e.key === 'ArrowRight' && item?.images) {
        setSelectedImg((prev) => (prev < item.images.length - 1 ? prev + 1 : 0))
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLightboxOpen, item?.images])

  useEffect(() => {
    if (id) {
      const loadItem = () => {
        const found = mockStore.getItemById(id)
        setItem(found)
        if (found) {
          const related = mockStore
            .getItems()
            .filter((i) => i.id !== found.id && i.category_id === found.category_id && i.status === 'available')
            .slice(0, 4)
          setRelatedItems(related)
        }
      }
      loadItem()
      return mockStore.subscribe(loadItem)
    }
  }, [id])

  if (!item) {
    return (
      <div className="container py-20 text-center space-y-4 max-w-md mx-auto">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <Package className="h-8 w-8" />
        </div>
        <h2 className="font-heading text-xl font-bold text-foreground">Material Not Found</h2>
        <p className="text-xs text-slate-700 dark:text-slate-300">
          This listing may have been completed, removed by the owner, or the link is invalid.
        </p>
        <Link to="/browse">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Browse</span>
          </Button>
        </Link>
      </div>
    )
  }

  const isOwner = user?.id === item.owner_id
  const conditionInfo = CONDITION_DESCRIPTIONS[item.condition] || {
    title: item.condition,
    desc: 'Functional campus material',
  }

  const estimatedKg = (item.quantity || 1) * (item.category?.avg_weight_kg || 1)
  const estimatedInr = (item.quantity || 1) * (item.category?.avg_value_inr || 500)

  // Match campus pickup point
  const matchedPickupPoint = campusConfig.pickupPoints.find(
    (pp) =>
      pp.name.toLowerCase().includes(item.pickup_location.toLowerCase()) ||
      item.pickup_location.toLowerCase().includes(pp.name.toLowerCase()) ||
      pp.id === item.pickup_point_id
  )

  const handleShare = async () => {
    const shareData = {
      title: `${item.title} on ReUseHub`,
      text: `Check out this campus material available for free reuse at ${campusConfig.shortName}: ${item.title}`,
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // Fall back to modal
      }
    }
    setIsShareModalOpen(true)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2500)
    toast({
      title: 'Link Copied',
      description: 'Material URL copied to your clipboard.',
      type: 'info',
    })
  }

  const handleOpenRequest = () => {
    if (!isAuthenticated || !user) {
      onOpenAuth()
      return
    }
    if (isOwner) {
      toast({ title: 'Notice', description: 'You cannot request your own listing', type: 'info' })
      return
    }
    setIsRequestModalOpen(true)
  }

  const handleSendRequest = () => {
    if (!user) return
    if (!pledgeChecked) {
      toast({
        title: 'Commitment Required',
        description: 'Please confirm that no money will be exchanged for this item.',
        type: 'info',
      })
      return
    }

    setIsSubmittingRequest(true)
    try {
      const fullMessage = `${requestMessage.trim() || `Hi, I am interested in reusing this for my academic coursework/projects.`}\n\n[Preferred Timeslot: ${preferredSlot}]`
      mockStore.createRequest(item.id, user, fullMessage)
      setIsRequestModalOpen(false)
      toast({
        title: 'Request Sent! 📦',
        description: 'The owner has been notified. You can coordinate handover in My Requests.',
        type: 'success',
      })
      navigate('/requests')
    } catch (err: any) {
      toast({ title: 'Request Error', description: err.message, type: 'error' })
    } finally {
      setIsSubmittingRequest(false)
    }
  }

  const handleReportSubmit = () => {
    toast({
      title: 'Report Received',
      description: `Thank you for keeping ${campusConfig.shortName} safe. Our campus moderators will review this listing shortly.`,
      type: 'info',
    })
    setIsReportModalOpen(false)
    setReportDetails('')
  }

  const handleUpdateStatus = (newStatus: ItemStatus) => {
    try {
      mockStore.updateItemStatus(item.id, newStatus)
      toast({
        title: 'Status Updated',
        description: `Listing marked as ${newStatus}.`,
        type: 'success',
      })
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, type: 'error' })
    }
  }

  const handleDeleteListing = () => {
    if (window.confirm('Are you sure you want to remove this listing from ReUseHub?')) {
      try {
        mockStore.deleteItem(item.id)
        toast({
          title: 'Listing Removed',
          description: 'Your material listing has been deleted.',
          type: 'info',
        })
        navigate('/browse')
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, type: 'error' })
      }
    }
  }

  return (
    <div className="container py-8 pb-28 max-w-6xl space-y-10">
      {/* Top Breadcrumb Nav */}
      <div className="flex items-center justify-between">
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Browse Materials</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-rose-600 hover:border-rose-300 transition-colors shadow-xs"
          >
            <Flag className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Report</span>
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-xs"
          >
            <Share2 className="h-3.5 w-3.5 text-primary" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery + Item Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border bg-slate-100 dark:bg-slate-800 shadow-card group">
            <img
              src={item.images[selectedImg] || item.images[0]}
              alt={item.title}
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
              }}
              className="h-full w-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.02]"
              onClick={() => setIsLightboxOpen(true)}
            />
            {/* Condition Pill */}
            <div className="absolute top-4 left-4">
              <span className="rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                {conditionInfo.title}
              </span>
            </div>
            {/* Status Pill */}
            <div className="absolute top-4 right-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-sm ${
                  item.status === 'available'
                    ? 'bg-emerald-600/95 backdrop-blur-md'
                    : item.status === 'reused'
                    ? 'bg-purple-600/95 backdrop-blur-md'
                    : 'bg-amber-500/95 backdrop-blur-md'
                }`}
              >
                {item.status}
              </span>
            </div>

            {/* Click to Zoom Overlay hint */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 rounded-xl bg-black/60 backdrop-blur-md text-white p-2 hover:bg-black/80 transition-colors shadow-md flex items-center gap-1.5 text-xs font-medium"
              aria-label="View Fullscreen"
            >
              <ZoomIn className="h-4 w-4" />
              <span className="hidden sm:inline">Zoom</span>
            </button>
          </div>

          {/* Thumbnails (if multiple) */}
          {item.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`relative h-20 w-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImg === idx
                      ? 'border-primary ring-2 ring-primary/20 scale-105'
                      : 'border-border/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
                    }}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Impact Banner */}
          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-4 sm:p-5 flex items-start gap-4 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading text-sm font-bold text-foreground">
                Environmental & Economic Impact
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                By recirculating this material on campus, you avoid{' '}
                <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  {formatWeightKg(estimatedKg)}
                </strong>{' '}
                of landfill municipal waste and save students approximately{' '}
                <strong className="text-accent font-semibold">{formatCurrencyINR(estimatedInr)}</strong>. Zero currency is ever exchanged.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Category & Department Header */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 mb-1.5">
                <span className="font-bold text-primary">{item.category?.name}</span>
                <span>•</span>
                <span>{item.department?.code} - {item.department?.name}</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground leading-snug">
                {item.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-1.5">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Listed {formatDate(item.created_at)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5" />
                  {item.quantity} unit(s) available
                </span>
              </div>
            </div>

            {/* Handover & Pickup Badge Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 shadow-soft">
              <div className="flex items-start gap-2.5 text-xs text-foreground font-semibold">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p>Pickup Spot: {matchedPickupPoint ? matchedPickupPoint.name : item.pickup_location}</p>
                  {matchedPickupPoint && (
                    <p className="text-[11px] font-normal text-slate-600 dark:text-slate-400 mt-0.5">
                      {matchedPickupPoint.floor}, {matchedPickupPoint.building} ({matchedPickupPoint.landmark})
                    </p>
                  )}
                </div>
              </div>

              {matchedPickupPoint && (
                <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span>Active Hours: {matchedPickupPoint.activeHours}</span>
                </div>
              )}

              <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                <Building className="h-4 w-4 text-muted-foreground shrink-0" />
                <span>Department Base: {item.department?.building}</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Designated Safe Campus Exchange Point</span>
              </div>
            </div>

            {/* Condition Explanation Box */}
            <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  Condition: {conditionInfo.title}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  Verified
                </Badge>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {conditionInfo.desc}
              </p>
            </div>

            {/* Description Notes */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Description & Notes
              </h3>
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line bg-card/60 rounded-xl p-3 border border-border/40">
                {item.description}
              </p>
            </div>

            {/* Owner Trust Card */}
            {item.owner && (
              <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Listed By Campus Peer
                  </span>
                  <RoleBadge role={item.owner.role} />
                </div>
                <div className="flex items-center gap-3">
                  <Avatar
                    src={item.owner.avatar_url}
                    fallback={item.owner.full_name}
                    size="md"
                    className="border-primary/40 ring-2 ring-primary/10"
                  />
                  <div>
                    <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      {item.owner.full_name}
                      {item.owner.is_verified && (
                        <span title="Campus ID Verified">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">{item.owner.email}</p>
                    <p className="text-[10px] text-slate-500">
                      {campusConfig.shortName} · Roll: {item.owner.roll_number || 'Enrolled'}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                  <span>Trust Score: <strong className="text-primary font-bold">{item.owner.trust_score || 98}%</strong></span>
                  <span>Campus Handovers: <strong className="text-foreground font-semibold">Verified</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Section */}
          <div className="pt-6 border-t border-border/60">
            {isOwner ? (
              <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">You own this listing</span>
                  <Badge variant="outline" className="text-[10px]">
                    Owner Controls
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(item.status === 'available' ? 'reserved' : 'available')}
                    className="text-xs"
                  >
                    {item.status === 'available' ? 'Mark Reserved' : 'Mark Available'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus('reused')}
                    className="text-xs text-purple-600 hover:text-purple-700"
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                    Mark Reused
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteListing}
                  className="w-full text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete Listing
                </Button>
              </div>
            ) : item.status === 'available' ? (
              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={handleOpenRequest}
                  className="w-full text-base font-bold shadow-md h-12"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  <span>Request This Material</span>
                </Button>
                <p className="text-center text-[11px] text-slate-600 dark:text-slate-400">
                  Zero money involved. Coordinate with peer for safe campus handover.
                </p>
              </div>
            ) : item.status === 'reused' ? (
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4 text-center space-y-1 text-purple-900 dark:text-purple-300">
                <CheckCircle2 className="h-5 w-5 mx-auto text-purple-600" />
                <p className="text-xs font-bold">Successfully Reused! 🌱</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  This item has already completed its campus handover cycle.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-center space-y-1 text-amber-900 dark:text-amber-300">
                <AlertCircle className="h-5 w-5 mx-auto text-amber-600" />
                <p className="text-xs font-bold">Request Pending / Reserved</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  An exchange is currently being coordinated with a campus peer.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Materials Section */}
      {relatedItems.length > 0 && (
        <section className="space-y-4 pt-8 border-t border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                More in {item.category?.name}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Other peer-listed materials in this campus category
              </p>
            </div>
            <Link to={`/browse?category=${item.category?.slug}`} className="text-xs text-primary font-semibold hover:underline">
              View All ({item.category?.name})
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {relatedItems.map((rel) => (
              <ItemCard key={rel.id} item={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Zoom Dialog */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Lightbox"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Top Lightbox Bar */}
          <div className="w-full flex items-center justify-between text-white max-w-5xl">
            <span className="text-sm font-semibold">
              {item.title} ({selectedImg + 1} / {item.images.length})
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Center Image with Prev / Next */}
          <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center my-4">
            <img
              src={item.images[selectedImg] || item.images[0]}
              alt={item.title}
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
              }}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {item.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImg((prev) => (prev > 0 ? prev - 1 : item.images.length - 1))}
                  className="absolute left-2 sm:-left-6 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setSelectedImg((prev) => (prev < item.images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 sm:-right-6 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all"
                  aria-label="Next Image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          {item.images.length > 1 && (
            <div className="flex gap-2 max-w-md overflow-x-auto pb-2">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`h-14 w-14 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImg === idx ? 'border-primary ring-2 ring-primary/40' : 'border-white/20 opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogHeader>
          <DialogTitle>Share Campus Material</DialogTitle>
          <DialogDescription>
            Help fellow {campusConfig.shortName} students discover this available item.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-3">
          <div className="flex justify-center p-4 bg-white rounded-2xl border border-border shadow-xs w-fit mx-auto">
            <QRCodeSVG value={window.location.href} size={160} level="M" />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={window.location.href}
              className="flex-1 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs font-mono text-foreground"
            />
            <Button size="sm" onClick={handleCopyLink} className="gap-1.5 shrink-0">
              {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Report Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-600">
            <Flag className="h-5 w-5" />
            <span>Report Material Listing</span>
          </DialogTitle>
          <DialogDescription>
            Flag safety concerns or policy violations to the {campusConfig.shortName} Eco Cell moderation team.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Violation Category</label>
            <Select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="text-xs"
            >
              <option value="commercial">Commercial intent / Money or payment requested</option>
              <option value="prohibited">Prohibited or dangerous substance/hardware</option>
              <option value="inaccurate">Misleading condition or non-working item</option>
              <option value="unavailable">Item already given away or unresponsive owner</option>
              <option value="harassment">Offensive content or harassment</option>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground mb-1 block">Additional Details</label>
            <Textarea
              rows={3}
              placeholder="Provide context for campus moderators..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsReportModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="default" onClick={handleReportSubmit} className="bg-rose-600 hover:bg-rose-700 text-white">
              Submit Report
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Request Modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-primary mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Campus Material Request</span>
          </div>
          <DialogTitle>Request "{item.title}"</DialogTitle>
          <DialogDescription>
            Coordinate with {item.owner?.full_name} for free on-campus collection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="rounded-xl border border-border/70 bg-muted/30 p-3 text-xs space-y-1">
            <p className="font-semibold text-foreground">Handover Location:</p>
            <p className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-primary" /> {item.pickup_location}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">
              Preferred Pickup Time Slot
            </label>
            <Select
              value={preferredSlot}
              onChange={(e) => setPreferredSlot(e.target.value)}
              className="text-xs"
            >
              <option value="Morning (9:30 AM – 12:00 PM)">Morning (9:30 AM – 12:00 PM)</option>
              <option value="Afternoon (1:00 PM – 3:30 PM)">Afternoon (1:00 PM – 3:30 PM)</option>
              <option value="Evening (3:30 PM – 5:00 PM)">Evening (3:30 PM – 5:00 PM)</option>
            </Select>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">
              Note to Owner *
            </label>
            <Textarea
              placeholder="Hi! I am taking this course / working on my semester lab project and would love to reuse this..."
              rows={3}
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            />
          </div>

          <label className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={pledgeChecked}
              onChange={(e) => setPledgeChecked(e.target.checked)}
              className="mt-0.5 rounded border-primary text-primary focus:ring-primary"
            />
            <span className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
              I understand that <strong className="text-foreground">zero currency is involved</strong>. I pledge to meet safely at the designated campus pickup spot and treat this material with care.
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRequestModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSendRequest}
              isLoading={isSubmittingRequest}
            >
              Send Request to Owner
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Mobile Sticky Bottom CTA Bar */}
      {!isOwner && item.status === 'available' && (
        <div className="fixed bottom-[4.75rem] sm:hidden left-0 right-0 z-30 px-4 py-2.5 bg-card/95 backdrop-blur-md border-t border-border shadow-elevation-3 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
              Free Campus Exchange
            </span>
            <span className="text-xs font-semibold text-foreground truncate max-w-[180px] block">
              {item.pickup_location.split(' (')[0]}
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleOpenRequest}
            className="font-bold px-4 h-9 shadow-sm shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            <span>Request</span>
          </Button>
        </div>
      )}
    </div>
  )
}
