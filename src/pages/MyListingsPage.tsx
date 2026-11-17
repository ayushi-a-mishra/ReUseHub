import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { mockStore } from '@/lib/mockStore'
import { Item, ItemStatus } from '@/types'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { Select } from '@/shared/ui/select'
import { useToast } from '@/shared/ui/toast'
import {
  PlusCircle,
  Package,
  Trash2,
  ExternalLink,
  MapPin,
  Inbox,
} from 'lucide-react'

export function MyListingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [items, setItems] = useState<Item[]>([])
  const [requests, setRequests] = useState(mockStore.getRequests())

  useEffect(() => {
    const update = () => {
      if (user) {
        setItems(mockStore.getItems().filter((i) => i.owner_id === user.id))
        setRequests(mockStore.getRequests())
      }
    }
    update()
    return mockStore.subscribe(update)
  }, [user])

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <p>Please sign in to view your campus listings.</p>
      </div>
    )
  }

  const handleStatusChange = (itemId: string, newStatus: ItemStatus) => {
    mockStore.updateItemStatus(itemId, newStatus)
    toast({
      title: 'Status Updated',
      description: `Item status changed to ${newStatus}`,
      type: 'info',
    })
  }

  const handleDelete = (itemId: string, title: string) => {
    mockStore.deleteItem(itemId)
    toast({
      title: 'Listing Removed',
      description: `"${title}" was removed from campus listings`,
      type: 'info',
    })
  }

  const availableCount = items.filter((i) => i.status === 'available').length
  const reservedCount = items.filter((i) => i.status === 'reserved' || i.status === 'requested').length
  const reusedCount = items.filter((i) => i.status === 'reused').length

  return (
    <div className="container py-8 max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
            My Campus Listings
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage materials you have offered for circular reuse across campus
          </p>
        </div>
        <Link to="/add-item">
          <Button className="gap-2 shadow-sm">
            <PlusCircle className="h-4 w-4" />
            <span>Offer New Item</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase">Available</p>
            <p className="font-heading text-2xl font-bold text-emerald-600">{availableCount}</p>
          </div>
          <span className="text-2xl">📦</span>
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase">Pending / Reserved</p>
            <p className="font-heading text-2xl font-bold text-amber-500">{reservedCount}</p>
          </div>
          <span className="text-2xl">🤝</span>
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase">Reused Successfully</p>
            <p className="font-heading text-2xl font-bold text-primary">{reusedCount}</p>
          </div>
          <span className="text-2xl">🌱</span>
        </Card>
      </div>

      {/* Listings List */}
      {items.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <h3 className="font-heading text-lg font-bold">No active listings</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You haven't listed any unused materials. Give your old textbooks, lab components, or dorm supplies a second life!
          </p>
          <Link to="/add-item" className="inline-block pt-2">
            <Button>List Your First Item</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const itemRequests = requests.filter((r) => r.item_id === item.id)
            const pendingRequests = itemRequests.filter((r) => r.status === 'pending')

            return (
              <Card key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={item.images[0]}
                    alt=""
                    className="h-16 w-16 rounded-xl object-cover border border-border shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/items/${item.id}`}
                        className="font-heading text-base font-bold text-foreground hover:text-primary transition-colors"
                      >
                        {item.title}
                      </Link>
                      <Badge
                        variant={
                          item.status === 'available'
                            ? 'success'
                            : item.status === 'reused'
                            ? 'forest'
                            : 'warning'
                        }
                        className="uppercase text-[9px] font-bold"
                      >
                        {item.status}
                      </Badge>
                      {pendingRequests.length > 0 && (
                        <Link to="/requests">
                          <span className="rounded-full bg-accent/15 border border-accent/30 text-accent px-2 py-0.5 text-[10px] font-bold animate-pulse flex items-center gap-1">
                            <Inbox className="h-3 w-3" />
                            {pendingRequests.length} new request(s)
                          </span>
                        </Link>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>{item.category?.name}</span>
                      <span>•</span>
                      <span>Qty: {item.quantity}</span>
                      <span>•</span>
                      <MapPin className="h-3 w-3 text-primary inline" />
                      <span>{item.pickup_location}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-border/60">
                  {/* Status quick toggle */}
                  <Select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value as ItemStatus)}
                    className="text-xs h-9 w-32"
                  >
                    <option value="available">Available</option>
                    <option value="requested">Requested</option>
                    <option value="reserved">Reserved</option>
                    <option value="reused">Reused</option>
                  </Select>

                  <Link to={`/items/${item.id}`}>
                    <Button variant="outline" size="sm" className="gap-1 text-xs h-9">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 h-9 px-2"
                    onClick={() => handleDelete(item.id, item.title)}
                    aria-label="Delete listing"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
