import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
import {
  getAllSlugs,
  getLocalizedBlogPost,
  getLocalizedBlogSlugs,
  getLocalizedPage,
  getLocalizedPageSlugs,
  getPostBySlug,
} from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tradingview-avis.com';
  const slugs = await getAllSlugs();

  const frPages = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getPostBySlug(slug);
      const canonical = post?.canonical ?? `/${slug}`;
      const lastModified = post?.updatedAt ?? post?.date ?? new Date().toISOString();
      return {
        url: new URL(canonical, baseUrl).toString(),
        lastModified: new Date(lastModified),
      };
    }),
  );

  const urls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    ...frPages,
  ];

  const locales = ['en', 'es', 'de'] as const;
  for (const lang of locales) {
    urls.push({ url: `${baseUrl}/${lang}`, lastModified: new Date() });
    urls.push({ url: `${baseUrl}/${lang}/blog`, lastModified: new Date() });

    const pageSlugs = await getLocalizedPageSlugs(lang);
    const pages = await Promise.all(
      pageSlugs.map(async (slug) => {
        const post = await getLocalizedPage(lang, slug);
        if (!post) return null;
        const canonical = post.canonical ?? `/${lang}/${slug}`;
        const lastModified = post.updatedAt ?? post.date ?? new Date().toISOString();
        return { url: new URL(canonical, baseUrl).toString(), lastModified: new Date(lastModified) };
      }),
    );
    for (const entry of pages) {
      if (entry) urls.push(entry);
    }

    const blogSlugs = await getLocalizedBlogSlugs(lang);
    const posts = await Promise.all(
      blogSlugs.map(async (slug) => {
        const post = await getLocalizedBlogPost(lang, slug);
        if (!post) return null;
        const canonical = post.canonical ?? `/${lang}/blog/${slug}`;
        const lastModified = post.updatedAt ?? post.date ?? new Date().toISOString();
        return { url: new URL(canonical, baseUrl).toString(), lastModified: new Date(lastModified) };
      }),
    );
    for (const entry of posts) {
      if (entry) urls.push(entry);
    }
  }

  urls.sort((a, b) => a.url.localeCompare(b.url));
  return urls;
}
