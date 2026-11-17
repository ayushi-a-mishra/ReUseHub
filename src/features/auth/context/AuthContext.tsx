import React, { createContext, useContext, useState, useEffect } from 'react'
import { Profile, UserRole } from '@/types'
import { MOCK_USERS } from '@/lib/mockData'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { campusConfig } from '@/config/campus'

interface AuthContextType {
  user: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isFaculty: boolean
  isStudent: boolean
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>
  signup: (data: {
    email: string
    password: string
    full_name: string
    role: UserRole
    department_id: string
    roll_number: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  switchDemoUser: (userIndex: number) => void
  loginAsStudent: () => void
  loginAsFaculty: () => void
  loginAsAdmin: () => void
  allowedDomains: string[]
  isDomainValid: (email: string) => boolean
  showOnboarding: boolean
  setShowOnboarding: (show: boolean) => void
  completeOnboarding: (interests?: string[], departmentId?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ALLOWED_DOMAINS = [
  campusConfig.emailDomain.toLowerCase(),
  ...(import.meta.env.VITE_COLLEGE_ALLOWED_DOMAINS
    ? import.meta.env.VITE_COLLEGE_ALLOWED_DOMAINS.split(',').map((d: string) => d.trim().toLowerCase())
    : []),
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to Priya Sharma (Student) for immediate out-of-the-box readiness
  const [user, setUser] = useState<Profile | null>(() => {
    try {
      const saved = localStorage.getItem('reusehub_active_user')
      if (saved) return JSON.parse(saved)
    } catch {
      // fallback
    }
    return MOCK_USERS[0]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem('reusehub_active_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('reusehub_active_user')
    }
  }, [user])

  const isDomainValid = (email: string): boolean => {
    if (!email || !email.includes('@')) return false
    const domain = email.split('@')[1]?.toLowerCase()
    return ALLOWED_DOMAINS.some((allowed: string) => domain === allowed || domain.endsWith('.' + allowed))
  }

  const login = async (email: string, _pass: string) => {
    setIsLoading(true)
    try {
      if (!isDomainValid(email)) {
        return {
          success: false,
          error: `Only verified ${campusConfig.shortName} campus emails are permitted (@${ALLOWED_DOMAINS.join(', @')})`,
        }
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: _pass })
        if (error) {
          return { success: false, error: error.message }
        }
        if (data.user) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('*, department:departments(*)')
            .eq('id', data.user.id)
            .single()
          if (prof) setUser(prof as Profile)
          return { success: true }
        }
      }

      // Local / Demo mode lookup
      const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (found) {
        setUser(found)
        return { success: true }
      }

      // Simulate profile creation if not in demo list
      const domain = email.split('@')[1]
      const simulated: Profile = {
        id: `u_${Date.now()}`,
        full_name: email.split('@')[0].replace(/[._]/g, ' '),
        email,
        role: 'student',
        college_domain: domain,
        is_verified: true,
        trust_score: 5.0,
        badges: ['First Reuse'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setUser(simulated)
      setShowOnboarding(true)
      return { success: true }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (data: {
    email: string
    password: string
    full_name: string
    role: UserRole
    department_id: string
    roll_number: string
  }) => {
    setIsLoading(true)
    try {
      if (!isDomainValid(data.email)) {
        return {
          success: false,
          error: `Sign up restricted to verified campus domains (@${campusConfig.emailDomain})`,
        }
      }

      if (isSupabaseConfigured && supabase) {
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.full_name,
              role: data.role,
              department_id: data.department_id,
              roll_number: data.roll_number,
            },
          },
        })
        if (error) return { success: false, error: error.message }
        if (authData.user) {
          return { success: true }
        }
      }

      // Local mode sign up
      const domain = data.email.split('@')[1]
      const newProfile: Profile = {
        id: `u_${Date.now()}`,
        full_name: data.full_name,
        email: data.email,
        role: data.role,
        department_id: data.department_id,
        roll_number: data.roll_number,
        college_domain: domain,
        is_verified: true,
        trust_score: 5.0,
        badges: ['First Reuse'],
        avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setUser(newProfile)
      setShowOnboarding(true)
      return { success: true }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut()
    }
    setUser(null)
    localStorage.removeItem('reusehub_active_user')
  }

  const switchDemoUser = (userIndex: number) => {
    const selected = MOCK_USERS[userIndex] || MOCK_USERS[0]
    setUser(selected)
  }

  const loginAsStudent = () => {
    setUser(MOCK_USERS[0])
  }

  const loginAsFaculty = () => {
    setUser(MOCK_USERS[1])
  }

  const loginAsAdmin = () => {
    setUser(MOCK_USERS[2])
  }

  const completeOnboarding = (_interests?: string[], departmentId?: string) => {
    if (user && departmentId) {
      const updated = { ...user, department_id: departmentId }
      setUser(updated)
    }
    setShowOnboarding(false)
    localStorage.setItem('reusehub_onboarding_done', 'true')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isFaculty: user?.role === 'faculty',
        isStudent: user?.role === 'student',
        login,
        signup,
        logout,
        switchDemoUser,
        loginAsStudent,
        loginAsFaculty,
        loginAsAdmin,
        allowedDomains: ALLOWED_DOMAINS,
        isDomainValid,
        showOnboarding,
        setShowOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
