import type { Metadata, Viewport } from 'next'
import { Outfit, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FDF8F3' },
    { media: '(prefers-color-scheme: dark)', color: '#2D2D2D' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://hahnemann.gt'),
  title: {
    default: 'Hahnemann & Moss Baby | Farmacia y Productos para Bebé en Guatemala',
    template: '%s | Hahnemann & Moss Baby Guatemala',
  },
  description: 'Tienda en línea de productos farmacéuticos Hahnemann y artículos premium para bebé Moss Baby. Vitaminas, suplementos, extractores de leche, loncheras. Envíos a toda Guatemala.',
  keywords: [
    'farmacia Guatemala',
    'productos farmacéuticos',
    'vitaminas Guatemala',
    'suplementos alimenticios',
    'productos para bebé',
    'extractor de leche Guatemala',
    'loncheras térmicas',
    'Hahnemann farmacia',
    'Moss Baby',
    'tienda en línea Guatemala',
    'medicamentos naturales',
    'cuidado personal',
  ],
  authors: [{ name: 'Hahnemann & Moss Baby' }],
  creator: 'Hahnemann & Moss Baby',
  publisher: 'Hahnemann & Moss Baby',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_GT',
    url: 'https://hahnemann.gt',
    siteName: 'Hahnemann & Moss Baby',
    title: 'Hahnemann & Moss Baby | Farmacia y Productos para Bebé en Guatemala',
    description: 'Tu farmacia de confianza y los mejores productos para bebé. Vitaminas, suplementos, extractores de leche, loncheras. Envíos a toda Guatemala.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hahnemann & Moss Baby - Farmacia y Productos para Bebé',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hahnemann & Moss Baby | Farmacia y Productos para Bebé',
    description: 'Tu farmacia de confianza y los mejores productos para bebé en Guatemala.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://hahnemann.gt',
  },
  category: 'ecommerce',
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hahnemann & Moss Baby',
  description: 'Farmacia y tienda de productos para bebé en Guatemala',
  url: 'https://hahnemann.gt',
  logo: 'https://hahnemann.gt/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+502-1234-5678',
    contactType: 'customer service',
    availableLanguage: 'Spanish',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ciudad de Guatemala',
    addressCountry: 'GT',
  },
  sameAs: [
    'https://facebook.com/hahnemanngt',
    'https://instagram.com/hahnemanngt',
  ],
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Hahnemann & Moss Baby',
  image: 'https://hahnemann.gt/logo.png',
  '@id': 'https://hahnemann.gt',
  url: 'https://hahnemann.gt',
  telephone: '+502-1234-5678',
  priceRange: 'Q50 - Q2000',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ciudad de Guatemala',
    addressRegion: 'Guatemala',
    addressCountry: 'GT',
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '18:00',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-GT" className={`${outfit.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="font-sans bg-cream text-charcoal antialiased">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#2D2D2D',
              color: '#fff',
              borderRadius: '12px',
            },
          }}
        />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
