import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export const viewport: Viewport = {
  themeColor: '#2b78ff',
};

export const metadata: Metadata = {
  title: {
    default: 'TradingView Avis',
    template: '%s | TradingView Avis',
  },
  description:
    'Avis TradingView : graphiques avancés, indicateurs, screeners, alertes et intégrations brokers. Prix, comparatif, FAQ et essai gratuit 30 jours.',
  icons: {
    icon: [{ url: '/images/favicon.webp', type: 'image/webp' }],
  },
  metadataBase: new URL('https://tradingview-avis.com'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'TradingView Avis',
    description:
      'Avis TradingView : graphiques avancés, indicateurs, screeners, alertes et intégrations brokers. Prix, comparatif, FAQ et essai gratuit 30 jours.',
    url: 'https://tradingview-avis.com',
    images: [{ url: '/images/og-image.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradingView Avis',
    description:
      'Avis TradingView : graphiques avancés, indicateurs, screeners, alertes et intégrations brokers. Prix, comparatif, FAQ et essai gratuit 30 jours.',
    images: ['/images/og-image.webp'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SiteHeader />
        <main className="container">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
