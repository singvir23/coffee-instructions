import styles from './CoffeePage.module.css'; // Import styles
import './globals.css'; // If you have a globals.css for resets etc.

export const metadata = {
  title: 'Morning Coffee Guide',
  description: 'Interactive guide to brewing your morning coffee',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* Apply the appContainer style to the body or a main wrapper */}
      <body className={styles.appContainer}>
        {children}
      </body>
    </html>
  )
}