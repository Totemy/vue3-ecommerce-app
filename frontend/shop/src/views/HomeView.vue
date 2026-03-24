<script setup lang="ts">
import { useCategories } from '../composable/useCategories'
import { useProducts } from '../composable/useProducts'

const { categories } = useCategories()
const { filteredProducts, selectedCategorySlug, selectCategory } = useProducts()
</script>

<template>
  <div class="categories">
    <button
      :class="{ active: selectedCategorySlug === null }"
      @click="selectCategory(null)"
    >
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
    <div v-for="product in filteredProducts" :key="product.id">
      <h2>{{ product.name }}</h2>
      <p>{{ product.price }}</p>
    </div>
  </div>
</template>
