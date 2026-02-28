import type { Metadata } from 'next';
import { BlogHub, type BlogHubPostCard } from '@/components/BlogHub';
import { getLocalizedBlogPosts } from '@/lib/content';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'TradingView Blog 2025 — Guides, tutorials & comparisons',
  description:
    'TradingView content hub: step-by-step guides, Pine Script tutorials, comparisons, best practices and use cases. Search through our articles.',
  alternates: { canonical: '/en/blog' },
  openGraph: {
    type: 'website',
    title: 'TradingView Blog',
    description:
      'TradingView content hub: step-by-step guides, Pine Script tutorials, comparisons, best practices and use cases. Search through our articles.',
    url: '/en/blog',
  },
};

export default async function EnBlogPage() {
  const posts = await getLocalizedBlogPosts('en');

  const cards: BlogHubPostCard[] = posts.map((p) => ({
    href: `/en/blog/${p.slug}`,
    title: p.title,
    description: p.description,
    dateLabel: p.date ? new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : undefined,
    readingTimeLabel: p.slug === 'blog-tradingview' ? '~12 min' : undefined,
    tags: p.slug === 'blog-tradingview' ? ['guide', 'comparison', 'invest'] : ['guide'],
    image: p.slug === 'blog-tradingview' ? { src: '/images/hero-banner.webp', alt: 'TradingView screenshot for the complete guide' } : undefined,
    ctaLabel: 'Read article',
  }));

  return (
    <div className="stack">
      <BlogHub
        emptyText="No article matches your search."
        filters={[
          { key: 'all', label: 'All' },
          { key: 'guide', label: 'Guides' },
          { key: 'comparison', label: 'Comparisons' },
          { key: 'pine', label: 'Pine Script' },
          { key: 'invest', label: 'Investing' },
        ]}
        filtersLabel="Category filters"
        heading="The TradingView Blog"
        posts={cards}
        searchLabel="Search an article"
        searchPlaceholder="Search an article…"
        subtitle="Step-by-step guides, comparisons, Pine Script, use cases — everything you need to master TradingView."
      />

      <section className="card" aria-label="Newsletter signup">
        <h2>Get our latest guides</h2>
        <p className="muted">One email per week with educational setups, checklists and TradingView updates.</p>
        <ul className="list">
          <li>Actionable content</li>
          <li>No spam, one-click unsubscribe</li>
        </ul>
        <form method="POST" data-netlify="true" name="newsletter" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="newsletter" />
          <p className="sr-only">
            <label>
              Do not fill: <input name="bot-field" />
            </label>
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              name="email"
              type="email"
              required
              placeholder="Your email"
              style={{
                flex: '1 1 240px',
                padding: '10px 12px',
                border: '1px solid var(--border)',
                borderRadius: 12,
                font: 'inherit',
              }}
            />
            <button className="cta-btn" type="submit">
              Subscribe
            </button>
          </div>
        </form>
      </section>

      <section className="card" aria-label="Call to action">
        <h2>Ready to try TradingView?</h2>
        <p className="muted">Advanced charts, indicators, server alerts and broker integrations.</p>
        <a
          className="cta-btn big"
          href="https://fr.tradingview.com/?aff_id=152551"
          rel="noopener nofollow sponsored noreferrer"
          target="_blank"
        >
          Free 30-day trial
        </a>
      </section>
    </div>
  );
}
