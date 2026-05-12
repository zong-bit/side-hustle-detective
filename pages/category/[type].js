import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const CATEGORIES = {
  online: { name: '线上兼职', emoji: '💻', desc: '远程工作、网赚、在家办公等线上副业', keywords: ['线上兼职', '远程', '在家', '网络', '网赚', '网上', '线上', '居家', '线上办公'] },
  offline: { name: '实体创业', emoji: '🏪', desc: '开店、摆摊、实体经营等线下创业', keywords: ['实体', '开店', '摆摊', '创业', '实体店', '地摊', '店铺'] },
  content: { name: '内容创作', emoji: '✍️', desc: '写作、视频、自媒体等内容副业', keywords: ['写作', '码字', '写小说', '视频', '自媒体', '内容', '创作', '拍视频', '剪辑', '文案', '直播'] },
  skill: { name: '技能服务', emoji: '🛠️', desc: '技能变现、技术服务、家教等技能副业', keywords: ['技能', '技术', '设计', '编程', '翻译', '家教', 'PS', '修图', 'Excel', 'PPT', '配音'] },
  social: { name: '社交电商', emoji: '🛒', desc: '微商、社群团购、带货等社交类副业', keywords: ['社交电商', '微商', '朋友圈', '社群', '团购', '带货', '代购', '推广'] },
};

const TYPE_NAMES = Object.keys(CATEGORIES);
const PAGE_SIZE = 20;

const platformConfig = {
  tieba:    { label: '贴吧',   icon: '📌', bg: 'var(--accent-subtle)', color: 'var(--accent)', border: 'var(--accent-faint)' },
  zhihu:    { label: '知乎',   icon: '💡', bg: '#faf5ff',             color: '#6b46c1',      border: '#e9d8fd' },
  xiaohongshu: { label: '小红书', icon: '📕', bg: 'var(--danger-subtle)', color: 'var(--danger)', border: 'var(--danger-border)' },
  bilibili: { label: 'B站',    icon: '📺', bg: '#f0f9ff',             color: '#0284c7',      border: '#bae6fd' },
  hupu:     { label: '虎扑',   icon: '🏀', bg: '#f0fdf4',             color: '#15803d',      border: '#bbf7d0' },
};

const typeIconMap = {
  online: { icon: '💻', label: '线上兼职' },
  offline: { icon: '🏪', label: '实体创业' },
  content: { icon: '✍️', label: '内容创作' },
  skill: { icon: '🛠️', label: '技能服务' },
  social: { icon: '🛒', label: '社交电商' },
};

