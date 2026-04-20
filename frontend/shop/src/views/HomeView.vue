<script setup lang="ts">
import { useCategories } from '../features/catalog/composable/useCategories'
import { useProducts } from '../features/catalog/composable/useProducts'
import { useCart } from '../features/cart/composable/useCart'

const { categories } = useCategories()
const { filteredProducts, selectedCategorySlug, selectCategory } = useProducts()
const { addItem } = useCart()

const formatPrice = (price: number) => `$${price.toFixed(2)}`
</script>

<template>
  <section class="home-page">
    <header class="hero">
      <p class="hero-kicker">Handcrafted Collection</p>
      <h1>Discover Jewelry With Character</h1>
    </header>

    <div class="categories" role="tablist" aria-label="Categories">
      <button
        class="chip"
        :class="{ active: selectedCategorySlug === null }"
        @click="selectCategory(null)"
      >
        All Products
      </button>

      <button
        v-for="category in categories"
        :key="category.id"
        class="chip"
        :class="{ active: selectedCategorySlug === category.slug }"
        @click="selectCategory(category.slug)"
      >
        {{ category.name }}
      </button>
    </div>

    <div class="product-grid">
      <RouterLink
        v-for="product in filteredProducts"
        :key="product.id"
        :to="`/products/${product.slug || product.id}`"
        class="product-card"
      >
        <h2 class="product-title">{{ product.name }}</h2>
        <p class="product-price">{{ formatPrice(product.price) }}</p>
        <p class="product-meta">{{ product.material }}</p>
        <button class="add-btn" @click.prevent.stop="addItem(product)">Add to cart</button>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hero {
  padding: 30px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(145deg, rgba(255, 248, 238, 0.9), rgba(255, 240, 222, 0.8)),
    radial-gradient(circle at 95% 0%, rgba(191, 90, 42, 0.2), transparent 50%);
  box-shadow: var(--shadow);
  animation: rise 0.55s ease;
}

.hero-kicker {
  margin: 0;
  font-family: Sora, 'Segoe UI', sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}

.hero h1 {
  margin: 8px 0 0;
  max-width: 600px;
  font-family: Sora, 'Segoe UI', sans-serif;
  font-size: clamp(1.7rem, 3vw, 2.6rem);
  line-height: 1.1;
}

.categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.76);
  color: var(--ink);
  padding: 9px 14px;
  font-weight: 600;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.chip:hover {
  transform: translateY(-1px);
  background: #fff;
}

.chip.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 14px;
}

.product-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--card);
  box-shadow: 0 6px 18px rgba(70, 40, 20, 0.08);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 130px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  border-color: #cba88d;
  box-shadow: 0 12px 24px rgba(70, 40, 20, 0.12);
}

.product-title {
  margin: 0;
  font-family: Sora, 'Segoe UI', sans-serif;
  font-size: 1rem;
}

.product-price {
  margin: 0;
  font-size: 1.14rem;
  font-weight: 800;
  color: var(--accent-strong);
}

.product-meta {
  margin: 0;
  color: var(--muted);
  text-transform: capitalize;
}

.add-btn {
  margin-top: auto;
  border: 0;
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 700;
  color: #fff;
  background: var(--accent);
  cursor: pointer;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .hero {
    padding: 22px;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
