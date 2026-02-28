import Link from 'next/link';
import type { Metadata } from 'next';
import { getLocalizedBlogPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Accede a todas las páginas: guías (TradingView, Bitpanda), artículos y páginas legales.',
  alternates: { canonical: '/es' },
  openGraph: {
    type: 'website',
    title: 'TradingView Review',
    description: 'Accede a todas las páginas: guías (TradingView, Bitpanda), artículos y páginas legales.',
    url: '/es',
  },
};

export default async function EsHomePage() {
  const posts = await getLocalizedBlogPosts('es');

  return (
    <div className="stack">
      <section className="hero">
        <h1>Todas las páginas</h1>
        <p>Guías, artículos y páginas legales.</p>
      </section>

      <section className="card" aria-label="Páginas del sitio">
        <h2>Páginas</h2>
        <ul className="list">
          <li>
            <Link href="/es/guide-tradingview">Guía TradingView</Link>
            <div className="muted">Gráficos, indicadores, alertas y precios.</div>
          </li>
          <li>
            <Link href="/es/bitpanda">Guía Bitpanda</Link>
            <div className="muted">Reseña Bitpanda: funciones, comisiones (visión general) y riesgos.</div>
          </li>
          <li>
            <Link href="/es/blog">Blog</Link>
            <div className="muted">Todos los artículos y guías.</div>
          </li>
          <li>
            <Link href="/es/legal-notice">Aviso legal</Link>
            <div className="muted">Editor, hosting, afiliación y responsabilidad.</div>
          </li>
          <li>
            <Link href="/es/privacy-policy">Política de privacidad</Link>
            <div className="muted">Datos, cookies y tus derechos.</div>
          </li>
        </ul>
      </section>

      <section className="card" aria-label="Artículos">
        <h2>Artículos</h2>
        <ul className="list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/es/blog/${p.slug}`}>{p.title}</Link>
              <div className="muted">{p.description}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
