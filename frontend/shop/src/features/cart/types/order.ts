export type CheckoutPaymentMethod = 'card' | 'cash_on_delivery'

export interface CheckoutOrderPayload {
  customerName: string
  customerEmail: string
  customerPhone: string
  paymentMethod: CheckoutPaymentMethod
  shippingAddress: {
    city: string
    address: string
    postalCode: string
  }
  customerNotes?: string
  items: Array<{
    productId: string
    quantity: number
    variantId?: string
  }>
}

export interface CreatedOrderResponse {
  message: string
  data: {
    id: string
    orderNumber: string
    total: number
  }
}
