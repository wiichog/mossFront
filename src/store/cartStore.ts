import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  productId: number
  variantId?: number
  name: string
  slug: string
  image: string
  price: number
  quantity: number
  variant?: string
}

interface CartState {
  items: CartItem[]
  totalItems: number
  subtotal: number
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      subtotal: 0,
      
      addItem: (item) => {
        const items = get().items
        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        )
        
        let newItems: CartItem[]
        
        if (existingIndex >= 0) {
          newItems = items.map((i, index) =>
            index === existingIndex
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        } else {
          const newItem: CartItem = {
            ...item,
            id: Date.now(),
          }
          newItems = [...items, newItem]
        }
        
        const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0)
        const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        
        set({ items: newItems, totalItems, subtotal })
      },
      
      removeItem: (id) => {
        const newItems = get().items.filter((i) => i.id !== id)
        const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0)
        const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        
        set({ items: newItems, totalItems, subtotal })
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }
        
        const newItems = get().items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        )
        const totalItems = newItems.reduce((sum, i) => sum + i.quantity, 0)
        const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        
        set({ items: newItems, totalItems, subtotal })
      },
      
      clearCart: () => {
        set({ items: [], totalItems: 0, subtotal: 0 })
      },
    }),
    {
      name: 'hahnemann-cart',
    }
  )
)

