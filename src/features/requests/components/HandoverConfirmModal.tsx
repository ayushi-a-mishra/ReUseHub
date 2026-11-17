import { useState } from 'react'
import confetti from 'canvas-confetti'
import { Handover, Profile } from '@/types'
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Avatar } from '@/shared/ui/avatar'
import { RoleBadge } from '@/features/auth/components/RoleBadge'
import { MapPin, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react'

interface HandoverConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  handover: Handover
  userRole: 'giver' | 'taker'
  onConfirm: () => void
}

export function HandoverConfirmModal({
  open,
  onOpenChange,
  handover,
  userRole,
  onConfirm,
}: HandoverConfirmModalProps) {
  const [agreedToCondition, setAgreedToCondition] = useState(false)
  const isGiver = userRole === 'giver'
  const otherParty: Profile | undefined = isGiver ? handover.taker : handover.giver

  const handleConfirmAction = () => {
    onConfirm()
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16A34A', '#F97316', '#22C55E', '#10B981'],
      })
    } catch {
      // safe fallback
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-primary mb-1">
          <Sparkles className="h-4 w-4 text-accent" />
          <span>Campus Handover Verification</span>
        </div>
        <DialogTitle>
          {isGiver ? 'Confirm Giving Material' : 'Confirm Receiving Material'}
        </DialogTitle>
        <DialogDescription>
          Verify the physical campus handover of "{handover.item?.title}" to complete this circular reuse.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 pt-2">
        {/* Item & Counterpart summary */}
        <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={handover.item?.images[0]}
              alt=""
              className="h-14 w-14 rounded-xl object-cover border border-border shrink-0"
            />
            <div className="space-y-0.5 min-w-0">
              <p className="font-heading text-sm font-bold text-foreground truncate">
                {handover.item?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Qty: {handover.item?.quantity} • {handover.item?.category?.name}
              </p>
              <p className="text-xs text-foreground/80 flex items-center gap-1 pt-0.5">
                <MapPin className="h-3 w-3 text-primary shrink-0" />
                <span className="truncate">{handover.location || handover.item?.pickup_location}</span>
              </p>
            </div>
          </div>

          {otherParty && (
            <div className="pt-2 border-t border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar
                  src={otherParty.avatar_url}
                  fallback={otherParty.full_name}
                  size="sm"
                />
                <div>
                  <p className="text-xs font-semibold text-foreground">{otherParty.full_name}</p>
                  <p className="text-[10px] text-muted-foreground">{otherParty.email}</p>
                </div>
              </div>
              <RoleBadge role={otherParty.role} />
            </div>
          )}
        </div>

        {/* Verification Checkbox */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToCondition}
              onChange={(e) => setAgreedToCondition(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
            />
            <span className="text-xs text-foreground leading-relaxed select-none">
              {isGiver
                ? 'I have handed over this material in the stated working condition to the campus peer.'
                : 'I have inspected and received this material in usable condition on campus.'}
            </span>
          </label>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground pl-6.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Zero money involved. Automatic impact logged once both parties confirm.</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!agreedToCondition}
            onClick={handleConfirmAction}
            className="gap-2 font-bold"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Verify & Complete Handover</span>
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
