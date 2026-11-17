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
import { supabase } from '@/lib/supabase'
import { campusConfig } from '@/config/campus'

export class SupabaseRepository implements IRepository {
  private get client() {
    if (!supabase) {
      throw new Error('Supabase client is not configured.')
    }
    return supabase
  }

  async getItems(filter?: ItemFilter): Promise<Item[]> {
    let query = this.client
      .from('items')
      .select('*, category:categories(*), department:departments(*), owner:profiles(*)')
      .order('created_at', { ascending: false })

    if (filter) {
      if (filter.categoryId && filter.categoryId !== 'all') {
        query = query.eq('category_id', filter.categoryId)
      }
      if (filter.departmentId && filter.departmentId !== 'all') {
        query = query.eq('department_id', filter.departmentId)
      }
      if (filter.condition) {
        query = query.eq('condition', filter.condition)
      }
      if (filter.status) {
        query = query.eq('status', filter.status)
      }
      if (filter.ownerId) {
        query = query.eq('owner_id', filter.ownerId)
      }
      if (filter.search) {
        query = query.ilike('title', `%${filter.search}%`)
      }
    }

    const { data, error } = await query
    if (error) throw error
    return (data as unknown as Item[]) || []
  }

  async getItemById(id: string): Promise<Item | null> {
    const { data, error } = await this.client
      .from('items')
      .select('*, category:categories(*), department:departments(*), owner:profiles(*)')
      .eq('id', id)
      .single()

    if (error) return null
    return data as unknown as Item
  }

  async createItem(item: CreateItemDTO): Promise<Item> {
    const { data, error } = await this.client
      .from('items')
      .insert({
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
      .select('*, category:categories(*), department:departments(*), owner:profiles(*)')
      .single()

    if (error) throw error
    return data as unknown as Item
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item> {
    const { data, error } = await this.client
      .from('items')
      .update(updates)
      .eq('id', id)
      .select('*, category:categories(*), department:departments(*), owner:profiles(*)')
      .single()

    if (error) throw error
    return data as unknown as Item
  }

  async deleteItem(id: string): Promise<void> {
    const { error } = await this.client.from('items').delete().eq('id', id)
    if (error) throw error
  }

  async incrementItemViews(id: string): Promise<void> {
    await this.client.rpc('increment_item_views', { item_id: id })
  }

  async getRequests(userId?: string): Promise<ItemRequest[]> {
    let query = this.client
      .from('requests')
      .select('*, item:items(*), requester:profiles(*), owner:profiles(*)')
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.or(`requester_id.eq.${userId},owner_id.eq.${userId}`)
    }

    const { data, error } = await query
    if (error) throw error
    return (data as unknown as ItemRequest[]) || []
  }

  async getRequestById(id: string): Promise<ItemRequest | null> {
    const { data, error } = await this.client
      .from('requests')
      .select('*, item:items(*), requester:profiles(*), owner:profiles(*)')
      .eq('id', id)
      .single()

    if (error) return null
    return data as unknown as ItemRequest
  }

  async createRequest(request: CreateRequestDTO): Promise<ItemRequest> {
    const { data, error } = await this.client
      .from('requests')
      .insert({
        item_id: request.item_id,
        requester_id: request.requester_id,
        owner_id: request.owner_id,
        message: request.message,
        status: 'pending',
      })
      .select('*, item:items(*), requester:profiles(*), owner:profiles(*)')
      .single()

    if (error) throw error
    return data as unknown as ItemRequest
  }

  async updateRequestStatus(id: string, status: RequestStatus, _reason?: string): Promise<ItemRequest> {
    const { data, error } = await this.client
      .from('requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*, item:items(*), requester:profiles(*), owner:profiles(*)')
      .single()

    if (error) throw error

    if (status === 'accepted' && data) {
      // Create handover record
      await this.client.from('handovers').insert({
        request_id: id,
        item_id: data.item_id,
        giver_id: data.owner_id,
        taker_id: data.requester_id,
        giver_confirmed: false,
        taker_confirmed: false,
      })
      // Update item status to reserved
      await this.client.from('items').update({ status: 'reserved' }).eq('id', data.item_id)
    }

    return data as unknown as ItemRequest
  }

  async getHandovers(userId?: string): Promise<Handover[]> {
    let query = this.client
      .from('handovers')
      .select('*, item:items(*), request:requests(*), giver:profiles(*), taker:profiles(*)')
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.or(`giver_id.eq.${userId},taker_id.eq.${userId}`)
    }

    const { data, error } = await query
    if (error) throw error
    return (data as unknown as Handover[]) || []
  }

  async getHandoverById(id: string): Promise<Handover | null> {
    const { data, error } = await this.client
      .from('handovers')
      .select('*, item:items(*), request:requests(*), giver:profiles(*), taker:profiles(*)')
      .eq('id', id)
      .single()

    if (error) return null
    return data as unknown as Handover
  }

  async confirmHandover(handoverId: string, role: 'giver' | 'taker'): Promise<Handover> {
    const field = role === 'giver' ? 'giver_confirmed' : 'taker_confirmed'
    const { data: current } = await this.client.from('handovers').select('*').eq('id', handoverId).single()

    const otherField = role === 'giver' ? 'taker_confirmed' : 'giver_confirmed'
    const isCompleted = current && current[otherField] === true

    const updates: Record<string, unknown> = { [field]: true }
    if (isCompleted) {
      updates.completed_at = new Date().toISOString()
    }

    const { data, error } = await this.client
      .from('handovers')
      .update(updates)
      .eq('id', handoverId)
      .select('*, item:items(*), request:requests(*), giver:profiles(*), taker:profiles(*)')
      .single()

    if (error) throw error

    if (isCompleted && current) {
      await this.client.from('items').update({ status: 'reused' }).eq('id', current.item_id)
    }

    return data as unknown as Handover
  }

  async getImpactMetrics(): Promise<CampusImpactMetrics> {
    const { data, error } = await this.client.rpc('get_campus_impact_metrics')
    if (error || !data) {
      return {
        total_items_reused: 0,
        total_kg_waste_avoided: 0,
        total_inr_saved: 0,
        monthly_cumulative: [],
        categories_breakdown: [],
        departments_leaderboard: [],
      }
    }
    return data as CampusImpactMetrics
  }

  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.client.from('categories').select('*').order('name')
    if (error) throw error
    return data as Category[]
  }

