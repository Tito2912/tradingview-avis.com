import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import {
  ABOUT_SLUGS,
  CONTACT_SLUGS,
  LEGAL_SLUGS,
  METHODOLOGY_SLUGS,
  PRIVACY_SLUGS,
  SITE,
  SOURCES_SLUGS,
  type Lang,
  blogIndexHref,
  homeHref,
  pageHref,
} from '@/lib/site';

const CONTENT_DIR = path.join(process.cwd(), 'content');

type TranslationIndex = Map<string, Partial<Record<Lang, string>>>;
let translationIndexPromise: Promise<TranslationIndex> | null = null;

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function inferSlugsByLang(slug: string): Record<Lang, string> {
  if (Object.values(LEGAL_SLUGS).includes(slug)) return LEGAL_SLUGS;
  if (Object.values(PRIVACY_SLUGS).includes(slug)) return PRIVACY_SLUGS;
  if (Object.values(ABOUT_SLUGS).includes(slug)) return ABOUT_SLUGS;
  if (Object.values(METHODOLOGY_SLUGS).includes(slug)) return METHODOLOGY_SLUGS;
  if (Object.values(SOURCES_SLUGS).includes(slug)) return SOURCES_SLUGS;
  if (Object.values(CONTACT_SLUGS).includes(slug)) return CONTACT_SLUGS;
  return {
    fr: slug,
    en: slug,
    es: slug,
    de: slug,
  };
}

type MdxFrontmatter = { canonical?: string; translationKey?: string };

async function readFrontmatterFromMdx(filePath: string): Promise<MdxFrontmatter | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data } = matter(raw);
    const fm = data as any;
    return {
      canonical: typeof fm?.canonical === 'string' && fm.canonical.trim() ? fm.canonical.trim() : undefined,
      translationKey:
        typeof fm?.translationKey === 'string' && fm.translationKey.trim() ? fm.translationKey.trim() : undefined,
    };
  } catch {
    return null;
  }
}

async function getTranslationIndex(): Promise<TranslationIndex> {
  if (!translationIndexPromise) translationIndexPromise = buildTranslationIndex();
  return translationIndexPromise;
}

function upsertIndex(index: TranslationIndex, key: string, lang: Lang, href: string) {
  const existing = index.get(key) ?? {};
  if (existing[lang]) return;
  existing[lang] = href;
  index.set(key, existing);
}

async function buildTranslationIndex(): Promise<TranslationIndex> {
  const index: TranslationIndex = new Map();

  const rootEntries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  for (const entry of rootEntries) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.mdx')) continue;
    if (entry.name.startsWith('_')) continue;
    const slug = entry.name.replace(/\.mdx$/, '');
    const filePath = path.join(CONTENT_DIR, entry.name);
    const fm = await readFrontmatterFromMdx(filePath);
    if (!fm?.translationKey) continue;
    upsertIndex(index, fm.translationKey, 'fr', fm.canonical ?? pageHref('fr', slug));
  }

  const nonDefaultLangs = SITE.supportedLangs.filter((l) => l !== SITE.defaultLang) as Array<Exclude<Lang, 'fr'>>;
  for (const lang of nonDefaultLangs) {
    const langDir = path.join(CONTENT_DIR, lang);
    let entries: Array<{ name: string; isFile: () => boolean; isDirectory: () => boolean }>;
    try {
      entries = (await fs.readdir(langDir, { withFileTypes: true })) as any;
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.mdx') && !entry.name.startsWith('_')) {
        const slug = entry.name.replace(/\.mdx$/, '');
        const filePath = path.join(langDir, entry.name);
        const fm = await readFrontmatterFromMdx(filePath);
        if (!fm?.translationKey) continue;
        upsertIndex(index, fm.translationKey, lang, fm.canonical ?? pageHref(lang, slug));
      }
    }

    const blogDir = path.join(langDir, 'blog');
    let blogEntries: Array<{ name: string; isDirectory: () => boolean }>;
    try {
      blogEntries = (await fs.readdir(blogDir, { withFileTypes: true })) as any;
    } catch {
      continue;
    }

    for (const entry of blogEntries) {
      if (!entry.isDirectory()) continue;
      const slug = entry.name;
      const filePath = path.join(blogDir, slug, 'index.mdx');
      const fm = await readFrontmatterFromMdx(filePath);
      if (!fm?.translationKey) continue;
      upsertIndex(index, fm.translationKey, lang, fm.canonical ?? `/${lang}/blog/${slug}`);
    }
  }

  return index;
}

