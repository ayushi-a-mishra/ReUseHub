import { describe, it, expect } from 'vitest'
import { addItemSchema } from '../schemas/itemSchema'
import { mockStore } from '@/lib/mockStore'

describe('Phase 2: Items Discovery & Listing Flow', () => {
  it('validates correct item data via Zod schema', () => {
    const validData = {
      title: 'Operating System Concepts 9th Edition',
      category_id: 'c1',
      department_id: 'd1',
      condition: 'good' as const,
      quantity: 1,
      pickup_location: 'Central Library Helpdesk',
      description: 'Used for CSE OS class. Includes all chapters and exercises.',
      images: ['https://example.com/cover.jpg'],
    }

    const result = addItemSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('fails validation when title or images are missing', () => {
    const invalidData = {
      title: 'ab', // too short (<3)
      category_id: 'c1',
      department_id: 'd1',
      condition: 'good' as const,
      quantity: 0, // must be >= 1
      pickup_location: 'Central Library',
      description: 'Short',
      images: [], // must have at least 1 image
    }

    const result = addItemSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      expect(fieldErrors.title).toBeDefined()
      expect(fieldErrors.images).toBeDefined()
      expect(fieldErrors.quantity).toBeDefined()
    }
  })

  it('allows browsing and filtering items accurately', () => {
    const allItems = mockStore.getItems()
    expect(allItems.length).toBeGreaterThanOrEqual(15)

    // Test search filter
    const searchMatches = allItems.filter(
      (i) => i.title.toLowerCase().includes('clrs') || i.description.toLowerCase().includes('clrs')
    )
    expect(searchMatches.length).toBeGreaterThan(0)
    expect(searchMatches[0].title).toContain('CLRS')

    // Test category filtering
    const books = allItems.filter((i) => i.category?.slug === 'books-textbooks')
    expect(books.length).toBeGreaterThan(0)

    // Test condition filtering
    const likeNewItems = allItems.filter((i) => i.condition === 'like_new')
    expect(likeNewItems.length).toBeGreaterThan(0)
  })

  it('adds a new item and reflects in store immediately', () => {
    const user = mockStore.getUsers()[0]
    const categories = mockStore.getCategories()
    const departments = mockStore.getDepartments()

    const beforeCount = mockStore.getItems().length

    const newItem = mockStore.addItem({
      title: 'Texas Instruments TI-84 Plus CE Graphing Calculator',
      description: 'Rechargeable battery, approved for engineering calculus and statistics.',
      category_id: categories[2].id,
      category: categories[2],
      department_id: departments[0].id,
      department: departments[0],
      owner_id: user.id,
      owner: user,
      condition: 'like_new',
      quantity: 1,
      status: 'available',
      pickup_location: 'Ramanujan Tower Math Lounge',
      images: ['https://example.com/ti84.jpg'],
    })

    const afterCount = mockStore.getItems().length
    expect(afterCount).toBe(beforeCount + 1)
    expect(newItem.title).toContain('Texas Instruments')
    expect(newItem.status).toBe('available')

    const retrieved = mockStore.getItemById(newItem.id)
    expect(retrieved?.id).toBe(newItem.id)
  })
})
