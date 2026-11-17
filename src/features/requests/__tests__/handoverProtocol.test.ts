import { describe, it, expect } from 'vitest'
import { mockStore } from '@/lib/mockStore'

describe('Phase 3: Requests, Approvals, Statuses, Handover & Notifications', () => {
  it('creates an item request and notifies the owner', () => {
    const giver = mockStore.getUsers()[0] // Priya Sharma
    const taker = mockStore.getUsers()[1] // Dr. Aris Thorne
    const categories = mockStore.getCategories()
    const departments = mockStore.getDepartments()

    // Create an item
    const testItem = mockStore.addItem({
      title: 'Lab Oscilloscope Probe Kit',
      description: '100MHz oscilloscope probes with attenuation switch.',
      category_id: categories[1].id,
      category: categories[1],
      department_id: departments[1].id,
      department: departments[1],
      owner_id: giver.id,
      owner: giver,
      condition: 'like_new',
      quantity: 1,
      status: 'available',
      pickup_location: 'Tesla Hall Room 108',
      images: ['https://example.com/probe.jpg'],
    })

    const initialNotifCount = mockStore.getNotifications(giver.id).length

    // Taker requests item
    const request = mockStore.createRequest(
      testItem.id,
      taker,
      'We need this probe for our undergraduate photonics experiment.'
    )

    expect(request.id).toBeDefined()
    expect(request.status).toBe('pending')
    expect(request.item_id).toBe(testItem.id)

    // Verify item is now marked requested
    const updatedItem = mockStore.getItemById(testItem.id)
    expect(updatedItem?.status).toBe('requested')

    // Verify owner received notification
    const giverNotifs = mockStore.getNotifications(giver.id)
    expect(giverNotifs.length).toBe(initialNotifCount + 1)
    expect(giverNotifs[0].type).toBe('request_received')
  })

  it('declining a request sets status to declined and frees item to available', () => {
    const giver = mockStore.getUsers()[0]
    const taker = mockStore.getUsers()[3]
    const categories = mockStore.getCategories()
    const departments = mockStore.getDepartments()

    const item = mockStore.addItem({
      title: 'Chemistry Glass Beakers 500ml',
      description: 'Borosilicate glassware set.',
      category_id: categories[5].id,
      category: categories[5],
      department_id: departments[4].id,
      department: departments[4],
      owner_id: giver.id,
      owner: giver,
      condition: 'good',
      quantity: 2,
      status: 'available',
      pickup_location: 'Mendel Block',
      images: ['https://example.com/beaker.jpg'],
    })

    const req = mockStore.createRequest(item.id, taker, 'Need beakers')
    expect(mockStore.getItemById(item.id)?.status).toBe('requested')

    // Owner declines
    mockStore.updateRequestStatus(req.id, 'declined')

    const declinedReq = mockStore.getRequests().find((r) => r.id === req.id)
    expect(declinedReq?.status).toBe('declined')

    // Item should be restored to available
    const restoredItem = mockStore.getItemById(item.id)
    expect(restoredItem?.status).toBe('available')
  })

  it('completes the full dual-confirmation handover and logs impact metrics', () => {
    const giver = mockStore.getUsers()[0]
    const taker = mockStore.getUsers()[1]
    const categories = mockStore.getCategories()
    const departments = mockStore.getDepartments()

    const initialImpact = mockStore.getImpactMetrics()

    const item = mockStore.addItem({
      title: 'Full Mechanics Drawing Mini Drafter',
      description: 'Standard drafting table instrument.',
      category_id: categories[2].id, // Stationery & Art (avg 0.4kg, avg ₹450)
      category: categories[2],
      department_id: departments[2].id,
      department: departments[2],
      owner_id: giver.id,
      owner: giver,
      condition: 'good',
      quantity: 1,
      status: 'available',
      pickup_location: 'Mechanical Workshop',
      images: ['https://example.com/drafter.jpg'],
    })

    const req = mockStore.createRequest(item.id, taker, 'Drafting class use')

    // 1. Owner approves
    mockStore.updateRequestStatus(req.id, 'accepted')
    expect(mockStore.getItemById(item.id)?.status).toBe('reserved')

    // Handover should be automatically initialized
    const handover = mockStore.getHandovers().find((h) => h.request_id === req.id)
    expect(handover).toBeDefined()
    expect(handover?.completed_at).toBeUndefined()

    // 2. Giver confirms alone: not yet complete
    mockStore.confirmHandover(handover!.id, 'giver')
    let currentHandover = mockStore.getHandovers().find((h) => h.id === handover!.id)
    expect(currentHandover?.giver_confirmed).toBe(true)
    expect(currentHandover?.taker_confirmed).toBe(false)
    expect(currentHandover?.completed_at).toBeUndefined()
    expect(mockStore.getItemById(item.id)?.status).toBe('reserved')

    // 3. Taker confirms: BOTH have confirmed!
    mockStore.confirmHandover(handover!.id, 'taker')
    currentHandover = mockStore.getHandovers().find((h) => h.id === handover!.id)
    expect(currentHandover?.taker_confirmed).toBe(true)
    expect(currentHandover?.completed_at).toBeDefined()

    // Request should be marked completed
    const finalReq = mockStore.getRequests().find((r) => r.id === req.id)
    expect(finalReq?.status).toBe('completed')

    // Item should be marked reused
    const finalItem = mockStore.getItemById(item.id)
    expect(finalItem?.status).toBe('reused')

    // Total campus impact should have increased
    const finalImpact = mockStore.getImpactMetrics()
    expect(finalImpact.total_items_reused).toBe(initialImpact.total_items_reused + 1)
    expect(finalImpact.total_kg_waste_avoided).toBe(initialImpact.total_kg_waste_avoided + categories[2].avg_weight_kg)
    expect(finalImpact.total_inr_saved).toBe(initialImpact.total_inr_saved + categories[2].avg_value_inr)
  })

  it('manages in-app notifications and unread badges properly', () => {
    const user = mockStore.getUsers()[0]
    mockStore.addNotification({
      user_id: user.id,
      title: 'Handover Completed Test',
      message: 'Verified successfully',
      type: 'item_reused',
    })

    const notifs = mockStore.getNotifications(user.id)
    expect(notifs.length).toBeGreaterThan(0)
    const latest = notifs[0]
    expect(latest.is_read).toBe(false)

    // Mark single notification read
    mockStore.markNotificationAsRead(latest.id)
    const updatedNotifs = mockStore.getNotifications(user.id)
    expect(updatedNotifs.find((n) => n.id === latest.id)?.is_read).toBe(true)

    // Mark all read
    mockStore.markAllNotificationsAsRead(user.id)
    const allRead = mockStore.getNotifications(user.id)
    expect(allRead.every((n) => n.is_read)).toBe(true)
  })
})
