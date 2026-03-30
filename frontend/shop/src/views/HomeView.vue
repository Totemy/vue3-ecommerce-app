<script setup lang="ts">
import { useCategories } from '../features/catalog/composable/useCategories'
import { useProducts } from '../features/catalog/composable/useProducts'

const { categories } = useCategories()
const { filteredProducts, selectedCategorySlug, selectCategory } = useProducts()
</script>

<template>
  <div>
    <div class="categories">
      <button :class="{ active: selectedCategorySlug === null }" @click="selectCategory(null)">
        All
      </button>

      <button
        v-for="category in categories"
        :key="category.id"
        :class="{ active: selectedCategorySlug === category.slug }"
        @click="selectCategory(category.slug)"
      >
        {{ category.name }}
      </button>
    </div>
    <div>
      <h1>Products</h1>
      <RouterLink
        v-for="product in filteredProducts"
        :key="product.id"
        :to="`/products/${product.slug || product.id}`"
      >
        <h2>{{ product.name }}</h2>
        <p>{{ product.price }}</p>
      </RouterLink>
    </div>
  </div>
</template>
