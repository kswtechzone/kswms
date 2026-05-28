import type { Metadata, Viewport } from 'next';
import './globals.css';
import ThemeProvider from '../components/ThemeProvider';
import { SITE } from '@/lib/constants';

const siteUrl = SITE.url;
const siteName = `${SITE.name} — ${SITE.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} — ${SITE.fullName} by ${SITE.parentCompany}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'management system Nepal',
    'ERP software Nepal',
    'hotel management system',
    'business management software',
    'SaaS management platform',
    'tenant management system',
    'KSW TechZone',
    'cloud ERP solution',
    'modern management software',
    'KSWMS',
    'restaurant management system',
    'staff management software',
    'attendance system Nepal',
    'hotel booking software',
    'multi-tenant SaaS Nepal',
  ],
  authors: [{ name: SITE.parentCompany, url: SITE.parentUrl }],
  creator: SITE.parentCompany,
  publisher: SITE.parentCompany,
  openGraph: {
    title: `${SITE.name} — Modern Cloud Management System by ${SITE.parentCompany}`,
    description: SITE.description,
    url: siteUrl,
    siteName,
    locale: 'en_US',
    type: 'website',
    countryName: 'Nepal',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Modern Cloud Management System by ${SITE.parentCompany}`,
    description: SITE.description,
    creator: '@kswtechzone',
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
  alternates: {
    canonical: siteUrl,
  },
  category: 'technology',
  classification: 'Business Software',
  other: {
    'google-site-verification': '',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE.parentUrl}#organization`,
      name: SITE.parentCompany,
      url: SITE.parentUrl,
      logo: `${SITE.parentUrl}/logo.png`,
      foundingDate: '2024',
      description: `${SITE.parentCompany} builds modern cloud-based management systems for businesses in Nepal and beyond.`,
      sameAs: [
        'https://www.facebook.com/kswtechzone',
        'https://twitter.com/kswtechzone',
        'https://www.linkedin.com/company/kswtechzone',
        'https://github.com/kswtechzone',
      ],
    },
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#webapplication`,
      name: SITE.name,
      url: siteUrl,
      description: SITE.description,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires modern browser',
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: '19',
        highPrice: '99',
        offerCount: '3',
      },
      author: {
        '@type': 'Organization',
        name: SITE.parentCompany,
        url: SITE.parentUrl,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      publisher: {
        '@type': 'Organization',
        name: SITE.parentCompany,
        url: SITE.parentUrl,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
