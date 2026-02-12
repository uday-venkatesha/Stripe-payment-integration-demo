'use client'

import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'

export default function HomePage() {
  return (
    <div style={styles.page}>
      <Header />
      
      <main style={styles.main}>
        <div style={styles.hero}>
          <h1 style={styles.title}>Premium Products</h1>
          <p style={styles.subtitle}>Discover our curated collection of high-quality items</p>
        </div>
        
        <div style={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
  hero: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#666',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
  }
}