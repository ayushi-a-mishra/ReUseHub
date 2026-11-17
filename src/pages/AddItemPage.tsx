import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { mockStore } from '@/lib/mockStore'
import { campusConfig } from '@/config/campus'
import { compressImage } from '@/lib/imageCompression'
import { addItemSchema, AddItemFormValues } from '@/features/items/schemas/itemSchema'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { Select } from '@/shared/ui/select'
import { Badge } from '@/shared/ui/badge'
import { useToast } from '@/shared/ui/toast'
import { formatCurrencyINR, formatWeightKg } from '@/lib/utils'
import {
  Upload,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Leaf,
  Clock,
  Camera,
  Layers,
  Check,
  AlertCircle,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const SAMPLE_PRESET_IMAGES: Record<string, string> = {
  'books-textbooks': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'lab-project-hardware': 'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=800&q=80',
  'stationery-art': 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
  'electronics-peripherals': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
  'dorm-furniture': 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=800&q=80',
  'sports-misc': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
}

const CONDITION_OPTIONS = [
  { value: 'like_new', label: 'Like New', desc: 'Practically untouched, zero defects' },
  { value: 'good', label: 'Good', desc: 'Minor semester wear, fully functional' },
  { value: 'fair', label: 'Fair', desc: 'Noticeable signs of use, 100% operational' },
  { value: 'new', label: 'Brand New', desc: 'Never opened or unboxed' },
]

const TIME_SLOTS = [
  'Morning (9:30 AM – 1:00 PM)',
  'Afternoon (1:00 PM – 4:00 PM)',
  'Evening (4:00 PM – 5:30 PM)',
  'Flexible (Coordinate via Chat)',
]

const DRAFT_KEY = 'reusehub_item_draft'

export function AddItemPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [isCompressing, setIsCompressing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [preferredSlot, setPreferredSlot] = useState(TIME_SLOTS[0])
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [createdItemId, setCreatedItemId] = useState<string | null>(null)

  const categories = mockStore.getCategories()
  const departments = mockStore.getDepartments()
  const pickupPoints = campusConfig.pickupPoints

  const defaultPickup = `${pickupPoints[0].name} (${pickupPoints[0].floor})`

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddItemFormValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: categories[0]?.id || '',
      department_id: departments[0]?.id || '',
      condition: 'good',
      quantity: 1,
      pickup_location: defaultPickup,
      images: [SAMPLE_PRESET_IMAGES['lab-project-hardware']],
      expiry_date: '',
    },
  })

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        reset(parsed)
      }
    } catch {
      // Ignore parse errors
    }
  }, [reset])

  const watchedValues = watch()
  const currentImages = watchedValues.images || []
  const selectedCategory = categories.find((c) => c.id === watchedValues.category_id)
  const selectedDepartment = departments.find((d) => d.id === watchedValues.department_id)

  // Auto-save draft on value changes
  useEffect(() => {
    if (watchedValues.title || watchedValues.description) {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(watchedValues))
      } catch {
        // storage quota exceeded
      }
    }
  }, [watchedValues])

  // Step navigation with field validation
  const goToStep = async (step: 1 | 2 | 3 | 4) => {
    if (step > currentStep) {
      if (currentStep === 1) {
        const valid = await trigger(['images'])
        if (!valid) {
          toast({ title: 'Photos Required', description: 'Please add at least one photo of the item', type: 'error' })
          return
        }
      } else if (currentStep === 2) {
        const valid = await trigger(['title', 'category_id', 'department_id', 'condition', 'quantity', 'description'])
        if (!valid) {
          toast({ title: 'Check Details', description: 'Please fill in all required item details', type: 'error' })
          return
        }
      } else if (currentStep === 3) {
        const valid = await trigger(['pickup_location'])
        if (!valid) {
          toast({ title: 'Select Pickup Location', description: 'Please choose a verified campus pickup point', type: 'error' })
          return
        }
      }
    }
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle file uploads with client-side compression
  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return

    if (currentImages.length >= 4) {
      toast({ title: 'Limit Reached', description: 'Maximum 4 photos allowed per listing', type: 'error' })
      return
    }

    setIsCompressing(true)
    const newCompressed: string[] = []

    try {
      const remainingSlots = 4 - currentImages.length
      const filesToProcess = Array.from(files).slice(0, remainingSlots)

      for (const file of filesToProcess) {
        const compressedDataUrl = await compressImage(file, 1200, 1200, 0.82)
        newCompressed.push(compressedDataUrl)
      }

      setValue('images', [...currentImages, ...newCompressed], { shouldValidate: true })
      toast({
        title: 'Photos Compressed & Added',
        description: `Added ${newCompressed.length} high-fidelity photo(s)`,
        type: 'success',
      })
    } catch {
      toast({ title: 'Upload Failed', description: 'Could not process selected image files', type: 'error' })
    } finally {
      setIsCompressing(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files)
  }

  const removeImage = (indexToRemove: number) => {
    const updated = currentImages.filter((_, idx) => idx !== indexToRemove)
    setValue('images', updated, { shouldValidate: true })
  }

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= currentImages.length) return
    const updated = [...currentImages]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    setValue('images', updated, { shouldValidate: true })
  }

  const useCategoryPreset = () => {
    if (selectedCategory && SAMPLE_PRESET_IMAGES[selectedCategory.slug]) {
      const preset = SAMPLE_PRESET_IMAGES[selectedCategory.slug]
      setValue('images', [preset], { shouldValidate: true })
      toast({ title: 'Preset Photo Set', description: `Loaded photo for ${selectedCategory.name}`, type: 'info' })
    }
  }

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    reset({
      title: '',
      description: '',
      category_id: categories[0]?.id || '',
      department_id: departments[0]?.id || '',
      condition: 'good',
      quantity: 1,
      pickup_location: defaultPickup,
      images: [SAMPLE_PRESET_IMAGES['lab-project-hardware']],
    })
    toast({ title: 'Draft Cleared', description: 'Form reset to clean state', type: 'info' })
  }

  // Estimated environmental and financial impact
  const estWeight = selectedCategory
    ? selectedCategory.avg_weight_kg * (watchedValues.quantity || 1)
    : 0.8
  const estValue = selectedCategory
    ? selectedCategory.avg_value_inr * (watchedValues.quantity || 1)
    : 500

  const onSubmit = (data: AddItemFormValues) => {
    if (!isAuthenticated || !user) {
      toast({ title: 'Sign In Required', description: 'Please sign in to list campus items', type: 'error' })
      return
    }

    const newItem = mockStore.addItem({
      title: data.title,
      description: data.description,
      category_id: data.category_id,
      category: categories.find((c) => c.id === data.category_id),
      department_id: data.department_id,
      department: departments.find((d) => d.id === data.department_id),
      owner_id: user.id,
      owner: user,
      condition: data.condition,
      quantity: data.quantity,
      status: 'available',
      pickup_location: `${data.pickup_location} • ${preferredSlot}`,
      images: data.images,
      expiry_date: data.expiry_date,
    })

    // Confetti blast celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#16A34A', '#22C55E', '#F97316', '#38BDF8'],
    })

    // Clear saved draft
    localStorage.removeItem(DRAFT_KEY)

    setCreatedItemId(newItem.id)
    setIsSuccessModalOpen(true)
  }

  return (
    <div className="container py-8 pb-32 max-w-4xl mx-auto px-4 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
          <Leaf className="h-3.5 w-3.5" />
          <span>{campusConfig.shortName} &bull; Circular Exchange</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          List an Item for Campus Reuse
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-xl">
          Pass down usable electronics, textbooks, drawing tools, or dorm essentials to SLRTCE peers. Zero money involved.
        </p>
      </div>

      {/* 4-Step Animated Wizard Stepper */}
      <div className="space-y-3 border-b border-border/80 pb-4">
        {/* Mobile progress bar */}
        <div className="sm:hidden space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-foreground">
            <span className="text-primary flex items-center gap-1.5">
              <span>Step {currentStep} of 4:</span>
              <span className="text-foreground">
                {currentStep === 1 ? 'Photos' : currentStep === 2 ? 'Details' : currentStep === 3 ? 'Pickup Location' : 'Review & Publish'}
              </span>
            </span>
            <span className="text-text-muted font-normal text-[11px]">{currentStep * 25}% Complete</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${currentStep * 25}%` }}
            />
          </div>
        </div>

        {/* Desktop / Tablet Step Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { step: 1, label: 'Photos', icon: Camera },
            { step: 2, label: 'Details', icon: Layers },
            { step: 3, label: 'Pickup', icon: MapPin },
            { step: 4, label: 'Review', icon: Eye },
          ].map((s) => {
            const Icon = s.icon
            const isDone = currentStep > s.step
            const isCurrent = currentStep === s.step

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => goToStep(s.step as 1 | 2 | 3 | 4)}
                className={`flex items-center justify-center sm:justify-start gap-2 p-2 sm:p-2.5 rounded-xl text-left transition-all ${
                  isCurrent
                    ? 'bg-primary/10 text-primary font-bold shadow-xs'
                    : isDone
                    ? 'text-foreground hover:bg-muted font-medium'
                    : 'text-text-muted opacity-60 hover:opacity-100'
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                      : isDone
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-text-muted'
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : <Icon className="h-3.5 w-3.5" />}
                </div>
                <div className="hidden sm:block">
                  <span className="text-xs block leading-tight">{s.label}</span>
                  <span className="text-[10px] text-text-muted">Step {s.step}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: PHOTOS & UPLOADS */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="font-heading text-xl font-bold text-foreground">Step 1: Item Photographs</h2>
                <p className="text-xs text-text-muted">
                  Add up to 4 clear photos showing the real item condition, serial labels, or accessories.
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center rounded-hero border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-primary bg-primary/10 scale-[1.01]'
                    : 'border-border/90 bg-card hover:border-primary/50 hover:bg-surface-raised'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                  <Upload className="h-6 w-6 stroke-[2.2]" />
                </div>

                <h3 className="font-heading text-sm font-bold text-foreground">
                  Click to upload or drag & drop photos
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  Supports JPEG, PNG, WebP up to 10MB (automatically compressed on device)
                </p>

                {isCompressing && (
                  <div className="mt-2 text-xs font-semibold text-primary animate-pulse">
                    Compressing high-resolution photo on device...
                  </div>
                )}

                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-primary">
                    {currentImages.length}/4 photos uploaded
                  </span>
                  <span className="text-[10px] text-text-muted">&bull; First photo is the primary cover</span>
                </div>
              </div>

              {/* Image Previews with Reorder & Delete */}
              {currentImages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Photo Reel</span>
                    <button
                      type="button"
                      onClick={useCategoryPreset}
                      className="text-[11px] text-primary hover:underline font-semibold"
                    >
                      Load Campus Preset Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {currentImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[4/3] rounded-card border-2 border-border/80 bg-surface-raised overflow-hidden shadow-xs group"
                      >
                        <img src={img} alt={`Upload ${idx + 1}`} className="h-full w-full object-cover" />

                        {idx === 0 && (
                          <span className="absolute top-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                            Cover
                          </span>
                        )}

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(idx, 'left')}
                              className="p-1 rounded-full bg-white/20 text-white hover:bg-white/40"
                              title="Move Left"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="p-1 rounded-full bg-destructive text-white hover:bg-destructive/80"
                            title="Remove Photo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>

                          {idx < currentImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(idx, 'right')}
                              className="p-1 rounded-full bg-white/20 text-white hover:bg-white/40"
                              title="Move Right"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.images && (
                <p className="text-xs text-destructive font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.images.message}</span>
                </p>
              )}

              {/* Navigation Button */}
              <div className="flex justify-end pt-4 border-t border-border/60">
                <Button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="font-bold text-xs gap-1.5"
                  disabled={currentImages.length === 0}
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: DETAILS & SPECIFICATIONS */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="font-heading text-xl font-bold text-foreground">Step 2: Listing Details</h2>
                <p className="text-xs text-text-muted">
                  Provide descriptive information so peers know exact specifications and condition.
                </p>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Item Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Arduino Uno R3 with 37 Sensor Modules"
                    {...register('title')}
                    error={errors.title?.message}
                  />
                </div>

                {/* Category & Department Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Category <span className="text-destructive">*</span>
                    </label>
                    <Select {...register('category_id')}>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({cat.avg_weight_kg} kg avg)
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Department Origin <span className="text-destructive">*</span>
                    </label>
                    <Select {...register('department_id')}>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Condition Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Condition <span className="text-destructive">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {CONDITION_OPTIONS.map((c) => {
                      const isSelected = watchedValues.condition === c.value
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setValue('condition', c.value as any, { shouldValidate: true })}
                          className={`rounded-card border p-3 text-left transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/10 shadow-xs'
                              : 'border-border/80 bg-card hover:border-primary/40'
                          }`}
                        >
                          <div className="text-xs font-bold text-foreground">{c.label}</div>
                          <p className="text-[10px] text-text-muted mt-0.5 leading-snug">{c.desc}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Quantity & Expiry Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Quantity Available</label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      {...register('quantity', { valueAsNumber: true })}
                      error={errors.quantity?.message}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Auto-Archive Date <span className="text-[10px] text-text-muted font-normal">(Optional)</span>
                    </label>
                    <Input type="date" {...register('expiry_date')} />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">
                      Description <span className="text-destructive">*</span>
                    </label>
                    <span className="text-[10px] text-text-muted">
                      {watchedValues.description?.length || 0}/1500 chars
                    </span>
                  </div>
                  <Textarea
                    rows={4}
                    placeholder="Describe included cables, edition, semester it was used in, and any minor cosmetic wear..."
                    {...register('description')}
                    error={errors.description?.message}
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goToStep(1)}
                  className="font-bold text-xs gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Photos</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="font-bold text-xs gap-1.5"
                >
                  <span>Continue to Pickup</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PICKUP & HANDOVER LOGISTICS */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="font-heading text-xl font-bold text-foreground">Step 3: Campus Pickup Point</h2>
                <p className="text-xs text-text-muted">
                  Choose one of the 5 official monitored SLRTCE handover locations and your available time slots.
                </p>
              </div>

              {/* Pickup Point Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-foreground">
                  Select Monitored Campus Spot <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pickupPoints.map((point) => {
                    const pointLabel = `${point.name} (${point.floor})`
                    const isSelected = watchedValues.pickup_location?.startsWith(point.name)

                    return (
                      <button
                        key={point.id}
                        type="button"
                        onClick={() => setValue('pickup_location', pointLabel, { shouldValidate: true })}
                        className={`rounded-card border p-4 text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-xs'
                            : 'border-border/80 bg-card hover:border-primary/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Badge variant="success" className="text-[9px] uppercase font-bold">
                              {point.floor}
                            </Badge>
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <div className="font-heading text-xs font-bold text-foreground mt-1">
                            {point.name}
                          </div>
                          <p className="text-[11px] text-text-muted leading-relaxed">
                            {point.instructions}
                          </p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border/40 text-[10px] text-text-muted flex items-center gap-1">
                          <Clock className="h-3 w-3 text-primary" />
                          <span>{point.activeHours}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Preferred Time Slot */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Preferred Meeting Window</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPreferredSlot(slot)}
                      className={`rounded-lg border px-3 py-2 text-xs text-center transition-all ${
                        preferredSlot === slot
                          ? 'border-primary bg-primary text-white font-bold'
                          : 'border-border bg-card text-text-muted hover:border-primary/50'
                      }`}
                    >
                      {slot.split(' (')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Safety notice */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-foreground">Safe Campus Handover Guarantee</p>
                  <p className="text-text-muted leading-relaxed">
                    All handovers occur under CCTV coverage at verified academic points. Never arrange off-campus meetings.
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goToStep(2)}
                  className="font-bold text-xs gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Details</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => goToStep(4)}
                  className="font-bold text-xs gap-1.5"
                >
                  <span>Continue to Review</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW & LIVE CARD PREVIEW */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="font-heading text-xl font-bold text-foreground">Step 4: Final Review & Publish</h2>
                <p className="text-xs text-text-muted">
                  Check how your listing card will appear to students and professors on ReUseHub.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Live Card Preview (Left / Center) */}
                <div className="md:col-span-6 space-y-2">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    <span>Live Campus Card Preview</span>
                  </span>

                  <div className="rounded-card border-2 border-primary/40 bg-card overflow-hidden shadow-elevation-2">
                    <div className="relative aspect-[4/3] w-full bg-surface-raised overflow-hidden">
                      <img
                        src={currentImages[0] || SAMPLE_PRESET_IMAGES['lab-project-hardware']}
                        alt={watchedValues.title || 'Preview'}
                        className="h-full w-full object-cover"
                      />
                      <Badge variant="success" className="absolute top-2 left-2 text-[9px] uppercase font-bold shadow-xs">
                        {watchedValues.condition?.replace('_', ' ')}
                      </Badge>
                      <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        {selectedDepartment?.code || 'CAMPUS'}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {selectedCategory?.name || 'Category'}
                      </span>
                      <h3 className="font-heading text-sm font-bold text-foreground leading-snug line-clamp-2">
                        {watchedValues.title || 'Untitled Item'}
                      </h3>
                      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                        {watchedValues.description || 'No description provided'}
                      </p>
                    </div>

                    <div className="p-3.5 pt-0 border-t border-border/40 flex items-center justify-between text-xs text-text-muted">
                      <span className="flex items-center gap-1 truncate max-w-[160px]">
                        <MapPin className="h-3 w-3 shrink-0 text-primary" />
                        <span className="truncate">{watchedValues.pickup_location?.split(' (')[0]}</span>
                      </span>
                      <span className="font-bold text-primary text-xs">Free Handover</span>
                    </div>
                  </div>
                </div>

                {/* Sustainability & Impact Summary (Right) */}
                <div className="md:col-span-6 space-y-4">
                  <div className="rounded-card border border-primary/25 bg-gradient-to-tr from-primary/10 via-emerald-500/5 to-teal-500/10 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <h4 className="font-heading font-bold text-sm text-foreground">
                        Your Contribution to SLRTCE
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="rounded-lg bg-card/80 p-3 border border-border/60">
                        <span className="text-[10px] text-text-muted block">Estimated Landfill Diversion</span>
                        <span className="font-heading text-lg font-black text-primary">
                          {formatWeightKg(estWeight)}
                        </span>
                        <span className="text-[9px] text-text-muted block">avoided waste</span>
                      </div>

                      <div className="rounded-lg bg-card/80 p-3 border border-border/60">
                        <span className="text-[10px] text-text-muted block">Student Funds Saved</span>
                        <span className="font-heading text-lg font-black text-accent">
                          {formatCurrencyINR(estValue)}
                        </span>
                        <span className="text-[9px] text-text-muted block">recirculated value</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Publishing this listing credits your profile badge tally and counts toward your department's circular leaderboard ranking.
                    </p>
                  </div>

                  {/* Draft Autosave Notice */}
                  <div className="flex items-center justify-between text-xs text-text-muted px-1">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      <span>Draft autosaved to browser storage</span>
                    </span>
                    <button
                      type="button"
                      onClick={clearDraft}
                      className="text-text-muted hover:text-destructive transition-colors text-[11px] underline"
                    >
                      Clear Draft
                    </button>
                  </div>

                  {/* Submission Button */}
                  <div className="pt-2 space-y-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 font-bold text-sm shadow-elevation-2 gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{isSubmitting ? 'Publishing Listing...' : 'Publish Item Listing 🎉'}</span>
                    </Button>
                    <p className="text-[10px] text-center text-text-muted">
                      By publishing, you agree to hand over this item free of charge on campus.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Back */}
              <div className="flex justify-start pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goToStep(3)}
                  className="font-bold text-xs gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Pickup</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-hero border border-primary/40 bg-card p-6 shadow-elevation-3 text-center space-y-4"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-emerald-500 text-white shadow-elevation-1">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <Badge variant="success" className="text-xs uppercase font-bold">
                Item Published
              </Badge>
              <h3 className="font-heading text-xl font-bold text-foreground">
                Give it a second life!
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Your item is now live in the SLRTCE circular economy catalog. Peers can now discover and request it.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsSuccessModalOpen(false)
                  navigate('/my-listings')
                }}
                className="text-xs font-semibold"
              >
                My Listings
              </Button>
              <Button
                onClick={() => {
                  setIsSuccessModalOpen(false)
                  if (createdItemId) navigate(`/items/${createdItemId}`)
                  else navigate('/browse')
                }}
                className="text-xs font-bold gap-1"
              >
                <span>View Item Card</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
