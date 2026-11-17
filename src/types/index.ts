export type UserRole = 'student' | 'faculty' | 'admin'

export type ItemCondition = 'new' | 'like_new' | 'good' | 'fair'

export type ItemStatus = 'available' | 'requested' | 'reserved' | 'reused' | 'removed'

export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed'

export type NotificationType =
  | 'request_received'
  | 'request_accepted'
  | 'request_declined'
  | 'handover_scheduled'
  | 'handover_confirmed'
  | 'item_reused'
  | 'wishlist_match'
  | 'system'

export interface Department {
  id: string
  name: string
  code: string
  building: string
  description?: string
  icon?: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  avg_weight_kg: number
  avg_value_inr: number
  created_at: string
}

export interface PickupPoint {
  id: string
  name: string
  building: string
  floor: string
  landmark?: string
  instructions: string
  active_hours?: string
  created_at?: string
}

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  department_id?: string
  department?: Department
  avatar_url?: string
  roll_number?: string
  bio?: string
  college_domain: string
  is_verified: boolean
  trust_score?: number
  badges?: string[]
  created_at: string
  updated_at: string
}

export interface Item {
  id: string
  title: string
  description: string
  category_id: string
  category?: Category
  department_id: string
  department?: Department
  owner_id: string
  owner?: Profile
  condition: ItemCondition
  quantity: number
  status: ItemStatus
  pickup_location: string
  pickup_point_id?: string
  images: string[]
  views_count?: number
  expires_at?: string
  expiry_date?: string
  search_vector?: string
  created_at: string
  updated_at: string
}

export interface ItemRequest {
  id: string
  item_id: string
  item?: Item
  requester_id: string
  requester?: Profile
  owner_id: string
  owner?: Profile
  message: string
  status: RequestStatus
  decline_reason?: string
  created_at: string
  updated_at: string
}

export interface Handover {
  id: string
  request_id: string
  request?: ItemRequest
  item_id: string
  item?: Item
  giver_id: string
  giver?: Profile
  taker_id: string
  taker?: Profile
  giver_confirmed: boolean
  taker_confirmed: boolean
  pickup_point_id?: string
  scheduled_at?: string
  location?: string
  completed_at?: string
  notes?: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  link?: string
  is_read: boolean
  created_at: string
}

export interface Message {
  id: string
  request_id: string
  sender_id: string
  sender?: Profile
  receiver_id: string
  receiver?: Profile
  content: string
  image_url?: string
  read_at?: string
  created_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  keyword: string
  category_id?: string
  category?: Category
  notify_email: boolean
  created_at: string
}

export interface SavedItem {
  id: string
  user_id: string
  item_id: string
  item?: Item
  created_at: string
}

export interface Review {
  id: string
  handover_id: string
  reviewer_id: string
  reviewer?: Profile
  target_user_id: string
  rating: number // 1 to 5
  comment: string
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  reporter?: Profile
  item_id?: string
  item?: Item
  target_user_id?: string
  reason: string
  details?: string
  status: 'pending' | 'reviewed' | 'dismissed'
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  topic: string
  message: string
  status: 'new' | 'in_progress' | 'resolved'
  created_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'General' | 'Giving Items' | 'Receiving Items' | 'Safety & Policies' | 'Impact & Badges'
  order: number
}

export interface Announcement {
  id: string
  title: string
  content: string
  type: 'info' | 'success' | 'warning'
  is_active: boolean
  link_url?: string
  created_at: string
}

export interface Campaign {
  id: string
  title: string
  description: string
  target_kg: number
  current_kg: number
  start_date: string
  end_date: string
  is_active: boolean
  banner_image: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  criteria: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  badge?: Badge
  earned_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  user_name: string
  department_code: string
  item_title: string
  action: 'listed' | 'requested' | 'reused'
  timestamp: string
}

export interface CampusImpactMetrics {
  total_items_reused: number
  total_kg_waste_avoided: number
  total_inr_saved: number
  monthly_cumulative: {
    month: string
    items_count: number
    kg_avoided: number
    inr_saved: number
  }[]
  categories_breakdown: {
    category_name: string
    category_slug: string
    items_count: number
    kg_avoided: number
    inr_saved: number
  }[]
  departments_leaderboard: {
    department_name: string
    department_code: string
    items_count: number
    kg_avoided: number
    inr_saved: number
  }[]
}
