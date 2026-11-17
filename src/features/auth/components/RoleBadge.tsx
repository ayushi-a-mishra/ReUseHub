import { UserRole } from '@/types'
import { Badge } from '@/shared/ui/badge'
import { GraduationCap, BookOpen, ShieldCheck } from 'lucide-react'

export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  if (role === 'admin') {
    return (
      <Badge variant="warning" className={`gap-1 font-semibold ${className || ''}`}>
        <ShieldCheck className="h-3 w-3" />
        Admin
      </Badge>
    )
  }

  if (role === 'faculty') {
    return (
      <Badge variant="info" className={`gap-1 font-semibold ${className || ''}`}>
        <BookOpen className="h-3 w-3" />
        Faculty
      </Badge>
    )
  }

  return (
    <Badge variant="success" className={`gap-1 font-semibold ${className || ''}`}>
      <GraduationCap className="h-3 w-3" />
      Student
    </Badge>
  )
}
