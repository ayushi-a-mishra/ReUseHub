import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { ToastProvider } from '@/shared/ui/toast'
import { AppShell } from '@/shared/layout/AppShell'

// Pages
import { HomePage } from '@/pages/HomePage'
import { BrowsePage } from '@/pages/BrowsePage'
import { ItemDetailPage } from '@/pages/ItemDetailPage'
import { AddItemPage } from '@/pages/AddItemPage'
import { MyListingsPage } from '@/pages/MyListingsPage'
import { MyRequestsPage } from '@/pages/MyRequestsPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { ImpactPage } from '@/pages/ImpactPage'
import { SupportPage } from '@/pages/SupportPage'
import { AdminPage } from '@/pages/AdminPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { AboutPage } from '@/pages/AboutPage'
import { HowItWorksPage } from '@/pages/HowItWorksPage'
import { DesignSystemPage } from '@/pages/DesignSystemPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppShell />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/items/:id" element={<ItemDetailPage />} />
                <Route path="/add-item" element={<AddItemPage />} />
                <Route path="/my-listings" element={<MyListingsPage />} />
                <Route path="/requests" element={<MyRequestsPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/impact" element={<ImpactPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/contact" element={<SupportPage />} />
                <Route path="/guidelines" element={<SupportPage />} />
                <Route path="/faq" element={<SupportPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/design-system" element={<DesignSystemPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
