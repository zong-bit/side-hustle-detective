import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const platformInfo = {
  tieba: { name: '贴吧', bg: 'var(--accent-subtle)', color: 'var(--accent)', border: 'var(--accent-faint)' },
  zhihu: { name: '知乎', bg: '#faf5ff', color: '#6b46c1', border: '#e9d8fd' },
  xiaohongshu: { name: '小红书', bg: 'var(--danger-subtle)', color: 'var(--danger)', border: 'var(--danger-border)' },
};

function PlatformBadge({ platform }) {
  const c = platformInfo[platform] || { name: platform, bg: 'var(--bg-subtle)', color: 'var(--fg-muted)', border: 'var(--border)' };
  return (
    <span className="badge" style={{ background: c.bg, color: c.color, boxShadow: `0 0 0 1px ${c.border}` }}>
      {c.name}
    </span>
  );
}

function StatusBadge({ isScam, isLowQuality }) {
  if (isScam) return <span className="badge badge-danger">⚠️ 需警惕</span>;
  if (isLowQuality) return <span className="badge badge-warning">📰 低质</span>;
  return <span className="badge badge-success">✅ 可信</span>;
}

function TrustBar({ score }) {
  const getColor = (s) => s >= 60 ? 'var(--success)' : s >= 30 ? 'var(--warning)' : 'var(--danger)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div className="progress-track" style={{ flex: 1 }}>
        <div className="progress-fill" style={{ width: `${score}%`, background: getColor(score) }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: getColor(score), fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
        {score}/100
      </span>
    </div>
  );
}

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const url = decodeURIComponent(atob(id));
        const res = await fetch('/api/posts');
        const allPosts = await res.json();
        const found = Array.isArray(allPosts) ? allPosts.find(p => p.url === url) : null;
        setPost(found || null);
        if (found) {
          const same = allPosts.filter(p => p.url !== url && p.platform === found.platform).slice(0, 5);
          setRelated(same);
        }
      } catch (e) {
        setPost(null);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (!id) return null;

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px 40px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 14 }}>
        <Head><title>加载中 - 副业侦探</title></Head>
        <div className="spinner" style={{ margin: '0 auto 16px' }} />
        <div>加载中...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px 40px' }}>
        <Head><title>未找到 - 副业侦探</title></Head>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🤷</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.02em' }}>帖子未找到</div>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14, marginBottom: 32 }}>
            该帖子可能已被删除或链接错误
          </p>
          <Link href="/" className="btn-primary">← 返回首页</Link>
        </div>
      </div>
    );
  }

  const plat = platformInfo[post.platform] || platformInfo.tieba;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px 48px' }}>
      <Head>
        <title>{post.title} - 副业侦探</title>
        <meta name="description" content={`${post.title} - ${plat.name}副业讨论`} />
        <meta property="og:title" content={`${post.title} - 副业侦探`} />
        <meta property="og:description" content={`来自${plat.name}的副业讨论，骗局预警分析`} />
        <meta property="og:type" content="article" />
      </Head>

      {/* Back link */}
      <Link href="/" style={{ fontSize: 13, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 32 }}>
        ← 返回首页
      </Link>

      {/* Main card */}
      <div className="card" style={{ padding: '28px 32px 24px' }}>
        {/* Badges row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <StatusBadge isScam={post.is_scam} isLowQuality={post.is_low_quality} />
          <PlatformBadge platform={post.platform} />
          {post.forum && (
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
              📌 {post.forum}
            </span>
          )}
        </div>

        {/* Trust score */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>可信度评分</span>
          </div>
          <TrustBar score={post.trust_score} />
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12, lineHeight: 1.3, letterSpacing: '-0.02em' }}>
          {post.title}
        </h1>

        {/* Author info */}
        <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <span>👤 {post.author}</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>🕐 {post.time}</span>
        </div>

        {/* Scam warnings */}
        {post.warnings && post.warnings.length > 0 && (
          <div style={{ padding: 16, marginBottom: 24, background: 'var(--danger-subtle)', boxShadow: '0 0 0 1px var(--danger-border)' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--danger)', marginBottom: 10 }}>
              🚩 骗局预警
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {post.warnings.map((w, j) => (
                <span key={j} className="badge" style={{ background: 'var(--danger-subtle)', color: 'var(--danger)' }}>
                  ⚠️ {w}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6 }}>
              <strong>检测说明：</strong>以上预警基于关键词规则自动识别，仅供参考。具体以帖子实际内容为准，请自行判断。
            </div>
          </div>
        )}

        {/* Content */}
        {post.snippet && (
          <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--fg)', padding: '20px 0', borderTop: '1px solid var(--border)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {post.snippet}
          </div>
        )}

        {/* Original link */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            🔗 查看原文
          </a>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-muted)', marginBottom: 16, letterSpacing: '0.02em' }}>
            同平台推荐（{plat.name}）
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {related.map((r, i) => (
              <Link
                key={i}
                href={`/posts/${btoa(encodeURIComponent(r.url))}`}
                className="card"
                style={{
                  padding: '14px 20px',
                  borderRadius: 0,
                  textDecoration: 'none',
                  color: 'inherit',
                  borderLeft: r.is_scam ? '3px solid var(--danger)' : '3px solid var(--accent)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <StatusBadge isScam={r.is_scam} isLowQuality={r.is_low_quality} />
                  <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>
                    {r.title}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-faint)' }}>
                  {r.author} · <span style={{ fontVariantNumeric: 'tabular-nums' }}>{r.time}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
