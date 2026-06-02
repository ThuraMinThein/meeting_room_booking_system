import type { User } from '@/api/users'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'


interface AuthState {
  token: string | null
  user: User | null
  setCredentials: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setCredentials: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'meeting-auth-storage',
    }
  )
)
