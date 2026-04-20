import { computed, reactive } from 'vue'
import type { Product } from '../../catalog/types/product'

export interface CartItem {
  productId: string
  slug?: string
  name: string
  material: string
  price: number
  quantity: number
}

const CART_STORAGE_KEY = 'shop-cart'

const state = reactive<{ items: CartItem[] }>({
  items: [],
})

let initialized = false

const persist = () => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
}

const initialize = () => {
  if (initialized) return
  initialized = true

  const raw = localStorage.getItem(CART_STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw) as CartItem[]
    if (Array.isArray(parsed)) {
      state.items = parsed
    }
  } catch {
    localStorage.removeItem(CART_STORAGE_KEY)
  }
}

export function useCart() {
  initialize()

  const addItem = (product: Product, quantity = 1) => {
    const safeQuantity = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1

    const existing = state.items.find((item) => item.productId === product.id)
    if (existing) {
      existing.quantity += safeQuantity
    } else {
      state.items.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        material: product.material,
        price: product.price,
        quantity: safeQuantity,
      })
    }

    persist()
  }

  const removeItem = (productId: string) => {
    state.items = state.items.filter((item) => item.productId !== productId)
    persist()
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const nextQuantity = Math.max(1, Math.floor(quantity))
    const target = state.items.find((item) => item.productId === productId)
    if (!target) return

    target.quantity = nextQuantity
    persist()
  }

  const clearCart = () => {
    state.items = []
    persist()
  }

  const subtotal = computed(() =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )

  const shippingCost = computed(() => (subtotal.value >= 2000 ? 0 : 80))
  const total = computed(() => subtotal.value + shippingCost.value)
  const totalItems = computed(() => state.items.reduce((sum, item) => sum + item.quantity, 0))

  return {
    items: computed(() => state.items),
    subtotal,
    shippingCost,
    total,
    totalItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}
