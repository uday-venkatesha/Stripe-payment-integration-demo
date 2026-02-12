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
    
    const paymentIntent = await stripe.paymentIntents.create({
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
        customer_email: customerInfo?.email || '',
        order_date: new Date().toISOString()
      },
      description: `Order for ${items.length} items`,
      receipt_email: customerInfo?.email || null
    })

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