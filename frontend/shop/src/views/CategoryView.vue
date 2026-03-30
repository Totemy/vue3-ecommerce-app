<script setup lang="ts">
import { useCategories } from '../features/catalog/composable/useCategories'
import type { Category } from '../features/catalog/types/category'

const { categories } = useCategories()

const emit = defineEmits<{
  (e: 'select', category: Category): void
}>()
</script>
<template>
  <div>
    <button v-for="category in categories" :key="category.id" @click="emit('select', category)">
      {{ category.name }}
    </button>
  </div>
</template>
