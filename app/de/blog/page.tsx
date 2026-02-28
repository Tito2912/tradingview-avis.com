import type { Metadata } from 'next';
import { BlogHub, type BlogHubPostCard } from '@/components/BlogHub';
import { getLocalizedBlogPosts } from '@/lib/content';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'TradingView Blog 2025 — Guides, Tutorials & Vergleichen',
  description:
    'TradingView Content Hub: Schritt für Schritt Anleitungen, Pine Script Tutorials, Vergleiche, Best Practices und Use Cases. Suche durch unsere Artikel.',
  alternates: { canonical: '/de/blog' },
  openGraph: {
    type: 'website',
    title: 'TradingView Blog',
    description:
      'TradingView Content Hub: Schritt für Schritt Anleitungen, Pine Script Tutorials, Vergleiche, Best Practices und Use Cases. Suche durch unsere Artikel.',
    url: '/de/blog',
  },
};

export default async function DeBlogPage() {
  const posts = await getLocalizedBlogPosts('de');

  const cards: BlogHubPostCard[] = posts.map((p) => ({
    href: `/de/blog/${p.slug}`,
    title: p.title,
    description: p.description,
    dateLabel: p.date ? new Date(p.date).toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric' }) : undefined,
    readingTimeLabel: p.slug === 'blog-tradingview' ? '~12 min' : undefined,
    tags: p.slug === 'blog-tradingview' ? ['guide', 'comparison', 'invest'] : ['guide'],
    image: p.slug === 'blog-tradingview' ? { src: '/images/hero-banner.webp', alt: 'TradingView Screenshot für den vollständigen Guide' } : undefined,
    ctaLabel: 'Artikel lesen',
  }));

  return (
    <div className="stack">
      <BlogHub
        emptyText="Kein Artikel entspricht Ihrer Suche."
        filters={[
          { key: 'all', label: 'Alle' },
          { key: 'guide', label: 'Anleitungen' },
          { key: 'comparison', label: 'Vergleiche' },
          { key: 'pine', label: 'Pinienskript' },
          { key: 'invest', label: 'Investieren' },
        ]}
        filtersLabel="Kategorie Filter"
        heading="Der TradingView Blog"
        posts={cards}
        searchLabel="Suchen Sie einen Artikel"
        searchPlaceholder="Suchen Sie einen Artikel…"
        subtitle="Schritt für Schritt Anleitungen, Vergleiche, Pine Script, Use Cases – alles, was Sie brauchen, um TradingView zu meistern."
      />

      <section className="card" aria-label="Newsletter Anmeldung">
        <h2>Holen Sie sich unsere neuesten Guides</h2>
        <p className="muted">Eine E-Mail pro Woche mit Bildungs-Setups, Checklisten und TradingView-Updates.</p>
        <ul className="list">
          <li>Aktionsfähiger Inhalt</li>
          <li>Kein Spam, ein Klick Abmelden</li>
        </ul>
        <form method="POST" data-netlify="true" name="newsletter" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="newsletter" />
          <p className="sr-only">
            <label>
              Nicht ausfüllen: <input name="bot-field" />
            </label>
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              name="email"
              type="email"
              required
              placeholder="Ihre E-Mail"
              style={{
                flex: '1 1 240px',
                padding: '10px 12px',
                border: '1px solid var(--border)',
                borderRadius: 12,
                font: 'inherit',
              }}
            />
            <button className="cta-btn" type="submit">
              Anmelden
            </button>
          </div>
        </form>
      </section>

      <section className="card" aria-label="Aufruf zur Aktion">
        <h2>Bereit, TradingView zu versuchen?</h2>
        <p className="muted">Erweiterte Diagramme, Indikatoren, Server-Alarme und Broker-Integrationen.</p>
        <a
          className="cta-btn big"
          href="https://fr.tradingview.com/?aff_id=152551"
          rel="noopener nofollow sponsored noreferrer"
          target="_blank"
        >
          Kostenlose 30-Tage-Testversion
        </a>
      </section>
    </div>
  );
}
