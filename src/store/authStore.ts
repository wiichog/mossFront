import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  email: string
  username: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  avatar?: string
  acceptsMarketing: boolean
  totalOrders: number
  totalSpent: number
  createdAt: string
}

export interface Address {
  id: number
  addressType: 'shipping' | 'billing' | 'both'
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  department: string
  postalCode?: string
  deliveryInstructions?: string
  isDefault: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  accessToken: string | null
  refreshToken: string | null
  
  setUser: (user: User) => void
  setTokens: (access: string, refresh: string) => void
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      refreshToken: null,
      
      setUser: (user) => {
        set({ user, isAuthenticated: true })
      },
      
      setTokens: (access, refresh) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', access)
          localStorage.setItem('refresh_token', refresh)
        }
        set({ accessToken: access, refreshToken: refresh })
      },
      
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
        set({ 
          user: null, 
          isAuthenticated: false, 
          accessToken: null, 
          refreshToken: null 
        })
      },
      
      updateUser: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null
        }))
      },
    }),
    {
      name: 'hahnemann-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)

