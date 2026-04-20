<script setup lang="ts">
import axios from 'axios'
import { computed, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCart } from '../features/cart/composable/useCart'
import { OrderService } from '../features/cart/services/order.service'
import type { CheckoutPaymentMethod } from '../features/cart/types/order'

const { items, subtotal, shippingCost, total, removeItem, updateQuantity, clearCart } = useCart()

const checkoutForm = reactive({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  paymentMethod: 'card' as CheckoutPaymentMethod,
  city: '',
  address: '',
  postalCode: '',
  customerNotes: '',
})

const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const canCheckout = computed(() => items.value.length > 0 && !isSubmitting.value)

const formatPrice = (price: number) => `$${price.toFixed(2)}`

const submitOrder = async () => {
  if (!canCheckout.value) return

  successMessage.value = ''
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const response = await OrderService.create({
      customerName: checkoutForm.customerName,
      customerEmail: checkoutForm.customerEmail,
      customerPhone: checkoutForm.customerPhone,
      paymentMethod: checkoutForm.paymentMethod,
      shippingAddress: {
        city: checkoutForm.city,
        address: checkoutForm.address,
        postalCode: checkoutForm.postalCode,
      },
      customerNotes: checkoutForm.customerNotes || undefined,
      items: items.value.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    })

    const orderNumber = response.data.data.orderNumber
    clearCart()
    successMessage.value = `Order ${orderNumber} created successfully.`
  } catch (error) {
    if (axios.isAxiosError(error)) {
      errorMessage.value =
        (error.response?.data as { error?: string } | undefined)?.error || error.message
    } else {
      errorMessage.value = error instanceof Error ? error.message : 'Failed to create order'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="cart-page">
    <header class="page-header">
      <h1>Your Cart</h1>
      <RouterLink class="back-link" to="/">Continue shopping</RouterLink>
    </header>

    <p v-if="successMessage" class="status success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="status error">{{ errorMessage }}</p>

    <div class="cart-layout">
      <div class="cart-items">
        <article v-for="item in items" :key="item.productId" class="cart-item">
          <div>
            <RouterLink class="item-title" :to="item.slug ? `/products/${item.slug}` : '/'">
              {{ item.name }}
            </RouterLink>
            <p class="item-meta">{{ item.material }}</p>
            <p class="item-price">{{ formatPrice(item.price) }}</p>
          </div>

          <div class="item-controls">
            <label>
              Qty
              <input
                type="number"
                min="1"
                :value="item.quantity"
                @input="
                  updateQuantity(item.productId, Number(($event.target as HTMLInputElement).value))
                "
              />
            </label>
            <button class="link danger" @click="removeItem(item.productId)">Remove</button>
          </div>
        </article>

        <div v-if="items.length === 0" class="empty-state">
          <p>Your cart is empty.</p>
          <RouterLink class="back-link" to="/">Browse products</RouterLink>
        </div>
      </div>

      <aside class="checkout-card">
        <h2>Checkout</h2>

        <div class="summary">
          <p>
            <span>Subtotal</span> <strong>{{ formatPrice(subtotal) }}</strong>
          </p>
          <p>
            <span>Shipping</span> <strong>{{ formatPrice(shippingCost) }}</strong>
          </p>
          <p class="total">
            <span>Total</span> <strong>{{ formatPrice(total) }}</strong>
          </p>
        </div>

        <form class="checkout-form" @submit.prevent="submitOrder">
          <input
            v-model.trim="checkoutForm.customerName"
            type="text"
            placeholder="Full name"
            required
          />
          <input
            v-model.trim="checkoutForm.customerEmail"
            type="email"
            placeholder="Email"
            required
          />
          <input
            v-model.trim="checkoutForm.customerPhone"
            type="tel"
            placeholder="Phone"
            required
          />
          <select v-model="checkoutForm.paymentMethod" required>
            <option value="card">Card</option>
            <option value="cash_on_delivery">Cash on delivery</option>
          </select>
          <input v-model.trim="checkoutForm.city" type="text" placeholder="City" required />
          <input v-model.trim="checkoutForm.address" type="text" placeholder="Address" required />
          <input
            v-model.trim="checkoutForm.postalCode"
            type="text"
            placeholder="Postal code"
            required
          />
          <textarea
            v-model.trim="checkoutForm.customerNotes"
            rows="3"
            placeholder="Order notes (optional)"
          />

          <button type="submit" class="checkout-btn" :disabled="!canCheckout">
            {{ isSubmitting ? 'Placing order...' : 'Place order' }}
          </button>
        </form>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.cart-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.page-header h1 {
  margin: 0;
  font-family: Sora, 'Segoe UI', sans-serif;
}

.back-link {
  color: var(--accent-strong);
  font-weight: 700;
}

.status {
  margin: 0;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line);
  background: #fff;
}

.status.success {
  border-color: #60a672;
  color: #1f6935;
}

.status.error {
  border-color: #cc6d45;
  color: #8a3416;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 14px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-item {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: var(--shadow);
  padding: 14px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.item-title {
  display: inline-block;
  font-family: Sora, 'Segoe UI', sans-serif;
  font-weight: 700;
}

.item-meta,
.item-price {
  margin: 4px 0 0;
}

.item-meta {
  color: var(--muted);
  text-transform: capitalize;
}

.item-price {
  font-weight: 800;
  color: var(--accent-strong);
}

.item-controls {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.item-controls input {
  margin-left: 8px;
  width: 70px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 6px 8px;
}

.link {
  border: 0;
  background: transparent;
  padding: 0;
  font-weight: 700;
  cursor: pointer;
}

.link.danger {
  color: #9e1f1f;
}

.empty-state {
  border: 1px dashed var(--line);
  border-radius: var(--radius-md);
  padding: 18px;
  text-align: center;
  background: rgba(255, 255, 255, 0.6);
}

.checkout-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: var(--shadow);
  padding: 16px;
  height: fit-content;
}

.checkout-card h2 {
  margin-top: 0;
  margin-bottom: 12px;
  font-family: Sora, 'Segoe UI', sans-serif;
}

.summary p {
  margin: 0;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 6px 0;
}

.summary .total {
  border-top: 1px solid var(--line);
  margin-top: 6px;
  padding-top: 10px;
}

.checkout-form {
  margin-top: 14px;
  display: grid;
  gap: 8px;
}

.checkout-form input,
.checkout-form select,
.checkout-form textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 9px 10px;
  font: inherit;
  background: #fff;
}

.checkout-btn {
  margin-top: 4px;
  border: 0;
  border-radius: 999px;
  padding: 11px 16px;
  font-weight: 800;
  color: #fff;
  background: var(--accent);
  cursor: pointer;
}

.checkout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}
</style>
