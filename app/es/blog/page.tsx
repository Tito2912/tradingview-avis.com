import Link from 'next/link';
import { getLocalizedBlogPosts } from '@/lib/content';

export const dynamic = 'force-static';

export default async function EsBlogPage() {
  const posts = await getLocalizedBlogPosts('es');

  return (
    <div className="stack">
      <section className="hero">
        <h1>Blog</h1>
        <p>Guías, comparativas y reseñas para empezar y progresar.</p>
      </section>

      <section className="card" aria-label="Lista de artículos">
        <h2>Artículos</h2>
        <ul className="list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/es/blog/${p.slug}`}>{p.title}</Link>
              <div className="muted">{p.description}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

