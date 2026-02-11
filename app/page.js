/**
 * HOME PAGE (Product Display)
 * 
 * This is the first page users see. It shows:
 * - A product image (placeholder)
 * - Product name and description
 * - Price
 * - "Buy Now" button that takes them to checkout
 * 
 * In Next.js, a file named "page.js" in a folder becomes a route.
 * app/page.js = homepage (/)
 * app/checkout/page.js = /checkout
 */

import Link from 'next/link'

export default function HomePage() {
  // This is our fake product data
  // In a real app, this would come from a database
  const product = {
    name: "Premium Wireless Headphones",
    description: "High-quality sound with active noise cancellation. Perfect for music lovers and professionals.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Product Image */}
        <img 
          src={product.image} 
          alt={product.name}
          style={styles.image}
        />
        
        {/* Product Details */}
        <div style={styles.content}>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.description}>{product.description}</p>
          
          {/* Price Display */}
          <div style={styles.priceContainer}>
            <span style={styles.price}>${product.price}</span>
            <span style={styles.priceLabel}>USD</span>
          </div>
          
          {/* 
            Link component navigates to /checkout without page reload
            This is called "client-side navigation" - faster and smoother
          */}
          <Link href="/checkout" style={styles.button}>
            Buy Now
          </Link>
          
          {/* Info badge */}
          <div style={styles.info}>
            <span style={styles.infoIcon}>ℹ️</span>
            <span style={styles.infoText}>
              This is a test demo. Use card number 4242 4242 4242 4242 to simulate payment.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Inline styles for this component
// In a real app, you might use CSS modules or Tailwind CSS
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
  },
  content: {
    padding: '30px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#1a1a1a',
  },
  description: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '25px',
  },
  price: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  priceLabel: {
    fontSize: '16px',
    color: '#666',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '16px',
    backgroundColor: '#635BFF', // Stripe's brand color
    color: 'white',
    textAlign: 'center',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s',
  },
  info: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#f0f0f0',
    borderRadius: '6px',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: '18px',
  },
  infoText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.4',
  }
}