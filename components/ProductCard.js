'use client'

import { useCartStore } from '../store/cartStore'
import { formatCurrency } from '../lib/utils'

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem)
  
  const handleAddToCart = () => {
    addItem(product)
  }
  
  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img src={product.image} alt={product.name} style={styles.image} />
      </div>
      
      <div style={styles.content}>
        <div style={styles.category}>{product.category}</div>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.description}>{product.description}</p>
        
        <div style={styles.footer}>
          <div style={styles.price}>{formatCurrency(product.price)}</div>
          <button onClick={handleAddToCart} style={styles.button}>
            Add to Cart
          </button>
        </div>
        
        <div style={styles.stock}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  content: {
    padding: '1.25rem',
  },
  category: {
    fontSize: '0.75rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  name: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '0.875rem',
    color: '#666',
    lineHeight: '1.4',
    marginBottom: '1rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  price: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#635BFF',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  stock: {
    fontSize: '0.75rem',
    color: '#666',
  }
}