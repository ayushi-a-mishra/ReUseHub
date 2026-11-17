import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/button'
import { Recycle, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="container min-h-[60vh] flex flex-col items-center justify-center text-center py-16 space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center text-primary mb-2">
        <Recycle className="h-8 w-8" />
      </div>
      <h1 className="font-heading text-4xl font-extrabold text-foreground">404 - Page Not Found</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        The campus resource or page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="pt-2">
        <Button className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Campus Feed</span>
        </Button>
      </Link>
    </div>
  )
}
