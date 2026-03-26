import { onMounted, ref } from 'vue'
import type { Category } from '../types/category'
import { CategoryService } from '../services/category.service'

export function useCategories() {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  const loadCategories = async () => {
    isLoading.value = true

    try {
      const { data } = await CategoryService.getAll()
      categories.value = data.categories
    } catch (e) {
      error.value = e as Error
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadCategories)
  return {
    categories,
    isLoading,
    error,
    loadCategories,
  }
}
