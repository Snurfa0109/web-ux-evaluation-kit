import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Platform Evaluasi UX — Disnakertrans Kabupaten Serang',
  description: 'Platform penelitian evaluasi pengalaman pengguna website Dinas Tenaga Kerja dan Transmigrasi Kabupaten Serang. Evaluasi dilakukan dalam 3 tahap: SUS, UEQ, dan UAT.',
  keywords: 'evaluasi UX, Disnakertrans Serang, SUS, UEQ, UAT, penelitian usability',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
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
