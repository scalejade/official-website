import { DM_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import '@/app/globals.css';
import { Metadata, Viewport } from 'next';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

const locales = ['en', 'id'];

const BASE = 'https://scalejade.com';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1a13' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'ScaleJade | Software Engineering · AI · Data Analytics · Blockchain & Cloud',
    template: '%s | ScaleJade',
  },
  description: 'ScaleJade (PT Skala Kecerdasan Nusantara / ScaleJade Technology Ltd) is a technology firm helping enterprises build reliable software, AI systems, data analytics, blockchain networks, and cloud infrastructure — built to perform, built to last.',
  keywords: [
    'software engineering',
    'artificial intelligence',
    'data analytics',
    'blockchain distributed ledger',
    'cloud infrastructure',
    'enterprise technology',
    'custom software development Singapore',
    'AI systems Indonesia',
    'MLOps',
    'data engineering',
    'LLM application development',
    'ScaleJade',
    'PT Skala Kecerdasan Nusantara',
    'ScaleJade Technology Ltd',
    'enterprise software Singapore',
    'enterprise software Indonesia',
    'technology firm Singapore',
    'software company Jakarta',
    'regulated industries technology',
    'financial technology Asia',
  ],
  authors: [{ name: 'ScaleJade', url: BASE }],
  creator: 'ScaleJade',
  publisher: 'ScaleJade',
  formatDetection: { email: false, address: false, telephone: false },
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE,
    siteName: 'ScaleJade',
    title: 'ScaleJade | Enterprise Software & Technology Solutions',
    description: 'Building reliable technology for enterprises — software engineering, AI, data analytics, blockchain, and cloud infrastructure for regulated industries.',
    images: [
      {
        url: `${BASE}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'ScaleJade — Built to perform, built to last.',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ScaleJade',
    creator: '@ScaleJade',
    title: 'ScaleJade | Enterprise Software & Technology',
    description: 'Software engineering, AI, data analytics, blockchain & cloud for regulated industries and enterprises.',
    images: [`${BASE}/opengraph-image`],
  },
  // Canonical + hreflang are set per-page via generateMetadata (localeAlternates),
  // so each route is self-referential. No static fallback here — inheriting a
  // homepage canonical on a sub-page that forgot its own would be an SEO bug.
  category: 'Technology',
  classification: 'Enterprise Technology Services',
  referrer: 'origin-when-cross-origin',
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Typed as a Promise for Next.js 15
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${dmSans.variable} antialiased scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ScaleJade",
              "alternateName": ["PT Skala Kecerdasan Nusantara", "ScaleJade Technology Ltd"],
              "url": "https://scalejade.com",
              "logo": "https://scalejade.com/scalejade-green-withtext.svg",
              "description": "ScaleJade is a technology firm helping enterprises build reliable software, AI systems, blockchain networks, and cloud infrastructure for regulated industries.",
              "sameAs": [
                "https://x.com/ScaleJade",
                "https://www.linkedin.com/company/scalejade"
              ],
              "address": [
                {
                  "@type": "PostalAddress",
                  "streetAddress": "9 Raffles Place, #16-20 Republic Plaza II",
                  "addressLocality": "Singapore",
                  "postalCode": "048619",
                  "addressCountry": "SG"
                },
                {
                  "@type": "PostalAddress",
                  "streetAddress": "Kb. Melati, Kecamatan Tanah Abang",
                  "addressLocality": "Jakarta Pusat",
                  "addressRegion": "DKI Jakarta",
                  "postalCode": "10230",
                  "addressCountry": "ID"
                }
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "sales",
                "url": "https://scalejade.com/demo"
              }
            })
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-canvas text-slate-900 font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          
          <Navigation locale={locale} />
          
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          
          <Footer />
          
        </NextIntlClientProvider>
      </body>
    </html>
  );
}