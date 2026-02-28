import Link from 'next/link';
import { getLocalizedBlogPosts } from '@/lib/content';

export const dynamic = 'force-static';

export default async function DeBlogPage() {
  const posts = await getLocalizedBlogPosts('de');

  return (
    <div className="stack">
      <section className="hero">
        <h1>Blog</h1>
        <p>Guides, Vergleiche und Reviews zum Starten und Weiterkommen.</p>
      </section>

      <section className="card" aria-label="Artikelliste">
        <h2>Artikel</h2>
        <ul className="list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/de/blog/${p.slug}`}>{p.title}</Link>
              <div className="muted">{p.description}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

