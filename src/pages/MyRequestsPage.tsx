import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { mockStore } from '@/lib/mockStore'
import { ItemRequest, Handover } from '@/types'
import { HandoverStepper } from '@/features/requests/components/HandoverStepper'
import { HandoverConfirmModal } from '@/features/requests/components/HandoverConfirmModal'
import { HandoverChatModal } from '@/features/chat/components/HandoverChatModal'
import { HandoverQRCodeModal } from '@/features/requests/components/HandoverQRCodeModal'
import { ReviewModal } from '@/features/reviews/components/ReviewModal'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { RoleBadge } from '@/features/auth/components/RoleBadge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs'
import { useToast } from '@/shared/ui/toast'
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Handshake,
  MapPin,
  MessageSquare,
  QrCode,
  Star,
} from 'lucide-react'

export function MyRequestsPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [tab, setTab] = useState<'incoming' | 'outgoing' | 'active'>('incoming')
  const [requests, setRequests] = useState<ItemRequest[]>([])
  const [handovers, setHandovers] = useState<Handover[]>([])

  // Modal State
  const [activeHandoverModal, setActiveHandoverModal] = useState<{
    handover: Handover
    role: 'giver' | 'taker'
  } | null>(null)
  const [activeChatRequest, setActiveChatRequest] = useState<ItemRequest | null>(null)
  const [activeQRHandover, setActiveQRHandover] = useState<Handover | null>(null)
  const [activeReviewHandover, setActiveReviewHandover] = useState<Handover | null>(null)

  useEffect(() => {
    const update = () => {
      setRequests(mockStore.getRequests())
      setHandovers(mockStore.getHandovers())
    }
    update()
    return mockStore.subscribe(update)
  }, [])

  if (!user) {
    return (
      <div className="container py-20 text-center space-y-3">
        <p className="text-muted-foreground">Please sign in to view your campus requests.</p>
      </div>
    )
  }

  // Incoming (I am Giver)
  const incoming = requests.filter((r) => r.owner_id === user.id)
  // Outgoing (I am Requester / Taker)
  const outgoing = requests.filter((r) => r.requester_id === user.id)
  // Active handovers involving user
  const activeHandoversList = handovers.filter(
    (h) => (h.giver_id === user.id || h.taker_id === user.id) && !h.completed_at
  )

  const handleApprove = (reqId: string) => {
    mockStore.updateRequestStatus(reqId, 'accepted')
    toast({
      title: 'Request Approved! 🤝',
      description: 'Handover record created. Coordinate with the recipient.',
      type: 'success',
    })
  }

  const handleDecline = (reqId: string) => {
    mockStore.updateRequestStatus(reqId, 'declined')
    toast({
      title: 'Request Declined',
      description: 'The material remains available for other campus peers.',
      type: 'info',
    })
  }

  const handleExecuteConfirmation = (handoverId: string, role: 'giver' | 'taker') => {
    const res = mockStore.confirmHandover(handoverId, role)
    if (res?.completed_at) {
      toast({
        title: 'Reuse Completed! 🎉',
        description: 'Both parties verified! Thank you for campus circularity.',
        type: 'success',
      })
      setTimeout(() => setActiveReviewHandover(res), 500)
    } else {
      toast({
        title: 'Confirmation Saved',
        description: 'Waiting for the other party to verify receipt.',
        type: 'info',
      })
    }
  }

  return (
    <div className="container py-8 pb-28 max-w-5xl space-y-8">
      {/* Page Title */}
      <div className="space-y-1">
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
          Requests & Campus Handovers
        </h1>
        <p className="text-sm text-muted-foreground">
          Track inbound requests for your materials, monitor status, and confirm physical handovers
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="grid w-full grid-cols-3 max-w-lg p-1">
          <TabsTrigger value="incoming" className="text-xs">
            <span>Incoming</span>
            <span className="ml-1 text-[11px] opacity-75">({incoming.length})</span>
          </TabsTrigger>
          <TabsTrigger value="outgoing" className="text-xs">
            <span className="hidden sm:inline">Sent Requests</span>
            <span className="sm:hidden">Sent</span>
            <span className="ml-1 text-[11px] opacity-75">({outgoing.length})</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="text-xs">
            <span className="hidden sm:inline">Active Meetups</span>
            <span className="sm:hidden">Meetups</span>
            <span className="ml-1 text-[11px] opacity-75">({activeHandoversList.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* 1. INCOMING REQUESTS (I AM GIVER) */}
        <TabsContent value="incoming" className="space-y-4 pt-4">
          {incoming.length === 0 ? (
            <Card className="p-12 text-center space-y-3">
              <Inbox className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="font-heading text-base font-bold text-foreground">No incoming requests yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                When campus peers request items you listed, they will appear here with their messages and intended use cases.
              </p>
            </Card>
          ) : (
            incoming.map((req) => {
              const matchingHandover = handovers.find((h) => h.request_id === req.id)
              return (
                <Card key={req.id} className="p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={req.item?.images[0]}
                        alt=""
                        className="h-16 w-16 rounded-xl object-cover border border-border shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/items/${req.item_id}`}
                            className="font-heading text-base font-bold text-foreground hover:text-primary transition-colors"
                          >
                            {req.item?.title}
                          </Link>
                          <Badge
                            variant={
                              req.status === 'accepted'
                                ? 'success'
                                : req.status === 'completed'
                                ? 'forest'
                                : req.status === 'declined'
                                ? 'destructive'
                                : 'warning'
                            }
                            className="text-[10px] uppercase font-bold"
                          >
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-primary" />
                          <span>Pickup: {req.item?.pickup_location}</span>
                        </p>
                      </div>
                    </div>

                    {req.requester && (
                      <div className="flex items-center gap-2.5 sm:text-right">
                        <div>
                          <p className="text-xs font-bold text-foreground">{req.requester.full_name}</p>
                          <p className="text-[10px] text-muted-foreground">{req.requester.email}</p>
                        </div>
                        <RoleBadge role={req.requester.role} />
                      </div>
                    )}
                  </div>

                  {/* Requester's Message */}
                  <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span>Intended Use & Note</span>
                    </div>
                    <p className="text-xs text-foreground italic leading-relaxed">
                      "{req.message}"
                    </p>
                  </div>

                  {/* Stepper */}
                  <HandoverStepper
                    status={req.status}
                    giverConfirmed={matchingHandover?.giver_confirmed}
                    takerConfirmed={matchingHandover?.taker_confirmed}
                  />

                  {/* Pending Action Bar */}
                  {req.status === 'pending' && (
                    <div className="pt-2 flex items-center gap-3">
                      <Button size="sm" onClick={() => handleApprove(req.id)} className="gap-1.5 font-bold">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Accept & Coordinate Meetup</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDecline(req.id)}
                        className="gap-1.5 text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Decline</span>
                      </Button>
                    </div>
                  )}

                  {/* Handover Action Bar */}
                  {req.status === 'accepted' && matchingHandover && (
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/60">
                      <div className="text-xs text-muted-foreground">
                        {matchingHandover.giver_confirmed ? (
                          <span className="text-primary font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> You confirmed handover. Awaiting recipient confirmation.
                          </span>
                        ) : (
                          <span>Meetup at {matchingHandover.location}. Click confirm once handed over.</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveChatRequest(req)}
                          className="gap-1.5"
                        >
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span>Chat</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveQRHandover(matchingHandover)}
                          className="gap-1.5"
                        >
                          <QrCode className="h-4 w-4 text-foreground" />
                          <span>QR Code</span>
                        </Button>
                        <Button
                          size="sm"
                          disabled={matchingHandover.giver_confirmed}
                          onClick={() =>
                            setActiveHandoverModal({
                              handover: matchingHandover,
                              role: 'giver',
                            })
                          }
                          className="gap-1.5 font-bold"
                        >
                          <Handshake className="h-4 w-4" />
                          <span>{matchingHandover.giver_confirmed ? '✓ Confirmed' : 'Confirm Giving'}</span>
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* Completed Review Action Bar */}
                  {req.status === 'completed' && matchingHandover && (
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/60">
                      <span className="text-xs text-primary font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Handover Completed! Material successfully recirculated.</span>
                      </span>
                      {mockStore.hasUserReviewedHandover(matchingHandover.id, user.id) ? (
                        <Badge variant="outline" className="text-amber-600 border-amber-300 gap-1 text-[11px]">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span>Reviewed</span>
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveReviewHandover(matchingHandover)}
                          className="gap-1.5 text-xs text-amber-700 border-amber-300 hover:bg-amber-50 dark:text-amber-400 font-semibold"
                        >
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                          <span>Review Taker</span>
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              )
            })
          )}
        </TabsContent>

        {/* 2. OUTGOING REQUESTS (I AM TAKER) */}
        <TabsContent value="outgoing" className="space-y-4 pt-4">
          {outgoing.length === 0 ? (
            <Card className="p-12 text-center space-y-3">
              <Inbox className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="font-heading text-base font-bold text-foreground">No sent requests</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                You haven't requested any campus materials. Browse textbooks, hardware, and furniture ready for reuse.
              </p>
              <Link to="/browse" className="inline-block pt-2">
                <Button size="sm">Browse Campus Items</Button>
              </Link>
            </Card>
          ) : (
            outgoing.map((req) => {
              const matchingHandover = handovers.find((h) => h.request_id === req.id)
              return (
                <Card key={req.id} className="p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={req.item?.images[0]}
                        alt=""
                        className="h-16 w-16 rounded-xl object-cover border border-border shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/items/${req.item_id}`}
                            className="font-heading text-base font-bold text-foreground hover:text-primary transition-colors"
                          >
                            {req.item?.title}
                          </Link>
                          <Badge
                            variant={
                              req.status === 'accepted'
                                ? 'success'
                                : req.status === 'completed'
                                ? 'forest'
                                : req.status === 'declined'
                                ? 'destructive'
                                : 'warning'
                            }
                            className="text-[10px] uppercase font-bold"
                          >
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Offered by <span className="font-semibold text-foreground">{req.owner?.full_name}</span> ({req.owner?.department?.code})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stepper */}
                  <HandoverStepper
                    status={req.status}
                    giverConfirmed={matchingHandover?.giver_confirmed}
                    takerConfirmed={matchingHandover?.taker_confirmed}
                  />

                  {/* Recipient Handover Confirmation Action */}
                  {req.status === 'accepted' && matchingHandover && (
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/60">
                      <div className="text-xs text-muted-foreground">
                        {matchingHandover.taker_confirmed ? (
                          <span className="text-primary font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> You confirmed receiving the item.
                          </span>
                        ) : (
                          <span>Owner approved! Meet at {matchingHandover.location} and confirm receipt.</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveChatRequest(req)}
                          className="gap-1.5"
                        >
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span>Chat</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveQRHandover(matchingHandover)}
                          className="gap-1.5"
                        >
                          <QrCode className="h-4 w-4 text-foreground" />
                          <span>QR Code</span>
                        </Button>
                        <Button
                          size="sm"
                          disabled={matchingHandover.taker_confirmed}
                          onClick={() =>
                            setActiveHandoverModal({
                              handover: matchingHandover,
                              role: 'taker',
                            })
                          }
                          className="gap-1.5 font-bold"
                        >
                          <Handshake className="h-4 w-4" />
                          <span>{matchingHandover.taker_confirmed ? '✓ Confirmed' : 'Confirm Receipt'}</span>
                        </Button>
                      </div>
                    </div>
                  )}
                  {/* Completed Review Action Bar */}
                  {req.status === 'completed' && matchingHandover && (
                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-border/60">
                      <span className="text-xs text-primary font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Item Received! Material successfully recirculated.</span>
                      </span>
                      {mockStore.hasUserReviewedHandover(matchingHandover.id, user.id) ? (
                        <Badge variant="outline" className="text-amber-600 border-amber-300 gap-1 text-[11px]">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span>Reviewed</span>
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveReviewHandover(matchingHandover)}
                          className="gap-1.5 text-xs text-amber-700 border-amber-300 hover:bg-amber-50 dark:text-amber-400 font-semibold"
                        >
                          <Star className="h-3.5 w-3.5 fill-amber-400" />
                          <span>Review Giver</span>
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              )
            })
          )}
        </TabsContent>

        {/* 3. ACTIVE MEETUPS */}
        <TabsContent value="active" className="space-y-4 pt-4">
          {activeHandoversList.length === 0 ? (
            <Card className="p-12 text-center space-y-3">
              <Handshake className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="font-heading text-base font-bold text-foreground">No pending meetups</h3>
              <p className="text-xs text-muted-foreground">
                Accepted requests requiring dual-party campus verification will appear here.
              </p>
            </Card>
          ) : (
            activeHandoversList.map((h) => {
              const isGiver = h.giver_id === user.id
              const userConfirmed = isGiver ? h.giver_confirmed : h.taker_confirmed

              return (
                <Card key={h.id} className="p-6 space-y-4 border-primary/20 bg-gradient-to-r from-card to-primary/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={h.item?.images[0]}
                        alt=""
                        className="h-14 w-14 rounded-xl object-cover border border-border shrink-0"
                      />
                      <div>
                        <h4 className="font-heading text-sm font-bold text-foreground">{h.item?.title}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-primary" />
                          <span>Meetup Spot: {h.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {h.request && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveChatRequest(h.request!)}
                          className="gap-1.5"
                        >
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span>Chat</span>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setActiveQRHandover(h)}
                        className="gap-1.5"
                      >
                        <QrCode className="h-4 w-4 text-foreground" />
                        <span>QR Code</span>
                      </Button>
                      <Button
                        size="sm"
                        disabled={userConfirmed}
                        onClick={() =>
                          setActiveHandoverModal({
                            handover: h,
                            role: isGiver ? 'giver' : 'taker',
                          })
                        }
                        className="gap-1.5 font-bold"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{userConfirmed ? '✓ Confirmed on Your End' : isGiver ? 'Confirm Giving' : 'Confirm Receiving'}</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Confirmation Modal */}
      {activeHandoverModal && (
        <HandoverConfirmModal
          open={!!activeHandoverModal}
          onOpenChange={(open) => !open && setActiveHandoverModal(null)}
          handover={activeHandoverModal.handover}
          userRole={activeHandoverModal.role}
          onConfirm={() =>
            handleExecuteConfirmation(
              activeHandoverModal.handover.id,
              activeHandoverModal.role
            )
          }
        />
      )}

      {/* Realtime Chat Modal */}
      {activeChatRequest && (
        <HandoverChatModal
          isOpen={!!activeChatRequest}
          onClose={() => setActiveChatRequest(null)}
          request={activeChatRequest}
        />
      )}

      {/* QR Code Handover Modal */}
      {activeQRHandover && (
        <HandoverQRCodeModal
          isOpen={!!activeQRHandover}
          onClose={() => setActiveQRHandover(null)}
          handover={activeQRHandover}
          onSuccess={() => {
            const hList = mockStore.getHandovers()
            setHandovers(hList)
            setRequests(mockStore.getRequests())
            const finished = hList.find((h) => h.id === activeQRHandover.id && h.completed_at)
            if (finished) {
              setTimeout(() => setActiveReviewHandover(finished), 500)
            }
          }}
        />
      )}

      {/* Post-Handover Review Modal */}
      {activeReviewHandover && (
        <ReviewModal
          isOpen={!!activeReviewHandover}
          onClose={() => setActiveReviewHandover(null)}
          handover={activeReviewHandover}
          onSuccess={() => {
            setHandovers(mockStore.getHandovers())
            setRequests(mockStore.getRequests())
          }}
        />
      )}
    </div>
  )
}
