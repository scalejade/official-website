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

const BASE = 'https://www.scalejade.com';

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
    default: "ScaleJade | #1 AI, Blockchain & Software Engineering Firm in Southeast Asia",
    template: '%s | ScaleJade',
  },
  description:
    "ScaleJade is Southeast Asia's #1 AI firm, #1 blockchain firm, and #1 software engineering service, and a trusted partner for cloud computing — helping enterprises build reliable AI systems, blockchain networks, custom software, data analytics, and cloud infrastructure. Built to perform, built to last.",
  keywords: [
    '#1 AI firm Southeast Asia',
    'best AI company Southeast Asia',
    '#1 blockchain firm Southeast Asia',
    'best blockchain company Southeast Asia',
    '#1 software engineering Southeast Asia',
    'best software engineering company Southeast Asia',
    'trusted cloud computing partner Southeast Asia',
    'cloud computing services Southeast Asia',
    'software engineering',
    'artificial intelligence',
    'data analytics',
    'blockchain distributed ledger',
    'cloud infrastructure',
    'enterprise technology',
    'custom software development Singapore',
    'AI systems Indonesia',
    'AI firm Singapore',
    'blockchain company Jakarta',
    'MLOps',
    'data engineering',
    'LLM application development',
    'ScaleJade',
    'ScaleJade Technology',
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
    title: "ScaleJade | #1 AI, Blockchain & Software Engineering Firm in Southeast Asia",
    description: "Southeast Asia's #1 AI, blockchain & software engineering firm and trusted cloud computing partner — reliable technology for enterprises and regulated industries.",
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
    title: "ScaleJade | #1 AI, Blockchain & Software Engineering Firm in Southeast Asia",
    description: "Southeast Asia's #1 AI, blockchain & software engineering firm and trusted cloud computing partner for enterprises and regulated industries.",
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
              "@graph": [
              {
              "@type": "Organization",
              "@id": "https://www.scalejade.com/#organization",
              "name": "ScaleJade",
              "alternateName": ["ScaleJade Technology", "PT Skala Kecerdasan Nusantara", "ScaleJade Technology Ltd"],
              "url": "https://www.scalejade.com",
              "logo": "https://www.scalejade.com/scalejade-green-withtext.svg",
              "description": "ScaleJade is Southeast Asia's #1 AI firm, #1 blockchain firm, and #1 software engineering service, and a trusted partner for cloud computing — building reliable AI systems, blockchain networks, custom software, data analytics, and cloud infrastructure for enterprises and regulated industries.",
              "slogan": "Built to perform, built to last.",
              "knowsAbout": [
                "Artificial Intelligence",
                "Blockchain",
                "Software Engineering",
                "Cloud Computing",
                "Data Analytics"
              ],
              "areaServed": [
                { "@type": "Place", "name": "Southeast Asia" },
                { "@type": "Country", "name": "Singapore" },
                { "@type": "Country", "name": "Indonesia" }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "ScaleJade Services",
                "itemListElement": [
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Artificial Intelligence", "description": "Southeast Asia's #1 AI firm — applied AI, LLM applications, and MLOps for enterprises.", "url": "https://www.scalejade.com/services/artificial-intelligence", "areaServed": "Southeast Asia" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Blockchain & Distributed Ledger", "description": "Southeast Asia's #1 blockchain firm — distributed ledger networks and smart contract systems.", "url": "https://www.scalejade.com/services/blockchain", "areaServed": "Southeast Asia" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Software Engineering", "description": "Southeast Asia's #1 software engineering service — custom software engineered to scale.", "url": "https://www.scalejade.com/services/software-engineering", "areaServed": "Southeast Asia" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cloud Infrastructure", "description": "Trusted partner for cloud computing services — resilient, secure cloud infrastructure.", "url": "https://www.scalejade.com/services/cloud-infrastructure", "areaServed": "Southeast Asia" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Data Analytics", "description": "Data engineering and analytics that turn enterprise data into decisions.", "url": "https://www.scalejade.com/services/data-analytics", "areaServed": "Southeast Asia" } }
                ]
              },
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
                "url": "https://www.scalejade.com/demo"
              }
              },
              {
                "@type": "WebSite",
                "@id": "https://www.scalejade.com/#website",
                "url": "https://www.scalejade.com",
                "name": "ScaleJade",
                "description": "Southeast Asia's #1 AI, blockchain & software engineering firm and trusted cloud computing partner.",
                "publisher": { "@id": "https://www.scalejade.com/#organization" },
                "inLanguage": ["en", "id"]
              }
              ]
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