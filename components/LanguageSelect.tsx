'use client';

import { usePathname } from 'next/navigation';
import { useId } from 'react';

type Lang = 'fr' | 'en' | 'es' | 'de';

const LANGS: Array<{ code: Lang; label: string }> = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' },
];

const ROUTES: Array<Record<Lang, string>> = [
  { fr: '/', en: '/en', es: '/es', de: '/de' },
  { fr: '/blog', en: '/en/blog', es: '/es/blog', de: '/de/blog' },
  { fr: '/guide-tradingview', en: '/en/guide-tradingview', es: '/es/guide-tradingview', de: '/de/guide-tradingview' },
  { fr: '/bitpanda', en: '/en/bitpanda', es: '/es/bitpanda', de: '/de/bitpanda' },
  { fr: '/mentions-legales', en: '/en/legal-notice', es: '/es/legal-notice', de: '/de/legal-notice' },
  {
    fr: '/politique-de-confidentialite',
    en: '/en/privacy-policy',
    es: '/es/privacy-policy',
    de: '/de/privacy-policy',
  },
  {
    fr: '/blog-tradingview',
    en: '/en/blog/blog-tradingview',
    es: '/es/blog/blog-tradingview',
    de: '/de/blog/blog-tradingview',
  },
];

function normalizePathname(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

function getLangFromPathname(pathname: string): Lang {
  const p = normalizePathname(pathname);
  if (p === '/en' || p.startsWith('/en/')) return 'en';
  if (p === '/es' || p.startsWith('/es/')) return 'es';
  if (p === '/de' || p.startsWith('/de/')) return 'de';
  return 'fr';
}

function getFallbackUrl(lang: Lang): string {
  return ROUTES[0]?.[lang] ?? '/';
}

function getTargetUrl(pathname: string, targetLang: Lang): string {
  const p = normalizePathname(pathname);
  for (const entry of ROUTES) {
    const values = Object.values(entry).map(normalizePathname);
    if (!values.includes(p)) continue;
    return entry[targetLang];
  }
  return getFallbackUrl(targetLang);
}

export function LanguageSelect() {
  const selectId = useId();
  const pathname = usePathname() ?? '/';
  const currentLang = getLangFromPathname(pathname);
  const label =
    currentLang === 'en'
      ? 'Language'
      : currentLang === 'es'
        ? 'Idioma'
        : currentLang === 'de'
          ? 'Sprache'
          : 'Langue';

  return (
    <div className="lang-select-container">
      <span aria-hidden="true" className="globe-icon">
        <img alt="" height={18} src="/images/globe.svg" width={18} />
      </span>
      <label className="sr-only" htmlFor={selectId}>
        {label}
      </label>
      <select
        className="lang-select"
        id={selectId}
        onChange={(e) => {
          const lang = e.target.value as Lang;
          const nextUrl = getTargetUrl(pathname, lang);
          window.location.assign(nextUrl);
        }}
        value={currentLang}
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
