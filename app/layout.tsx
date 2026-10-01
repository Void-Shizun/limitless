import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'limitless',
  description: 'Read Light Novels From Emerging Creators',
  
  icons: {
    icon: [
      {
        url: '/openbook.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/openbook.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/openbook.png',
        type: 'image/png',
      },
    ],
    apple: '/openbook.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
