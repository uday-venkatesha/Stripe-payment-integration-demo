/**
 * CHECKOUT FORM COMPONENT
 * 
 * This is where users enter their card details.
 * 
 * IMPORTANT SECURITY NOTE:
 * We're using Stripe Elements - these are secure input fields that Stripe provides.
 * Card data NEVER touches your server. It goes directly from the user's browser
 * to Stripe's servers. This is called "PCI compliance" and it's required by law.
 * 
 * HOW IT WORKS:
 * 1. Component loads
 * 2. Shows Stripe's secure card input fields
 * 3. User fills in card details
 * 4. User clicks "Pay"
 * 5. Stripe processes the payment
 * 6. We redirect to success page
 * 
 * This is a CLIENT component (runs in the browser, not on the server)
 * That's why we have 'use client' at the top
 */

'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'

export default function CheckoutForm({ amount }) {
  // Stripe hooks - these give us access to Stripe functionality
  const stripe = useStripe()  // Main Stripe object
  const elements = useElements()  // Payment form elements
  
  // State to track what's happening
  const [isProcessing, setIsProcessing] = useState(false)  // Is payment being processed?
  const [message, setMessage] = useState('')  // Error or success messages

  // This function runs when user clicks "Pay Now"
  const handleSubmit = async (event) => {
    // Prevent the form from reloading the page
    event.preventDefault()

    // Make sure Stripe has loaded
    if (!stripe || !elements) {
      setMessage('Stripe has not loaded yet. Please wait.')
      return
    }

    // Show loading state
    setIsProcessing(true)
    setMessage('')

    // Confirm the payment with Stripe
    // This sends the card data to Stripe and processes the payment
    const { error } = await stripe.confirmPayment({
      elements,  // The payment form elements
      confirmParams: {
        // Where to redirect after successful payment
        return_url: `${window.location.origin}/success`,
      },
    })

    // If there's an error, show it to the user
    if (error) {
      setMessage(error.message)
      setIsProcessing(false)
    } else {
      // Success! Stripe will redirect to the success page
      // We don't need to do anything here
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {/* 
        PaymentElement - This is Stripe's magic component
        It shows the card input fields, Apple Pay, Google Pay, etc.
        All secure and PCI compliant!
      */}
      <PaymentElement />

      {/* Show error messages if any */}
      {message && (
        <div style={styles.error}>
          {message}
        </div>
      )}

      {/* Submit button */}
      <button 
        type="submit" 
        disabled={!stripe || isProcessing}
        style={{
          ...styles.button,
          ...((!stripe || isProcessing) ? styles.buttonDisabled : {})
        }}
      >
        {isProcessing ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>

      {/* Test card info reminder */}
      <div style={styles.testInfo}>
        <p style={styles.testTitle}>Test Card Numbers:</p>
        <p style={styles.testCard}>✓ Success: 4242 4242 4242 4242</p>
        <p style={styles.testCard}>✗ Decline: 4000 0000 0000 0002</p>
        <p style={styles.testSmall}>Use any future date, any CVC, any ZIP</p>
      </div>
    </form>
  )
}

// Styles for this component
const styles = {
  form: {
    maxWidth: '500px',
    margin: '0 auto',
  },
  button: {
    width: '100%',
    padding: '16px',
    marginTop: '20px',
    backgroundColor: '#635BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#9B96FF',
    cursor: 'not-allowed',
  },
  error: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#FEE',
    color: '#C33',
    borderRadius: '6px',
    fontSize: '14px',
  },
  testInfo: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#F7F7F7',
    borderRadius: '8px',
    fontSize: '14px',
  },
  testTitle: {
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  },
  testCard: {
    margin: '4px 0',
    color: '#666',
    fontFamily: 'monospace',
  },
  testSmall: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#999',
  }
}