import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Avatar } from '@/shared/ui/avatar'
import { mockStore } from '@/lib/mockStore'
import { ItemRequest, Message } from '@/types'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Send, MessageSquare, MapPin, CheckCheck, ShieldCheck } from 'lucide-react'

interface HandoverChatModalProps {
  request: ItemRequest | null
  isOpen: boolean
  onClose: () => void
}

const QUICK_CHATS = [
  'Where on campus shall we meet?',
  'I am near the Central Library foyer.',
  'Walking over now with the item!',
  'I have arrived wearing a blue hoodie.',
]

export function HandoverChatModal({ request, isOpen, onClose }: HandoverChatModalProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!request) return
    const update = () => {
      setMessages(mockStore.getMessages(request.id))
    }
    update()
    return mockStore.subscribe(update)
  }, [request])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  if (!request || !user) return null

  const isOwner = user.id === request.owner_id
  const otherParty = isOwner ? request.requester : request.owner
  const otherRole = isOwner ? 'Taker' : 'Giver'

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim()
    if (!text) return

    mockStore.sendMessage(
      request.id,
      user.id,
      otherParty?.id || '',
      text
    )
    setInputText('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="max-w-md w-full">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar
              src={otherParty?.avatar_url}
              fallback={otherParty?.full_name || 'U'}
              size="md"
              className="border-primary/40 ring-2 ring-primary/10"
            />
            <div>
              <DialogTitle className="text-base flex items-center gap-2">
                <span>{otherParty?.full_name}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {otherRole}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs flex items-center gap-1.5 text-muted-foreground mt-0.5">
                <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="truncate max-w-[240px]">
                  {request.item?.pickup_location || 'Campus Meeting Spot'}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Item Context Pill */}
        <div className="mx-6 mt-2 p-2 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-3">
          {request.item?.images?.[0] && (
            <img
              src={request.item.images[0]}
              alt={request.item.title}
              className="h-10 w-10 rounded-lg object-cover border border-border/80"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-foreground truncate">{request.item?.title}</p>
            <p className="text-[10px] text-muted-foreground">
              Qty: {request.item?.quantity} • {request.item?.category?.name}
            </p>
          </div>
        </div>

        {/* Campus Safety Banner */}
        <div className="mx-6 mt-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/20 flex items-center gap-2 text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>Verified campus chat. Meet at official pickup spots under CCTV surveillance. Zero money involved.</span>
        </div>

        {/* Chat Message Stream */}
        <div className="p-6 h-[320px] overflow-y-auto space-y-3 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs font-semibold text-foreground">No messages yet</p>
              <p className="text-[11px] text-muted-foreground mt-1 max-w-[220px]">
                Coordinate pickup time and campus location with {otherParty?.full_name.split(' ')[0]}.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMine = m.sender_id === user.id
              return (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[80%] ${
                    isMine ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      isMine
                        ? 'bg-primary text-white rounded-br-xs'
                        : 'bg-muted/80 text-foreground rounded-bl-xs border border-border/50'
                    }`}
                  >
                    {m.content}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1 px-1">
                    <span>
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isMine && <CheckCheck className="h-3 w-3 text-primary stroke-[2.5]" />}
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Bubbles */}
        <div className="px-6 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {QUICK_CHATS.map((qc) => (
            <button
              key={qc}
              type="button"
              onClick={() => handleSendMessage(qc)}
              className="shrink-0 text-[11px] bg-card hover:bg-muted border border-border/80 px-2.5 py-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              {qc}
            </button>
          ))}
        </div>

        {/* Send Input Bar */}
        <div className="p-4 border-t border-border/80 bg-card flex items-center gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder={`Message ${otherParty?.full_name.split(' ')[0]}...`}
            className="text-xs"
          />
          <Button
            size="sm"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="gap-1 shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
