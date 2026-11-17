import { z } from 'zod'

export const addItemSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  category_id: z.string().min(1, 'Please select a category'),
  department_id: z.string().min(1, 'Please select a department'),
  condition: z.enum(['new', 'like_new', 'good', 'fair'], {
    required_error: 'Please select item condition',
  }),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(50, 'Max quantity is 50'),
  pickup_location: z
    .string()
    .min(3, 'Pickup location must be at least 3 characters')
    .max(150, 'Location too long'),
  expiry_date: z.string().optional(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1500, 'Description cannot exceed 1500 characters'),
  images: z.array(z.string()).min(1, 'Please provide at least one photo'),
})

export type AddItemFormValues = z.infer<typeof addItemSchema>
