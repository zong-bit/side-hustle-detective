import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const CATEGORIES = [
  { key: 'all', icon: '🔥', label: '全部' },
  { key: 'recommended', icon: '✅', label: '推荐', desc: '可信度高 + 非低质' },
  { key: 'warning', icon: '⚠️', label: '需警惕', desc: 'is_scam=true' },
  { key: 'lowquality', icon: '📰', label: '低质', desc: 'is_low_quality=true' },
];

function getTrustScore(score) {
  const s = Number(score) || 50;
  if (s <= 20) return { color: 'var(--danger)', label: '极低' };
  if (s <= 50) return { color: 'var(--warning)', label: '较低' };
  if (s <= 80) return { color: 'var(--warning)', label: '一般' };
  return { color: 'var(--success)', label: '可信' };
}

function TrustBar({ score }) {
  const s = Number(score) || 50;
  const info = getTrustScore(s);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${s}%`, background: info.color }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 500, color: info.color, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
        {score}分
      </span>
    </div>
  );
}

function DashboardCard({ icon, label, value, danger }) {
  return (
    <div className="card" style={{ flex: 1, minWidth: 100, padding: '16px 20px' }}>
      <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 4, fontWeight: 500, letterSpacing: '0.02em' }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, color: danger ? 'var(--danger)' : 'var(--fg)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ isScam, isLowQuality }) {
  if (isScam) {
    return <span className="badge badge-danger">⚠️ 需警惕</span>;
  }
  if (isLowQuality) {
    return <span className="badge badge-warning">📰 低质内容</span>;
  }
  return <span className="badge badge-success">✅ 可信</span>;
}

function PlatformTag({ platform }) {
  const config = {
    tieba: { label: '贴吧', bg: 'var(--accent-subtle)', color: 'var(--accent)', border: 'var(--accent-faint)' },
    zhihu: { label: '知乎', bg: '#faf5ff', color: '#6b46c1', border: '#e9d8fd' },
    xiaohongshu: { label: '小红书', bg: 'var(--danger-subtle)', color: 'var(--danger)', border: 'var(--danger-border)' },
  };
  const c = config[platform] || { label: platform, bg: 'var(--bg-subtle)', color: 'var(--fg-muted)', border: 'var(--border)' };
  return (
    <span className="badge" style={{ background: c.bg, color: c.color, boxShadow: `0 0 0 1px ${c.border}` }}>
      {c.label}
    </span>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80, gap: 16 }}>
      <div className="spinner" />
      <div style={{ color: 'var(--fg-muted)', fontSize: 13 }}>正在加载数据...</div>
    </div>
  );
}

function DailyRecommendCard({ recommend, onRefresh }) {
  if (!recommend) return null;

  const platformLabels = {
    tieba: { icon: '📌', label: '贴吧', bg: 'var(--accent-subtle)', color: 'var(--accent)' },
    zhihu: { icon: '💡', label: '知乎', bg: '#faf5ff', color: '#6b46c1' },
    xiaohongshu: { icon: '📕', label: '小红书', bg: 'var(--danger-subtle)', color: 'var(--danger)' },
    bilibili: { icon: '📺', label: 'B站', bg: '#f0f9ff', color: '#0284c7' },
    hupu: { icon: '🏀', label: '虎扑', bg: '#f0fdf4', color: '#15803d' },
    warning: { icon: '⚠️', label: '防骗', bg: 'var(--danger-subtle)', color: 'var(--danger)' },
  };

  const p = platformLabels[recommend.platform] || { icon: '📰', label: '其他', bg: 'var(--bg-subtle)', color: 'var(--fg-muted)' };

  return (
    <div className="card fade-in" style={{ padding: '20px 24px', marginBottom: 36, background: 'var(--bg-subtle)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🎯</span>
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>每日推荐</span>
        </div>
        <button
          onClick={onRefresh}
          style={{
            border: 'none', background: 'var(--bg-elevated)', cursor: 'pointer',
            fontSize: 12, color: 'var(--fg-muted)', padding: '4px 12px', borderRadius: 4,
            boxShadow: 'var(--shadow-card)', fontFamily: 'inherit', transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.target.style.boxShadow = 'var(--shadow-card-hover)'}
          onMouseLeave={e => e.target.style.boxShadow = 'var(--shadow-card)'}
        >
          🔄 换一条
        </button>
      </div>
      <Link href={`/posts/${btoa(encodeURIComponent(recommend.url))}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.5, marginBottom: 10, letterSpacing: '-0.01em' }}>
          {recommend.title}
        </div>
      </Link>
      {recommend.snippet && (
        <p style={{ fontSize: 13, color: 'var(--fg-muted)', margin: '0 0 12px', lineHeight: 1.7 }}>
          {recommend.snippet}
        </p>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: p.color, fontWeight: 500 }}>
          {p.icon} {p.label}
        </span>
        {recommend.author && (
          <span style={{ fontSize: 12, color: 'var(--fg-faint)' }}>
            · {recommend.author}
          </span>
        )}
        {recommend.time && (
          <span style={{ fontSize: 12, color: 'var(--fg-faint)', fontVariantNumeric: 'tabular-nums' }}>
            · {recommend.time}
          </span>
        )}
      </div>
    </div>
  );
}

