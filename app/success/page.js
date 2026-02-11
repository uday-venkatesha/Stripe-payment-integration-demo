/**
 * SUCCESS PAGE
 * 
 * Users land here after a successful payment.
 * 
 * Stripe automatically redirects here (we configured it in CheckoutForm.js)
 * and adds a "payment_intent" parameter to the URL so we can verify the payment.
 * 
 * In a real app, you would:
 * 1. Verify the payment with Stripe
 * 2. Create an order in your database
 * 3. Send confirmation email
 * 4. Show order details
 */

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('loading')
  
  // Get payment intent ID from URL
  const paymentIntent = searchParams.get('payment_intent')

  useEffect(() => {
    // In a real app, you'd verify the payment status here
    // For this demo, we'll just mark it as successful
    if (paymentIntent) {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }, [paymentIntent])

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === 'loading' && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Verifying payment...</p>
          </div>
        )}

        {status === 'success' && (
          <div style={styles.success}>
            {/* Success checkmark */}
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

            <h1 style={styles.title}>Payment Successful!</h1>
            
            <p style={styles.message}>
              Thank you for your purchase. Your order has been confirmed.
            </p>

            {/* Order details box */}
            <div style={styles.details}>
              <h2 style={styles.detailsTitle}>Order Details</h2>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Product:</span>
                <span style={styles.detailValue}>Premium Wireless Headphones</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Amount Paid:</span>
                <span style={styles.detailValue}>$49.99</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Payment ID:</span>
                <span style={styles.detailValueSmall}>{paymentIntent}</span>
              </div>
            </div>

            {/* Info box */}
            <div style={styles.info}>
              <p style={styles.infoTitle}>📧 Confirmation Email</p>
              <p style={styles.infoText}>
                A confirmation email has been sent to your email address.
                (This is a demo - no actual email was sent)
              </p>
            </div>

            {/* Action buttons */}
            <div style={styles.actions}>
              <a href="/" style={styles.primaryButton}>
                Back to Home
              </a>
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
              We couldn't verify your payment. Please contact support.
            </p>
            <a href="/" style={styles.primaryButton}>
              Back to Home
            </a>
          </div>
        )}
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
  loading: {
    textAlign: 'center',
    padding: '40px',
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
  success: {
    textAlign: 'center',
  },
  checkmark: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#1a1a1a',
  },
  message: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
  },
  details: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'left',
  },
  detailsTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: '14px',
    color: '#666',
  },
  detailValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  detailValueSmall: {
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#666',
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  info: {
    backgroundColor: '#E8F5E9',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '25px',
  },
  infoTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#2E7D32',
  },
  infoText: {
    fontSize: '13px',
    color: '#555',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '10px',
    flexDirection: 'column',
  },
  primaryButton: {
    display: 'block',
    padding: '14px',
    backgroundColor: '#635BFF',
    color: 'white',
    textAlign: 'center',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  secondaryButton: {
    display: 'block',
    padding: '14px',
    backgroundColor: 'white',
    color: '#635BFF',
    textAlign: 'center',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    border: '2px solid #635BFF',
  },
  error: {
    textAlign: 'center',
  }
}