import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/components/ArticleLayout';
import { getLocalizedPage, getLocalizedPageSlugs } from '@/lib/content';
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/lib/schema';

export async function generateStaticParams() {
  const slugs = await getLocalizedPageSlugs('de');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getLocalizedPage('de', slug);
  if (!post) return {};

  const canonical = post.canonical ?? `/de/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: canonical,
    },
  };
}

export default async function DePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getLocalizedPage('de', slug);
  if (!post) return notFound();

  const articleJsonLd = buildArticleJsonLd(post);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(post);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <ArticleLayout post={post} />
    </>
  );
}

