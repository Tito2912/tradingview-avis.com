import type { Metadata } from 'next';
import { BlogHub, type BlogHubPostCard } from '@/components/BlogHub';
import { getLocalizedBlogPosts } from '@/lib/content';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'TradingView Blog 2025 — Guías, tutoriales y comparaciones',
  description:
    'Centro de contenido de TradingView: guías paso a paso, tutoriales de Pine Script, comparaciones, mejores prácticas y casos de uso.',
  alternates: { canonical: '/es/blog' },
  openGraph: {
    type: 'website',
    title: 'TradingView Blog',
    description:
      'Centro de contenido de TradingView: guías paso a paso, tutoriales de Pine Script, comparaciones, mejores prácticas y casos de uso.',
    url: '/es/blog',
  },
};

export default async function EsBlogPage() {
  const posts = await getLocalizedBlogPosts('es');

  const cards: BlogHubPostCard[] = posts.map((p) => ({
    href: `/es/blog/${p.slug}`,
    title: p.title,
    description: p.description,
    dateLabel: p.date ? new Date(p.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' }) : undefined,
    readingTimeLabel: p.slug === 'blog-tradingview' ? '~12 min' : undefined,
    tags: p.slug === 'blog-tradingview' ? ['guide', 'comparison', 'invest'] : ['guide'],
    image: p.slug === 'blog-tradingview' ? { src: '/images/hero-banner.webp', alt: 'Captura de TradingView para la guía completa' } : undefined,
    ctaLabel: 'Leer artículo',
  }));

  return (
    <div className="stack">
      <BlogHub
        emptyText="Ningún artículo coincide con tu búsqueda."
        filters={[
          { key: 'all', label: 'Todos' },
          { key: 'guide', label: 'Guías' },
          { key: 'comparison', label: 'Comparaciones' },
          { key: 'pine', label: 'Pine Script' },
          { key: 'invest', label: 'Invertir' },
        ]}
        filtersLabel="Filtros de categoría"
        heading="El Blog de TradingView"
        posts={cards}
        searchLabel="Buscar un artículo"
        searchPlaceholder="Buscar un artículo…"
        subtitle="Guías paso a paso, comparaciones, Pine Script, casos de uso — todo lo que necesitas para dominar TradingView."
      />

      <section className="card" aria-label="Suscripción a la newsletter">
        <h2>Recibe nuestras últimas guías</h2>
        <p className="muted">Un correo por semana con setups educativos, checklists y novedades de TradingView.</p>
        <ul className="list">
          <li>Contenido accionable</li>
          <li>Sin spam, baja en 1 clic</li>
        </ul>
        <form method="POST" data-netlify="true" name="newsletter" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="newsletter" />
          <p className="sr-only">
            <label>
              No completar: <input name="bot-field" />
            </label>
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              name="email"
              type="email"
              required
              placeholder="Tu email"
              style={{
                flex: '1 1 240px',
                padding: '10px 12px',
                border: '1px solid var(--border)',
                borderRadius: 12,
                font: 'inherit',
              }}
            />
            <button className="cta-btn" type="submit">
              Suscribirse
            </button>
          </div>
        </form>
      </section>

      <section className="card" aria-label="Llamada a la acción">
        <h2>¿Listo para probar TradingView?</h2>
        <p className="muted">Gráficos avanzados, indicadores, alertas del servidor e integraciones con brokers.</p>
        <a
          className="cta-btn big"
          href="https://fr.tradingview.com/?aff_id=152551"
          rel="noopener nofollow sponsored noreferrer"
          target="_blank"
        >
          Prueba gratis de 30 días
        </a>
      </section>
    </div>
  );
}
