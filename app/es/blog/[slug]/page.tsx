import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/components/ArticleLayout';
import { getLocalizedBlogPost, getLocalizedBlogSlugs } from '@/lib/content';
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/lib/schema';
import { buildAlternatesForBlogPost, getOgImage } from '@/lib/seo';

export async function generateStaticParams() {
  const slugs = await getLocalizedBlogSlugs('es');
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getLocalizedBlogPost('es', slug);
  if (!post) return {};

  const canonical = post.canonical ?? `/es/blog/${post.slug}`;
  const alternates = await buildAlternatesForBlogPost({ lang: 'es', slug: post.slug, canonical });

  return {
    title: post.title,
    description: post.description,
    alternates,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: canonical,
      images: [{ url: getOgImage('es') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [getOgImage('es')],
    },
  };
}

export default async function EsBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getLocalizedBlogPost('es', slug);
  if (!post) return notFound();

  const articleJsonLd = buildArticleJsonLd(post);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(post);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {post.faq?.length ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: post.faq.map((x) => ({
                '@type': 'Question',
                name: x.q,
                acceptedAnswer: { '@type': 'Answer', text: x.a },
              })),
            }),
          }}
        />
      ) : null}
      <ArticleLayout post={post} />
    </>
  );
}