function BlogSection() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/blog-posts')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setArticles(data.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  if (articles.length === 0) return null;

  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>📖 最新文章</h2>
        <Link href="/blog" style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
          查看全部 →
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {articles.map((post, i) => (
          <Link
            key={i}
            href={`/blog/${post.slug}`}
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
              {post.date || ''}
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, letterSpacing: '-0.01em' }}>
              {post.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const fs = await import('fs');
  const path = await import('path');
  const dataDir = path.default.join(process.cwd(), 'data');
  let allPosts = [];
  if (fs.default.existsSync(dataDir)) {
    const files = fs.default.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      try {
        const content = fs.default.readFileSync(path.default.join(dataDir, file), 'utf8');
        const posts = JSON.parse(content);
        if (Array.isArray(posts)) allPosts = allPosts.concat(posts);
        else if (posts.posts) allPosts = allPosts.concat(posts.posts);
      } catch(e) {}
    }
  }
  const totalCount = allPosts.length;
  const today = new Date().toISOString().slice(0,10);
  return { props: { initialPosts: allPosts, totalCount, lastUpdate: today } };
}

export default function Home({ initialPosts = [], totalCount = 0, lastUpdate: initialLastUpdate = '' }) {
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(initialPosts.length === 0);
  const [category, setCategory] = useState('all');
  const [recommend, setRecommend] = useState(null);
  const [totalPosts, setTotalPosts] = useState(totalCount);
  const [lastUpdate, setLastUpdate] = useState(initialLastUpdate);

  useEffect(() => {
    async function loadData() {
      const startTime = Date.now();
      const res = await fetch('/api/posts').then(r => r.json()).catch(() => []);
      const elapsed = Date.now() - startTime;
      if (elapsed < 400) await new Promise(r => setTimeout(r, 400 - elapsed));
      setPosts(Array.isArray(res) ? res : []);
      setLoading(false);
    }
    loadData();

    // Load total count
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => setTotalPosts(Array.isArray(data) ? data.length : 0))
      .catch(() => {});


    // Load daily recommendation
    fetchDailyRecommend();
  }, []);

  const fetchDailyRecommend = useCallback(async () => {
    try {
      const res = await fetch('/api/daily-recommend');
      const data = await res.json();
      if (data && data.title) setRecommend(data);
    } catch {
      setRecommend(null);
    }
  }, []);

  const stats = {
    total: posts.length,
    scam: posts.filter(p => p.is_scam).length,
    lowQuality: posts.filter(p => p.is_low_quality).length,
    recommended: posts.filter(p => !p.is_scam && !p.is_low_quality && p.trust_score >= 50).length,
  };

  const filtered = posts.filter(p => {
    if (search) {
      const q = search.toLowerCase();
      if (!p.title?.toLowerCase().includes(q) && !p.snippet?.toLowerCase().includes(q)) return false;
    }
    if (category === 'recommended') return !p.is_scam && !p.is_low_quality && p.trust_score >= 50;
    if (category === 'warning') return p.is_scam;
    if (category === 'lowquality') return p.is_low_quality;
    return true;
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 48px' }}>
      <Head>
        <title>副业侦探 - 副业信息聚合与防骗检测</title>
        <meta name="description" content="副业侦探 - 聚合全网副业信息，发现靠谱副业项目，防骗指南与赚钱攻略" />
        <meta name="keywords" content="副业,兼职,赚钱,防骗,贴吧副业,知乎副业,小红书副业" />
        <meta property="og:title" content="副业侦探 - 副业信息聚合与防骗检测" />
        <meta property="og:description" content="聚合贴吧、知乎、小红书的副业讨论，AI 关键词辅助甄别骗局。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--fg-faint)', textTransform: 'uppercase', marginBottom: 12 }}>
          副业信息聚合
        </div>
        <h1 style={{ fontSize: 32, marginBottom: 8, letterSpacing: '-0.03em' }}>
          🕵️ 副业侦探
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6, maxWidth: 480 }}>
          聚合贴吧 · 知乎 · 小红书上的副业讨论，自动甄别骗局
        </p>
      </div>

      {/* Banner */}
      <div style={{
        background: 'var(--accent)',
        color: '#ffffff',
        padding: '12px 20px',
        borderRadius: 0,
        marginBottom: 32,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>📢</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            今天有 <strong style={{ fontSize: 16 }}>{totalPosts}</strong> 个副业推荐
          </span>
        </div>
        {lastUpdate && (
          <span style={{ fontSize: 12, opacity: 0.85, fontVariantNumeric: 'tabular-nums' }}>
            最近更新：{lastUpdate}
          </span>
        )}
      </div>

      {/* Disclaimer */}
      <div className="card" style={{ marginBottom: 32, padding: '14px 20px', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--warning)' }}>⚠️ 免责声明</strong><br />
        本站自动聚合各平台公开讨论内容，信息仅供参考，不构成任何建议。骗局检测基于关键词规则自动判断，可能存在误判或遗漏，请自行甄别。
      </div>

      {/* Data Dashboard */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
        <DashboardCard icon="📊" label="总量" value={stats.total} />
        <DashboardCard icon="✅" label="推荐" value={stats.recommended} />
        <DashboardCard icon="⚠️" label="需警惕" value={stats.scam} danger />
        <DashboardCard icon="📰" label="低质" value={stats.lowQuality} />
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24, position: 'relative' }}>
        <input
          className="input"
          placeholder="搜索副业关键词…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              border: 'none', background: 'none', cursor: 'pointer', fontSize: 14,
              color: 'var(--fg-muted)', padding: '4px 8px', lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => {
          const active = category === cat.key;
          const counts = { all: stats.total, recommended: stats.recommended, warning: stats.scam, lowquality: stats.lowQuality };
          return (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              style={{
                padding: '6px 14px', borderRadius: 0, fontSize: 13,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
                fontFamily: 'inherit', border: 'none',
                background: active ? 'var(--accent)' : 'var(--bg-elevated)',
                color: active ? '#fff' : 'var(--fg)',
                boxShadow: active ? 'none' : 'var(--shadow-card)',
                fontWeight: active ? 500 : 400,
              }}
              title={cat.desc || ''}
            >
              {cat.icon} {cat.label}
              <span style={{ marginLeft: 6, fontSize: 11, opacity: active ? 0.85 : 0.7, fontVariantNumeric: 'tabular-nums' }}>
                {counts[cat.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category quick links */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: '28px', marginRight: 4 }}>
          分类浏览：
        </span>
        {[
          { key: 'online', icon: '💻', label: '线上兼职' },
          { key: 'offline', icon: '🏪', label: '实体创业' },
          { key: 'content', icon: '✍️', label: '内容创作' },
          { key: 'skill', icon: '🛠️', label: '技能服务' },
          { key: 'social', icon: '🛒', label: '社交电商' },
        ].map(cat => (
          <Link key={cat.key} href={`/category/${cat.key}`} className="btn-secondary" style={{ padding: '4px 12px', fontSize: 12 }}>
            {cat.icon} {cat.label}
          </Link>
        ))}
      </div>

      {/* Quick Entry */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
        <a href="/quiz" className="p-4 border border-[var(--border)] rounded-xl text-center hover:bg-[var(--bg-hover)] transition-colors">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-sm font-medium">副业匹配</div>
        </a>
        <a href="/calculator" className="p-4 border border-[var(--border)] rounded-xl text-center hover:bg-[var(--bg-hover)] transition-colors">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-sm font-medium">收入计算</div>
        </a>
        <a href="/scam-check" className="p-4 border border-[var(--border)] rounded-xl text-center hover:bg-[var(--bg-hover)] transition-colors">
          <div className="text-2xl mb-1">🔍</div>
          <div className="text-sm font-medium">骗局检测</div>
        </a>
        <a href="/features" className="p-4 border border-[var(--border)] rounded-xl text-center hover:bg-[var(--bg-hover)] transition-colors">
          <div className="text-2xl mb-1">📋</div>
          <div className="text-sm font-medium">全部功能</div>
        </a>
      </div>

      {/* Daily Recommendation */}
      {recommend && <DailyRecommendCard recommend={recommend} onRefresh={fetchDailyRecommend} />}

      {/* Latest Blog Articles */}
      <BlogSection />

      {/* Post list */}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--fg-muted)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14 }}>暂无结果</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Hairline divider between cards */}
          {filtered.map((p, i) => {
            const isScam = p.is_scam;
            const isLowQuality = p.is_low_quality;
            return (
              <div
                key={i}
                className="card"
                style={{
                  padding: '18px 24px',
                  borderRadius: 0,
                  borderLeft: isScam ? '3px solid var(--danger)' : isLowQuality ? '3px solid var(--warning)' : '3px solid var(--accent)',
                }}
              >
                {/* Top row: tags */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                  <StatusBadge isScam={isScam} isLowQuality={isLowQuality} />
                  <PlatformTag platform={p.platform} />
                  {p.type && (
                    <span className="badge badge-accent">
                      {(() => {
                        const typeMap = { online: '💻', offline: '🏪', content: '✍️', skill: '🛠️', social: '🛒' };
                        return `${typeMap[p.type] || '📌'} ${(() => {
                          const labelMap = { online: '线上兼职', offline: '实体创业', content: '内容创作', skill: '技能服务', social: '社交电商' };
                          return labelMap[p.type] || p.type;
                        })()}`;
                      })()}
                    </span>
                  )}
                  {p.forum && (
                    <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>
                      📌 {p.forum}
                    </span>
                  )}
                </div>

                {/* Title - link */}
                <Link href={`/posts/${btoa(encodeURIComponent(p.url))}`} style={{ fontSize: 15, fontWeight: 500, marginBottom: 6, lineHeight: 1.5, letterSpacing: '-0.01em' }}>
                  {p.title}
                </Link>

                {/* Snippet */}
                {p.snippet && (
                  <p style={{ fontSize: 13, color: 'var(--fg-muted)', margin: '0 0 8px', lineHeight: 1.7, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.snippet}
                  </p>
                )}

                {/* Warnings */}
                {p.warnings && p.warnings.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {p.warnings.map((w, j) => (
                      <span key={j} className="badge" style={{ background: 'var(--danger-subtle)', color: 'var(--danger)' }}>
                        🚩 {w}
                      </span>
                    ))}
                  </div>
                )}

                {/* Trust bar */}
                <TrustBar score={p.trust_score} />

                {/* Bottom info */}
                <div style={{ fontSize: 12, color: 'var(--fg-faint)', marginTop: 10, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                  <span>{p.author || '匿名'}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{p.time || p.date || ''}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recommended Tools */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>🛠️ 推荐工具</h2>
        </div>
        <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '1px solid #bae6fd' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 28 }}>📝</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>50个科研AI Prompt合集</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>科研效率工具 · 即买即用</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.7, margin: '0 0 12px' }}>
                覆盖论文摘要、改写、分析、写作、效率五大场景，共50个精心调校的Prompt。适配 ChatGPT、Claude、DeepSeek 等所有主流AI工具，即复制即用。
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                <span className="badge" style={{ background: '#dbeafe', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>✍️ 论文摘要</span>
                <span className="badge" style={{ background: '#fce7f3', color: '#be185d', border: '1px solid #fbcfe8' }}>🔄 改写润色</span>
                <span className="badge" style={{ background: '#d1fae5', color: '#047857', border: '1px solid #a7f3d0' }}>🔬 深度分析</span>
                <span className="badge" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>📄 论文写作</span>
                <span className="badge" style={{ background: '#ede9fe', color: '#6d28d9', border: '1px solid #ddd6fe' }}>⚡ 效率提升</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.02em' }}>¥19.9</span>
                <span style={{ fontSize: 12, color: 'var(--fg-faint)' }}>一次性购买 · 持续更新</span>
              </div>
            </div>
            <div style={{ width: 220, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>✅ 即买即用，无需配置</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>✅ 适配所有主流AI</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>✅ 5大场景全覆盖</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>✅ 持续更新迭代</div>
              </div>
              <a
                href="https://afdian.com/item/xxxx"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px 0',
                  background: 'var(--accent)',
                  color: '#fff',
                  borderRadius: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.target.style.opacity = 0.85}
                onMouseLeave={e => e.target.style.opacity = 1}
              >
                🛒 立即购买
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '40px 0', marginTop: 48, fontSize: 12, color: 'var(--fg-faint)', borderTop: '1px solid var(--border)' }}>
        副业侦探 · 数据仅供参考，投资有风险，参与需谨慎
      </div>
    </div>
  );
}
