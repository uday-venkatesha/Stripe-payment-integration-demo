/**
 * ROOT LAYOUT
 * 
 * This wraps your entire application. Think of it as the "skeleton" that appears
 * on every page (like a header, footer, or common styling).
 * 
 * In Next.js 14, this is required and must be in the app/ directory.
 */

export const metadata = {
  title: 'Stripe Checkout Demo',
  description: 'Test e-commerce checkout with Stripe',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* This adds basic responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: '#f7f7f7'
      }}>
        {/* 
          {children} is where each page's content will appear
          For example, when you visit "/checkout", the checkout page content
          will be inserted here
        */}
        {children}
      </body>
    </html>
  )
}