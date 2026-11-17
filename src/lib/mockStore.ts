import {
  Department,
  Category,
  Profile,
  Item,
  ItemRequest,
  Handover,
  Notification,
  CampusImpactMetrics,
  ItemStatus,
  RequestStatus,
  Message,
  WishlistItem,
  Review,
  Report,
  ContactMessage,
  FAQ,
} from '@/types'
import {
  MOCK_DEPARTMENTS,
  MOCK_CATEGORIES,
  MOCK_USERS,
  MOCK_ITEMS,
  MOCK_REQUESTS,
  MOCK_HANDOVERS,
  MOCK_NOTIFICATIONS,
  MOCK_MESSAGES,
  MOCK_WISHLIST,
  MOCK_FAQS,
} from './mockData'

const STORAGE_KEYS = {
  ITEMS: 'reusehub_items',
  REQUESTS: 'reusehub_requests',
  HANDOVERS: 'reusehub_handovers',
  NOTIFICATIONS: 'reusehub_notifications',
  USERS: 'reusehub_users',
  MESSAGES: 'reusehub_messages',
  WISHLIST: 'reusehub_wishlist',
  REVIEWS: 'reusehub_reviews',
  REPORTS: 'reusehub_reports',
  CONTACT_MESSAGES: 'reusehub_contact_messages',
  ACTIVE_USER: 'reusehub_active_user',
}

const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-01',
    reporter_id: 'u-student-02',
    reporter: MOCK_USERS[1],
    item_id: 'item-08',
    item: MOCK_ITEMS.find((i) => i.id === 'item-08'),
    target_user_id: 'u-student-03',
    reason: 'Incorrect item specifications',
    details: 'The listing stated this was an Arduino Mega 2560, but photo shows an Uno R3 clone.',
    status: 'pending',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'rep-02',
    reporter_id: 'u-faculty-01',
    reporter: MOCK_USERS[2],
    item_id: 'item-14',
    item: MOCK_ITEMS.find((i) => i.id === 'item-14'),
    target_user_id: 'u-student-01',
    reason: 'Suspected duplicate listing',
    details: 'Same drafting set listed twice with identical photos.',
    status: 'pending',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
]

const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-01',
    name: 'Aarav Patel',
    email: 'aarav.patel@slrtce.in',
    topic: 'Campus Pickup Node Suggestion',
    message: 'Can we add a drop-off locker near the 4th floor Mechanical CAD lab? Many senior students work late there.',
    status: 'new',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'msg-02',
    name: 'Prof. Anjali Nair',
    email: 'anjali.nair@slrtce.in',
    topic: 'Bulk Lab Decommissioning',
    message: 'The Electronics department is upgrading 12 oscilloscope probes. We would like to list them as a batch for students.',
    status: 'in_progress',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
]

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    handover_id: 'ho-seed-01',
    reviewer_id: 'u-student-01',
    reviewer: MOCK_USERS[0],
    target_user_id: 'u-faculty-01',
    rating: 5,
    comment: 'Dr. Verma was extremely supportive. The lab kit was clean with all sensors labeled properly!',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'rev-02',
    handover_id: 'ho-seed-02',
    reviewer_id: 'u-student-02',
    reviewer: MOCK_USERS[1],
    target_user_id: 'u-student-01',
    rating: 5,
    comment: 'Priya arrived right on time at IDEA Lab-1. The algorithm textbook was in like-new condition. Thank you!',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
]

class MockDataStore {
  private items: Item[] = []
  private requests: ItemRequest[] = []
  private handovers: Handover[] = []
  private notifications: Notification[] = []
  private users: Profile[] = []
  private messages: Message[] = []
  private wishlist: WishlistItem[] = []
  private reviews: Review[] = []
  private reports: Report[] = []
  private contactMessages: ContactMessage[] = []
  private listeners: Set<() => void> = new Set()

  constructor() {
    this.init()
  }

