export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const calculateTax = (subtotal, taxRate = 0.08) => {
  return subtotal * taxRate
}

export const calculateShipping = (subtotal) => {
  if (subtotal >= 100) return 0
  return 15.00
}

export const calculateTotal = (subtotal) => {
  const tax = calculateTax(subtotal)
  const shipping = calculateShipping(subtotal)
  return subtotal + tax + shipping
}

export const convertToStripeAmount = (amount) => {
  return Math.round(amount * 100)
}

export const convertFromStripeAmount = (amount) => {
  return amount / 100
}