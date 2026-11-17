import { Link } from 'react-router-dom'
import { Item } from '@/types'
import { MapPin } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'

interface ItemCardProps {
  item: Item
  layout?: 'grid' | 'list'
}

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%2316a34a" opacity="0.12"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2316a34a" font-family="sans-serif" font-weight="bold" font-size="14">Campus Item</text></svg>'

export function ItemCard({ item, layout = 'grid' }: ItemCardProps) {
  const isAvailable = item.status === 'available'
  const isReused = item.status === 'reused'

  const conditionLabels: Record<string, string> = {
    new: 'Brand New',
    like_new: 'Like New',
    good: 'Good',
    fair: 'Fair',
  }

  if (layout === 'list') {
    return (
      <Link
        to={`/items/${item.id}`}
        className="group flex flex-col sm:flex-row rounded-card border border-border/80 bg-card shadow-elevation-1 hover:shadow-elevation-2 hover:border-primary/50 transition-all overflow-hidden p-3 gap-4"
      >
        <div className="relative aspect-[4/3] sm:aspect-square w-full sm:w-36 rounded-lg overflow-hidden bg-surface-raised shrink-0">
          <img
            src={item.images[0]}
            alt={item.title}
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
            }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <Badge
            variant="success"
            className="absolute top-1.5 left-1.5 text-[8px] uppercase font-bold shadow-xs bg-card/90"
          >
            {conditionLabels[item.condition] || item.condition}
          </Badge>
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1 py-0.2 text-[8px] font-bold text-white">
            {item.department?.code || 'CAMPUS'}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-text-muted mb-1">
              <span className="font-bold uppercase tracking-wider text-primary">
                {item.category?.name}
              </span>
              <span>&bull;</span>
              <span>Listed by {item.owner?.full_name || 'Peer'}</span>
            </div>
            <h3 className="font-heading text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {item.title}
            </h3>
            <p className="text-xs text-text-muted line-clamp-2 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between text-xs text-text-muted gap-2">
            <span className="flex items-center gap-1 truncate max-w-[220px]">
              <MapPin className="h-3 w-3 shrink-0 text-primary" />
              <span className="truncate">{item.pickup_location}</span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium text-text-muted">Qty: {item.quantity}</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                Free Handover
              </span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Default Grid Layout
  return (
    <Link
      to={`/items/${item.id}`}
      className="group flex flex-col rounded-card border border-border/80 bg-card shadow-elevation-1 hover:shadow-elevation-2 hover:border-primary/50 transition-all duration-200 overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-raised">
        <img
          src={item.images[0]}
          alt={item.title}
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
          }}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Condition Tag */}
        <div className="absolute top-2 left-2">
          <Badge
            variant="success"
            className="text-[9px] px-2 py-0.2 uppercase font-bold shadow-xs bg-card/90 backdrop-blur-sm"
          >
            {conditionLabels[item.condition] || item.condition}
          </Badge>
        </div>

        {/* Status / Department Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={`rounded-md px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider shadow-xs ${
              isAvailable
                ? 'bg-primary/90 backdrop-blur-sm'
                : isReused
                ? 'bg-purple-600/90 backdrop-blur-sm'
                : 'bg-amber-500/90 backdrop-blur-sm'
            }`}
          >
            {item.status}
          </span>
        </div>

        <span className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-bold text-white">
          {item.department?.code || 'CAMPUS'}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-3.5 flex flex-col justify-between space-y-2.5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-0.5">
            {item.category?.name}
          </span>
          <h3 className="font-heading text-xs sm:text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-text-muted line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-text-muted">
          <span className="flex items-center gap-1 truncate max-w-[130px] text-[11px]">
            <MapPin className="h-3 w-3 shrink-0 text-primary" />
            <span className="truncate">{item.pickup_location.split(' (')[0]}</span>
          </span>
          <span className="font-bold text-primary text-xs">Free</span>
        </div>
      </div>
    </Link>
  )
}
