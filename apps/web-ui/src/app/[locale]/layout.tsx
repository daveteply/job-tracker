import { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { BRANDING } from '@job-tracker/domain';

import { routing } from '../../i18n/routing';
import { Providers } from '../providers';

import '../global.css';

export const metadata: Metadata = {
  metadataBase: new URL(`https://${BRANDING.domain}`),
  title: {
    default: BRANDING.name,
    template: `%s | ${BRANDING.name}`,
  },
  description: BRANDING.tagline,
  keywords: ['job tracker', 'career management', 'local-first', 'offline-ready', 'PWA', 'job search organizer'],
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'es-US': '/es-US',
    },
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
  openGraph: {
    title: BRANDING.name,
    description: BRANDING.tagline,
    url: './',
    siteName: BRANDING.name,
    images: [
      {
        url: '/vireo-logo-1t.png',
        width: 711,
        height: 285,
        alt: `${BRANDING.name} Logo`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: BRANDING.name,
    description: BRANDING.tagline,
    images: ['/vireo-logo-1t.png'],
  },
  other: {
    google: 'notranslate',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1d232a' },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: BRANDING.name,
    description: BRANDING.tagline,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Android, iOS',
    url: `https://${BRANDING.domain}`,
    image: `https://${BRANDING.domain}/vireo-logo-1t.png`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <html lang={locale} translate="no" suppressHydrationWarning>
      <body className="bg-base-100 text-base-content min-h-screen font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
