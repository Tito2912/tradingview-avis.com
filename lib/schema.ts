import type { Post } from '@/lib/types';

const BASE_URL = 'https://tradingview-avis.com';
const BRAND = 'tradingview-avis.com';
const PUBLISHER = 'E-Com Shop';

const STATIC_PAGE_SLUGS = new Set([
  'about', 'contact', 'legal-notice', 'methodology', 'privacy-policy', 'sources',
  'a-propos', 'mentions-legales', 'methodologie', 'politique-de-confidentialite',
  'contacto',
]);

export function buildArticleJsonLd(post: Post) {
  const url = new URL(post.canonical ?? `/${post.slug}`, BASE_URL).toString();
  const published = post.date ?? post.updatedAt ?? new Date().toISOString();
  const modified = post.updatedAt ?? published;

  const slugBase = (post.canonical ?? `/${post.slug}`).split('/').filter(Boolean).pop() ?? '';
  if (STATIC_PAGE_SLUGS.has(slugBase)) {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: post.title,
      description: post.description,
      url,
      dateModified: modified,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    mainEntityOfPage: url,
    datePublished: published,
    dateModified: modified,
    author: [{ '@type': 'Organization', name: BRAND }],
    publisher: { '@type': 'Organization', name: PUBLISHER },
  };
}

export function buildBreadcrumbJsonLd(post: Post) {
  const url = new URL(post.canonical ?? `/${post.slug}`, BASE_URL).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.title,
        item: url,
      },
    ],
  };
}
