import Link from 'next/link';
import type { Metadata } from 'next';
import { getLocalizedBlogPosts } from '@/lib/content';
import { buildAlternatesForHome, getOgImage } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'TradingView Guides (2026) — tradingview-avis.com',
  description: 'Practical TradingView guides: plans, limits, alerts, Pine Script, and checklists to choose without surprises.',
  alternates: buildAlternatesForHome('en'),
  openGraph: {
    type: 'website',
    title: 'TradingView Guides (2026) — tradingview-avis.com',
    description: 'Practical TradingView guides: plans, limits, alerts, Pine Script, and checklists to choose without surprises.',
    url: '/en',
    images: [{ url: getOgImage('en') }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradingView Guides (2026) — tradingview-avis.com',
    description: 'Practical TradingView guides: plans, limits, alerts, Pine Script, and checklists to choose without surprises.',
    images: [getOgImage('en')],
  },
};

export default async function EnHomePage() {
  const posts = await getLocalizedBlogPosts('en');

  return (
    <div className="stack">
      <section className="hero">
        <h1>tradingview-avis.com: TradingView guides</h1>
        <p>Clear checklists to choose a plan, understand limits, and avoid surprises. Educational content.</p>
      </section>

      <section className="card" aria-label="Start here">
        <h2>Start here</h2>
        <ul className="list">
          <li>
            <Link href="/en/guide-tradingview">TradingView guide (pillar)</Link>
            <div className="muted">Charts, alerts, plans and key points.</div>
          </li>
          <li>
            <Link href="/en/blog/blog-tradingview">TradingView: complete guide (2025)</Link>
            <div className="muted">Features, pricing, Pine Script, alerts, alternatives.</div>
          </li>
          <li>
            <Link href="/en/bitpanda">Bitpanda guide</Link>
            <div className="muted">Crypto alternative: overview + risks.</div>
          </li>
          <li>
            <Link href="/en/blog">Blog</Link>
            <div className="muted">All articles and guides.</div>
          </li>
        </ul>
      </section>

      <section className="card" aria-label="Transparency">
        <h2>Transparency</h2>
        <ul className="list">
          <li>
            <Link href="/en/methodology">Methodology</Link>
            <div className="muted">Evaluation criteria (plans, limits, data, workflows).</div>
          </li>
          <li>
            <Link href="/en/sources">Sources</Link>
            <div className="muted">Official docs + fast verification method.</div>
          </li>
          <li>
            <Link href="/en/about">About</Link>
            <div className="muted">Affiliates, updates, corrections.</div>
          </li>
          <li>
            <Link href="/en/contact">Contact</Link>
            <div className="muted">Questions, corrections, reports.</div>
          </li>
        </ul>
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
          <li>
            <Link href="/en/about">About</Link>
            <div className="muted">Affiliate disclosure, updates, corrections.</div>
          </li>
          <li>
            <Link href="/en/methodology">Methodology</Link>
            <div className="muted">Our checklist and criteria.</div>
          </li>
          <li>
            <Link href="/en/sources">Sources</Link>
            <div className="muted">Official docs and fast verification.</div>
          </li>
          <li>
            <Link href="/en/contact">Contact</Link>
            <div className="muted">Questions, corrections, reports.</div>
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
