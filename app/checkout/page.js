/**
 * CHECKOUT PAGE
 * 
 * This page handles the entire checkout process:
 * 1. Creates a Payment Intent (calls our API)
 * 2. Loads Stripe library
 * 3. Shows the payment form
 * 
 * This is a CLIENT component because it needs to:
 * - Make API calls
 * - Update the UI dynamically
 * - Use Stripe's JavaScript library
 */

'use client'

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../../components/CheckoutForm'

// Load Stripe library with your publishable key
// This key is safe to expose in the browser (it's public)
// It starts with "pk_test_" for test mode
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function CheckoutPage() {
  // State to store the client secret from Stripe
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Product details - same as home page
  // In a real app, you'd pass this via URL params or fetch from database
  const amount = 4999 // $49.99 in cents (Stripe uses smallest currency unit)

  // useEffect runs when the component first loads
  // This is where we create the Payment Intent
  useEffect(() => {
    // Function to create the payment intent
    const createPaymentIntent = async () => {
      try {
        // Call our API route
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        })

        // Check if the request was successful
        if (!response.ok) {
          throw new Error('Failed to create payment intent')
        }

        const data = await response.json()
        
        // Save the client secret - we need this for the payment form
        setClientSecret(data.clientSecret)
        setLoading(false)
        
      } catch (err) {
        console.error('Error:', err)
        setError('Failed to initialize checkout. Please try again.')
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, []) // Empty array means this runs once when component loads

  // Stripe Elements options
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe', // You can also use 'night' or 'flat'
      variables: {
        colorPrimary: '#635BFF',
      },
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Checkout</h1>
          <p style={styles.amount}>Total: ${(amount / 100).toFixed(2)}</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Loading checkout...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={styles.error}>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              style={styles.retryButton}
            >
              Retry
            </button>
          </div>
        )}

        {/* Payment form - only show when we have a client secret */}
        {clientSecret && !loading && !error && (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm amount={amount} />
          </Elements>
        )}

        {/* Back link */}
        <div style={styles.footer}>
          <a href="/" style={styles.backLink}>← Back to product</a>
        </div>
      </div>
    </div>
  )
}

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f7f7f7',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
    padding: '40px',
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#1a1a1a',
  },
  amount: {
    fontSize: '24px',
    color: '#635BFF',
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  spinner: {
    width: '40px',
    height: '40px',
    margin: '0 auto 20px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #635BFF',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    color: '#c33',
  },
  retryButton: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#635BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #e0e0e0',
  },
  backLink: {
    color: '#635BFF',
    textDecoration: 'none',
    fontSize: '14px',
  }
}