  private init() {
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        const storedItems = localStorage.getItem(STORAGE_KEYS.ITEMS)
        this.items = storedItems ? JSON.parse(storedItems) : MOCK_ITEMS

        const storedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS)
        this.requests = storedRequests ? JSON.parse(storedRequests) : MOCK_REQUESTS

        const storedHandovers = localStorage.getItem(STORAGE_KEYS.HANDOVERS)
        this.handovers = storedHandovers ? JSON.parse(storedHandovers) : MOCK_HANDOVERS

        const storedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
        this.notifications = storedNotifications ? JSON.parse(storedNotifications) : MOCK_NOTIFICATIONS

        const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS)
        this.users = storedUsers ? JSON.parse(storedUsers) : MOCK_USERS

        const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES)
        this.messages = storedMessages ? JSON.parse(storedMessages) : MOCK_MESSAGES

        const storedWishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST)
        this.wishlist = storedWishlist ? JSON.parse(storedWishlist) : MOCK_WISHLIST

        const storedReviews = localStorage.getItem(STORAGE_KEYS.REVIEWS)
        this.reviews = storedReviews ? JSON.parse(storedReviews) : INITIAL_REVIEWS

        const storedReports = localStorage.getItem(STORAGE_KEYS.REPORTS)
        this.reports = storedReports ? JSON.parse(storedReports) : INITIAL_REPORTS

        const storedContact = localStorage.getItem(STORAGE_KEYS.CONTACT_MESSAGES)
        this.contactMessages = storedContact ? JSON.parse(storedContact) : INITIAL_CONTACT_MESSAGES
        return
      }
    } catch {
      // fallback
    }
    this.items = [...MOCK_ITEMS]
    this.requests = [...MOCK_REQUESTS]
    this.handovers = [...MOCK_HANDOVERS]
    this.notifications = [...MOCK_NOTIFICATIONS]
    this.users = [...MOCK_USERS]
    this.messages = [...MOCK_MESSAGES]
    this.wishlist = [...MOCK_WISHLIST]
    this.reviews = [...INITIAL_REVIEWS]
    this.reports = [...INITIAL_REPORTS]
    this.contactMessages = [...INITIAL_CONTACT_MESSAGES]
  }

  private save() {
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(this.items))
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(this.requests))
        localStorage.setItem(STORAGE_KEYS.HANDOVERS, JSON.stringify(this.handovers))
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications))
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users))
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(this.messages))
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(this.wishlist))
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(this.reviews))
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports))
        localStorage.setItem(STORAGE_KEYS.CONTACT_MESSAGES, JSON.stringify(this.contactMessages))
      }
    } catch {
      // no-op in headless/node environments
    }
    this.notify()
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener())
  }

  // GETTERS
  getDepartments(): Department[] {
    return MOCK_DEPARTMENTS
  }

  getCategories(): Category[] {
    return MOCK_CATEGORIES
  }

  getUsers(): Profile[] {
    return this.users
  }

  getUserById(id: string): Profile | undefined {
    return this.users.find((u) => u.id === id)
  }

  getItems(): Item[] {
    return this.items
  }

  getItemById(id: string): Item | undefined {
    return this.items.find((i) => i.id === id)
  }

  getRequests(): ItemRequest[] {
    return this.requests
  }

  getHandovers(): Handover[] {
    return this.handovers
  }

  getNotifications(userId: string): Notification[] {
    return this.notifications.filter((n) => n.user_id === userId)
  }

  // CRUD OPERATIONS
  addItem(item: Omit<Item, 'id' | 'created_at' | 'updated_at'>): Item {
    const newItem: Item = {
      ...item,
      id: `i_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.items = [newItem, ...this.items]
    this.save()
    this.checkWishlistMatches(newItem)
    return newItem
  }

  updateItemStatus(itemId: string, status: ItemStatus): void {
    this.items = this.items.map((i) => (i.id === itemId ? { ...i, status, updated_at: new Date().toISOString() } : i))
    this.save()
  }

  updateItem(itemId: string, updates: Partial<Item>): Item {
    let updatedItem: Item | undefined
    this.items = this.items.map((i) => {
      if (i.id === itemId) {
        updatedItem = { ...i, ...updates, updated_at: new Date().toISOString() }
        return updatedItem
      }
      return i
    })
    this.save()
    if (!updatedItem) throw new Error('Item not found')
    return updatedItem
  }

  getRequestById(id: string): ItemRequest | undefined {
    return this.requests.find((r) => r.id === id)
  }

  getUserRequests(userId: string): ItemRequest[] {
    return this.requests.filter((r) => r.requester_id === userId || r.owner_id === userId)
  }

  getHandoverById(id: string): Handover | undefined {
    return this.handovers.find((h) => h.id === id)
  }

  getUserHandovers(userId: string): Handover[] {
    return this.handovers.filter((h) => h.giver_id === userId || h.taker_id === userId)
  }

  getUserNotifications(userId: string): Notification[] {
    return this.getNotifications(userId)
  }

  markNotificationRead(id: string): void {
    this.markNotificationAsRead(id)
  }

  markAllNotificationsRead(userId: string): void {
    this.markAllNotificationsAsRead(userId)
  }

  deleteItem(itemId: string): void {
    this.items = this.items.filter((i) => i.id !== itemId)
    this.save()
  }

  createRequest(itemId: string, requester: Profile, message: string): ItemRequest {
    const item = this.getItemById(itemId)
    if (!item) throw new Error('Item not found')

    const newRequest: ItemRequest = {
      id: `r_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      item_id: item.id,
      item,
      requester_id: requester.id,
      requester,
      owner_id: item.owner_id,
      owner: item.owner,
      message,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    this.requests = [newRequest, ...this.requests]
    this.updateItemStatus(itemId, 'requested')

    // Notify item owner
    this.addNotification({
      user_id: item.owner_id,
      title: 'New Reuse Request! 📦',
      message: `${requester.full_name} requested "${item.title}". Check your requests to review.`,
      type: 'request_received',
      link: '/requests',
    })

    this.save()
    return newRequest
  }

  updateRequestStatus(requestId: string, status: RequestStatus): void {
    const req = this.requests.find((r) => r.id === requestId)
    if (!req) return

    this.requests = this.requests.map((r) =>
      r.id === requestId ? { ...r, status, updated_at: new Date().toISOString() } : r
    )

    if (status === 'accepted') {
      this.updateItemStatus(req.item_id, 'reserved')

      // Create a handover record
      const newHandover: Handover = {
        id: `h_${Date.now()}`,
        request_id: req.id,
        request: req,
        item_id: req.item_id,
        item: req.item,
        giver_id: req.owner_id,
        giver: req.owner,
        taker_id: req.requester_id,
        taker: req.requester,
        giver_confirmed: false,
        taker_confirmed: false,
        location: req.item?.pickup_location || 'Campus Center',
        created_at: new Date().toISOString(),
      }
      this.handovers = [newHandover, ...this.handovers]

      // Notify requester
      this.addNotification({
        user_id: req.requester_id,
        title: 'Request Accepted! 🤝',
        message: `${req.owner?.full_name || 'Owner'} accepted your request for "${req.item?.title}". Coordinate your handover!`,
        type: 'request_accepted',
        link: '/requests',
      })
    } else if (status === 'declined') {
      this.updateItemStatus(req.item_id, 'available')
      this.addNotification({
        user_id: req.requester_id,
        title: 'Request Update',
        message: `Your request for "${req.item?.title}" was declined by the owner.`,
        type: 'request_declined',
        link: '/browse',
      })
    }

    this.save()
  }

  confirmHandover(handoverId: string, role: 'giver' | 'taker'): Handover | undefined {
    const handover = this.handovers.find((h) => h.id === handoverId)
    if (!handover) return undefined

    const updated = {
      ...handover,
      giver_confirmed: role === 'giver' ? true : handover.giver_confirmed,
      taker_confirmed: role === 'taker' ? true : handover.taker_confirmed,
    }

    // Check if both confirmed
    if (updated.giver_confirmed && updated.taker_confirmed && !updated.completed_at) {
      updated.completed_at = new Date().toISOString()
      this.updateItemStatus(updated.item_id, 'reused')
      this.updateRequestStatus(updated.request_id, 'completed')

      // Notifications
      this.addNotification({
        user_id: updated.giver_id,
        title: 'Handover Completed! 🎉',
        message: `Item "${updated.item?.title}" reuse has been verified. Thank you for giving it a second life!`,
        type: 'item_reused',
        link: '/history',
      })
      this.addNotification({
        user_id: updated.taker_id,
        title: 'Item Received! 🎉',
        message: `You successfully received "${updated.item?.title}". Thank you for campus circularity!`,
        type: 'item_reused',
        link: '/history',
      })
    } else {
      // Notify other party
      const otherUserId = role === 'giver' ? updated.taker_id : updated.giver_id
      this.addNotification({
        user_id: otherUserId,
        title: 'Handover Confirmation Pending',
        message: `The ${role} has confirmed the handover of "${updated.item?.title}". Please confirm on your end!`,
        type: 'handover_confirmed',
        link: '/requests',
      })
    }

    this.handovers = this.handovers.map((h) => (h.id === handoverId ? updated : h))
    this.save()
    return updated
  }

  // REVIEWS & TRUST
  getReviews(targetUserId?: string): Review[] {
    if (targetUserId) {
      return this.reviews.filter((r) => r.target_user_id === targetUserId)
    }
    return this.reviews
  }

  hasUserReviewedHandover(handoverId: string, reviewerId: string): boolean {
    return this.reviews.some((r) => r.handover_id === handoverId && r.reviewer_id === reviewerId)
  }

  addReview(reviewData: Omit<Review, 'id' | 'created_at'>): Review {
    const newReview: Review = {
      ...reviewData,
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    }
    this.reviews = [newReview, ...this.reviews]

    // Recalculate trust score for target user
    const userReviews = this.reviews.filter((r) => r.target_user_id === reviewData.target_user_id)
    if (userReviews.length > 0) {
      const avg = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length
      const trustScore = Math.round((avg / 5) * 100)
      this.users = this.users.map((u) => (u.id === reviewData.target_user_id ? { ...u, trust_score: trustScore } : u))
    }

    // Notify target user
    this.addNotification({
      user_id: reviewData.target_user_id,
      title: 'New Campus Review! ⭐',
      message: `${reviewData.reviewer?.full_name || 'A campus peer'} left you a ${reviewData.rating}-star review.`,
      type: 'system',
      link: '/profile',
    })

    this.save()
    return newReview
  }

  addNotification(notif: Omit<Notification, 'id' | 'is_read' | 'created_at'>): void {
    const newNotif: Notification = {
      ...notif,
      id: `n_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    }
    this.notifications = [newNotif, ...this.notifications]
    this.save()
  }

  markNotificationAsRead(id: string): void {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    this.save()
  }

  markAllNotificationsAsRead(userId: string): void {
    this.notifications = this.notifications.map((n) => (n.user_id === userId ? { ...n, is_read: true } : n))
    this.save()
  }

  // MESSAGES
  getMessages(requestId: string): Message[] {
    return this.messages
      .filter((m) => m.request_id === requestId)
      .map((m) => ({
        ...m,
        sender: this.getUserById(m.sender_id),
        receiver: this.getUserById(m.receiver_id),
      }))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }

  sendMessage(requestId: string, senderId: string, receiverId: string, content: string): Message {
    const newMessage: Message = {
      id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      request_id: requestId,
      sender_id: senderId,
      sender: this.getUserById(senderId),
      receiver_id: receiverId,
      receiver: this.getUserById(receiverId),
      content: content.trim(),
      created_at: new Date().toISOString(),
    }
    this.messages = [...this.messages, newMessage]
    this.save()

    // Add notification to receiver
    const sender = this.getUserById(senderId)
    this.addNotification({
      user_id: receiverId,
      title: 'New Message Received 💬',
      message: `${sender?.full_name || 'A user'}: "${content.slice(0, 45)}${content.length > 45 ? '...' : ''}"`,
      type: 'system',
      link: `/requests`,
    })

    return newMessage
  }

  // WISHLIST
  getWishlist(userId: string): WishlistItem[] {
    return this.wishlist.filter((w) => w.user_id === userId)
  }

  addWishlist(userId: string, keyword: string, categoryId?: string): WishlistItem {
    const newItem: WishlistItem = {
      id: `w_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      user_id: userId,
      keyword: keyword.trim(),
      category_id: categoryId,
      category: categoryId ? this.getCategories().find((c) => c.id === categoryId) : undefined,
      notify_email: true,
      created_at: new Date().toISOString(),
    }
    this.wishlist = [newItem, ...this.wishlist]
    this.save()
    return newItem
  }

  removeWishlist(wishlistId: string): void {
    this.wishlist = this.wishlist.filter((w) => w.id !== wishlistId)
    this.save()
  }

  checkWishlistMatches(item: Item): void {
    const titleLower = item.title.toLowerCase()
    const descLower = item.description.toLowerCase()

    this.wishlist.forEach((w) => {
      if (w.user_id === item.owner_id) return

      const keywordLower = w.keyword.toLowerCase()
      if (titleLower.includes(keywordLower) || descLower.includes(keywordLower)) {
        this.addNotification({
          user_id: w.user_id,
          title: 'Wishlist Match Found! 🎉',
          message: `An item matching your alert "${w.keyword}" was just listed: "${item.title}".`,
          type: 'wishlist_match',
          link: `/items/${item.id}`,
        })
      }
    })
  }

  // IMPACT METRICS CALCULATION
  getImpactMetrics(): CampusImpactMetrics {
    const reusedItems = this.items.filter((i) => i.status === 'reused')

    let total_kg_waste_avoided = 0
    let total_inr_saved = 0

    // Compute totals
    reusedItems.forEach((item) => {
      const cat = this.getCategories().find((c) => c.id === item.category_id)
      const weight = cat?.avg_weight_kg || 1.0
      const value = cat?.avg_value_inr || 500
      total_kg_waste_avoided += item.quantity * weight
      total_inr_saved += item.quantity * value
    })

    // Category breakdown
    const categories_breakdown = this.getCategories().map((cat) => {
      const catItems = reusedItems.filter((i) => i.category_id === cat.id)
      const count = catItems.reduce((acc, curr) => acc + curr.quantity, 0)
      const kg = count * cat.avg_weight_kg
      const inr = count * cat.avg_value_inr
      return {
        category_name: cat.name,
        category_slug: cat.slug,
        items_count: count,
        kg_avoided: kg,
        inr_saved: inr,
      }
    })

    // Department leaderboard
    const departments_leaderboard = this.getDepartments().map((dept) => {
      const deptItems = reusedItems.filter((i) => i.department_id === dept.id)
      const count = deptItems.reduce((acc, curr) => acc + curr.quantity, 0)
      let kg = 0
      let inr = 0
      deptItems.forEach((item) => {
        const cat = this.getCategories().find((c) => c.id === item.category_id)
        kg += item.quantity * (cat?.avg_weight_kg || 1)
        inr += item.quantity * (cat?.avg_value_inr || 500)
      })
      return {
        department_name: dept.name,
        department_code: dept.code,
        items_count: count,
        kg_avoided: kg,
        inr_saved: inr,
      }
    }).sort((a, b) => b.items_count - a.items_count)

    // Monthly strictly non-decreasing cumulative metrics
    const totalReused = reusedItems.reduce((acc, i) => acc + i.quantity, 0)
    const totalKg = Math.round(total_kg_waste_avoided * 100) / 100
    const totalInr = Math.round(total_inr_saved)

    const monthly_cumulative = [
      {
        month: 'Jul',
        items_count: Math.round(totalReused * 0.15),
        kg_avoided: Math.round(totalKg * 0.12 * 10) / 10,
        inr_saved: Math.round(totalInr * 0.13),
      },
      {
        month: 'Aug',
        items_count: Math.round(totalReused * 0.35),
        kg_avoided: Math.round(totalKg * 0.32 * 10) / 10,
        inr_saved: Math.round(totalInr * 0.34),
      },
      {
        month: 'Sep',
        items_count: Math.round(totalReused * 0.60),
        kg_avoided: Math.round(totalKg * 0.58 * 10) / 10,
        inr_saved: Math.round(totalInr * 0.61),
      },
      {
        month: 'Oct',
        items_count: Math.round(totalReused * 0.85),
        kg_avoided: Math.round(totalKg * 0.83 * 10) / 10,
        inr_saved: Math.round(totalInr * 0.84),
      },
      {
        month: 'Nov',
        items_count: totalReused,
        kg_avoided: totalKg,
        inr_saved: totalInr,
      },
    ]

    return {
      total_items_reused: totalReused,
      total_kg_waste_avoided: totalKg,
      total_inr_saved: totalInr,
      monthly_cumulative,
      categories_breakdown,
      departments_leaderboard,
    }
  }

  // FAQS
  getFAQs(): FAQ[] {
    return MOCK_FAQS
  }

  // REPORTS
  getReports(): Report[] {
    return this.reports
  }

  addReport(reportData: Omit<Report, 'id' | 'created_at' | 'status'>): Report {
    const newReport: Report = {
      ...reportData,
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    }
    this.reports = [newReport, ...this.reports]

    // Notify admins
    const adminUser = this.users.find((u) => u.role === 'admin')
    if (adminUser) {
      this.addNotification({
        user_id: adminUser.id,
        title: 'New Moderation Report ⚠️',
        message: `A report has been submitted for item "${newReport.item?.title || 'Unknown'}": ${newReport.reason}`,
        type: 'system',
        link: '/admin',
      })
    }

    this.save()
    return newReport
  }

  updateReportStatus(id: string, status: 'pending' | 'reviewed' | 'dismissed'): void {
    this.reports = this.reports.map((r) => (r.id === id ? { ...r, status } : r))
    this.save()
  }

  // CONTACT & SUPPORT TICKETS
  getContactMessages(): ContactMessage[] {
    return this.contactMessages
  }

  addContactMessage(msgData: Omit<ContactMessage, 'id' | 'created_at' | 'status'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msgData,
      id: `ticket_${Date.now().toString(36).toUpperCase()}_${Math.floor(100 + Math.random() * 900)}`,
      status: 'new',
      created_at: new Date().toISOString(),
    }
    this.contactMessages = [newMsg, ...this.contactMessages]

    // Notify user of ticket submission
    const currentUser = this.users.find((u) => u.email.toLowerCase() === msgData.email.toLowerCase())
    if (currentUser) {
      this.addNotification({
        user_id: currentUser.id,
        title: 'Support Ticket Received 🎫',
        message: `Your inquiry regarding "${msgData.topic}" has been registered. Ticket #${newMsg.id}`,
        type: 'system',
        link: '/support',
      })
    }

    this.save()
    return newMsg
  }

  updateContactMessageStatus(id: string, status: 'new' | 'in_progress' | 'resolved'): void {
    this.contactMessages = this.contactMessages.map((m) => (m.id === id ? { ...m, status } : m))
    this.save()
  }
}

export const mockStore = new MockDataStore()
