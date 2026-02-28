import type { Metadata } from 'next';
import './globals.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: {
    default: 'TradingView Avis',
    template: '%s | TradingView Avis',
  },
  description:
    'Avis TradingView : graphiques avancés, indicateurs, screeners, alertes et intégrations brokers. Prix, comparatif, FAQ et essai gratuit 30 jours.',
  metadataBase: new URL('https://tradingview-avis.com'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'TradingView Avis',
    description:
      'Avis TradingView : graphiques avancés, indicateurs, screeners, alertes et intégrations brokers. Prix, comparatif, FAQ et essai gratuit 30 jours.',
    url: 'https://tradingview-avis.com',
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
