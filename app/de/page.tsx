import Link from 'next/link';
import type { Metadata } from 'next';
import { getLocalizedBlogPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Start',
  description: 'Alle Seiten: Guides (TradingView, Bitpanda), Artikel und rechtliche Seiten.',
  alternates: { canonical: '/de' },
  openGraph: {
    type: 'website',
    title: 'TradingView Review',
    description: 'Alle Seiten: Guides (TradingView, Bitpanda), Artikel und rechtliche Seiten.',
    url: '/de',
  },
};

export default async function DeHomePage() {
  const posts = await getLocalizedBlogPosts('de');

  return (
    <div className="stack">
      <section className="hero">
        <h1>Alle Seiten</h1>
        <p>Guides, Artikel und rechtliche Seiten.</p>
      </section>

      <section className="card" aria-label="Seiten der Website">
        <h2>Seiten</h2>
        <ul className="list">
          <li>
            <Link href="/de/guide-tradingview">TradingView Guide</Link>
            <div className="muted">Charts, Indikatoren, Alerts und Preise.</div>
          </li>
          <li>
            <Link href="/de/bitpanda">Bitpanda Guide</Link>
            <div className="muted">Bitpanda Review: Funktionen, Gebühren (Überblick) und Risiken.</div>
          </li>
          <li>
            <Link href="/de/blog">Blog</Link>
            <div className="muted">Alle Artikel und Guides.</div>
          </li>
          <li>
            <Link href="/de/legal-notice">Rechtliche Hinweise</Link>
            <div className="muted">Herausgeber, Hosting, Affiliate-Hinweis und Haftung.</div>
          </li>
          <li>
            <Link href="/de/privacy-policy">Datenschutz</Link>
            <div className="muted">Daten, Cookies und Ihre Rechte.</div>
          </li>
        </ul>
      </section>

      <section className="card" aria-label="Artikel">
        <h2>Artikel</h2>
        <ul className="list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/de/blog/${p.slug}`}>{p.title}</Link>
              <div className="muted">{p.description}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
