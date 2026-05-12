import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { marked } from 'marked';

const SITE_URL = 'https://side-hustle-detective.vercel.app';

// Configure marked for safety and code highlighting
marked.setOptions({
  breaks: true,
  gfm: true,
});

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Calculate reading time from Chinese text content
  function calcReadingTime(content) {
    if (!content) return 1;
    // Count Chinese characters (roughly)
    const chineseChars = (content.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
    const minutes = Math.max(1, Math.round(chineseChars / 400));
    return minutes;
  }

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      fetch(`/api/blog-posts?slug=${encodeURIComponent(slug)}`).then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      }),
      fetch('/api/blog-posts').then(r => r.json()).catch(() => []),
    ])
      .then(([postData, allPostsData]) => {
        setPost(postData);
        setAllPosts(allPostsData);
        setLoading(false);

        // Find related posts by matching tags
        if (postData.tags && postData.tags.length > 0 && Array.isArray(allPostsData)) {
          const related = allPostsData
            .filter(p => p.slug !== postData.slug && p.tags && p.tags.length > 0)
            .map(p => ({
              ...p,
              matchCount: p.tags.filter(t => postData.tags.includes(t)).length,
            }))
            .filter(p => p.matchCount > 0)
            .sort((a, b) => b.matchCount - a.matchCount)
            .slice(0, 3);
          setRelatedPosts(related);
        }
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (!slug) return null;

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px 40px', textAlign: 'center', color: 'var(--fg-muted)' }}>
        <Head><title>加载中 - 副业侦探</title></Head>
        <div className="spinner" style={{ margin: '0 auto 16px' }} />
        <div style={{ fontSize: 14 }}>加载中...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px 40px' }}>
        <Head><title>未找到 - 副业侦探</title></Head>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🤷</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.02em' }}>文章未找到</div>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14, marginBottom: 32 }}>
            该文章可能已被删除或链接错误
          </p>
          <Link href="/blog" className="btn-primary">← 返回阅读</Link>
        </div>
      </div>
    );
  }

  const htmlContent = marked(post.content);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 48px' }}>
      <Head>
        <title>{post.title} - 副业侦探</title>
        <meta name="description" content={post.excerpt || `${post.title} - 副业侦探原创文章`} />
        <meta name="keywords" content={post.keywords || post.tags?.join(',') || ''} />
        <meta property="og:title" content={`${post.title} - 副业侦探`} />
        <meta property="og:description" content={post.excerpt || `${post.title}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/blog/${slug}`} />
        <meta property="og:image" content={`${SITE_URL}/api/og-image`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="canonical" href={`${SITE_URL}/blog/${slug}`} />
        <link rel="alternate" hrefLang="zh-Hans" href={`${SITE_URL}/blog/${slug}`} />
        {post.date && <meta property="article:published_time" content={post.date} />}
        {post.tags && post.tags.map((tag, i) => (
          <meta key={i} property="article:tag" content={tag} />
        ))}
      </Head>

      {/* Back link */}
      <Link href="/blog" style={{ fontSize: 13, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 32 }}>
        ← 返回阅读
      </Link>

      {/* Article header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, color: 'var(--fg-faint)', marginBottom: 8, fontVariantNumeric: 'tabular-nums', display: 'flex', gap: 12, alignItems: 'center' }}>
          {post.date && <span>📅 {post.date}</span>}
          <span>📖 预计阅读 {calcReadingTime(post.content)} 分钟</span>
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.02em', margin: '0 0 16px' }}>
          {post.title}
        </h1>
        {post.tags && post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {post.tags.map((tag, i) => (
              <span key={i} className="badge" style={{ background: 'var(--bg-subtle)', color: 'var(--fg-muted)', boxShadow: '0 0 0 1px var(--border)' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Article content */}
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{
          fontSize: 16,
          lineHeight: 1.8,
          color: 'var(--fg)',
        }}
      />

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div style={{ marginTop: 48, marginBottom: 48 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, letterSpacing: '-0.02em' }}>📌 相关推荐</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {relatedPosts.map((p, i) => (
              <Link
                key={i}
                href={`/blog/${p.slug}`}
                className="card"
                style={{
                  padding: '16px 20px',
                  borderRadius: 0,
                  borderLeft: '3px solid var(--accent)',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                }}
              >
                <div style={{ fontSize: 12, color: 'var(--fg-faint)', marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>
                  {p.date || ''}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, letterSpacing: '-0.01em', marginBottom: 4 }}>
                  {p.title}
                </div>
                {p.excerpt && (
                  <p style={{
                    fontSize: 13, color: 'var(--fg-muted)', margin: 0,
                    lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {p.excerpt.slice(0, 120)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '40px 0', marginTop: 48, fontSize: 12, color: 'var(--fg-faint)', borderTop: '1px solid var(--border)' }}>
        <Link href="/blog" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← 返回阅读更多文章</Link>
      </div>
    </div>
  );
}
