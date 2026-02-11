/**
 * CREATE PAYMENT INTENT API
 * 
 * This is a BACKEND route that creates a Stripe Payment Intent.
 * 
 * WHAT IS A PAYMENT INTENT?
 * Think of it as a "checkout session". It tells Stripe:
 * - How much money to charge
 * - What currency to use
 * - Generates a secret key for the frontend to use
 * 
 * WHY DO WE NEED THIS?
 * Your Stripe SECRET key must NEVER be in frontend code (users can see it!).
 * So we create an API route that runs on the SERVER, where secrets are safe.
 * 
 * HOW IT WORKS:
 * 1. Frontend calls this API: fetch('/api/create-payment-intent')
 * 2. This code runs on the server
 * 3. Server talks to Stripe using the secret key
 * 4. Stripe creates a Payment Intent and returns a "client secret"
 * 5. We send that client secret back to the frontend
 * 6. Frontend uses it to show the payment form
 */

import Stripe from 'stripe'
import { NextResponse } from 'next/server'

// Initialize Stripe with your secret key
// process.env.STRIPE_SECRET_KEY comes from your .env.local file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// This function handles POST requests to /api/create-payment-intent
export async function POST(request) {
  try {
    // Get the amount from the request body
    // In a real app, you'd calculate this from cart items in your database
    const { amount } = await request.json()
    
    // Create a Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents (e.g., 4999 = $49.99)
      currency: 'usd', // Can also be 'eur', 'gbp', etc.
      // Automatic payment methods enable cards, wallets, etc.
      automatic_payment_methods: {
        enabled: true,
      },
      // You can add metadata to track this payment
      metadata: {
        product: 'Premium Wireless Headphones',
        // In production, you'd add order_id, user_id, etc.
      }
    })

    // Send the client secret back to the frontend
    // The frontend needs this to complete the payment
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      // We also send the payment intent ID for reference
      paymentIntentId: paymentIntent.id
    })

  } catch (error) {
    // If something goes wrong, log it and return an error
    console.error('Error creating payment intent:', error)
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}