import { useState } from 'react'
import confetti from 'canvas-confetti'
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Textarea } from '@/shared/ui/textarea'
import { Avatar } from '@/shared/ui/avatar'
import { Handover, Profile } from '@/types'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { mockStore } from '@/lib/mockStore'
import { useToast } from '@/shared/ui/toast'
import { Star, Sparkles, Heart } from 'lucide-react'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  handover: Handover | null
  onSuccess?: () => void
}

const RATING_LABELS: Record<number, string> = {
  1: 'Difficult or delayed experience',
  2: 'Fair handover with some issues',
  3: 'Good and satisfactory exchange',
  4: 'Very smooth & punctual handover',
  5: 'Exceptional! True campus circular champion ⭐',
}

const PRAISE_TAGS = [
  'Punctual on Campus',
  'Item in Great Condition',
  'Friendly & Respectful',
  'Prompt Communication',
  'Safe Meeting Spot',
]

export function ReviewModal({
  isOpen,
  onClose,
  handover,
  onSuccess,
}: ReviewModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Punctual on Campus',
    'Item in Great Condition',
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!handover || !user) return null

  const isGiver = user.id === handover.giver_id
  const targetUser: Profile | undefined = isGiver ? handover.taker : handover.giver
  const targetRole = isGiver ? 'Recipient / Taker' : 'Donor / Giver'

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmitReview = () => {
    if (!targetUser) return

    setIsSubmitting(true)
    try {
      const fullComment = selectedTags.length > 0
        ? `${selectedTags.map((t) => `[${t}]`).join(' ')} ${comment.trim()}`
        : comment.trim() || 'Great campus circular handover!'

      mockStore.addReview({
        handover_id: handover.id,
        reviewer_id: user.id,
        reviewer: user,
        target_user_id: targetUser.id,
        rating,
        comment: fullComment,
      })

      try {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#16A34A', '#22C55E', '#F59E0B', '#3B82F6'],
        })
      } catch {
        // no-op
      }

      toast({
        title: 'Review Submitted! ⭐',
        description: `Thank you for rating ${targetUser.full_name}. Your feedback strengthens campus trust.`,
        type: 'success',
      })

      if (onSuccess) onSuccess()
      onClose()
    } catch (err: any) {
      toast({
        title: 'Submission Error',
        description: err.message,
        type: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentDisplayRating = hoverRating || rating

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="max-w-md w-full space-y-5">
        <DialogHeader>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Campus Trust Rating</span>
          </div>
          <DialogTitle className="text-xl">
            Rate Handover Experience
          </DialogTitle>
          <DialogDescription className="text-xs">
            Help build the {targetUser?.department?.code || 'campus'} community trust network for circular reuse.
          </DialogDescription>
        </DialogHeader>

        {/* Counterpart Card */}
        {targetUser && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40 border border-border/60">
            <Avatar
              src={targetUser.avatar_url}
              fallback={targetUser.full_name}
              size="md"
              className="border-primary/30 ring-2 ring-primary/10"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground truncate">
                {targetUser.full_name}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {targetRole} • {handover.item?.title}
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
              {targetUser.role}
            </span>
          </div>
        )}

        {/* Star Rating Selector */}
        <div className="text-center space-y-2 py-2 border-y border-border/50">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= currentDisplayRating
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(star)}
                  className="p-1 rounded-lg transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  aria-label={`${star} Star`}
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      isFilled
                        ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                </button>
              )
            })}
          </div>
          <p className="text-xs font-semibold text-foreground h-4 transition-all">
            {RATING_LABELS[currentDisplayRating]}
          </p>
        </div>

        {/* Quick Praise Tags */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground block">
            What went well? (Select all that apply)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRAISE_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-all border ${
                    isSelected
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>

        {/* Comments Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground block">
            Public Appreciation or Feedback
          </label>
          <Textarea
            placeholder="Share details about the meetup, condition of the material, or a thank you note..."
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="text-xs"
          />
          <p className="text-[10px] text-muted-foreground">
            Your review will be visible on {targetUser?.full_name.split(' ')[0]}'s campus trust profile.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Skip for Now
          </Button>
          <Button
            size="sm"
            onClick={handleSubmitReview}
            isLoading={isSubmitting}
            className="gap-1.5 font-bold shadow-sm"
          >
            <Heart className="h-4 w-4 fill-white/20" />
            <span>Submit Review & Rating</span>
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
