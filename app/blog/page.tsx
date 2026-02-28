import type { Metadata } from 'next';
import { BlogHub, type BlogHubPostCard } from '@/components/BlogHub';
import { getAllPosts } from '@/lib/content';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Blog TradingView 2025 — Guides, tutoriels & comparatifs',
  description:
    'Hub de contenus TradingView : guides pas à pas, tutoriels Pine Script, comparatifs, bonnes pratiques et cas d’usage. Recherchez parmi nos articles.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: 'Blog TradingView',
    description:
      'Hub de contenus TradingView : guides pas à pas, tutoriels Pine Script, comparatifs, bonnes pratiques et cas d’usage. Recherchez parmi nos articles.',
    url: '/blog',
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  const cards: BlogHubPostCard[] = posts.map((p) => ({
    href: `/${p.slug}`,
    title: p.title,
    description: p.description,
    dateLabel: p.date ? new Date(p.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' }) : undefined,
    readingTimeLabel: p.slug === 'blog-tradingview' ? '~12 min' : undefined,
    tags: p.slug === 'blog-tradingview' ? ['guide', 'comparison', 'invest'] : ['guide'],
    image: p.slug === 'blog-tradingview' ? { src: '/images/hero-banner.webp', alt: 'Capture TradingView pour le guide complet' } : undefined,
    ctaLabel: 'Lire l’article',
  }));

  return (
    <div className="stack">
      <BlogHub
        emptyText="Aucun article ne correspond à votre recherche."
        filters={[
          { key: 'all', label: 'Tous' },
          { key: 'guide', label: 'Guides' },
          { key: 'comparison', label: 'Comparatifs' },
          { key: 'pine', label: 'Pine Script' },
          { key: 'invest', label: 'Investissement' },
        ]}
        filtersLabel="Filtres catégorie"
        heading="Le Blog TradingView"
        posts={cards}
        searchLabel="Rechercher un article"
        searchPlaceholder="Rechercher un article…"
        subtitle="Guides pas à pas, comparatifs, Pine Script, cas d’usage — tout pour maîtriser TradingView."
      />

      <section className="card" aria-label="Inscription newsletter">
        <h2>Recevez nos nouveaux guides</h2>
        <p className="muted">Un e-mail par semaine, avec setups pédagogiques, checklists et nouveautés TradingView.</p>
        <ul className="list">
          <li>Contenus actionnables</li>
          <li>Sans spam, désinscription en 1 clic</li>
        </ul>
        <form method="POST" data-netlify="true" name="newsletter" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="newsletter" />
          <p className="sr-only">
            <label>
              Ne pas remplir : <input name="bot-field" />
            </label>
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              name="email"
              type="email"
              required
              placeholder="Votre e-mail"
              style={{
                flex: '1 1 240px',
                padding: '10px 12px',
                border: '1px solid var(--border)',
                borderRadius: 12,
                font: 'inherit',
              }}
            />
            <button className="cta-btn" type="submit">
              S’inscrire
            </button>
          </div>
        </form>
      </section>

      <section className="card" aria-label="Appel à l’action">
        <h2>Prêt à essayer TradingView ?</h2>
        <p className="muted">Graphiques avancés, indicateurs, alertes serveur et intégrations courtiers.</p>
        <a
          className="cta-btn big"
          href="https://fr.tradingview.com/?aff_id=152551"
          rel="noopener nofollow sponsored noreferrer"
          target="_blank"
        >
          Essai gratuit 30 jours
        </a>
      </section>
    </div>
  );
}
