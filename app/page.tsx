import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPages } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Accueil',
  description:
    'Accédez à toutes les pages du site : guides (TradingView, Bitpanda), articles et pages légales.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: 'TradingView Avis',
    description:
      'Accédez à toutes les pages du site : guides (TradingView, Bitpanda), articles et pages légales.',
    url: '/',
  },
};

export default async function HomePage() {
  const pages = await getAllPages();
  const pinned = new Set(['guide-tradingview', 'bitpanda']);

  return (
    <div className="stack">
      <section className="hero">
        <h1>Toutes les pages</h1>
        <p>Guides, articles et pages légales.</p>
      </section>

      <section className="card" aria-label="Pages du site">
        <h2>Pages</h2>
        <ul className="list">
          <li>
            <Link href="/guide-tradingview">Guide TradingView</Link>
            <div className="muted">Graphiques, alertes, tarifs et points clés.</div>
          </li>
          <li>
            <Link href="/bitpanda">Guide Bitpanda</Link>
            <div className="muted">Avis Bitpanda : fonctionnalités, frais (vue d’ensemble) et risques.</div>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
            <div className="muted">Tous les articles et guides.</div>
          </li>
          {pages
            .filter((p) => !pinned.has(p.slug))
            .map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`}>{p.title}</Link>
                <div className="muted">{p.description}</div>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
