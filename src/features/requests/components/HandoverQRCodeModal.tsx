import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import confetti from 'canvas-confetti'
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Handover } from '@/types'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { mockStore } from '@/lib/mockStore'
import { useToast } from '@/shared/ui/toast'
import { QrCode, CheckCircle2, MapPin, ShieldCheck } from 'lucide-react'

interface HandoverQRCodeModalProps {
  handover: Handover | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function HandoverQRCodeModal({
  handover,
  isOpen,
  onClose,
  onSuccess,
}: HandoverQRCodeModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    if (!handover) return

    const payload = JSON.stringify({
      handover_id: handover.id,
      item_id: handover.item_id,
      item_title: handover.item?.title,
      giver_id: handover.giver_id,
      taker_id: handover.taker_id,
      token: `reusehub_${handover.id.slice(-6)}`,
    })

    QRCode.toDataURL(payload, {
      width: 260,
      margin: 2,
      color: {
        dark: '#14532D',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err))
  }, [handover])

  if (!handover || !user) return null

  const isGiver = user.id === handover.giver_id
  const otherParty = isGiver ? handover.taker : handover.giver
  const roleTitle = isGiver ? 'Giver (Present this QR)' : 'Taker (Scan or Match QR)'

  const handleVerifyQRHandover = () => {
    setIsVerifying(true)
    setTimeout(() => {
      try {
        const role = isGiver ? 'giver' : 'taker'
        const updated = mockStore.confirmHandover(handover.id, role)

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16A34A', '#F97316', '#22C55E', '#3B82F6'],
        })

        toast({
          title: updated?.completed_at ? 'Handover Fully Completed! 🎉' : 'QR Verified on Your End',
          description: updated?.completed_at
            ? `Item reuse recorded! Waste avoided and rupees saved on campus.`
            : 'Waiting for the other party to also confirm.',
          type: 'success',
        })

        if (onSuccess) onSuccess()
        onClose()
      } catch (err: any) {
        toast({
          title: 'Handover Verification Error',
          description: err.message,
          type: 'error',
        })
      } finally {
        setIsVerifying(false)
      }
    }, 400)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="max-w-sm w-full text-center">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
            <QrCode className="h-6 w-6" />
          </div>
          <DialogTitle className="text-lg">Campus Handover QR Code</DialogTitle>
          <DialogDescription className="text-xs">
            Present or scan this code when meeting in person at the campus pickup spot.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Badge */}
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-[11px] font-semibold border-primary/30 text-primary">
              <ShieldCheck className="h-3 w-3 mr-1" />
              {roleTitle}
            </Badge>
          </div>

          {/* QR Container */}
          <div className="mx-auto w-[200px] h-[200px] rounded-2xl bg-white p-3 shadow-md border border-slate-200 flex items-center justify-center">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Handover QR Code" className="w-full h-full object-contain" />
            ) : (
              <div className="animate-pulse text-xs text-slate-400">Generating QR...</div>
            )}
          </div>

          {/* Handover Details */}
          <div className="rounded-xl bg-muted/40 p-3 text-left space-y-1.5 border border-border/60">
            <p className="text-xs font-bold text-foreground truncate">{handover.item?.title}</p>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{handover.location || handover.item?.pickup_location}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Exchanging with: <span className="font-semibold text-foreground">{otherParty?.full_name}</span>
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleVerifyQRHandover}
            disabled={isVerifying}
            className="w-full gap-2 shadow-sm font-bold"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Confirm Handover Match</span>
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
