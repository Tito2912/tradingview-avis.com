import Link from 'next/link';
import { getLocalizedBlogPosts } from '@/lib/content';

export const dynamic = 'force-static';

export default async function EnBlogPage() {
  const posts = await getLocalizedBlogPosts('en');

  return (
    <div className="stack">
      <section className="hero">
        <h1>Blog</h1>
        <p>Guides, comparisons and reviews to get started and improve.</p>
      </section>

      <section className="card" aria-label="Articles list">
        <h2>Articles</h2>
        <ul className="list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/en/blog/${p.slug}`}>{p.title}</Link>
              <div className="muted">{p.description}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

