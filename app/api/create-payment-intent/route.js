import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { items, customerInfo } = await request.json()
    
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
    const tax = subtotal * 0.08
    const shipping = subtotal >= 100 ? 0 : 15.00
    const total = subtotal + tax + shipping
    
    const amount = Math.round(total * 100)
    
    const lineItems = items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }))
    
    // 1. Define the base payment intent options
    const paymentIntentOptions = {
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        order_items: JSON.stringify(lineItems),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        customer_email: customerInfo?.email || '', // Metadata is tolerant of empty strings
        order_date: new Date().toISOString()
      },
      description: `Order for ${items.length} items`
    }

    // 2. Conditionally add receipt_email ONLY if it exists and is valid
    if (customerInfo?.email) {
      paymentIntentOptions.receipt_email = customerInfo.email
    }

    // 3. Create the intent with the constructed options
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}