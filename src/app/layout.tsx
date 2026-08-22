import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Evalux — Platform Evaluasi UX',
  description: 'Platform evaluasi dan pengujian pengalaman pengguna (UX) berbasis metode terstandar SUS, UEQ, dan UAT.',
  keywords: 'Evalux, evaluasi UX, usability testing, SUS, UEQ, UAT, penelitian UX',
  icons: {
    icon: '/evalux.png',
    shortcut: '/evalux.png',
    apple: '/evalux.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/evalux.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#1b3a6b" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