export default function CategoryPage() {
  const router = useRouter();
  const { type } = router.query;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/posts');
        const allPosts = await res.json();
        setPosts(Array.isArray(allPosts) ? allPosts : []);
      } catch (e) {}
      setLoading(false);
    }
    load();
  }, []);

  if (!type || !TYPE_NAMES.includes(type)) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px 40px' }}>
        <Head><title>分类未找到 - 副业侦探</title></Head>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🤷</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.02em' }}>分类不存在</div>
          <p style={{ color: 'var(--fg-muted)', fontSize: 14, marginBottom: 32 }}>请从以下分类中选择：</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <Link key={key} href={`/category/${key}`} className="btn-secondary" style={{ padding: '8px 20px', fontSize: 13 }}>
                {cat.emoji} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const category = CATEGORIES[type];

  const filtered = posts.filter(p => {
    const text = (p.title + ' ' + (p.snippet || '')).toLowerCase();
    return category.keywords.some(k => text.includes(k));
  });

  filtered.sort((a, b) => {
    if (a.is_scam !== b.is_scam) return a.is_scam ? -1 : 1;
    return (b.time || '').localeCompare(a.time || '');
  });

  const paged = filtered.slice(0, (page + 1) * PAGE_SIZE);
  const hasMore = filtered.length > paged.length;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 48px' }}>
      <Head>
        <title>{category.name}副业推荐 - 副业侦探</title>
        <meta name="description" content={`${category.name}副业信息聚合 - ${category.desc}。自动骗局检测，安全可靠。`} />
        <meta name="keywords" content={`${category.name},副业,${category.name}副业,副业推荐,防骗`} />
        <meta property="og:url" content={`https://side-hustle-detective.vercel.app/category/${type}`} />
        <link rel="canonical" href={`https://side-hustle-detective.vercel.app/category/${type}`} />
        <link rel="alternate" hrefLang="zh-Hans" href={`https://side-hustle-detective.vercel.app/category/${type}`} />
      </Head>

      {/* Back link */}
      <Link href="/" style={{ fontSize: 13, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 32 }}>
        ← 返回首页
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8, letterSpacing: '-0.03em' }}>
          {category.emoji} {category.name}
        </h1>
        <p style={{ color: 'var(--fg-muted)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
          {category.desc}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: 'var(--bg-subtle)', color: 'var(--fg-muted)', boxShadow: '0 0 0 1px var(--border)' }}>
            📊 共 {filtered.length} 条
          </span>
          <span className="badge badge-danger">
            ⚠️ 需警惕 {filtered.filter(p => p.is_scam).length}
          </span>
          <span className="badge badge-success">
            ✅ 推荐 {filtered.filter(p => !p.is_scam && !p.is_low_quality).length}
          </span>
        </div>
      </div>

      {/* Category nav */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: '26px', marginRight: 4 }}>
          其他分类：
        </span>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          key === type ? (
            <span key={key} style={{ padding: '4px 12px', borderRadius: 0, fontSize: 12, background: 'var(--accent)', color: '#fff', fontWeight: 500 }}>
              {cat.emoji} {cat.name}
            </span>
          ) : (
            <Link key={key} href={`/category/${key}`} className="btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }}>
              {cat.emoji} {cat.name}
            </Link>
          )
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--fg-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: 14 }}>加载中...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--fg-muted)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14 }}>该分类暂无内容，后续会持续更新</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {paged.map((p, i) => {
            const isScam = p.is_scam;
            const isLowQuality = p.is_low_quality;
            return (
              <Link
                key={i}
                href={`/posts/${btoa(encodeURIComponent(p.url))}`}
                className="card"
                style={{
                  padding: '18px 24px',
                  borderRadius: 0,
                  borderLeft: isScam ? '3px solid var(--danger)' : isLowQuality ? '3px solid var(--warning)' : '3px solid var(--accent)',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    {(() => {
                      const pc = platformConfig[p.platform] || { label: p.platform, icon: '📰', bg: 'var(--bg-subtle)', color: 'var(--fg-muted)', border: 'var(--border)' };
                      return (
                        <span className="badge" style={{ background: pc.bg, color: pc.color, boxShadow: `0 0 0 1px ${pc.border}` }}>
                          {pc.icon} {pc.label}
                        </span>
                      );
                    })()}
                    {p.type && typeIconMap[p.type] && (
                      <span className="badge badge-accent">
                        {typeIconMap[p.type].icon} {typeIconMap[p.type].label}
                      </span>
                    )}
                  </div>
                  <StatusBadge isScam={isScam} isLowQuality={isLowQuality} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.01em' }}>
                  {p.title}
                </div>
                {p.snippet && (
                  <p style={{ fontSize: 13, color: 'var(--fg-muted)', margin: '0 0 8px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.snippet}
                  </p>
                )}
                {p.warnings && p.warnings.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {p.warnings.map((w, j) => (
                      <span key={j} className="badge" style={{ background: 'var(--danger-subtle)', color: 'var(--danger)' }}>
                        🚩 {w}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 12, color: 'var(--fg-faint)', marginTop: 10, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <span>{p.author || '匿名'}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{p.time || p.date || ''}</span>
                </div>
              </Link>
            );
          })}

          {/* Load more */}
          {hasMore && (
            <button
              onClick={() => setPage(page + 1)}
              className="btn-secondary"
              style={{ margin: '16px auto 0' }}
            >
              加载更多（{paged.length}/{filtered.length}）
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ isScam, isLowQuality }) {
  if (isScam) return <span className="badge badge-danger">⚠️ 需警惕</span>;
  if (isLowQuality) return <span className="badge badge-warning">📰 低质</span>;
  return <span className="badge badge-success">✅ 可信</span>;
}
