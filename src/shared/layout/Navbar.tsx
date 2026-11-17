import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { RoleBadge } from '@/features/auth/components/RoleBadge'
import { Button } from '@/shared/ui/button'
import { Avatar } from '@/shared/ui/avatar'
import { mockStore } from '@/lib/mockStore'
import { useTranslation } from '@/lib/i18n'
import {
  Recycle,
  PlusCircle,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  History,
} from 'lucide-react'

import { campusConfig } from '@/config/campus'

interface NavbarProps {
  onOpenAuth: () => void
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  const { user, isAuthenticated, isAdmin, logout, switchDemoUser } = useAuth()
  const { t, lang, setLanguage } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })

  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  // Listen to mockStore notifications
  useEffect(() => {
    const updateNotifs = () => {
      if (user) {
        const notifs = mockStore.getNotifications(user.id)
        setUnreadCount(notifs.filter((n) => !n.is_read).length)
      } else {
        setUnreadCount(0)
      }
    }
    updateNotifs()
    return mockStore.subscribe(updateNotifs)
  }, [user])

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDarkMode = () => {
    const next = !isDarkMode
    setIsDarkMode(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const collegeName = campusConfig.shortName

  const userNotifications = user ? mockStore.getNotifications(user.id) : []

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 glass-nav transition-colors">
      <div className="container px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-emerald-500 text-white shadow-sm transition-transform group-hover:scale-105">
              <Recycle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-lg font-black tracking-tight text-foreground">
                  ReUse<span className="text-primary">Hub</span>
                </span>
                <span className="hidden md:inline-flex rounded-full bg-accent/15 px-1.5 py-0.2 text-[10px] font-bold text-accent">
                  CAMPUS
                </span>
              </div>
              <p className="text-[10px] font-medium text-muted-foreground hidden sm:block">
                Give it a second life • {collegeName}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/browse"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                location.pathname === '/browse'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {t('browseItems')}
            </Link>
            <Link
              to="/how-it-works"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                location.pathname === '/how-it-works'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/about"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                location.pathname === '/about'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              About
            </Link>
            <Link
              to="/impact"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                location.pathname === '/impact'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {t('campusImpact')}
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  location.pathname === '/admin'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {t('adminConsole')}
              </Link>
            )}
          </nav>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2.5">
          {/* Add Item CTA Button */}
          <Button
            size="sm"
            onClick={() => {
              if (isAuthenticated) {
                navigate('/add-item')
              } else {
                onOpenAuth()
              }
            }}
            className="hidden sm:inline-flex gap-1.5 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            <span>{t('listItem')}</span>
          </Button>

          {/* Language Toggle (EN / HI) */}
          <button
            onClick={() => setLanguage(lang === 'en' ? 'hi' : 'en')}
            className="rounded-button px-2 sm:px-2.5 py-1 text-xs font-bold text-foreground transition-all hover:bg-muted border border-border/80 focus:outline-none shadow-xs"
            aria-label="Toggle language"
            title="Toggle English / Hindi"
          >
            {lang === 'en' ? (
              <span>
                <span className="sm:hidden font-semibold">हिं</span>
                <span className="hidden sm:inline">🇮🇳 हिन्दी</span>
              </span>
            ) : (
              <span>
                <span className="sm:hidden font-semibold">EN</span>
                <span className="hidden sm:inline">🇬🇧 EN</span>
              </span>
            )}
          </button>

          {/* Dark Mode Toggle (Desktop only; on mobile available in user dropdown) */}
          <button
            onClick={toggleDarkMode}
            className="hidden md:inline-flex rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications Dropdown */}
          {isAuthenticated && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-3 shadow-xl backdrop-blur-xl z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-xs font-bold text-foreground">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => user && mockStore.markAllNotificationsAsRead(user.id)}
                        className="text-[11px] text-primary hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="mt-2 max-h-72 overflow-y-auto space-y-2">
                    {userNotifications.length === 0 ? (
                      <p className="py-6 text-center text-xs text-muted-foreground">No notifications yet</p>
                    ) : (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            mockStore.markNotificationAsRead(notif.id)
                            if (notif.link) navigate(notif.link)
                            setIsNotifOpen(false)
                          }}
                          className={`cursor-pointer rounded-xl p-2.5 text-xs transition-colors ${
                            !notif.is_read
                              ? 'bg-primary/10 border border-primary/20'
                              : 'bg-muted/40 hover:bg-muted'
                          }`}
                        >
                          <p className="font-semibold text-foreground">{notif.title}</p>
                          <p className="text-muted-foreground mt-0.5">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile / Auth State */}
          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full p-0 transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40"
                aria-label="Open user profile menu"
              >
                <Avatar
                  src={user.avatar_url}
                  fallback={user.full_name}
                  className="h-10 w-10 border-2 border-primary/50 shadow-sm"
                />
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-card border border-border/80 bg-card/95 p-2 shadow-elevation-3 backdrop-blur-xl z-50">
                  <div className="border-b border-border/60 p-3">
                    <p className="font-heading text-sm font-bold text-foreground">{user.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <RoleBadge role={user.role} />
                      <span className="text-[10px] text-muted-foreground">
                        {user.department?.code || 'Campus Member'}
                      </span>
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5 text-xs">
                    {/* Theme Toggle in Menu (especially for mobile) */}
                    <button
                      onClick={toggleDarkMode}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-foreground hover:bg-muted font-medium"
                    >
                      <div className="flex items-center gap-2">
                        {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
                        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{isDarkMode ? 'Light' : 'Dark'}</span>
                    </button>

                    <Link
                      to="/my-listings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-foreground hover:bg-muted font-medium"
                    >
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {t('myListings')}
                    </Link>
                    <Link
                      to="/requests"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-foreground hover:bg-muted font-medium"
                    >
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      {t('myRequests')}
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-foreground hover:bg-muted font-medium"
                    >
                      <History className="h-4 w-4 text-muted-foreground" />
                      {t('history')}
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-foreground hover:bg-muted font-medium"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      Profile & Badges
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 font-medium"
                      >
                        <ShieldCheck className="h-4 w-4 text-amber-600" />
                        Admin Dashboard
                      </Link>
                    )}
                  </div>

                  {/* Switch Demo User Fast Pill */}
                  <div className="border-t border-border/60 p-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase px-2 mb-1 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" /> Switch Demo Role
                    </p>
                    <div className="grid grid-cols-3 gap-1 text-[11px]">
                      <button
                        onClick={() => { switchDemoUser(0); setIsUserMenuOpen(false) }}
                        className={`rounded-lg py-1 text-center font-medium transition-colors ${
                          user.role === 'student' ? 'bg-primary/15 text-primary font-bold' : 'hover:bg-muted'
                        }`}
                      >
                        Student
                      </button>
                      <button
                        onClick={() => { switchDemoUser(1); setIsUserMenuOpen(false) }}
                        className={`rounded-lg py-1 text-center font-medium transition-colors ${
                          user.role === 'faculty' ? 'bg-blue-500/15 text-blue-600 font-bold' : 'hover:bg-muted'
                        }`}
                      >
                        Faculty
                      </button>
                      <button
                        onClick={() => { switchDemoUser(2); setIsUserMenuOpen(false) }}
                        className={`rounded-lg py-1 text-center font-medium transition-colors ${
                          user.role === 'admin' ? 'bg-amber-500/15 text-amber-600 font-bold' : 'hover:bg-muted'
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-border/60 p-1">
                    <button
                      onClick={() => {
                        logout()
                        setIsUserMenuOpen(false)
                        navigate('/')
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-destructive hover:bg-destructive/10 font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button size="sm" onClick={onOpenAuth} className="rounded-xl">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
