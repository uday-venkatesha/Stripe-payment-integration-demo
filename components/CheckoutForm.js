'use client'

import { useState } from 'react'
import { useStripe, useElements, PaymentElement, LinkAuthenticationElement } from '@stripe/react-stripe-js'

export default function CheckoutForm({ amount, items }) {
  const stripe = useStripe()
  const elements = useElements()
  
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      setMessage('Stripe has not loaded yet. Please wait.')
      return
    }

    setIsProcessing(true)
    setMessage('')

    // Build confirmParams - only include receipt_email if we have a valid email
    const confirmParams = {
      return_url: `${window.location.origin}/success`,
    }
    
    // Only add receipt_email if the email is valid and non-empty
    if (email && email.trim().length > 0) {
      confirmParams.receipt_email = email.trim()
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams,
    })

    if (error) {
      setMessage(error.message)
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Contact Information</h3>
        <LinkAuthenticationElement
          onChange={(e) => setEmail(e.value.email)}
        />
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Payment Details</h3>
        <PaymentElement />
      </div>

      {message && (
        <div style={styles.error}>
          {message}
        </div>
      )}

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

      <div style={styles.secure}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth="2"/>
        </svg>
        <span style={styles.secureText}>Secured by Stripe</span>
      </div>
    </form>
  )
}

const styles = {
  form: {
    maxWidth: '500px',
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: '#1a1a1a',
  },
  button: {
    width: '100%',
    padding: '1rem',
    marginTop: '1rem',
    backgroundColor: '#635BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonDisabled: {
    backgroundColor: '#9B96FF',
    cursor: 'not-allowed',
  },
  error: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#FEE',
    color: '#C33',
    borderRadius: '6px',
    fontSize: '0.875rem',
  },
  secure: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  secureText: {
    fontSize: '0.75rem',
    color: '#666',
  }
}