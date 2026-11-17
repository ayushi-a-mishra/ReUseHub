import { useState, useEffect, useMemo } from 'react'
import { mockStore } from '@/lib/mockStore'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Item, Profile, Report, ContactMessage, UserRole } from '@/types'
import { campusConfig } from '@/config/campus'
import { formatWeightKg } from '@/lib/utils'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { Avatar } from '@/shared/ui/avatar'
import { RoleBadge } from '@/features/auth/components/RoleBadge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs'
import { useToast } from '@/shared/ui/toast'
import {
  ShieldCheck,
  AlertTriangle,
  Download,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Search,
  Users,
  Package,
  Recycle,
  MailCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export function AdminPage() {
  const { user, isAdmin, switchDemoUser } = useAuth()
  const { toast } = useToast()

  const [tab, setTab] = useState<'listings' | 'users' | 'reports' | 'inquiries' | 'activity'>('listings')
  const [items, setItems] = useState<Item[]>([])
  const [users, setUsers] = useState<Profile[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [inquiries, setInquiries] = useState<ContactMessage[]>([])
  const [searchListing, setSearchListing] = useState('')
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all')
  const [searchUser, setSearchUser] = useState('')

  useEffect(() => {
    const update = () => {
      setItems(mockStore.getItems())
      setUsers(mockStore.getUsers())
      setReports(mockStore.getReports())
      setInquiries(mockStore.getContactMessages())
    }
    update()
    return mockStore.subscribe(update)
  }, [])

  const impact = useMemo(() => mockStore.getImpactMetrics(), [items])

  if (!isAdmin) {
    return (
      <div className="container py-20 text-center space-y-5 max-w-lg mx-auto">
        <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto ring-1 ring-amber-500/20">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div className="space-y-1.5">
          <Badge variant="outline" className="text-amber-600 border-amber-500/30 text-xs">
            Restricted Governance Area
          </Badge>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
            Admin Moderation Console
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Access is reserved for {campusConfig.shortName} Sustainability Cell Officers, Department Coordinators, and IDEA Lab-1 administrators.
          </p>
        </div>

        <Card className="p-4 bg-muted/30 border-border/60 text-left space-y-2">
          <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Live Project Evaluation Access
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Switch to the institution coordinator account to test all moderation queues, user role adjustments, report resolution, and audit controls.
          </p>
        </Card>

        <div className="pt-2">
          <Button onClick={() => switchDemoUser(2)} className="gap-2 font-bold shadow-sm">
            <span>Continue as Dr. Rajesh Verma (Admin Demo)</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Filter listings
  const filteredListings = items.filter((item) => {
    const matchesSearch =
      !searchListing ||
      item.title.toLowerCase().includes(searchListing.toLowerCase()) ||
      item.owner?.full_name.toLowerCase().includes(searchListing.toLowerCase())
    const matchesDept = selectedDeptFilter === 'all' || item.department_id === selectedDeptFilter
    const matchesStatus = selectedStatusFilter === 'all' || item.status === selectedStatusFilter
    return matchesSearch && matchesDept && matchesStatus
  })

  // Filter users
  const filteredUsers = users.filter((u) => {
    if (!searchUser) return true
    const q = searchUser.toLowerCase()
    return (
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.department?.name && u.department.name.toLowerCase().includes(q)) ||
      (u.roll_number && u.roll_number.toLowerCase().includes(q))
    )
  })

  const handleExportCSV = () => {
    const headers = 'ID,Title,Category,Department,Status,Quantity,PickupLocation,CreatedAt\n'
    const rows = items
      .map(
        (i) =>
          `"${i.id}","${i.title.replace(/"/g, '""')}","${i.category?.name || ''}","${
            i.department?.name || ''
          }","${i.status}",${i.quantity},"${i.pickup_location || ''}","${i.created_at}"`
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reusehub_campus_impact_export_${Date.now()}.csv`
    a.click()
    toast({
      title: 'Export Generated 📊',
      description: 'Official campus circularity CSV downloaded.',
      type: 'success',
    })
  }

  const handleDeleteListing = (itemId: string, title: string) => {
    mockStore.deleteItem(itemId)
    toast({ title: 'Listing Removed', description: `Admin removed "${title}" from campus index.`, type: 'info' })
  }

  const handleDismissReport = (reportId: string) => {
    mockStore.updateReportStatus(reportId, 'dismissed')
    toast({ title: 'Report Dismissed', description: 'Listing remains active in catalog.', type: 'info' })
  }

  const handleResolveReport = (reportId: string, itemId: string) => {
    mockStore.deleteItem(itemId)
    mockStore.updateReportStatus(reportId, 'reviewed')
    toast({ title: 'Listing Removed & Report Resolved', description: 'Item removed from student view.', type: 'success' })
  }

  const handleUpdateInquiryStatus = (id: string, status: 'new' | 'in_progress' | 'resolved') => {
    mockStore.updateContactMessageStatus(id, status)
    toast({
      title: 'Ticket Updated',
      description: `Inquiry status marked as ${status.replace('_', ' ')}.`,
      type: 'info',
    })
  }

  const handlePromoteRole = (targetUser: Profile, newRole: UserRole) => {
    targetUser.role = newRole
    toast({
      title: 'Role Updated',
      description: `${targetUser.full_name} is now assigned as ${newRole.toUpperCase()}.`,
      type: 'success',
    })
  }

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length

  return (
    <div className="container py-8 max-w-6xl space-y-8 pb-24 sm:pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400 gap-1.5 text-xs font-bold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Campus Sustainability Administration</span>
            </Badge>
            <span className="text-xs text-muted-foreground hidden sm:inline">· Logged in as {user?.full_name}</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Governance & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Campus-wide supervision of peer listings, user trust, reported items, and helpdesk dispatches for {campusConfig.name}.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs font-bold h-9 justify-center"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            size="sm"
            onClick={() => switchDemoUser(0)}
            variant="outline"
            className="text-xs text-muted-foreground hover:text-foreground h-9 border-border/60 justify-center"
          >
            <span>Student View</span>
          </Button>
        </div>
      </div>

      {/* Top 5 KPI Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <Card className="p-4 space-y-1 shadow-card border-primary/20">
          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Package className="h-3 w-3 text-primary" /> Listings
          </span>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-foreground">{items.length}</p>
          <span className="text-[10px] text-muted-foreground">{items.filter((i) => i.status === 'available').length} available</span>
        </Card>

        <Card className="p-4 space-y-1 shadow-card border-blue-500/20">
          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Users className="h-3 w-3 text-blue-600" /> Users
          </span>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">{users.length}</p>
          <span className="text-[10px] text-muted-foreground">100% verified</span>
        </Card>

        <Card className="p-4 space-y-1 shadow-card border-emerald-500/20">
          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <Recycle className="h-3 w-3 text-emerald-600" /> Reused
          </span>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {impact.total_items_reused}
          </p>
          <span className="text-[10px] text-muted-foreground">{formatWeightKg(impact.total_kg_waste_avoided)} diverted</span>
        </Card>

        <Card className="p-4 space-y-1 shadow-card border-amber-500/20">
          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-amber-500" /> Flags
          </span>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {pendingReportsCount}
          </p>
          <span className="text-[10px] text-muted-foreground">Pending review</span>
        </Card>

        <Card className="col-span-2 sm:col-span-1 p-4 space-y-1 shadow-card border-purple-500/20">
          <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
            <MailCheck className="h-3 w-3 text-purple-600" /> Inquiries
          </span>
          <p className="font-heading text-xl sm:text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {inquiries.length}
          </p>
          <span className="text-[10px] text-muted-foreground">{newInquiriesCount} new tickets</span>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="space-y-6">
        <TabsList className="grid grid-cols-4 max-w-2xl bg-muted/60 p-1">
          <TabsTrigger value="listings" className="text-xs">
            Listings ({items.length})
          </TabsTrigger>
          <TabsTrigger value="users" className="text-xs">
            Members ({users.length})
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-xs">
            Flags ({pendingReportsCount})
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="text-xs">
            Tickets ({inquiries.length})
          </TabsTrigger>
        </TabsList>

        {/* 1. LISTINGS MODERATION TAB */}
        <TabsContent value="listings" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="h-3.5 w-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search material title or owner…"
                value={searchListing}
                onChange={(e) => setSearchListing(e.target.value)}
                className="pl-9 text-xs h-9"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="text-xs h-9 w-full sm:w-44"
              >
                <option value="all">All Departments</option>
                {mockStore.getDepartments().map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} ({d.name.split(' ')[0]})
                  </option>
                ))}
              </Select>

              <Select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="text-xs h-9 w-full sm:w-36"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="reused">Reused</option>
              </Select>
            </div>
          </div>

          <Card className="overflow-hidden shadow-card border-border/80">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 border-b border-border/80 text-muted-foreground uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Material</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Owner</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredListings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No listings match your search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredListings.slice(0, 20).map((item) => (
                      <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-3.5 font-semibold text-foreground max-w-[220px]">
                          <div className="flex items-center gap-2.5">
                            {item.images && item.images[0] && (
                              <img
                                src={item.images[0]}
                                alt=""
                                className="h-8 w-8 rounded-lg object-cover shrink-0 border border-border"
                              />
                            )}
                            <span className="truncate">{item.title}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-muted-foreground">{item.category?.name}</td>
                        <td className="p-3.5 text-muted-foreground">
                          <span className="font-semibold text-foreground">{item.department?.code}</span>
                        </td>
                        <td className="p-3.5 text-foreground">{item.owner?.full_name}</td>
                        <td className="p-3.5">
                          <Badge
                            variant={
                              item.status === 'available'
                                ? 'success'
                                : item.status === 'reused'
                                ? 'forest'
                                : 'warning'
                            }
                            className="text-[9px] uppercase font-bold"
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                          <a href={`/items/${item.id}`} target="_blank" rel="noreferrer">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteListing(item.id, item.title)}
                            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                            title="Remove listing"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* 2. CAMPUS USERS TAB */}
        <TabsContent value="users" className="space-y-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="h-3.5 w-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search member name, roll number, or department…"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>

          <Card className="overflow-hidden shadow-card border-border/80">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/50 border-b border-border/80 text-muted-foreground uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Member</th>
                    <th className="p-3.5">Email / Roll</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Trust Score</th>
                    <th className="p-3.5 text-right">Promote / Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar src={u.avatar_url} fallback={u.full_name} size="sm" />
                          <span className="font-bold text-foreground">{u.full_name}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-muted-foreground">
                        <p className="truncate">{u.email}</p>
                        <p className="text-[10px] text-muted-foreground">{u.roll_number || 'SLRTCE'}</p>
                      </td>
                      <td className="p-3.5">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="p-3.5 text-muted-foreground">{u.department?.code || 'Campus'}</td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="h-3 w-3" />
                          {u.trust_score || 96}%
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handlePromoteRole(u, 'faculty')}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
                            >
                              Make Faculty
                            </button>
                          )}
                          {u.role !== 'student' && (
                            <button
                              onClick={() => handlePromoteRole(u, 'student')}
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors"
                            >
                              Make Student
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* 3. REPORTS TAB */}
        <TabsContent value="reports" className="space-y-4">
          {reports.length === 0 ? (
            <Card className="p-12 text-center text-xs text-muted-foreground border-dashed">
              <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-semibold text-foreground">Zero Active Moderation Flags</p>
              <p>All reported items have been inspected and resolved.</p>
            </Card>
          ) : (
            reports.map((rep) => (
              <Card key={rep.id} className="p-5 space-y-4 shadow-card border-border/80">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="font-heading text-sm font-bold text-foreground">
                      {rep.reason}
                    </span>
                    <Badge variant={rep.status === 'pending' ? 'warning' : 'outline'} className="text-[9px] uppercase font-bold">
                      {rep.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Reported by {rep.reporter?.full_name || 'Campus Student'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <p className="text-foreground font-semibold">
                    Target Listing: {rep.item?.title || 'Campus Item'}
                  </p>
                  <p className="text-muted-foreground italic bg-muted/30 p-2.5 rounded-lg border border-border/40">
                    &ldquo;{rep.details}&rdquo;
                  </p>
                </div>

                {rep.status === 'pending' && (
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleResolveReport(rep.id, rep.item_id || '')}
                      className="gap-1.5 text-xs font-bold h-8"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove Listing & Resolve</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDismissReport(rep.id)}
                      className="text-xs h-8"
                    >
                      Dismiss Report
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        {/* 4. INQUIRIES & SUPPORT TICKETS TAB */}
        <TabsContent value="inquiries" className="space-y-4">
          {inquiries.length === 0 ? (
            <Card className="p-12 text-center text-xs text-muted-foreground border-dashed">
              <MailCheck className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-semibold text-foreground">No Support Tickets Logged</p>
            </Card>
          ) : (
            inquiries.map((inq) => (
              <Card key={inq.id} className="p-5 space-y-3 shadow-card border-border/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">#{inq.id}</span>
                    <span className="font-heading text-sm font-bold text-foreground truncate">
                      {inq.topic}
                    </span>
                    <Badge
                      variant={
                        inq.status === 'new'
                          ? 'warning'
                          : inq.status === 'in_progress'
                          ? 'outline'
                          : 'success'
                      }
                      className="text-[9px] uppercase font-bold"
                    >
                      {inq.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    From: {inq.name} ({inq.email})
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {inq.message}
                </p>

                <div className="flex items-center gap-2 pt-2 border-t border-border/40 text-xs">
                  <span className="text-muted-foreground text-[11px]">Mark status:</span>
                  <button
                    onClick={() => handleUpdateInquiryStatus(inq.id, 'in_progress')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                      inq.status === 'in_progress' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleUpdateInquiryStatus(inq.id, 'resolved')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                      inq.status === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
