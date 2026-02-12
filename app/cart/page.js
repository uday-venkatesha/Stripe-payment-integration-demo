'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import { useCartStore } from '../../store/cartStore'
import { formatCurrency, calculateTax, calculateShipping, calculateTotal } from '../../lib/utils'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const subtotal = mounted ? getTotal() : 0
  const tax = calculateTax(subtotal)
  const shipping = calculateShipping(subtotal)
  const total = calculateTotal(subtotal)

  const handleCheckout = () => {
    if (items.length === 0) return
    router.push('/checkout')
  }
  
  if (!mounted || items.length === 0) {
    return (
      <div style={styles.page}>
        <Header />
        <div style={styles.empty}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
            <path d="M9 2L7.17 6H2v13h20V6h-5.17L15 2H9z"/>
          </svg>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptyText}>Add some products to get started</p>
          <button onClick={() => router.push('/')} style={styles.shopButton}>
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div style={styles.page}>
      <Header />
      
      <main style={styles.main}>
        <h1 style={styles.title}>Shopping Cart</h1>
        
        <div style={styles.container}>
          <div style={styles.itemsSection}>
            {items.map((item) => (
              <div key={item.id} style={styles.item}>
                <img src={item.image} alt={item.name} style={styles.itemImage} />
                
                <div style={styles.itemDetails}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemDescription}>{item.description}</p>
                  <p style={styles.itemPrice}>{formatCurrency(item.price)}</p>
                </div>
                
                <div style={styles.itemActions}>
                  <div style={styles.quantityControl}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={styles.quantityButton}
                    >
                      -
                    </button>
                    <span style={styles.quantity}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={styles.quantityButton}
                    >
                      +
                    </button>
                  </div>
                  
                  <div style={styles.itemTotal}>
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div style={styles.summarySection}>
            <div style={styles.summary}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>
              
              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              <div style={styles.summaryRow}>
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
              </div>
              
              {shipping > 0 && (
                <div style={styles.freeShippingNote}>
                  Add {formatCurrency(100 - subtotal)} more for free shipping
                </div>
              )}
              
              <div style={styles.summaryDivider}></div>
              
              <div style={styles.summaryTotal}>
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
              
              <button onClick={handleCheckout} style={styles.checkoutButton}>
                Proceed to Checkout
              </button>
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
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
  },
  itemsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  item: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  itemImage: {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
    color: '#1a1a1a',
  },
  itemDescription: {
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  itemPrice: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.75rem',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '0.25rem',
  },
  quantityButton: {
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  quantity: {
    minWidth: '40px',
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: '600',
  },
  itemTotal: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  removeButton: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    color: '#dc3545',
    border: '1px solid #dc3545',
    borderRadius: '6px',
    fontSize: '0.875rem',
    cursor: 'pointer',
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
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    fontSize: '0.95rem',
    color: '#666',
  },
  freeShippingNote: {
    fontSize: '0.75rem',
    color: '#635BFF',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '1rem 0',
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#1a1a1a',
  },
  checkoutButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#635BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginTop: '1rem',
    marginBottom: '0.5rem',
    color: '#1a1a1a',
  },
  emptyText: {
    color: '#666',
    marginBottom: '2rem',
  },
  shopButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#635BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  }
}