export function getOgImage(lang: Lang): string {
  if (lang === 'en') return '/images/image-hero-en.png';
  if (lang === 'es') return '/images/image-hero-es.png';
  if (lang === 'de') return '/images/image-hero-de.png';
  return '/images/image-hero-fr.png';
}

export function buildAlternatesForHome(lang: Lang): Metadata['alternates'] {
  const canonical = homeHref(lang);
  const languages: Record<string, string> = {};
  for (const l of SITE.supportedLangs) languages[l] = homeHref(l);
  return { canonical, languages };
}

export function buildAlternatesForBlogIndex(lang: Lang): Metadata['alternates'] {
  const canonical = blogIndexHref(lang);
  const languages: Record<string, string> = {};
  for (const l of SITE.supportedLangs) languages[l] = blogIndexHref(l);
  return { canonical, languages };
}

export async function buildAlternatesForPage({
  lang,
  slug,
  canonical,
}: {
  lang: Lang;
  slug: string;
  canonical: string;
}): Promise<Metadata['alternates']> {
  const filePath =
    lang === SITE.defaultLang ? path.join(CONTENT_DIR, `${slug}.mdx`) : path.join(CONTENT_DIR, lang, `${slug}.mdx`);
  const currentFm = await readFrontmatterFromMdx(filePath);
  if (currentFm?.translationKey) {
    const index = await getTranslationIndex();
    const entry = index.get(currentFm.translationKey);
    if (entry && Object.keys(entry).length) {
      return { canonical, languages: entry as Record<string, string> };
    }
  }

  const slugsByLang = inferSlugsByLang(slug);
  const languages: Record<string, string> = {};

  for (const l of SITE.supportedLangs) {
    const targetSlug = slugsByLang[l];
    const filePath =
      l === SITE.defaultLang
        ? path.join(CONTENT_DIR, `${targetSlug}.mdx`)
        : path.join(CONTENT_DIR, l, `${targetSlug}.mdx`);
    if (!(await exists(filePath))) continue;
    const fm = await readFrontmatterFromMdx(filePath);
    languages[l] = fm?.canonical ?? pageHref(l, targetSlug);
  }

  return { canonical, languages: Object.keys(languages).length ? languages : undefined };
}

export async function buildAlternatesForBlogPost({
  lang,
  slug,
  canonical,
}: {
  lang: Exclude<Lang, 'fr'>;
  slug: string;
  canonical: string;
}): Promise<Metadata['alternates']> {
  const currentPath = path.join(CONTENT_DIR, lang, 'blog', slug, 'index.mdx');
  const currentFm = await readFrontmatterFromMdx(currentPath);
  if (currentFm?.translationKey) {
    const index = await getTranslationIndex();
    const entry = index.get(currentFm.translationKey);
    if (entry && Object.keys(entry).length) {
      return { canonical, languages: entry as Record<string, string> };
    }
  }

  const languages: Record<string, string> = {};

  for (const l of SITE.supportedLangs) {
    if (l === SITE.defaultLang) continue;
    const filePath = path.join(CONTENT_DIR, l, 'blog', slug, 'index.mdx');
    if (!(await exists(filePath))) continue;
    const fm = await readFrontmatterFromMdx(filePath);
    languages[l] = fm?.canonical ?? `/${l}/blog/${slug}`;
  }

  return { canonical, languages: Object.keys(languages).length ? languages : undefined };
}
