<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ProductService } from '../features/catalog/services/product.service'
import type { Product } from '../features/catalog/types/product'

const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await ProductService.getBySlug(route.params.slug as string)
    product.value = response.data.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <RouterLink to="/">Back</RouterLink>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="product">
      <h1>{{ product.name }}</h1>
      <p>{{ product.description }}</p>
      <p>Price: {{ product.price }}</p>
      <p>Material: {{ product.material }}</p>
      <p>Weight: {{ product.weight }}g</p>
      <div v-for="image in product.images" :key="image.url">
        <img :src="image.url" :alt="image.altText || product.name" />
      </div>
    </div>
  </div>
</template>
