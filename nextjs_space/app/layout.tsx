import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import type { Metadata } from 'next'
import Script from 'next/script'

export const dynamic = 'force-static'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  metadataBase: new URL('https://bmbrenovation.co.uk'),
  title: 'BMB Renovation | Premium Home Renovation & Building Services in Watford & London',
  description: 'BMB Renovation offers premium home, kitchen & bathroom renovation services in Watford, London & Hertfordshire. Free consultation. Get your quote today. Call +44 7775 758 717.',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://bmbrenovation.co.uk',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://bmbrenovation.co.uk',
    siteName: 'BMB Renovation',
    title: 'BMB Renovation | Premium Home Renovation & Building Services',
    description: 'BMB Renovation offers premium home, kitchen & bathroom renovation services in Watford, London & Hertfordshire. Free consultation. Call +44 7775 758 717.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BMB Renovation - Premium Home Renovation Services in Watford' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMB Renovation | Premium Home Renovation & Building Services',
    description: 'BMB Renovation offers premium home, kitchen & bathroom renovation services in Watford, London & Hertfordshire.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <Script strategy="afterInteractive" src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            "name": "BMB Renovation",
            "url": "https://bmbrenovation.co.uk",
            "logo": "https://bmbrenovation.co.uk/favicon.svg",
            "image": "https://bmbrenovation.co.uk/og-image.png",
            "description": "BMB Renovation offers premium home, kitchen & bathroom renovation services in Watford, London & Hertfordshire. 15+ years of experience. Free consultation.",
            "telephone": "+447775758717",
            "email": "contact@bmbrenovation.co.uk",
            "priceRange": "££",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "157 Judge Street",
              "addressLocality": "Watford",
              "postalCode": "WD24 5AN",
              "addressRegion": "Hertfordshire",
              "addressCountry": "GB"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 51.6549,
              "longitude": -0.3978
            },
            "areaServed": [
              "Watford", "Bushey", "Rickmansworth", "St Albans",
              "Hemel Hempstead", "Borehamwood", "Harrow", "Croxley Green",
              "Luton", "Bedford", "London"
            ],
            "openingHoursSpecification": [
              { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "08:00", "closes": "18:00" },
              { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:00", "closes": "16:00" }
            ],
            "sameAs": [
              "https://www.facebook.com/bmbrenovation",
              "https://www.instagram.com/bmbrenovation"
            ]
          }) }}
        />
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=AW-18105187591" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18105187591');
          `}
        </Script>
      </head>
      <body className={`${dmSans.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <ChunkLoadErrorHandler />
        </ThemeProvider>
      </body>
    </html>
  )
}
