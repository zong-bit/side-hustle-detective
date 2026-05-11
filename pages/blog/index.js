import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

function BlogCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card"
      style={{
        padding: '24px',
        borderRadius: 0,
        textDecoration: 'none',
        color: 'inherit',
        borderLeft: '3px solid var(--accent)',
        display: 'block',
      }}
    >
      {post.date && (
        <div style={{ fontSize: 12, color: 'var(--fg-faint)', marginBottom: 8, fontVariantNumeric: 'tabular-nums' }}>
          📅 {post.date}
        </div>
      )}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, lineHeight: 1.4, letterSpacing: '-0.02em' }}>
        {post.title}
      </h2>
      {post.excerpt && (
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', margin: '0 0 12px', lineHeight: 1.7 }}>
          {post.excerpt}
        </p>
      )}
      {post.tags && post.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {post.tags.map((tag, i) => (
            <span key={i} className="badge" style={{ background: 'var(--bg-subtle)', color: 'var(--fg-muted)', boxShadow: '0 0 0 1px var(--border)' }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog-posts')
      .then(r => r.json())
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 48px' }}>
      <Head>
        <title>阅读 · 副业侦探博客</title>
        <meta name="description" content="副业方法、AI工具、效率提升 —— 副业侦探的原创内容。副业不再盲目，从读到做。"/>
        <meta property="og:title" content="阅读 · 副业侦探" />
        <meta property="og:description" content="副业方法、AI工具、效率提升 —— 副业侦探的原创内容。" />
      </Head>

      {/* Back link */}
      <Link href="/" style={{ fontSize: 13, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 32 }}>
        ← 返回首页
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--fg-faint)', textTransform: 'uppercase', marginBottom: 12 }}>
          副业侦探
        </div>
        <h1 style={{ fontSize: 28, marginBottom: 8, letterSpacing: '-0.03em' }}>
          📖 阅读
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6, maxWidth: 480 }}>
          副业方法 · AI工具 · 效率提升 —— 原创深度内容
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--fg-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: 14 }}>加载中...</div>
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--fg-muted)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📝</div>
          <div style={{ fontSize: 14 }}>暂无文章，敬请期待</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {posts.map((post, i) => (
            <BlogCard key={i} post={post} />
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '40px 0', marginTop: 48, fontSize: 12, color: 'var(--fg-faint)', borderTop: '1px solid var(--border)' }}>
        副业侦探 · 从读到做
      </div>
    </div>
  );
}
