import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vellum Alternative - Free Book Formatter',
  description: 'Professional book formatting for $0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