  async getDepartments(): Promise<Department[]> {
    const { data, error } = await this.client.from('departments').select('*').order('name')
    if (error) throw error
    return data as Department[]
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

  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await this.client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Notification[]
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.client.from('notifications').update({ is_read: true }).eq('id', id)
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await this.client.from('notifications').update({ is_read: true }).eq('user_id', userId)
  }

  async getMessages(requestId: string): Promise<Message[]> {
    const { data, error } = await this.client
      .from('messages')
      .select('*, sender:profiles(*), receiver:profiles(*)')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as unknown as Message[]
  }

  async sendMessage(message: SendMessageDTO): Promise<Message> {
    const { data, error } = await this.client
      .from('messages')
      .insert({
        request_id: message.request_id,
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        content: message.content,
      })
      .select('*, sender:profiles(*), receiver:profiles(*)')
      .single()

    if (error) throw error
    return data as unknown as Message
  }

  async getWishlist(userId: string): Promise<WishlistItem[]> {
    const { data, error } = await this.client
      .from('wishlist')
      .select('*, category:categories(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as unknown as WishlistItem[]
  }

  async addWishlistItem(item: AddWishlistDTO): Promise<WishlistItem> {
    const { data, error } = await this.client
      .from('wishlist')
      .insert({
        user_id: item.user_id,
        keyword: item.keyword,
        category_id: item.category_id,
        notify_email: item.notify_email ?? true,
      })
      .select('*, category:categories(*)')
      .single()

    if (error) throw error
    return data as unknown as WishlistItem
  }

  async removeWishlistItem(id: string): Promise<void> {
    await this.client.from('wishlist').delete().eq('id', id)
  }

  async submitReport(report: SubmitReportDTO): Promise<void> {
    const { error } = await this.client.from('reports').insert({
      reporter_id: report.reporter_id,
      item_id: report.item_id,
      reason: report.reason,
      details: report.details,
    })
    if (error) throw error
  }

  async submitContactMessage(data: SubmitContactDTO): Promise<void> {
    const { error } = await this.client.from('contact_messages').insert({
      name: data.name,
      email: data.email,
      topic: data.topic,
      message: data.message,
    })
    if (error) throw error
  }

  subscribe(callback: () => void): () => void {
    const channel = this.client
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        callback()
      })
      .subscribe()

    return () => {
      this.client.removeChannel(channel)
    }
  }
}
