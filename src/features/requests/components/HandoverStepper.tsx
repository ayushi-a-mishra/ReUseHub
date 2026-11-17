import { RequestStatus } from '@/types'
import { Check, XCircle } from 'lucide-react'

interface HandoverStepperProps {
  status: RequestStatus
  giverConfirmed?: boolean
  takerConfirmed?: boolean
  className?: string
}

export function HandoverStepper({
  status,
  giverConfirmed = false,
  takerConfirmed = false,
  className = '',
}: HandoverStepperProps) {
  if (status === 'declined' || status === 'cancelled') {
    return (
      <div className={`flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive ${className}`}>
        <XCircle className="h-4 w-4 shrink-0" />
        <span className="font-semibold">
          Request {status === 'declined' ? 'Declined by Owner' : 'Cancelled'}
        </span>
      </div>
    )
  }

  const steps = [
    {
      id: 1,
      title: 'Requested',
      desc: 'Pending owner review',
      isCompleted: status === 'accepted' || status === 'completed',
      isCurrent: status === 'pending',
    },
    {
      id: 2,
      title: 'Approved',
      desc: 'Meetup scheduled',
      isCompleted: status === 'accepted' || status === 'completed',
      isCurrent: status === 'accepted' && (!giverConfirmed || !takerConfirmed),
    },
    {
      id: 3,
      title: 'Campus Handover',
      desc: giverConfirmed && takerConfirmed ? 'Both verified' : giverConfirmed ? 'Giver confirmed' : takerConfirmed ? 'Recipient confirmed' : 'Awaiting confirmation',
      isCompleted: status === 'completed' || (giverConfirmed && takerConfirmed),
      isCurrent: status === 'accepted' && (giverConfirmed || takerConfirmed),
    },
    {
      id: 4,
      title: 'Completed',
      desc: 'Impact logged 🎉',
      isCompleted: status === 'completed',
      isCurrent: status === 'completed',
    },
  ]

  return (
    <div className={`w-full py-2 ${className}`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
        {steps.map((s, idx) => {
          const isDone = s.isCompleted
          const isCur = s.isCurrent

          return (
            <div
              key={s.id}
              className={`flex flex-col p-2.5 rounded-xl border transition-all ${
                isDone
                  ? 'border-primary/40 bg-primary/5 text-foreground'
                  : isCur
                  ? 'border-accent bg-accent/5 ring-1 ring-accent/30 text-foreground'
                  : 'border-border/60 bg-muted/20 text-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Step 0{idx + 1}
                </span>
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                    isDone
                      ? 'bg-primary text-white'
                      : isCur
                      ? 'bg-accent text-white animate-pulse'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isDone ? <Check className="h-3 w-3 stroke-[3]" /> : idx + 1}
                </div>
              </div>
              <p className="font-heading text-xs font-bold leading-tight truncate">
                {s.title}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                {s.desc}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
