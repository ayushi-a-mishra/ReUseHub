import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { mockStore } from '@/lib/mockStore'
import { Handover } from '@/types'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Avatar } from '@/shared/ui/avatar'
import { formatCurrencyINR, formatWeightKg, formatDate } from '@/lib/utils'
import {
  Sparkles,
  Recycle,
  Leaf,
  TrendingUp,
  Award,
} from 'lucide-react'

export function HistoryPage() {
  const { user } = useAuth()
  const [completedHandovers, setCompletedHandovers] = useState<Handover[]>([])

  useEffect(() => {
    const update = () => {
      if (user) {
        const list = mockStore
          .getHandovers()
          .filter((h) => (h.giver_id === user.id || h.taker_id === user.id) && h.completed_at)
        setCompletedHandovers(list)
      }
    }
    update()
    return mockStore.subscribe(update)
  }, [user])

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <p>Please sign in to view your circular reuse history.</p>
      </div>
    )
  }

  // Calculate personal impact
  let myKgAvoided = 0
  let myInrSaved = 0

  completedHandovers.forEach((h) => {
    const cat = h.item?.category
    const qty = h.item?.quantity || 1
    myKgAvoided += qty * (cat?.avg_weight_kg || 1)
    myInrSaved += qty * (cat?.avg_value_inr || 500)
  })

  return (
    <div className="container py-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <Badge variant="default" className="gap-1 mb-1">
          <Sparkles className="h-3 w-3 text-accent" />
          Campus Circularity Record
        </Badge>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
          Reuse History & Personal Impact
        </h1>
        <p className="text-sm text-muted-foreground">
          Verified materials you have recirculated on campus with fellow students and faculty
        </p>
      </div>

      {/* Personal Impact Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-primary mb-1">
            <Recycle className="h-4 w-4" />
            <span>Materials Recirculated</span>
          </div>
          <p className="font-heading text-3xl font-extrabold text-foreground">
            {completedHandovers.length}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Successful campus handovers</p>
        </Card>

        <Card className="p-5 border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-1">
            <Leaf className="h-4 w-4" />
            <span>Landfill Waste Prevented</span>
          </div>
          <p className="font-heading text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
            {formatWeightKg(myKgAvoided)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Kept out of city waste streams</p>
        </Card>

        <Card className="p-5 border-accent/20 bg-accent/5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-accent mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>Value Re-Circulated</span>
          </div>
          <p className="font-heading text-3xl font-extrabold text-accent">
            {formatCurrencyINR(myInrSaved)}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Zero rupees spent by peers</p>
        </Card>
      </div>

      {/* History Items List */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <span>Completed Reuse Transactions</span>
        </h3>

        {completedHandovers.length === 0 ? (
          <Card className="p-12 text-center space-y-3">
            <Recycle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <h4 className="font-heading text-base font-bold text-foreground">No completed handovers yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Once both you and the counterpart confirm an in-person campus handover, it will appear here in your permanent environmental record.
            </p>
            <Link to="/browse" className="inline-block pt-2">
              <Button size="sm">Browse Campus Materials</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {completedHandovers.map((h) => {
              const isGiver = h.giver_id === user.id
              const otherParty = isGiver ? h.taker : h.giver
              const cat = h.item?.category
              const qty = h.item?.quantity || 1

              return (
                <Card key={h.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={h.item?.images[0]}
                      alt=""
                      className="h-16 w-16 rounded-xl object-cover border border-border shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-base font-bold text-foreground">
                          {h.item?.title}
                        </span>
                        <Badge variant="forest" className="text-[10px] uppercase font-bold">
                          {isGiver ? 'You Donated' : 'You Received'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span>{formatDate(h.completed_at || h.created_at)}</span>
                        <span>•</span>
                        <span>{h.location}</span>
                      </p>
                      <div className="flex items-center gap-2 pt-0.5 text-[11px] text-muted-foreground">
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          +{formatWeightKg(qty * (cat?.avg_weight_kg || 1))} diverted
                        </span>
                        <span>•</span>
                        <span className="text-accent font-semibold">
                          {formatCurrencyINR(qty * (cat?.avg_value_inr || 500))} saved
                        </span>
                      </div>
                    </div>
                  </div>

                  {otherParty && (
                    <div className="flex items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-border/60 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <p className="text-xs font-bold text-foreground">{otherParty.full_name}</p>
                        <p className="text-[10px] text-muted-foreground">{otherParty.department?.code}</p>
                      </div>
                      <Avatar
                        src={otherParty.avatar_url}
                        fallback={otherParty.full_name}
                        size="sm"
                      />
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
