import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { mockStore } from '@/lib/mockStore'
import { Card } from '@/shared/ui/card'
import { RoleBadge } from '@/features/auth/components/RoleBadge'
import { Avatar } from '@/shared/ui/avatar'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog'
import { useToast } from '@/shared/ui/toast'
import { formatCurrencyINR, formatWeightKg } from '@/lib/utils'
import {
  Award,
  Mail,
  Building,
  Hash,
  Edit3,
  Package,
  Layers,
  History,
  CheckCircle2,
  Lock,
} from 'lucide-react'

export function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [bioInput, setBioInput] = useState(user?.bio || '')
  const [rollInput, setRollInput] = useState(user?.roll_number || '')

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Please sign in to view your campus profile.</p>
      </div>
    )
  }

  // Calculate user stats
  const myListings = mockStore.getItems().filter((i) => i.owner_id === user.id)
  const myHandovers = mockStore
    .getHandovers()
    .filter((h) => (h.giver_id === user.id || h.taker_id === user.id) && h.completed_at)

  let myKg = 0
  let myInr = 0
  myHandovers.forEach((h) => {
    const qty = h.item?.quantity || 1
    const cat = h.item?.category
    myKg += qty * (cat?.avg_weight_kg || 1)
    myInr += qty * (cat?.avg_value_inr || 500)
  })

  // Badges criteria
  const badges = [
    {
      id: 'pioneer',
      name: 'Zero Waste Pioneer',
      icon: '🌱',
      desc: 'Listed or recirculated at least 1 campus material',
      isUnlocked: myListings.length > 0 || myHandovers.length > 0,
    },
    {
      id: 'verified',
      name: 'Verified Campus Member',
      icon: '🛡️',
      desc: 'Authenticated with approved college email domain',
      isUnlocked: user.is_verified,
    },
    {
      id: 'champion',
      name: 'Eco Champion',
      icon: '🌳',
      desc: 'Diverted 2+ kg of waste from campus garbage dumps',
      isUnlocked: myKg >= 2,
    },
    {
      id: 'benefactor',
      name: 'Campus Benefactor',
      icon: '💎',
      desc: 'Helped peers avoid spending > ₹1,000 on course materials',
      isUnlocked: myInr >= 1000,
    },
    {
      id: 'recirculator',
      name: 'Super Recirculator',
      icon: '⚡',
      desc: 'Conducted 2+ physical verified handovers on campus',
      isUnlocked: myHandovers.length >= 2,
    },
  ]

  const handleSaveProfile = () => {
    user.bio = bioInput
    user.roll_number = rollInput
    localStorage.setItem('reusehub_active_user', JSON.stringify(user))
    setIsEditModalOpen(false)
    toast({
      title: 'Profile Updated',
      description: 'Your bio and details have been saved.',
      type: 'success',
    })
  }

  return (
    <div className="container py-8 max-w-4xl space-y-8">
      {/* Header Profile Card */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <Avatar
            src={user.avatar_url}
            fallback={user.full_name}
            size="xl"
            className="h-24 w-24 border-2 border-primary ring-4 ring-primary/10 shadow-md shrink-0"
          />
          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                  {user.full_name}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <RoleBadge role={user.role} />
                  <span className="text-xs text-muted-foreground">
                    {user.department?.name || 'Department Member'}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBioInput(user.bio || '')
                  setRollInput(user.roll_number || '')
                  setIsEditModalOpen(true)
                }}
                className="gap-1.5 text-xs self-center sm:self-start"
              >
                <Edit3 className="h-3.5 w-3.5 text-primary" />
                <span>Edit Profile</span>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              {user.bio || 'Active participant in university sustainability and peer circularity.'}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground pt-2">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>{user.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-primary" />
                <span>{user.department?.code || 'Campus'}</span>
              </span>
              {user.roll_number && (
                <span className="flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-primary" />
                  <span>ID: {user.roll_number}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4 Impact Stat Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/60">
          <div className="rounded-xl border border-border/80 bg-muted/20 p-3 text-center space-y-0.5">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Listings</p>
            <p className="font-heading text-xl font-bold text-foreground">{myListings.length}</p>
          </div>
          <div className="rounded-xl border border-border/80 bg-muted/20 p-3 text-center space-y-0.5">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Handovers</p>
            <p className="font-heading text-xl font-bold text-foreground">{myHandovers.length}</p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-center space-y-0.5">
            <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Waste Prevented</p>
            <p className="font-heading text-xl font-bold text-emerald-700 dark:text-emerald-400">
              {formatWeightKg(myKg)}
            </p>
          </div>
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-center space-y-0.5">
            <p className="text-[10px] uppercase font-bold text-accent">Value Retained</p>
            <p className="font-heading text-xl font-bold text-accent">
              {formatCurrencyINR(myInr)}
            </p>
          </div>
        </div>
      </Card>

      {/* Badges Section */}
      <Card className="p-6 space-y-5 shadow-card">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            <h3 className="font-heading text-base font-bold text-foreground">
              Campus Circularity Badges
            </h3>
          </div>
          <span className="text-xs text-muted-foreground">
            {badges.filter((b) => b.isUnlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl border p-4 space-y-2 transition-all ${
                b.isUnlocked
                  ? 'border-primary/30 bg-primary/5 text-foreground'
                  : 'border-border/60 bg-muted/20 text-muted-foreground opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{b.icon}</span>
                {b.isUnlocked ? (
                  <Badge variant="success" className="text-[9px] gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Unlocked
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[9px] gap-1 text-muted-foreground">
                    <Lock className="h-3 w-3" /> Locked
                  </Badge>
                )}
              </div>
              <div>
                <p className="font-heading text-xs font-bold text-foreground">{b.name}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/my-listings">
          <Card className="p-4 hover:border-primary/50 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-bold text-foreground">My Listings</p>
                <p className="text-[10px] text-muted-foreground">{myListings.length} materials</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/requests">
          <Card className="p-4 hover:border-primary/50 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Layers className="h-5 w-5 text-accent" />
              <div>
                <p className="text-xs font-bold text-foreground">My Requests</p>
                <p className="text-[10px] text-muted-foreground">Inbound & outbound</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/history">
          <Card className="p-4 hover:border-primary/50 transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-foreground">Reuse History</p>
                <p className="text-[10px] text-muted-foreground">{myHandovers.length} completed</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogHeader>
          <DialogTitle>Edit Campus Profile</DialogTitle>
          <DialogDescription>
            Update your campus bio, research interests, and student/faculty ID.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">Roll / Staff ID</label>
            <Input
              value={rollInput}
              onChange={(e) => setRollInput(e.target.value)}
              placeholder="e.g. CS21B042"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-foreground mb-1 block">Campus Bio</label>
            <Textarea
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              placeholder="Share what courses or research you work on..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
