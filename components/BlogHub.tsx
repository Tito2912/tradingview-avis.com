'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

type Tag = 'all' | 'guide' | 'comparison' | 'pine' | 'invest';

export type BlogHubPostCard = {
  href: string;
  title: string;
  description: string;
  dateLabel?: string;
  readingTimeLabel?: string;
  tags: Tag[];
  image?: { src: string; alt: string };
  ctaLabel: string;
};

export function BlogHub({
  heading,
  subtitle,
  searchLabel,
  searchPlaceholder,
  filtersLabel,
  emptyText,
  filters,
  posts,
}: {
  heading: string;
  subtitle: string;
  searchLabel: string;
  searchPlaceholder: string;
  filtersLabel: string;
  emptyText: string;
  filters: Array<{ key: Tag; label: string }>;
  posts: BlogHubPostCard[];
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Tag>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesQuery = !q || `${p.title} ${p.description}`.toLowerCase().includes(q);
      const matchesFilter = filter === 'all' || p.tags.includes(filter);
      return matchesQuery && matchesFilter;
    });
  }, [filter, posts, query]);

  return (
    <div className="stack">
      <section className="hero" aria-label="Blog">
        <h1>{heading}</h1>
        <p>{subtitle}</p>
      </section>

      <section className="card" aria-label={searchLabel}>
        <label className="sr-only" htmlFor="blog-q">
          {searchLabel}
        </label>
        <input
          id="blog-q"
          type="search"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid var(--border)',
            borderRadius: 12,
            font: 'inherit',
          }}
        />

        <div aria-label={filtersLabel} role="group" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '6px 10px',
                borderRadius: 999,
                border: '1px solid var(--border)',
                background: filter === f.key ? '#111' : '#fff',
                color: filter === f.key ? '#fff' : '#111',
                cursor: 'pointer',
                font: 'inherit',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card" aria-label="Articles list">
        <h2>Articles</h2>
        {filtered.length ? (
          <ul className="list">
            {filtered.map((p) => (
              <li key={p.href}>
                {p.image ? (
                  <div style={{ margin: '8px 0 10px' }}>
                    <img
                      alt={p.image.alt}
                      decoding="async"
                      height={270}
                      loading="lazy"
                      src={p.image.src}
                      style={{ width: '100%', height: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}
                      width={480}
                    />
                  </div>
                ) : null}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {p.tags
                    .filter((t) => t !== 'all')
                    .map((t) => (
                      <span key={t} className="badge">
                        {t}
                      </span>
                    ))}
                </div>
                <div style={{ marginTop: 6 }}>
                  <Link href={p.href}>{p.title}</Link>
                  <div className="muted">{p.description}</div>
                </div>
                {(p.dateLabel || p.readingTimeLabel) && (
                  <div className="muted" style={{ marginTop: 6 }}>
                    {[p.dateLabel, p.readingTimeLabel].filter(Boolean).join(' · ')}
                  </div>
                )}
                <div style={{ marginTop: 8 }}>
                  <Link href={p.href}>{p.ctaLabel}</Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">{emptyText}</p>
        )}
      </section>
    </div>
  );
}

