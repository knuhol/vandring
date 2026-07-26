import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'

import '@/global.css'
import styles from '@/app/[slug]/page.module.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Knuts vandringar',
  description: 'Följ Knuts vandringar och fjälläventyr i Sverige.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👣</text></svg>',
  },
}

export const viewport: Viewport = {
  themeColor: '#f6f4ef',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="sv" className={inter.className}>
      <body>
        <div className="container">
          {children}
          <footer className="footer">
            <p>⛰️ Gjord med kärlek till skogen, fjällen och långa vandringar</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
