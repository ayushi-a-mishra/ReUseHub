import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'
import { AuthModal } from '@/features/auth/components/AuthModal'
import { OnboardingModal } from '@/features/auth/components/OnboardingModal'

export function AppShell() {
  const [authModalOpen, setAuthModalOpen] = useState(false)

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Seamless Continuous Mesh Ambient Glow (Zero Horizontal Seams) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[750px] opacity-70 dark:opacity-25 blur-[90px] transition-opacity"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(34, 197, 94, 0.22), transparent 75%), radial-gradient(ellipse 45% 35% at 85% 12%, rgba(249, 115, 22, 0.12), transparent 70%), radial-gradient(ellipse 40% 30% at 15% 20%, rgba(22, 163, 74, 0.15), transparent 70%)',
          }}
        />
      </div>

      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

      <main className="flex-1 pb-24 md:pb-0">
        <Outlet context={{ onOpenAuth: () => setAuthModalOpen(true) }} />
      </main>

      <Footer />
      <BottomNav onOpenAuth={() => setAuthModalOpen(true)} />

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <OnboardingModal />
    </div>
  )
}
