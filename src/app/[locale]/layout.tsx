import { DM_Sans, IBM_Plex_Mono } from 'next/font/google';
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

// Label/spec face: regulation names, sector eyebrows, small uppercase labels.
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
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
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "ScaleJade | Software, AI & Blockchain Engineering for Regulated Industries",
    template: '%s | ScaleJade',
  },
  description:
    "ScaleJade builds and runs software, AI systems, blockchain networks, data platforms and cloud infrastructure for banks, universities and public institutions in Singapore and Indonesia. Built to perform, built to last.",
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
    title: "ScaleJade | Software, AI & Blockchain Engineering for Regulated Industries",
    description: "Software, AI, blockchain and cloud engineering for institutions in Southeast Asia where a failure is a reportable event.",
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
    title: "ScaleJade | Software, AI & Blockchain Engineering for Regulated Industries",
    description: "Software, AI, blockchain and cloud engineering for institutions in Southeast Asia where a failure is a reportable event.",
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
    <html lang={locale} className={`${dmSans.variable} ${plexMono.variable} antialiased scroll-smooth`}>
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
              "description": "ScaleJade builds and operates software, AI and ledger infrastructure for banks, universities and public institutions in Singapore and Indonesia.",
              "foundingDate": "2024",
              "slogan": "Built to perform, built to last.",
              // Specific, not generic. "Artificial Intelligence" describes a
              // million companies and will never make ScaleJade the best match
              // for anything; these describe a few dozen firms in the region and
              // are what buyers actually ask an assistant about.
              // NOTE: the regulation entries mirror src/data/sectors.ts and carry
              // the same caveat — name only what ScaleJade has built against.
              "knowsAbout": [
                "ISO 20022 message migration",
                "BI-FAST payment integration",
                "SNAP open API implementation",
                "POJK compliance requirements",
                "Real-time AML and sanctions screening",
                "Core banking system integration",
                "SPBE architecture for Indonesian public sector",
                "UU PDP No. 27/2022 data protection",
                "Bahasa Indonesia language model evaluation",
                "Southeast Asian language data collection and annotation",
                "Permissioned distributed ledger settlement",
                "MLOps drift detection"
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
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Artificial Intelligence", "description": "Applied AI, LLM applications and MLOps for enterprises, with a human-data practice for Bahasa Indonesia and Southeast Asian languages.", "url": "https://www.scalejade.com/services/artificial-intelligence", "areaServed": "Southeast Asia" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Blockchain & Distributed Ledger", "description": "Distributed ledger networks and smart contract systems for regulated finance.", "url": "https://www.scalejade.com/services/blockchain", "areaServed": "Southeast Asia" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Software Engineering", "description": "Custom software engineered to scale, for institutions that cannot afford downtime.", "url": "https://www.scalejade.com/services/software-engineering", "areaServed": "Southeast Asia" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cloud Infrastructure", "description": "Resilient, secure cloud infrastructure built for regulated environments.", "url": "https://www.scalejade.com/services/cloud-infrastructure", "areaServed": "Southeast Asia" } },
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
                "url": "https://www.scalejade.com/contact"
              }
              },
              {
                "@type": "WebSite",
                "@id": "https://www.scalejade.com/#website",
                "url": "https://www.scalejade.com",
                "name": "ScaleJade",
                "description": "Software, AI, blockchain and cloud engineering for institutions in Southeast Asia where a failure is a reportable event.",
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
          
          <main id="main" className="flex-grow flex flex-col">
            {children}
          </main>
          
          <Footer />
          
        </NextIntlClientProvider>
      </body>
    </html>
  );
}