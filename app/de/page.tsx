import Link from 'next/link';
import type { Metadata } from 'next';
import { getLocalizedBlogPosts } from '@/lib/content';
import { buildAlternatesForHome, getOgImage } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'TradingView Guides (2026) — tradingview-avis.com',
  description: 'Praxisnahe TradingView-Guides: Pläne, Limits, Alerts, Pine Script und Checklisten für die richtige Wahl.',
  alternates: buildAlternatesForHome('de'),
  openGraph: {
    type: 'website',
    title: 'TradingView Guides (2026) — tradingview-avis.com',
    description: 'Praxisnahe TradingView-Guides: Pläne, Limits, Alerts, Pine Script und Checklisten für die richtige Wahl.',
    url: '/de',
    images: [{ url: getOgImage('de') }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradingView Guides (2026) — tradingview-avis.com',
    description: 'Praxisnahe TradingView-Guides: Pläne, Limits, Alerts, Pine Script und Checklisten für die richtige Wahl.',
    images: [getOgImage('de')],
  },
};

export default async function DeHomePage() {
  const posts = await getLocalizedBlogPosts('de');

  return (
    <div className="stack">
      <section className="hero">
        <h1>tradingview-avis.com: TradingView Guides</h1>
        <p>Klare Checklisten zur Planwahl, Limits verstehen und Überraschungen vermeiden. Educational content.</p>
      </section>

      <section className="card" aria-label="Start">
        <h2>Start</h2>
        <ul className="list">
          <li>
            <Link href="/de/guide-tradingview">TradingView Guide (Pillar)</Link>
            <div className="muted">Charts, Alerts, Pläne und Key-Points.</div>
          </li>
          <li>
            <Link href="/de/blog/blog-tradingview">TradingView: kompletter Guide (2025)</Link>
            <div className="muted">Features, Pricing, Pine Script, Alerts, Alternativen.</div>
          </li>
          <li>
            <Link href="/de/blog/tradingview-pricing-2026">TradingView Preise (2026)</Link>
            <div className="muted">Planwahl nach Limits (Alerts, Indikatoren, Daten).</div>
          </li>
          <li>
            <Link href="/de/blog/tradingview-alerts-2026">TradingView Alerts (2026)</Link>
            <div className="muted">Webhooks, Templates und Zuverlässigkeits-Checkliste.</div>
          </li>
          <li>
            <Link href="/de/blog/tradingview-pine-script-2026">Pine Script (2026)</Link>
            <div className="muted">Patterns, Backtesting und Alerts sauber nutzen.</div>
          </li>
          <li>
            <Link href="/de/blog/tradingview-brokers-2026">TradingView + Broker (2026)</Link>
            <div className="muted">Kompatibilität, Limits und typische Fehler.</div>
          </li>
          <li>
            <Link href="/de/blog/tradingview-alternatives-2026">TradingView Alternativen (2026)</Link>
            <div className="muted">Auswahl nach Charting, Execution, Automation.</div>
          </li>
          <li>
            <Link href="/de/blog/tradingview-vs-metatrader-2026">TradingView vs MetaTrader (2026)</Link>
            <div className="muted">Workflow-first Vergleich.</div>
          </li>
          <li>
            <Link href="/de/bitpanda">Bitpanda Guide</Link>
            <div className="muted">Krypto-Alternative: Überblick + Risiken.</div>
          </li>
          <li>
            <Link href="/de/blog">Blog</Link>
            <div className="muted">Alle Artikel und Guides.</div>
          </li>
        </ul>
      </section>

      <section className="card" aria-label="Transparenz">
        <h2>Transparenz</h2>
        <ul className="list">
          <li>
            <Link href="/de/methodology">Methodik</Link>
            <div className="muted">Kriterien (Pläne, Limits, Daten, Workflows).</div>
          </li>
          <li>
            <Link href="/de/sources">Quellen</Link>
            <div className="muted">Offizielle Docs + schneller Check.</div>
          </li>
          <li>
            <Link href="/de/about">Über uns</Link>
            <div className="muted">Affiliate, Updates, Korrekturen.</div>
          </li>
          <li>
            <Link href="/de/contact">Kontakt</Link>
            <div className="muted">Fragen, Korrekturen, Hinweise.</div>
          </li>
        </ul>
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
          <li>
            <Link href="/de/about">Über uns</Link>
            <div className="muted">Affiliate, Updates, Korrekturen.</div>
          </li>
          <li>
            <Link href="/de/methodology">Methodik</Link>
            <div className="muted">Checkliste und Kriterien.</div>
          </li>
          <li>
            <Link href="/de/sources">Quellen</Link>
            <div className="muted">Offizielle Docs und Verifikation.</div>
          </li>
          <li>
            <Link href="/de/contact">Kontakt</Link>
            <div className="muted">Fragen, Korrekturen, Hinweise.</div>
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
