import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPages } from '@/lib/content';
import { buildAlternatesForHome, getOgImage } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Guides TradingView (2026) — tradingview-avis.com',
  description:
    'Guides pratiques TradingView : plans, limites, alertes, Pine Script et checklists pour choisir sans surprises. Contenu informatif.',
  alternates: buildAlternatesForHome('fr'),
  openGraph: {
    type: 'website',
    title: 'Guides TradingView (2026) — tradingview-avis.com',
    description:
      'Guides pratiques TradingView : plans, limites, alertes, Pine Script et checklists pour choisir sans surprises.',
    url: '/',
    images: [{ url: getOgImage('fr') }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guides TradingView (2026) — tradingview-avis.com',
    description:
      'Guides pratiques TradingView : plans, limites, alertes, Pine Script et checklists pour choisir sans surprises.',
    images: [getOgImage('fr')],
  },
};

export default async function HomePage() {
  const pages = await getAllPages();
  const pinned = new Set(['guide-tradingview', 'bitpanda', 'blog', 'methodologie', 'sources', 'a-propos', 'contact']);

  return (
    <div className="stack">
      <section className="hero">
        <h1>tradingview-avis.com : guides TradingView</h1>
        <p>Des checklists claires pour choisir un plan, comprendre les limites et éviter les surprises. Contenu informatif.</p>
      </section>

      <section className="card" aria-label="Commencer">
        <h2>Commencer</h2>
        <ul className="list">
          <li>
            <Link href="/guide-tradingview">Guide TradingView (pilier)</Link>
            <div className="muted">Graphiques, alertes, plans et points clés.</div>
          </li>
          <li>
            <Link href="/blog-tradingview">TradingView : guide complet (2025)</Link>
            <div className="muted">Fonctionnalités, tarifs, Pine Script, alertes, alternatives.</div>
          </li>
          <li>
            <Link href="/tradingview-pricing-2026">TradingView : tarifs &amp; plans (2026)</Link>
            <div className="muted">Choisir un plan selon vos limites (alertes, indicateurs, data).</div>
          </li>
          <li>
            <Link href="/tradingview-alerts-2026">Alertes TradingView (2026)</Link>
            <div className="muted">Serveur, webhooks, templates et checklist de fiabilité.</div>
          </li>
          <li>
            <Link href="/tradingview-pine-script-2026">Pine Script (2026)</Link>
            <div className="muted">Débuter proprement : patterns, backtesting, alertes.</div>
          </li>
          <li>
            <Link href="/tradingview-brokers-2026">TradingView + brokers (2026)</Link>
            <div className="muted">Compatibilité, limites et erreurs fréquentes.</div>
          </li>
          <li>
            <Link href="/tradingview-alternatives-2026">Alternatives à TradingView (2026)</Link>
            <div className="muted">Choisir selon charting, execution, automation.</div>
          </li>
          <li>
            <Link href="/tradingview-vs-metatrader-2026">TradingView vs MetaTrader (2026)</Link>
            <div className="muted">Comparatif centré workflow + décision rapide.</div>
          </li>
          <li>
            <Link href="/bitpanda">Guide Bitpanda</Link>
            <div className="muted">Alternative crypto : aperçu des fonctionnalités, frais (vue d’ensemble) et risques.</div>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
            <div className="muted">Tous les articles et guides.</div>
          </li>
        </ul>
      </section>

      <section className="card" aria-label="Transparence">
        <h2>Transparence</h2>
        <ul className="list">
          <li>
            <Link href="/methodologie">Méthodologie</Link>
            <div className="muted">Critères d’évaluation (plans, limites, data, workflows).</div>
          </li>
          <li>
            <Link href="/sources">Sources</Link>
            <div className="muted">Docs officielles et méthode de vérification rapide.</div>
          </li>
          <li>
            <Link href="/a-propos">À propos</Link>
            <div className="muted">Affiliation, mises à jour, corrections.</div>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
            <div className="muted">Question, correction, signalement.</div>
          </li>
        </ul>
      </section>

      <section className="card" aria-label="Pages du site">
        <h2>Toutes les pages</h2>
        <ul className="list">
          <li>
            <Link href="/guide-tradingview">Guide TradingView</Link>
            <div className="muted">Graphiques, alertes, tarifs et points clés.</div>
          </li>
          <li>
            <Link href="/bitpanda">Guide Bitpanda</Link>
            <div className="muted">Avis Bitpanda : fonctionnalités, frais (vue d’ensemble) et risques.</div>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
            <div className="muted">Tous les articles et guides.</div>
          </li>
          {pages
            .filter((p) => !pinned.has(p.slug))
            .map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`}>{p.title}</Link>
                <div className="muted">{p.description}</div>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
