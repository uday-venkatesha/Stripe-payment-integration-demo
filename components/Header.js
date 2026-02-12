'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '../store/cartStore'

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link href="/" style={styles.logo}>
          Store
        </Link>
        
        <nav style={styles.nav}>
          <Link href="/" style={styles.link}>
            Products
          </Link>
          <Link href="/cart" style={styles.cartLink}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 2L7.17 6H2v13h20V6h-5.17L15 2H9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {mounted && itemCount > 0 && (
              <span style={styles.badge}>{itemCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}

const styles = {
  header: {
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid #333',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  cartLink: {
    position: 'relative',
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#635BFF',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  }
}