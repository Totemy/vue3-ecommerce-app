<script setup lang="ts">
import axios from 'axios'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ProductService } from '../features/catalog/services/product.service'
import type { Product } from '../features/catalog/types/product'

const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

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
