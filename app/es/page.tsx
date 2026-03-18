import Link from 'next/link';
import type { Metadata } from 'next';
import { getLocalizedBlogPosts } from '@/lib/content';
import { buildAlternatesForHome, getOgImage } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Guías de TradingView (2026) — tradingview-avis.com',
  description: 'Guías prácticas de TradingView: planes, límites, alertas, Pine Script y checklists para elegir sin sorpresas.',
  alternates: buildAlternatesForHome('es'),
  openGraph: {
    type: 'website',
    title: 'Guías de TradingView (2026) — tradingview-avis.com',
    description: 'Guías prácticas de TradingView: planes, límites, alertas, Pine Script y checklists para elegir sin sorpresas.',
    url: '/es',
    images: [{ url: getOgImage('es') }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guías de TradingView (2026) — tradingview-avis.com',
    description: 'Guías prácticas de TradingView: planes, límites, alertas, Pine Script y checklists para elegir sin sorpresas.',
    images: [getOgImage('es')],
  },
};

export default async function EsHomePage() {
  const posts = await getLocalizedBlogPosts('es');

  return (
    <div className="stack">
      <section className="hero">
        <h1>tradingview-avis.com: guías de TradingView</h1>
        <p>Checklists claras para elegir un plan, entender límites y evitar sorpresas. Contenido educativo.</p>
      </section>

      <section className="card" aria-label="Empieza aquí">
        <h2>Empieza aquí</h2>
        <ul className="list">
          <li>
            <Link href="/es/guide-tradingview">Guía TradingView (pilar)</Link>
            <div className="muted">Gráficos, alertas, planes y puntos clave.</div>
          </li>
          <li>
            <Link href="/es/blog/blog-tradingview">TradingView: guía completa (2025)</Link>
            <div className="muted">Funciones, precios, Pine Script, alertas, alternativas.</div>
          </li>
          <li>
            <Link href="/es/bitpanda">Guía Bitpanda</Link>
            <div className="muted">Alternativa cripto: overview + riesgos.</div>
          </li>
          <li>
            <Link href="/es/blog">Blog</Link>
            <div className="muted">Todos los artículos y guías.</div>
          </li>
        </ul>
      </section>

      <section className="card" aria-label="Transparencia">
        <h2>Transparencia</h2>
        <ul className="list">
          <li>
            <Link href="/es/methodology">Metodología</Link>
            <div className="muted">Criterios (planes, límites, datos, workflows).</div>
          </li>
          <li>
            <Link href="/es/sources">Fuentes</Link>
            <div className="muted">Docs oficiales y verificación rápida.</div>
          </li>
          <li>
            <Link href="/es/about">Acerca de</Link>
            <div className="muted">Afiliación, actualizaciones, correcciones.</div>
          </li>
          <li>
            <Link href="/es/contact">Contacto</Link>
            <div className="muted">Preguntas, correcciones, reportes.</div>
          </li>
        </ul>
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
          <li>
            <Link href="/es/about">Acerca de</Link>
            <div className="muted">Afiliación, actualizaciones, correcciones.</div>
          </li>
          <li>
            <Link href="/es/methodology">Metodología</Link>
            <div className="muted">Checklist y criterios.</div>
          </li>
          <li>
            <Link href="/es/sources">Fuentes</Link>
            <div className="muted">Docs oficiales y verificación.</div>
          </li>
          <li>
            <Link href="/es/contact">Contacto</Link>
            <div className="muted">Preguntas, correcciones, reportes.</div>
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
