import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import type { Post, PostType } from '@/lib/types';
import type { TocHeading } from '@/components/TableOfContents';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const EXCLUDE_FROM_INDEX = new Set([
  'mentions-legales',
  'politique-de-confidentialite',
  'bitpanda',
  'guide-tradingview',
]);

type Frontmatter = {
  title: string;
  description: string;
  date?: string;
  updatedAt?: string;
  canonical?: string;
  type?: PostType;
  primaryKeyword?: string;
  jumpLinks?: { href: string; label: string }[];
  quickAnswer?: string[];
  cta?: { title: string; body: string; buttonLabel: string; buttonHref: string };
  internalLinks?: { href: string; anchor: string }[];
  faq?: { q: string; a: string }[];
  translationKey?: string;
};

function extractHeadingsFromMdxSource(source: string): TocHeading[] {
  type Match = { index: number; level: number; text: string; explicitId?: string };
  const matches: Match[] = [];

  // Markdown headings (## to ####)
  const mdRe = /^(#{2,4})\s+(.+?)\s*$/gm;
  for (const m of source.matchAll(mdRe)) {
    const level = m[1]?.length ?? 2;
    const text = (m[2] ?? '').replace(/`/g, '').trim();
    if (!text) continue;
    matches.push({ index: m.index ?? 0, level, text });
  }

  // HTML headings (<h2> to <h4>)
  const htmlRe = /<h([2-4])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
  for (const m of source.matchAll(htmlRe)) {
    const level = Number(m[1] ?? 2);
    const attrs = m[2] ?? '';
    const inner = m[3] ?? '';
    const explicitId = /id\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];
    const text = decodeHtmlEntities(stripHtmlTags(inner)).replace(/`/g, '').trim();
    if (!text) continue;
    matches.push({ index: m.index ?? 0, level, text, explicitId });
  }

  matches.sort((a, b) => a.index - b.index);

  const headings: TocHeading[] = [];
  const slugger = createSlugger();

  for (const h of matches) {
    if (h.explicitId) {
      slugger.use(h.explicitId);
      headings.push({ id: h.explicitId, text: h.text, level: h.level });
      continue;
    }
    headings.push({ id: slugger.slug(h.text), text: h.text, level: h.level });
  }

  return headings;
}

function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

type Slugger = { use: (slug: string) => void; slug: (text: string) => string };

function createSlugger(): Slugger {
  const counts = new Map<string, number>();

  function use(slug: string) {
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  function slug(text: string) {
    const base = slugify(text) || 'section';
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  }

  return { use, slug };
}

function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2f;/gi, '/')
    .replace(/&#(\d+);/g, (_m, n: string) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, n: string) => String.fromCharCode(Number.parseInt(n, 16)));
}

function rehypeAddHeadingIds() {
  return (tree: unknown) => {
    const slugger = createSlugger();

    function getText(node: any): string {
      if (!node) return '';
      if (node.type === 'text' && typeof node.value === 'string') return node.value;
      if (!Array.isArray(node.children)) return '';
      return node.children.map(getText).join('');
    }

    function walk(node: any) {
      if (!node) return;

      if (node.type === 'element') {
        node.properties ??= {};
        const existingId = node.properties.id;
        if (existingId) slugger.use(String(existingId));

        const tag = String(node.tagName ?? '').toLowerCase();
        if ((tag === 'h2' || tag === 'h3' || tag === 'h4') && !node.properties.id) {
          const text = getText(node).trim();
          if (text) node.properties.id = slugger.slug(text);
        }
      }

      if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
        const tag = String(node.name ?? '').toLowerCase();
        const attributes = Array.isArray(node.attributes) ? node.attributes : [];
        const existingId = attributes.find((a: any) => a?.type === 'mdxJsxAttribute' && a?.name === 'id')?.value;
        if (typeof existingId === 'string') slugger.use(existingId);

        if ((tag === 'h2' || tag === 'h3' || tag === 'h4') && typeof existingId !== 'string') {
          const text = getText(node).trim();
          if (text) {
            node.attributes ??= [];
            node.attributes.push({ type: 'mdxJsxAttribute', name: 'id', value: slugger.slug(text) });
          }
        }
      }

      if (Array.isArray(node.children)) {
        for (const child of node.children) walk(child);
      }
    }

    walk(tree as any);
  };
}

export async function getAllSlugs(): Promise<string[]> {
  const entries = await fs.readdir(CONTENT_DIR);
  return entries
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => name.replace(/\.mdx$/, ''))
    .filter((slug) => !slug.startsWith('_'))
    .sort();
}

