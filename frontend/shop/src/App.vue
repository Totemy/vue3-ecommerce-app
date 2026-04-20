<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useCart } from './features/cart/composable/useCart'

const { totalItems } = useCart()
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink to="/" class="brand">Stone Jewelry</RouterLink>
      <RouterLink to="/cart" class="cart-link">Cart ({{ totalItems }})</RouterLink>
    </header>
    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  display: grid;
  gap: 16px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.75);
  box-shadow: var(--shadow);
}

.brand {
  font-family: Sora, 'Segoe UI', sans-serif;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.cart-link {
  font-weight: 800;
  color: var(--accent-strong);
}
</style>
