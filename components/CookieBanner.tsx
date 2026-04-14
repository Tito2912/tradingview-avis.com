'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLangFromPathname, pageHref, PRIVACY_SLUGS, SITE } from '@/lib/site';

type Consent = 'accepted' | 'refused';
const COOKIE_KEY = 'tradingview_cookies_v1';
const COOKIE_MAX_AGE_DAYS = 180;

function getCookie(name: string): string | null {
  try {
    const cookies = document.cookie ? document.cookie.split(';') : [];
    for (const c of cookies) {
      const [k, ...rest] = c.trim().split('=');
      if (k === name) return decodeURIComponent(rest.join('='));
    }
  } catch {
    // ignore
  }
  return null;
}

function setCookie(name: string, value: string) {
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  const secure = typeof window !== 'undefined' && window.location?.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function ensureGa4Loaded() {
  const id = SITE.ga4Id;
  if (!id) return;
  const w = window as any;
  if (w.__tradingview_avis_ga4_loaded) return;
  w.__tradingview_avis_ga4_loaded = true;

  const ext = document.createElement('script');
  ext.async = true;
  ext.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(ext);

  const inline = document.createElement('script');
  inline.text = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${id}', { anonymize_ip: true });
  `;
  document.head.appendChild(inline);
}

const COPY = {
  fr: {
    cookie: "Nous utilisons des cookies analytiques (Google Analytics 4) pour améliorer le site.",
    accept: 'Accepter',
    refuse: 'Refuser',
    privacy: 'Politique de confidentialité',
  },
  en: {
    cookie: 'We use analytics cookies (Google Analytics 4) to improve the site.',
    accept: 'Accept',
    refuse: 'Refuse',
    privacy: 'Privacy policy',
  },
  es: {
    cookie: 'Usamos cookies analíticas (Google Analytics 4) para mejorar el sitio.',
    accept: 'Aceptar',
    refuse: 'Rechazar',
    privacy: 'Política de privacidad',
  },
  de: {
    cookie: 'Wir verwenden Analyse-Cookies (Google Analytics 4), um die Website zu verbessern.',
    accept: 'Akzeptieren',
    refuse: 'Ablehnen',
    privacy: 'Datenschutz',
  },
} as const;

export function CookieBanner() {
  const pathname = usePathname() ?? '/';
  const lang = getLangFromPathname(pathname);
  const t = COPY[lang] ?? COPY.fr;

  const [hidden, setHidden] = useState(true);
  const privacyHref = pageHref(lang, PRIVACY_SLUGS[lang]);

  useEffect(() => {
    try {
      const cookieConsent = getCookie(COOKIE_KEY) as Consent | null;
      if (cookieConsent === 'accepted') ensureGa4Loaded();
      if (cookieConsent === 'accepted' || cookieConsent === 'refused') {
        setHidden(true);
        return;
      }

      const storageConsent = localStorage.getItem(COOKIE_KEY) as Consent | null;
      if (storageConsent === 'accepted') ensureGa4Loaded();
      if (storageConsent === 'accepted' || storageConsent === 'refused') {
        setHidden(true);
        return;
      }

      setHidden(false);
    } catch {
      setHidden(false);
    }
  }, []);

  function set(consent: Consent) {
    try {
      setCookie(COOKIE_KEY, consent);
      localStorage.setItem(COOKIE_KEY, consent);
    } catch {
      // ignore
    }
    if (consent === 'accepted') ensureGa4Loaded();
    setHidden(true);
  }

  return (
    <div aria-label="Cookie banner" aria-live="polite" className={`cookie-banner ${hidden ? 'hidden' : ''}`} role="dialog">
      <p>
        {t.cookie} <Link href={privacyHref}>{t.privacy}</Link>
      </p>
      <div className="cookie-actions">
        <button className="btn btn--primary btn--sm" onClick={() => set('accepted')} type="button">
          {t.accept}
        </button>
        <button className="btn btn--ghost btn--sm" onClick={() => set('refused')} type="button">
          {t.refuse}
        </button>
      </div>
    </div>
  );
}

