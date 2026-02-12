'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '../../components/Header'
import { useCartStore } from '../../store/cartStore'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)
  
  const [status, setStatus] = useState('loading')
  const paymentIntent = searchParams.get('payment_intent')

  useEffect(() => {
    if (paymentIntent) {
      setStatus('success')
      clearCart()
    } else {
      setStatus('error')
    }
  }, [paymentIntent, clearCart])

  return (
    <div style={styles.page}>
      <Header />
      
      <main style={styles.main}>
        {status === 'loading' && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Verifying payment...</p>
          </div>
        )}

        {status === 'success' && (
          <div style={styles.success}>
            <div style={styles.checkmark}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="38" fill="#4CAF50" />
                <path 
                  d="M25 40 L35 50 L55 30" 
                  stroke="white" 
                  strokeWidth="5" 
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h1 style={styles.title}>Order Confirmed!</h1>
            
            <p style={styles.message}>
              Thank you for your purchase. Your order has been successfully processed.
            </p>

            <div style={styles.details}>
              <h2 style={styles.detailsTitle}>What's Next?</h2>
              <ul style={styles.list}>
                <li style={styles.listItem}>You'll receive an order confirmation email shortly</li>
                <li style={styles.listItem}>We'll send you tracking information once your order ships</li>
                <li style={styles.listItem}>Estimated delivery: 3-5 business days</li>
              </ul>
            </div>

            <div style={styles.orderInfo}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Order Number:</span>
                <span style={styles.infoValue}>{paymentIntent}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Date:</span>
                <span style={styles.infoValue}>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div style={styles.actions}>
              <button 
                onClick={() => router.push('/')} 
                style={styles.primaryButton}
              >
                Continue Shopping
              </button>
              <a 
                href={`https://dashboard.stripe.com/test/payments/${paymentIntent}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.secondaryButton}
              >
                View in Stripe Dashboard
              </a>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={styles.error}>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.message}>
              We couldn't verify your payment. Please contact support if you were charged.
            </p>
            <button 
              onClick={() => router.push('/')} 
              style={styles.primaryButton}
            >
              Return to Home
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    margin: '0 auto 1rem',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #635BFF',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  success: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '3rem',
    textAlign: 'center',
  },
  checkmark: {
    marginBottom: '1.5rem',
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '0.75rem',
    color: '#1a1a1a',
  },
  message: {
    fontSize: '1.125rem',
    color: '#666',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  details: {
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    textAlign: 'left',
  },
  detailsTitle: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#1a1a1a',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '0.5rem 0',
    paddingLeft: '1.5rem',
    position: 'relative',
    color: '#666',
    fontSize: '0.95rem',
  },
  orderInfo: {
    backgroundColor: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    textAlign: 'left',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  infoLabel: {
    fontSize: '0.95rem',
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: '0.95rem',
    color: '#1a1a1a',
    fontFamily: 'monospace',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    flexDirection: 'column',
  },
  primaryButton: {
    padding: '1rem',
    backgroundColor: '#635BFF',
    color: 'white',
    textAlign: 'center',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
  },
  secondaryButton: {
    padding: '1rem',
    backgroundColor: 'white',
    color: '#635BFF',
    textAlign: 'center',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    border: '2px solid #635BFF',
    display: 'block',
  },
  error: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '3rem',
    textAlign: 'center',
  }
}