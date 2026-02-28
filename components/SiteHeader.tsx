'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSelect } from '@/components/LanguageSelect';

type Lang = 'fr' | 'en' | 'es' | 'de';

function getLangFromPathname(pathname: string): Lang {
  if (!pathname) return 'fr';
  const p = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  if (p === '/en' || p.startsWith('/en/')) return 'en';
  if (p === '/es' || p.startsWith('/es/')) return 'es';
  if (p === '/de' || p.startsWith('/de/')) return 'de';
  return 'fr';
}

export function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const lang = getLangFromPathname(pathname);
  const prefix = lang === 'fr' ? '' : `/${lang}`;
  const labels =
    lang === 'en'
      ? { home: 'Home', blog: 'Blog', legal: 'Legal notice' }
      : lang === 'es'
        ? { home: 'Inicio', blog: 'Blog', legal: 'Aviso legal' }
        : lang === 'de'
          ? { home: 'Startseite', blog: 'Blog', legal: 'Rechtliche Hinweise' }
      : { home: 'Accueil', blog: 'Blog', legal: 'Mentions légales' };

  const homeHref = prefix || '/';
  const guideTradingViewHref = `${prefix}/guide-tradingview`;
  const bitpandaHref = `${prefix}/bitpanda`;
  const blogHref = `${prefix}/blog`;
  const legalHref = lang === 'fr' ? '/mentions-legales' : `${prefix}/legal-notice`;

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand-group">
          <a aria-label={labels.home} className="brand" href={homeHref}>
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
            <Link href={legalHref}>{labels.legal}</Link>
          </nav>
          <LanguageSelect />
        </div>
      </div>
    </header>
  );
}
