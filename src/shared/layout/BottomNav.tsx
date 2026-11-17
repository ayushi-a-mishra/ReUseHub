import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useTranslation } from '@/lib/i18n'
import { Home, Compass, Plus, Inbox, User } from 'lucide-react'

interface BottomNavProps {
  onOpenAuth: () => void
}

const MotionLink = motion(Link)

export function BottomNav({ onOpenAuth }: BottomNavProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { lang } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const navItems = [
    { label: lang === 'hi' ? 'होम' : 'Home', path: '/', icon: Home },
    { label: lang === 'hi' ? 'खोजें' : 'Browse', path: '/browse', icon: Compass },
    { label: lang === 'hi' ? 'जोड़ें' : 'Add', path: '/add-item', icon: Plus, isAction: true },
    { label: lang === 'hi' ? 'अनुरोध' : 'Requests', path: '/requests', icon: Inbox },
    { label: lang === 'hi' ? 'प्रोफ़ाइल' : 'Profile', path: '/profile', icon: User },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 block border-t border-border/80 glass-nav md:hidden pb-safe"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          if (item.isAction) {
            return (
              <motion.button
                key={item.label}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/add-item')
                  } else {
                    onOpenAuth()
                  }
                }}
                className="-mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-emerald-500 text-white shadow-elevation-2 active:shadow-sm min-h-[48px] min-w-[48px] focus:outline-none"
                aria-label="Add new item listing"
              >
                <Plus className="h-6 w-6 stroke-[2.5]" />
              </motion.button>
            )
          }

          const requiresAuth = item.path === '/requests' || item.path === '/profile'

          return (
            <MotionLink
              key={item.label}
              to={requiresAuth && !isAuthenticated ? '#' : item.path}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              onClick={(e) => {
                if (requiresAuth && !isAuthenticated) {
                  e.preventDefault()
                  onOpenAuth()
                }
              }}
              className={`relative flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] px-3 py-1.5 transition-colors select-none ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-text-muted hover:text-foreground'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-1 left-2.5 right-2.5 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                />
              )}
              <motion.div
                animate={isActive && !shouldReduceMotion ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </MotionLink>
          )
        })}
      </div>
    </nav>
  )
}
