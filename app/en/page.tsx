import Link from 'next/link';
import type { Metadata } from 'next';
import { getLocalizedBlogPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Browse all pages: guides (TradingView, Bitpanda), articles and legal pages.',
  alternates: { canonical: '/en' },
  openGraph: {
    type: 'website',
    title: 'TradingView Review',
    description: 'Browse all pages: guides (TradingView, Bitpanda), articles and legal pages.',
    url: '/en',
  },
};

export default async function EnHomePage() {
  const posts = await getLocalizedBlogPosts('en');

  return (
    <div className="stack">
      <section className="hero">
        <h1>All pages</h1>
        <p>Guides, articles and legal pages.</p>
      </section>

      <section className="card" aria-label="Site pages">
        <h2>Pages</h2>
        <ul className="list">
          <li>
            <Link href="/en/guide-tradingview">TradingView guide</Link>
            <div className="muted">Charts, indicators, alerts and pricing.</div>
          </li>
          <li>
            <Link href="/en/bitpanda">Bitpanda guide</Link>
            <div className="muted">Bitpanda review: features, fees (high-level) and risks.</div>
          </li>
          <li>
            <Link href="/en/blog">Blog</Link>
            <div className="muted">All articles and guides.</div>
          </li>
          <li>
            <Link href="/en/legal-notice">Legal notice</Link>
            <div className="muted">Publisher, hosting, affiliation and liability.</div>
          </li>
          <li>
            <Link href="/en/privacy-policy">Privacy policy</Link>
            <div className="muted">Data, cookies and your rights.</div>
          </li>
        </ul>
      </section>

      <section className="card" aria-label="Articles">
        <h2>Articles</h2>
        <ul className="list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/en/blog/${p.slug}`}>{p.title}</Link>
              <div className="muted">{p.description}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
