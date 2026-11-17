import {
  IRepository,
  ItemFilter,
  CreateItemDTO,
  CreateRequestDTO,
  SendMessageDTO,
  AddWishlistDTO,
  SubmitReportDTO,
  SubmitContactDTO,
} from './types'
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
} from '@/types'
import { mockStore } from '@/lib/mockStore'
import { MOCK_USERS } from '@/lib/mockData'
import { campusConfig } from '@/config/campus'

export class MockRepository implements IRepository {
  // Items
  async getItems(filter?: ItemFilter): Promise<Item[]> {
    let items = mockStore.getItems()

    if (filter) {
      if (filter.categoryId && filter.categoryId !== 'all') {
        items = items.filter((i) => i.category_id === filter.categoryId)
      }
      if (filter.departmentId && filter.departmentId !== 'all') {
        items = items.filter((i) => i.department_id === filter.departmentId)
      }
      if (filter.condition) {
        items = items.filter((i) => i.condition === filter.condition)
      }
      if (filter.status) {
        items = items.filter((i) => i.status === filter.status)
      }
      if (filter.ownerId) {
        items = items.filter((i) => i.owner_id === filter.ownerId)
      }
      if (filter.search) {
        const query = filter.search.toLowerCase()
        items = items.filter(
          (i) =>
            i.title.toLowerCase().includes(query) ||
            i.description.toLowerCase().includes(query) ||
            i.category?.name.toLowerCase().includes(query) ||
            i.department?.name.toLowerCase().includes(query)
        )
      }
    }

    return items
  }

  async getItemById(id: string): Promise<Item | null> {
    return mockStore.getItemById(id) || null
  }

  async createItem(item: CreateItemDTO): Promise<Item> {
    return mockStore.addItem({
      title: item.title,
      description: item.description,
      category_id: item.category_id,
      department_id: item.department_id,
      owner_id: item.owner_id,
      condition: item.condition,
      quantity: item.quantity,
      status: item.status || 'available',
      pickup_location: item.pickup_location,
      images: item.images,
      expiry_date: item.expiry_date,
    })
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item> {
    return mockStore.updateItem(id, updates)
  }

  async deleteItem(id: string): Promise<void> {
    mockStore.deleteItem(id)
  }

  async incrementItemViews(id: string): Promise<void> {
    const item = mockStore.getItemById(id)
    if (item) {
      mockStore.updateItem(id, { views_count: (item.views_count || 0) + 1 })
    }
  }

  // Requests
  async getRequests(userId?: string): Promise<ItemRequest[]> {
    if (userId) {
      return mockStore.getUserRequests(userId)
    }
    return mockStore.getRequests()
  }

  async getRequestById(id: string): Promise<ItemRequest | null> {
    return mockStore.getRequestById(id) || null
  }

  async createRequest(request: CreateRequestDTO): Promise<ItemRequest> {
    const requester = mockStore.getUserById(request.requester_id) || MOCK_USERS[0]
    return mockStore.createRequest(request.item_id, requester, request.message)
  }

  async updateRequestStatus(id: string, status: RequestStatus, _reason?: string): Promise<ItemRequest> {
    mockStore.updateRequestStatus(id, status)
    const updated = mockStore.getRequestById(id)
    if (!updated) throw new Error('Request not found')
    return updated
  }

  // Handovers
  async getHandovers(userId?: string): Promise<Handover[]> {
    if (userId) {
      return mockStore.getUserHandovers(userId)
    }
    return mockStore.getHandovers()
  }

  async getHandoverById(id: string): Promise<Handover | null> {
    return mockStore.getHandoverById(id) || null
  }

  async confirmHandover(handoverId: string, role: 'giver' | 'taker'): Promise<Handover> {
    const res = mockStore.confirmHandover(handoverId, role)
    if (!res) throw new Error('Handover not found')
    return res
  }

  // Impact
  async getImpactMetrics(): Promise<CampusImpactMetrics> {
    return mockStore.getImpactMetrics()
  }

  // Categories & Departments
  async getCategories(): Promise<Category[]> {
    return mockStore.getCategories()
  }

  async getDepartments(): Promise<Department[]> {
    return mockStore.getDepartments()
  }

  async getPickupPoints(): Promise<Array<{ id: string; name: string; building: string; floor: string; instructions: string }>> {
    return campusConfig.pickupPoints.map((pp) => ({
      id: pp.id,
      name: pp.name,
      building: pp.building,
      floor: pp.floor,
      instructions: pp.instructions,
    }))
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    return mockStore.getUserNotifications(userId)
  }

  async markNotificationAsRead(id: string): Promise<void> {
    mockStore.markNotificationRead(id)
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    mockStore.markAllNotificationsRead(userId)
  }

  // Chat Messages
  async getMessages(requestId: string): Promise<Message[]> {
    return mockStore.getMessages(requestId)
  }

  async sendMessage(message: SendMessageDTO): Promise<Message> {
    return mockStore.sendMessage(
      message.request_id,
      message.sender_id,
      message.receiver_id,
      message.content
    )
  }

  // Wishlist
  async getWishlist(userId: string): Promise<WishlistItem[]> {
    return mockStore.getWishlist(userId)
  }

  async addWishlistItem(item: AddWishlistDTO): Promise<WishlistItem> {
    return mockStore.addWishlist(item.user_id, item.keyword, item.category_id)
  }

  async removeWishlistItem(id: string): Promise<void> {
    mockStore.removeWishlist(id)
  }

  // Moderation & Feedback
  async submitReport(report: SubmitReportDTO): Promise<void> {
    const storedReports = JSON.parse(localStorage.getItem('reusehub_reports') || '[]')
    storedReports.push({
      id: `rep_${Date.now()}`,
      reporter_id: report.reporter_id,
      item_id: report.item_id,
      reason: report.reason,
      details: report.details,
      status: 'pending',
      created_at: new Date().toISOString(),
    })
    localStorage.setItem('reusehub_reports', JSON.stringify(storedReports))
  }

  async submitContactMessage(data: SubmitContactDTO): Promise<void> {
    const storedMessages = JSON.parse(localStorage.getItem('reusehub_contact_messages') || '[]')
    storedMessages.push({
      id: `msg_${Date.now()}`,
      name: data.name,
      email: data.email,
      topic: data.topic,
      message: data.message,
      status: 'new',
      created_at: new Date().toISOString(),
    })
    localStorage.setItem('reusehub_contact_messages', JSON.stringify(storedMessages))
  }

  // Realtime subscription
  subscribe(callback: () => void): () => void {
    return mockStore.subscribe(callback)
  }
}
