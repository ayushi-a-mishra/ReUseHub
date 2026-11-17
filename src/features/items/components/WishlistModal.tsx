import { useState, useEffect } from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { Badge } from '@/shared/ui/badge'
import { mockStore } from '@/lib/mockStore'
import { WishlistItem, Category } from '@/types'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useToast } from '@/shared/ui/toast'
import { Heart, Plus, Trash2, BellRing, Sparkles } from 'lucide-react'

interface WishlistModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    if (!user) return
    const update = () => {
      setWishlist(mockStore.getWishlist(user.id))
      setCategories(mockStore.getCategories())
    }
    update()
    return mockStore.subscribe(update)
  }, [user])

  if (!user) return null

  const handleAddWishlist = (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyword.trim()) return

    mockStore.addWishlist(user.id, keyword.trim(), selectedCategory || undefined)
    toast({
      title: 'Wishlist Alert Added! 🔔',
      description: `You will be notified immediately when someone lists "${keyword.trim()}".`,
      type: 'success',
    })
    setKeyword('')
    setSelectedCategory('')
  }

  const handleRemove = (id: string, kw: string) => {
    mockStore.removeWishlist(id)
    toast({
      title: 'Alert Removed',
      description: `Removed notification alert for "${kw}".`,
      type: 'info',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="max-w-md w-full">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 mb-2">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <DialogTitle className="text-center text-lg">Campus Wishlist Alerts</DialogTitle>
          <DialogDescription className="text-center text-xs">
            Save items or keywords you are looking for. We will alert you the moment a peer lists a match.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Add Keyword Form */}
          <form onSubmit={handleAddWishlist} className="space-y-3 p-3.5 rounded-2xl bg-muted/40 border border-border/70">
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Create New Item Alert</span>
            </p>
            <div className="flex gap-2">
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Arduino, Digital Caliper, Engineering Mechanics..."
                className="text-xs flex-1"
                required
              />
              <Button type="submit" size="sm" className="gap-1 shrink-0 font-bold">
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </Button>
            </div>
            <div className="pt-1">
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs"
              >
                <option value="">Any Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          </form>

          {/* Active Wishlist Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span>Your Active Alerts ({wishlist.length})</span>
              <span className="text-[11px] font-normal flex items-center gap-1 text-primary">
                <BellRing className="h-3 w-3" />
                Instant in-app notifications
              </span>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-dashed border-border/80 bg-card">
                <p className="text-xs text-muted-foreground">You don't have any wishlist alerts set yet.</p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                  Type a keyword above to receive instant notifications!
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-card hover:border-primary/40 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-foreground">"{item.keyword}"</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[10px] py-0">
                          {item.category?.name || 'All Categories'}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          Added {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id, item.keyword)}
                      className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg transition-colors"
                      title="Remove alert"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )
}
