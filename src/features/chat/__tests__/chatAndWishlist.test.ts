import { describe, it, expect } from 'vitest'
import { mockStore } from '@/lib/mockStore'
import { setLanguage, getLanguage } from '@/lib/i18n'

describe('ReUseHub v1.1 Chat, Wishlist & Localization Features', () => {
  it('allows sending and retrieving realtime messages per request', () => {
    const requests = mockStore.getRequests()
    expect(requests.length).toBeGreaterThan(0)
    const testReq = requests[0]

    const initialMessages = mockStore.getMessages(testReq.id)
    const newMsg = mockStore.sendMessage(
      testReq.id,
      testReq.requester_id,
      testReq.owner_id,
      'I will be near the library at 3:15 PM.'
    )

    expect(newMsg.id).toBeDefined()
    expect(newMsg.content).toBe('I will be near the library at 3:15 PM.')

    const updatedMessages = mockStore.getMessages(testReq.id)
    expect(updatedMessages.length).toBe(initialMessages.length + 1)
    expect(updatedMessages[updatedMessages.length - 1].content).toBe(
      'I will be near the library at 3:15 PM.'
    )
  })

  it('manages wishlist keywords and triggers match notifications on matching item listings', () => {
    const user = mockStore.getUsers()[0]
    const testKeyword = 'Quadrocopter Frame'

    // Add wishlist alert
    const wishlistItem = mockStore.addWishlist(user.id, testKeyword)
    expect(wishlistItem.id).toBeDefined()
    expect(wishlistItem.keyword).toBe(testKeyword)

    const initialNotifs = mockStore.getNotifications(user.id).length

    // Different user adds an item matching this keyword
    const otherUser = mockStore.getUsers()[1]
    const categories = mockStore.getCategories()
    const departments = mockStore.getDepartments()

    mockStore.addItem({
      title: 'Carbon Fiber Quadrocopter Frame Kit',
      description: 'Surplus drone frame from robotics club.',
      category_id: categories[1].id,
      department_id: departments[1].id,
      owner_id: otherUser.id,
      condition: 'like_new',
      quantity: 1,
      status: 'available',
      pickup_location: 'Robotics Lab B',
      images: ['https://example.com/drone.jpg'],
    })

    // User should have received an instant wishlist match notification
    const updatedNotifs = mockStore.getNotifications(user.id)
    expect(updatedNotifs.length).toBeGreaterThan(initialNotifs)
    const matchNotif = updatedNotifs.find((n) => n.type === 'wishlist_match')
    expect(matchNotif).toBeDefined()
    expect(matchNotif?.title).toContain('Wishlist Match')
  })

  it('toggles language between English and Hindi correctly', () => {
    setLanguage('en')
    expect(getLanguage()).toBe('en')

    setLanguage('hi')
    expect(getLanguage()).toBe('hi')

    // Reset back to English
    setLanguage('en')
    expect(getLanguage()).toBe('en')
  })
})
