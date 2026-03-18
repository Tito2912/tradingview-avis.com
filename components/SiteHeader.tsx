'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSelect } from '@/components/LanguageSelect';
import {
  LEGAL_SLUGS,
  METHODOLOGY_SLUGS,
  SOURCES_SLUGS,
  blogIndexHref,
  getLangFromPathname,
  homeHref,
  pageHref,
} from '@/lib/site';

export function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const lang = getLangFromPathname(pathname);
  const labels =
    lang === 'en'
      ? { home: 'Home', blog: 'Blog', methodology: 'Methodology', sources: 'Sources', legal: 'Legal notice' }
      : lang === 'es'
        ? { home: 'Inicio', blog: 'Blog', methodology: 'Metodología', sources: 'Fuentes', legal: 'Aviso legal' }
        : lang === 'de'
          ? { home: 'Startseite', blog: 'Blog', methodology: 'Methodik', sources: 'Quellen', legal: 'Rechtliche Hinweise' }
      : { home: 'Accueil', blog: 'Blog', methodology: 'Méthodo', sources: 'Sources', legal: 'Mentions légales' };

  const home = homeHref(lang);
  const guideTradingViewHref = pageHref(lang, 'guide-tradingview');
  const bitpandaHref = pageHref(lang, 'bitpanda');
  const blogHref = blogIndexHref(lang);
  const methodologyHref = pageHref(lang, METHODOLOGY_SLUGS[lang]);
  const sourcesHref = pageHref(lang, SOURCES_SLUGS[lang]);
  const legalHref = pageHref(lang, LEGAL_SLUGS[lang]);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand-group">
          <a aria-label={labels.home} className="brand" href={home}>
            <Image alt="tradingview-avis.com" height={40} priority src="/images/logo.webp" width={132} />
          </a>
          <Link className="brand" href={guideTradingViewHref}>
            Guide TradingView
          </Link>
          <Link className="brand" href={bitpandaHref}>
            Guide Bitpanda
          </Link>
        </div>

        <div className="header-right">
          <nav aria-label="Primary" className="nav">
            <Link href={blogHref}>{labels.blog}</Link>
            <Link href={methodologyHref}>{labels.methodology}</Link>
            <Link href={sourcesHref}>{labels.sources}</Link>
            <Link href={legalHref}>{labels.legal}</Link>
          </nav>
          <LanguageSelect />
        </div>
      </div>
    </header>
  );
}
