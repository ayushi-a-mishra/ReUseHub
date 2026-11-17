import {
  Item,
  ItemRequest,
  Handover,
  Notification,
  Message,
  WishlistItem,
  CampusImpactMetrics,
  Category,
  Department,
  RequestStatus,
  ItemStatus,
  ItemCondition,
} from '@/types'

export interface ItemFilter {
  categoryId?: string
  departmentId?: string
  condition?: ItemCondition
  status?: ItemStatus
  search?: string
  ownerId?: string
}

export interface CreateItemDTO {
  title: string
  description: string
  category_id: string
  department_id: string
  owner_id: string
  condition: ItemCondition
  quantity: number
  status?: ItemStatus
  pickup_location: string
  images: string[]
  expiry_date?: string
}

export interface CreateRequestDTO {
  item_id: string
  requester_id: string
  owner_id: string
  message: string
}

export interface SendMessageDTO {
  request_id: string
  sender_id: string
  receiver_id: string
  content: string
}

export interface AddWishlistDTO {
  user_id: string
  keyword: string
  category_id?: string
  notify_email?: boolean
}

export interface SubmitReportDTO {
  reporter_id: string
  item_id: string
  reason: string
  details?: string
}

export interface SubmitContactDTO {
  name: string
  email: string
  topic: string
  message: string
}

export interface IRepository {
  // Items
  getItems(filter?: ItemFilter): Promise<Item[]>
  getItemById(id: string): Promise<Item | null>
  createItem(item: CreateItemDTO): Promise<Item>
  updateItem(id: string, updates: Partial<Item>): Promise<Item>
  deleteItem(id: string): Promise<void>
  incrementItemViews(id: string): Promise<void>

  // Requests
  getRequests(userId?: string): Promise<ItemRequest[]>
  getRequestById(id: string): Promise<ItemRequest | null>
  createRequest(request: CreateRequestDTO): Promise<ItemRequest>
  updateRequestStatus(id: string, status: RequestStatus, reason?: string): Promise<ItemRequest>

  // Handovers
  getHandovers(userId?: string): Promise<Handover[]>
  getHandoverById(id: string): Promise<Handover | null>
  confirmHandover(handoverId: string, role: 'giver' | 'taker'): Promise<Handover>

  // Impact & Analytics
  getImpactMetrics(): Promise<CampusImpactMetrics>

  // Static Metadata
  getCategories(): Promise<Category[]>
  getDepartments(): Promise<Department[]>
  getPickupPoints(): Promise<Array<{ id: string; name: string; building: string; floor: string; instructions: string }>>

  // Notifications
  getNotifications(userId: string): Promise<Notification[]>
  markNotificationAsRead(id: string): Promise<void>
  markAllNotificationsAsRead(userId: string): Promise<void>

  // Messages (Chat)
  getMessages(requestId: string): Promise<Message[]>
  sendMessage(message: SendMessageDTO): Promise<Message>

  // Wishlist
  getWishlist(userId: string): Promise<WishlistItem[]>
  addWishlistItem(item: AddWishlistDTO): Promise<WishlistItem>
  removeWishlistItem(id: string): Promise<void>

  // Moderation & Feedback
  submitReport(report: SubmitReportDTO): Promise<void>
  submitContactMessage(data: SubmitContactDTO): Promise<void>

  // Realtime subscription emulation
  subscribe(callback: () => void): () => void
}
