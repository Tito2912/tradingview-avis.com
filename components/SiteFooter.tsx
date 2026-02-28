'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Lang = 'fr' | 'en' | 'es' | 'de';

function getLangFromPathname(pathname: string): Lang {
  if (!pathname) return 'fr';
  const p = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  if (p === '/en' || p.startsWith('/en/')) return 'en';
  if (p === '/es' || p.startsWith('/es/')) return 'es';
  if (p === '/de' || p.startsWith('/de/')) return 'de';
  return 'fr';
}

export function SiteFooter() {
  const pathname = usePathname() ?? '/';
  const lang = getLangFromPathname(pathname);
  const prefix = lang === 'fr' ? '' : `/${lang}`;
  const labels =
    lang === 'en'
      ? { privacy: 'Privacy', legal: 'Legal notice', contact: 'Contact' }
      : lang === 'es'
        ? { privacy: 'Privacidad', legal: 'Aviso legal', contact: 'Contacto' }
        : lang === 'de'
          ? { privacy: 'Datenschutz', legal: 'Rechtliche Hinweise', contact: 'Kontakt' }
          : { privacy: 'Confidentialité', legal: 'Mentions légales', contact: 'Contact' };

  const privacyHref = lang === 'fr' ? '/politique-de-confidentialite' : `${prefix}/privacy-policy`;
  const legalHref = lang === 'fr' ? '/mentions-legales' : `${prefix}/legal-notice`;

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>© {new Date().getFullYear()} — tradingview-avis.com</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href={privacyHref}>{labels.privacy}</Link>
          <Link href={legalHref}>{labels.legal}</Link>
          <a href="mailto:contact.ecomshopfrance@gmail.com">{labels.contact}</a>
        </div>
      </div>
    </footer>
  );
}
