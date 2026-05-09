import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

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
        const found = allPosts.find(p => p.url === url);
        setPost(found || null);

        // Find related posts (same platform or same scam status)
        if (found) {
          const samePlatform = allPosts.filter(p =>
            p.url !== url && p.platform === found.platform
          ).slice(0, 5);
          setRelated(samePlatform);
        }
      } catch (e) {
        setPost(null);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', textAlign: 'center', paddingTop: 100, color: '#999' }}>
        加载中...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <Head><title>未找到 - 副业侦探</title></Head>
        <div style={{ textAlign: 'center', paddingTop: 100 }}>
          <h1 style={{ fontSize: 28, marginBottom: 16 }}>🤷 帖子未找到</h1>
          <p style={{ color: '#666', marginBottom: 24 }}>
            该帖子可能已被删除或链接错误
          </p>
          <Link href="/" style={{ color: '#1a73e8', textDecoration: 'none', fontSize: 15 }}>
            ← 返回首页
          </Link>
        </div>
      </div>
    );
  }

  const platformNames = { tieba: '贴吧', zhihu: '知乎', xiaohongshu: '小红书' };
  const platformColors = { tieba: '#e3f2fd', zhihu: '#f3e5f5', xiaohongshu: '#fce4ec' };

  const badgeText = post.is_scam ? '⚠️ 需警惕' : post.is_low_quality ? '📰 低质' : '✅ 可信';
  const badgeColor = post.is_scam ? '#c62828' : post.is_low_quality ? '#f57f17' : '#2e7d32';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Head>
        <title>{post.title} - 副业侦探</title>
        <meta name="description" content={`${post.title} - ${post.platform === 'tieba' ? '贴吧' : post.platform === 'zhihu' ? '知乎' : '小红书'}副业讨论，自动骗局检测结果`} />
        <meta property="og:title" content={`${post.title} - 副业侦探`} />
        <meta property="og:description" content={`来自${platformNames[post.platform] || post.platform}的副业讨论，骗局预警分析`} />
        <meta property="og:type" content="article" />
      </Head>

      {/* 返回导航 */}
      <Link href="/" style={{ color: '#1a73e8', textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
        ← 返回首页
      </Link>

      {/* 主内容卡片 */}
      <div style={{
        background: 'white', borderRadius: 12, border: '1px solid #eee',
        padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        {/* 顶部标签 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
          <span style={{
            fontSize: 12, padding: '3px 10px', borderRadius: 6,
            background: platformColors[post.platform] || '#f5f5f5', color: '#555'
          }}>
            {platformNames[post.platform] || post.platform}
          </span>
          {post.forum && (
            <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 6, background: '#f5f5f5', color: '#555' }}>
              {post.forum}
            </span>
          )}
          <span style={{ fontSize: 13, color: badgeColor, fontWeight: 500, marginLeft: 'auto' }}>{badgeText}</span>
        </div>

        {/* 可信度评分条 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: '#666' }}>可信度评分</span>
            <span style={{
              fontSize: 18, fontWeight: 600,
              color: post.trust_score >= 60 ? '#2e7d32' : post.trust_score >= 30 ? '#f57f17' : '#c62828'
            }}>
              {post.trust_score}/100
            </span>
          </div>
          <div style={{ height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              width: `${post.trust_score}%`,
              background: post.trust_score >= 60 ? '#43a047' : post.trust_score >= 30 ? '#ffa000' : '#e53935',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* 标题 */}
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 12px 0', lineHeight: 1.4, color: '#222' }}>
          {post.title}
        </h1>

        {/* 作者信息 */}
        <div style={{ fontSize: 13, color: '#888', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span>👤 {post.author}</span>
          <span>🕐 {post.time}</span>
        </div>

        {/* 骗局预警 */}
        {post.warnings && post.warnings.length > 0 && (
          <div style={{
            background: '#fff5f5', border: '1px solid #ffcdd2', borderRadius: 8,
            padding: 16, marginBottom: 20
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: 15, color: '#c62828', display: 'flex', alignItems: 'center', gap: 6 }}>
              🚩 骗局预警
            </h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {post.warnings.map((w, j) => (
                <span key={j} style={{
                  fontSize: 13, padding: '4px 10px', borderRadius: 6,
                  background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', fontWeight: 500
                }}>
                  ⚠️ {w}
                </span>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: '#666', lineHeight: 1.6 }}>
              <strong>检测说明：</strong>以上预警基于关键词规则自动识别，仅供参考。
              具体以帖子实际内容为准，请自行判断。
            </div>
          </div>
        )}

        {/* 正文内容 */}
        {post.snippet && (
          <div style={{
            fontSize: 15, lineHeight: 1.8, color: '#333',
            padding: '16px 0', borderTop: '1px solid #eee',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word'
          }}>
            {post.snippet}
          </div>
        )}

        {/* 原始链接 */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #eee' }}>
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block', padding: '10px 20px', borderRadius: 8,
              background: '#1a73e8', color: 'white', textDecoration: 'none',
              fontSize: 14, fontWeight: 500
            }}
          >
            🔗 查看原文
          </a>
        </div>
      </div>

      {/* 相关推荐 */}
      {related.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16, color: '#444', marginBottom: 12 }}>
            📌 同平台推荐（{platformNames[post.platform] || post.platform}）
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {related.map((r, i) => (
              <Link
                key={i}
                href={`/posts/${btoa(encodeURIComponent(r.url))}`}
                style={{
                  display: 'block', padding: '12px 16px', borderRadius: 8,
                  border: '1px solid #eee', textDecoration: 'none',
                  color: '#333', fontSize: 14, transition: 'background 0.2s',
                  background: 'white'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 11, padding: '1px 6px', borderRadius: 4,
                    background: r.is_scam ? '#ffebee' : '#e8f5e9',
                    color: r.is_scam ? '#c62828' : '#2e7d32'
                  }}>
                    {r.is_scam ? '⚠️' : '✅'}
                  </span>
                  <span style={{ fontWeight: 500 }}>{r.title}</span>
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  {r.author} · {r.time}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
