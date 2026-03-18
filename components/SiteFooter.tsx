'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ABOUT_SLUGS,
  CONTACT_SLUGS,
  LEGAL_SLUGS,
  METHODOLOGY_SLUGS,
  PRIVACY_SLUGS,
  SOURCES_SLUGS,
  getLangFromPathname,
  pageHref,
} from '@/lib/site';

export function SiteFooter() {
  const pathname = usePathname() ?? '/';
  const lang = getLangFromPathname(pathname);
  const labels =
    lang === 'en'
      ? {
          about: 'About',
          methodology: 'Methodology',
          sources: 'Sources',
          contact: 'Contact',
          privacy: 'Privacy',
          legal: 'Legal notice',
        }
      : lang === 'es'
        ? {
            about: 'Acerca de',
            methodology: 'Metodología',
            sources: 'Fuentes',
            contact: 'Contacto',
            privacy: 'Privacidad',
            legal: 'Aviso legal',
          }
        : lang === 'de'
          ? {
              about: 'Über uns',
              methodology: 'Methodik',
              sources: 'Quellen',
              contact: 'Kontakt',
              privacy: 'Datenschutz',
              legal: 'Rechtliche Hinweise',
            }
          : {
              about: 'À propos',
              methodology: 'Méthodologie',
              sources: 'Sources',
              contact: 'Contact',
              privacy: 'Confidentialité',
              legal: 'Mentions légales',
            };

  const aboutHref = pageHref(lang, ABOUT_SLUGS[lang]);
  const methodologyHref = pageHref(lang, METHODOLOGY_SLUGS[lang]);
  const sourcesHref = pageHref(lang, SOURCES_SLUGS[lang]);
  const contactHref = pageHref(lang, CONTACT_SLUGS[lang]);
  const privacyHref = pageHref(lang, PRIVACY_SLUGS[lang]);
  const legalHref = pageHref(lang, LEGAL_SLUGS[lang]);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>© {new Date().getFullYear()} — tradingview-avis.com</div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href={aboutHref}>{labels.about}</Link>
          <Link href={methodologyHref}>{labels.methodology}</Link>
          <Link href={sourcesHref}>{labels.sources}</Link>
          <Link href={contactHref}>{labels.contact}</Link>
          <Link href={privacyHref}>{labels.privacy}</Link>
          <Link href={legalHref}>{labels.legal}</Link>
        </div>
      </div>
    </footer>
  );
}
