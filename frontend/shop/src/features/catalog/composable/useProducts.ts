import { computed, onMounted, ref } from 'vue'
import type { Product } from '../types/product'
import { ProductService } from '../services/product.service'
import type { Category } from '../types/category'

export function useProducts() {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const selectedCategorySlug = ref<string | null>(null)

  const loadProducts = async () => {
    isLoading.value = true

    try {
      const { data } = await ProductService.getAll()
      products.value = data.products
    } catch (e) {
      error.value = e as Error
    } finally {
      isLoading.value = false
    }
  }

  const selectCategory = (slug: string | null) => {
    selectedCategorySlug.value = slug
  }

  const filteredProducts = computed<Product[]>(() => {
    const slug = selectedCategorySlug.value
    if (!slug) return products.value
    return products.value.filter((product) =>
      product.categories.some((category: Category) => category.slug === slug),
    )
  })

  onMounted(loadProducts)

  return {
    products,
    filteredProducts,
    selectedCategorySlug,
    isLoading,
    error,
    loadProducts,
    selectCategory,
  }
}
