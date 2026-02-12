'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import Header from '../../components/Header'
import CheckoutForm from '../../components/CheckoutForm'
import { useCartStore } from '../../store/cartStore'
import { formatCurrency, calculateTax, calculateShipping, calculateTotal } from '../../lib/utils'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal } = useCartStore()
  
  const [mounted, setMounted] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const subtotal = mounted ? getTotal() : 0
  const tax = calculateTax(subtotal)
  const shipping = calculateShipping(subtotal)
  const total = calculateTotal(subtotal)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    if (items.length === 0) {
      router.push('/cart')
      return
    }

    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: items.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            })),
            customerInfo: {
              email: ''
            }
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create payment intent')
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
        setLoading(false)
        
      } catch (err) {
        console.error('Error:', err)
        setError(err.message || 'Failed to initialize checkout. Please try again.')
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, [items, router, mounted])

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#635BFF',
      },
    },
  }

  if (!mounted) {
    return (
      <div style={styles.page}>
        <Header />
        <main style={styles.main}>
          <h1 style={styles.title}>Checkout</h1>
          <div style={styles.formSection}>
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
              <p>Loading...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <Header />
      
      <main style={styles.main}>
        <h1 style={styles.title}>Checkout</h1>
        
        <div style={styles.container}>
          <div style={styles.formSection}>
            {loading && (
              <div style={styles.loading}>
                <div style={styles.spinner}></div>
                <p>Loading checkout...</p>
              </div>
            )}

            {error && (
              <div style={styles.errorBox}>
                <h3 style={styles.errorTitle}>Configuration Error</h3>
                <p>{error}</p>
                <div style={styles.errorHelp}>
                  <p><strong>Possible solutions:</strong></p>
                  <ul style={styles.errorList}>
                    <li>Check that your <code>.env.local</code> file exists</li>
                    <li>Verify your Stripe secret key starts with <code>sk_test_</code></li>
                    <li>Make sure the key is set correctly in <code>.env.local</code></li>
                    <li>Restart your dev server after changing <code>.env.local</code></li>
                  </ul>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  style={styles.retryButton}
                >
                  Retry
                </button>
              </div>
            )}

            {clientSecret && !loading && !error && (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm amount={Math.round(total * 100)} items={items} />
              </Elements>
            )}
          </div>
          
          <div style={styles.summarySection}>
            <div style={styles.summary}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>
              
              <div style={styles.items}>
                {items.map((item) => (
                  <div key={item.id} style={styles.summaryItem}>
                    <img src={item.image} alt={item.name} style={styles.summaryItemImage} />
                    <div style={styles.summaryItemDetails}>
                      <div style={styles.summaryItemName}>{item.name}</div>
                      <div style={styles.summaryItemQty}>Qty: {item.quantity}</div>
                    </div>
                    <div style={styles.summaryItemPrice}>
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={styles.divider}></div>
              
              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              <div style={styles.summaryRow}>
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>
              
              <div style={styles.divider}></div>
              
              <div style={styles.summaryTotal}>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#1a1a1a',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '2rem',
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '2rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
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
  errorBox: {
    padding: '2rem',
    color: '#c33',
  },
  errorTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  errorHelp: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#fff3cd',
    borderRadius: '6px',
    color: '#856404',
  },
  errorList: {
    marginTop: '0.5rem',
    paddingLeft: '1.5rem',
  },
  retryButton: {
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#635BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  summarySection: {
    position: 'sticky',
    top: '100px',
    height: 'fit-content',
  },
  summary: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
  },
  summaryTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#1a1a1a',
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1rem',
  },
  summaryItem: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  summaryItemImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  summaryItemDetails: {
    flex: 1,
  },
  summaryItemName: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#1a1a1a',
  },
  summaryItemQty: {
    fontSize: '0.75rem',
    color: '#666',
  },
  summaryItemPrice: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '1rem 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    fontSize: '0.95rem',
    color: '#666',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
  }
}