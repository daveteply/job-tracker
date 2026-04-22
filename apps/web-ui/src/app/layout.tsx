import { Metadata, Viewport } from 'next';
import './global.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Job Tracker',
  description: 'Track your career journey',
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="bg-base-100 text-base-content min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
