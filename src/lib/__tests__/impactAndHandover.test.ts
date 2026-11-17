import { describe, it, expect } from 'vitest'
import { mockStore } from '../mockStore'
import { formatCurrencyINR, formatWeightKg } from '../utils'

describe('ReUseHub Core Domain & Handover Protocols', () => {
  it('correctly calculates initial impact metrics from seeded items', () => {
    const impact = mockStore.getImpactMetrics()
    expect(impact.total_items_reused).toBeGreaterThan(0)
    expect(impact.total_kg_waste_avoided).toBeGreaterThan(0)
    expect(impact.total_inr_saved).toBeGreaterThan(0)
    expect(impact.departments_leaderboard.length).toBe(8)
    expect(impact.categories_breakdown.length).toBe(6)
  })

  it('formats currency and weights according to campus standards', () => {
    expect(formatCurrencyINR(1500)).toContain('1,500')
    expect(formatWeightKg(2.5)).toBe('2.5 kg')
    expect(formatWeightKg(1200)).toBe('1.2 tonnes')
  })

  it('handles item addition and status progression', () => {
    const user = mockStore.getUsers()[0]
    const categories = mockStore.getCategories()
    const departments = mockStore.getDepartments()

    const item = mockStore.addItem({
      title: 'Digital Signal Processing (Proakis)',
      description: 'ECE textbook for semester 5.',
      category_id: categories[0].id,
      category: categories[0],
      department_id: departments[1].id,
      department: departments[1],
      owner_id: user.id,
      owner: user,
      condition: 'good',
      quantity: 1,
      status: 'available',
      pickup_location: 'Tesla Hall 204',
      images: ['https://example.com/dsp.jpg'],
    })

    expect(item.id).toBeDefined()
    expect(item.status).toBe('available')

    const requester = mockStore.getUsers()[1]
    const req = mockStore.createRequest(item.id, requester, 'Need for class')
    expect(req.status).toBe('pending')

    const updatedItem = mockStore.getItemById(item.id)
    expect(updatedItem?.status).toBe('requested')

    mockStore.updateRequestStatus(req.id, 'accepted')
    const reservedItem = mockStore.getItemById(item.id)
    expect(reservedItem?.status).toBe('reserved')

    // Find created handover
    const handovers = mockStore.getHandovers()
    const handover = handovers.find((h) => h.request_id === req.id)
    expect(handover).toBeDefined()

    // Dual party confirmations
    mockStore.confirmHandover(handover!.id, 'giver')
    const completedHandover = mockStore.confirmHandover(handover!.id, 'taker')

    expect(completedHandover?.completed_at).toBeDefined()
    const reusedItem = mockStore.getItemById(item.id)
    expect(reusedItem?.status).toBe('reused')
  })
})
