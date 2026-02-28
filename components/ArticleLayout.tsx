import Link from 'next/link';
import { TableOfContents } from '@/components/TableOfContents';
import { FAQ } from '@/components/FAQ';
import { CTABox } from '@/components/CTABox';
import type { Post } from '@/lib/types';

export function ArticleLayout({ post }: { post: Post }) {
  return (
    <article className="article stack">
      <header>
        <div className="badges">
          <span className="badge">{post.type.toUpperCase()}</span>
          {post.primaryKeyword ? <span className="badge">KW: {post.primaryKeyword}</span> : null}
          {post.updatedAt ? <span className="badge">MAJ: {new Date(post.updatedAt).toLocaleDateString('fr-FR')}</span> : null}
        </div>
        <h1>{post.title}</h1>
        <p className="lede">{post.description}</p>

        {post.jumpLinks?.length ? (
          <div className="card">
            <strong>Aller à</strong>
            <ul className="list">
              {post.jumpLinks.map((j) => (
                <li key={j.href}>
                  <a href={j.href}>{j.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </header>

      <div className="grid">
        <div className="stack">
          {post.quickAnswer?.length ? (
            <section aria-label="Réponse rapide" className="card">
              <strong>Réponse rapide</strong>
              <ul className="list">
                {post.quickAnswer.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="stack">{post.content}</div>

          {post.cta ? (
            <CTABox
              body={post.cta.body}
              buttonHref={post.cta.buttonHref}
              buttonLabel={post.cta.buttonLabel}
              title={post.cta.title}
            />
          ) : null}

          <hr className="hr" />

          {post.faq?.length ? <FAQ items={post.faq} /> : null}

          {post.internalLinks?.length ? (
            <section className="card">
              <h2 id="next-steps">À lire ensuite</h2>
              <ul className="list">
                {post.internalLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.anchor}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside aria-label="Table of contents" className="toc">
          <div className="card">
            <strong>Sur cette page</strong>
            <TableOfContents headings={post.headings} />
          </div>
        </aside>
      </div>
    </article>
  );
}

