import { http } from '../../../api/http'
import type { CheckoutOrderPayload, CreatedOrderResponse } from '../types/order'

export const OrderService = {
  create(payload: CheckoutOrderPayload) {
    return http.post<CreatedOrderResponse>('/orders', payload)
  },
}
