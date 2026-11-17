import { IRepository } from './types'
import { MockRepository } from './MockRepository'
import { SupabaseRepository } from './SupabaseRepository'
import { isSupabaseConfigured } from '@/lib/supabase'

export * from './types'
export * from './MockRepository'
export * from './SupabaseRepository'

let repositoryInstance: IRepository | null = null

export function getRepository(): IRepository {
  if (repositoryInstance) {
    return repositoryInstance
  }

  // Check explicit env override or missing Supabase configuration
  const useMockExplicit = import.meta.env.VITE_USE_MOCK === 'true'
  
  if (useMockExplicit || !isSupabaseConfigured) {
    repositoryInstance = new MockRepository()
  } else {
    try {
      repositoryInstance = new SupabaseRepository()
    } catch {
      // In case of network initialization failure, graceful fallback
      repositoryInstance = new MockRepository()
    }
  }

  return repositoryInstance
}
