import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import './site-consistency.css'
import {SiteLanguage} from '@/components/site-language'
import {ImageLightbox} from '@/components/image-lightbox'
import {RouteProgress} from '@/components/route-progress'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Xiangrui Zhou — Interaction & Service Designer',
  description: 'Designing experiences that bridge digital and physical boundaries, starting from human behavior.',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="bg-background scroll-smooth">
      <body className="font-sans antialiased">
        <RouteProgress />
        <SiteLanguage>{children}</SiteLanguage>
        <ImageLightbox />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