export async function getAllPosts(): Promise<Array<Pick<Post, 'slug' | 'title' | 'description' | 'updatedAt' | 'date'>>> {
  const slugs = await getAllSlugs();
  const posts = await Promise.all(slugs.filter((slug) => !EXCLUDE_FROM_INDEX.has(slug)).map(readIndexItem));
  return posts;
}

export async function getAllPages(): Promise<Array<Pick<Post, 'slug' | 'title' | 'description' | 'updatedAt' | 'date'>>> {
  const slugs = await getAllSlugs();
  const pages = await Promise.all(slugs.map(readIndexItem));
  return pages;
}

async function readIndexItem(
  slug: string,
): Promise<Pick<Post, 'slug' | 'title' | 'description' | 'updatedAt' | 'date'>> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, `${slug}.mdx`), 'utf8');
  const { data } = matter(raw);
  const fm = data as Frontmatter;
  return {
    slug,
    title: fm.title,
    description: fm.description,
    date: fm.date,
    updatedAt: fm.updatedAt,
  };
}

type Locale = 'en' | 'es' | 'de';

export async function getLocalizedPageSlugs(lang: Locale): Promise<string[]> {
  const dirPath = path.join(CONTENT_DIR, lang);
  let entries: Array<{ name: string; isFile: () => boolean }>;
  try {
    entries = (await fs.readdir(dirPath, { withFileTypes: true })) as any;
  } catch {
    return [];
  }

  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => name.replace(/\.mdx$/, ''))
    .filter((slug) => !slug.startsWith('_'))
    .sort();
}

export async function getLocalizedPage(lang: Locale, slug: string): Promise<Post | null> {
  const filePath = path.join(CONTENT_DIR, lang, `${slug}.mdx`);
  const canonicalFallback = `/${lang}/${slug}`;
  return getPostByFilePath({ filePath, slug, canonicalFallback });
}

export async function getLocalizedBlogSlugs(lang: Locale): Promise<string[]> {
  const dirPath = path.join(CONTENT_DIR, lang, 'blog');
  let entries: Array<{ name: string; isDirectory: () => boolean }>;
  try {
    entries = (await fs.readdir(dirPath, { withFileTypes: true })) as any;
  } catch {
    return [];
  }

  return entries.filter((d) => d.isDirectory()).map((d) => d.name).sort();
}

export async function getLocalizedBlogPosts(
  lang: Locale,
): Promise<Array<Pick<Post, 'slug' | 'title' | 'description' | 'updatedAt' | 'date'>>> {
  const slugs = await getLocalizedBlogSlugs(lang);
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await fs.readFile(path.join(CONTENT_DIR, lang, 'blog', slug, 'index.mdx'), 'utf8');
      const { data } = matter(raw);
      const fm = data as Frontmatter;
      return {
        slug,
        title: fm.title,
        description: fm.description,
        date: fm.date,
        updatedAt: fm.updatedAt,
      };
    }),
  );
  return items;
}

export async function getLocalizedBlogPost(lang: Locale, slug: string): Promise<Post | null> {
  const filePath = path.join(CONTENT_DIR, lang, 'blog', slug, 'index.mdx');
  const canonicalFallback = `/${lang}/blog/${slug}`;
  return getPostByFilePath({ filePath, slug, canonicalFallback });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  return getPostByFilePath({ filePath, slug, canonicalFallback: `/${slug}` });
}

async function getPostByFilePath({
  filePath,
  slug,
  canonicalFallback,
}: {
  filePath: string;
  slug: string;
  canonicalFallback: string;
}): Promise<Post | null> {
  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }

  const headings = extractHeadingsFromMdxSource(raw);
  const { content: mdxSource, data } = matter(raw);
  const frontmatter = data as Frontmatter;

  const compiled = await compileMDX({
    source: mdxSource,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        rehypePlugins: [rehypeAddHeadingIds],
      },
      // Build-time compilation of trusted local MDX.
      blockDangerousJS: true,
      blockJS: true,
    },
  });

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    updatedAt: frontmatter.updatedAt,
    canonical: frontmatter.canonical ?? canonicalFallback,
    type: frontmatter.type ?? 'guide',
    primaryKeyword: frontmatter.primaryKeyword,
    jumpLinks: frontmatter.jumpLinks,
    quickAnswer: frontmatter.quickAnswer,
    cta: frontmatter.cta,
    internalLinks: frontmatter.internalLinks,
    faq: frontmatter.faq,
    headings,
    content: compiled.content,
  };
}
