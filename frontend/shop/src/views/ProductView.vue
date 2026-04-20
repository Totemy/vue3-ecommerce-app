<script setup lang="ts">
import axios from 'axios'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ProductService } from '../features/catalog/services/product.service'
import type { Product } from '../features/catalog/types/product'
import { useCart } from '../features/cart/composable/useCart'

const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const quantity = ref(1)
const { addItem } = useCart()

const loadProduct = async (slug: string) => {
  loading.value = true
  error.value = null

  try {
    const response = await ProductService.getBySlug(slug)
    product.value = response.data.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = (err.response?.data as { error?: string } | undefined)?.error || err.message
    } else {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    }
    product.value = null
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.slug,
  (slug) => {
    if (typeof slug === 'string' && slug.length > 0) {
      loadProduct(slug)
    }
  },
  { immediate: true },
)

const addCurrentProductToCart = () => {
  if (!product.value) return
  addItem(product.value, quantity.value)
}
</script>

<template>
  <section class="product-page">
    <RouterLink class="back-link" to="/">Back to products</RouterLink>
    <div v-if="loading" class="state-card">Loading product details...</div>
    <div v-else-if="error" class="state-card error">{{ error }}</div>
    <article v-else-if="product" class="product-layout">
      <header class="product-header">
        <h1>{{ product.name }}</h1>
        <p class="price">${{ product.price.toFixed(2) }}</p>
      </header>

      <div class="details">
        <p class="description">{{ product.description }}</p>
        <div class="meta-row">
          <span>Material: {{ product.material }}</span>
          <span>Weight: {{ product.weight }}g</span>
        </div>

        <div class="buy-row">
          <label>
            Qty
            <input v-model.number="quantity" type="number" min="1" />
          </label>
          <button class="add-btn" @click="addCurrentProductToCart">Add to cart</button>
        </div>
      </div>

      <div class="images" v-if="product.images.length > 0">
        <img
          v-for="image in product.images"
          :key="image.url"
          :src="image.url"
          :alt="image.altText || product.name"
        />
      </div>
    </article>
  </section>
</template>

<style scoped>
.product-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: rise 0.45s ease;
}

.back-link {
  width: fit-content;
  color: var(--accent-strong);
  font-weight: 700;
}

.state-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  padding: 18px;
  box-shadow: var(--shadow);
}

.state-card.error {
  border-color: #cc6d45;
  color: #8a3416;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 22px;
  background: var(--card);
  box-shadow: var(--shadow);
}

.product-header h1 {
  margin: 0;
  font-family: Sora, 'Segoe UI', sans-serif;
  font-size: clamp(1.4rem, 2.5vw, 2.1rem);
}

.price {
  margin: 10px 0 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--accent-strong);
}

.description {
  margin: 0;
  color: var(--ink);
}

.meta-row {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: var(--muted);
}

.buy-row {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.buy-row input {
  margin-left: 6px;
  width: 70px;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 6px 8px;
}

.add-btn {
  border: 0;
  border-radius: 999px;
  padding: 9px 14px;
  font-weight: 700;
  color: #fff;
  background: var(--accent);
  cursor: pointer;
}

.images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.images img {
  width: 100%;
  height: 210px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line);
  background: #fff;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 700px) {
  .product-layout {
    padding: 16px;
  }

  .images img {
    height: 170px;
  }
}
</style>
