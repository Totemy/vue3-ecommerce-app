import { http } from '../../../api/http'
import type { Product } from '../types/product'

export const ProductService = {
  getAll() {
    return http.get<{ products: Product[] }>('/products')
  },

  getBySlug(slug: string) {
    return http.get<{ data: Product }>(`/products/${slug}`)
  },
}
