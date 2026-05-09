import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const TYPE_CONFIG = {
  online: { icon: '💻', label: '线上兼职' },
  offline: { icon: '🏪', label: '实体创业' },
  content: { icon: '📝', label: '内容创作' },
  skill: { icon: '🎓', label: '技能服务' },
  social: { icon: '🤝', label: '社交电商' },
  other: { icon: '📌', label: '其他' },
};

const CATEGORIES = [
  { key: 'all', icon: '🔥', label: '全部' },
  { key: 'recommended', icon: '✅', label: '推荐副业', desc: '可信度高 + 非低质' },
  { key: 'warning', icon: '⚠️', label: '需警惕', desc: 'is_scam=true' },
  { key: 'lowquality', icon: '📰', label: '低质内容', desc: 'is_low_quality=true' },
];

function getTrustBarColor(score) {
  if (score <= 20) return { bg: '#ff1744', text: '#ff1744', label: '极低' };
  if (score <= 50) return { bg: '#ff9100', text: '#e65100', label: '较低' };
  if (score <= 80) return { bg: '#ffd600', text: '#f57f17', label: '一般' };
  return { bg: '#00c853', text: '#2e7d32', label: '可信' };
}

function TrustBar({ score }) {
  const info = getTrustBarColor(score);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
      <div style={{
        flex: 1, height: 8, borderRadius: 4,
        background: '#e0e0e0', overflow: 'hidden',
      }}>
        <div style={{
          width: `${score}%`, height: '100%',
          background: info.bg,
          borderRadius: 4,
          transition: 'width 0.6s ease-out',
        }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: info.text, whiteSpace: 'nowrap' }}>
        {score}分
      </span>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 60, gap: 16,
    }}>
      <div className="spinner" />
      <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
        正在加载数据...
      </div>
      <style jsx>{`
        .spinner {
          width: 36px;
          height: 36px;
          border: 3px solid var(--border-color);
          border-top-color: #1a73e8;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function DashboardCard({ icon, label, value, bg, color }) {
  return (
    <div className="dash-card" style={{
      flex: 1, minWidth: 120, padding: '12px 16px', borderRadius: 12,
      background: bg || 'var(--card-bg)',
      border: `1px solid ${color || 'var(--border-color)'}`,
    }}>
      <div style={{ fontSize: 13, color: color || 'var(--text-secondary)', marginBottom: 4, fontWeight: 500 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    async function loadData() {
      const startTime = Date.now();
      const responses = await Promise.all([
        fetch('/api/posts').then(r => r.json()).catch(() => []),
      ]);
      // Ensure minimum loading animation time for UX
      const elapsed = Date.now() - startTime;
      if (elapsed < 400) {
        await new Promise(r => setTimeout(r, 400 - elapsed));
      }
      setPosts(responses.flat());
      setLoading(false);
    }
    loadData();
  }, []);

  // Get latest time from posts
  const latestTime = posts.reduce((latest, p) => {
    if (p.time && p.time > latest) return p.time;
    return latest;
  }, '');

  const stats = {
    total: posts.length,
    scam: posts.filter(p => p.is_scam).length,
    lowQuality: posts.filter(p => p.is_low_quality).length,
    recommended: posts.filter(p => !p.is_scam && !p.is_low_quality && p.trust_score >= 50).length,
  };

  const filtered = posts.filter(p => {
    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchSnippet = p.snippet?.toLowerCase().includes(q);
      const matchWarnings = p.warnings?.some(w => w.includes(q));
      if (!matchTitle && !matchSnippet && !matchWarnings) return false;
    }
    // Category filter
    if (category === 'recommended') {
      return !p.is_scam && !p.is_low_quality && p.trust_score >= 50;
    }
    if (category === 'warning') return p.is_scam;
    if (category === 'lowquality') return p.is_low_quality;
    return true;
  });

  return (
    <div style={{
      maxWidth: 840, margin: '0 auto', padding: '16px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
    }}>
      <style jsx global>{`
        :root {
          --bg: #f5f5f5;
          --card-bg: #ffffff;
          --text-primary: #222;
          --text-secondary: #666;
          --border-color: #e0e0e0;
          --shadow: 0 1px 3px rgba(0,0,0,0.08);
          --shadow-hover: 0 4px 12px rgba(0,0,0,0.12);
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #1a1a2e;
            --card-bg: #16213e;
            --text-primary: #e8e8e8;
            --text-secondary: #a0a0b0;
            --border-color: #2a2a4a;
            --shadow: 0 1px 3px rgba(0,0,0,0.3);
            --shadow-hover: 0 4px 12px rgba(0,0,0,0.5);
          }
        }
        body {
          margin: 0;
          background: var(--bg);
          color: var(--text-primary);
        }
        * {
          box-sizing: border-box;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 3px;
        }
      `}</style>

      <Head>
        <title>副业侦探 - 副业信息聚合与防骗检测</title>
        <meta name="description" content="聚合贴吧、知乎、小红书的副业讨论，AI 关键词辅助甄别骗局。实时检测要求交钱、刷单、虚假承诺等骗局特征，帮助你找到靠谱副业。" />
        <meta name="keywords" content="副业,兼职,赚钱,防骗,贴吧副业,知乎副业,小红书副业,副业侦探,骗局识别,靠谱副业" />
        <meta property="og:title" content="副业侦探 - 副业信息聚合与防骗检测" />
        <meta property="og:description" content="聚合贴吧、知乎、小红书的副业讨论，AI 关键词辅助甄别骗局。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* 免责声明 */}
      <div style={{
        background: 'var(--card-bg)', border: '1px solid #ffe082', borderRadius: 12,
        padding: '12px 16px', marginBottom: 16, fontSize: 13, lineHeight: 1.6,
        color: 'var(--text-secondary)', boxShadow: 'var(--shadow)'
      }}>
        <strong style={{ color: '#f57f17' }}>⚠️ 免责声明</strong><br />
        本站自动聚合各平台公开讨论内容，信息仅供参考，不构成任何建议。
        骗局检测基于关键词规则自动判断，可能存在误判或遗漏，请自行甄别。
        平台不保证任何副业信息的真实性、可靠性或收益预期。
        投资有风险，参与需谨慎。
      </div>

      {/* 头部 */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 26, marginBottom: 2, marginTop: 0 }}>🕵️ 副业侦探</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14 }}>
          聚合贴吧 · 知乎 · 小红书的副业讨论，AI 辅助甄别骗局
        </p>
      </div>

      {/* 分类浏览导航 */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap',
        padding: '12px 16px', background: 'var(--card-bg)', borderRadius: 8,
        boxShadow: 'var(--shadow)',
      }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: '30px' }}>分类浏览：</span>
        <Link href="/category/online"
          style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13,
            background: 'white', color: '#555', textDecoration: 'none',
            border: '1px solid var(--border-color)' }}>
          💻 线上兼职
        </Link>
        <Link href="/category/offline"
          style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13,
            background: 'white', color: '#555', textDecoration: 'none',
            border: '1px solid var(--border-color)' }}>
          🏪 实体创业
        </Link>
        <Link href="/category/content"
          style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13,
            background: 'white', color: '#555', textDecoration: 'none',
            border: '1px solid var(--border-color)' }}>
          ✍️ 内容创作
        </Link>
        <Link href="/category/skill"
          style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13,
            background: 'white', color: '#555', textDecoration: 'none',
            border: '1px solid var(--border-color)' }}>
          🛠️ 技能服务
        </Link>
        <Link href="/category/social"
          style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13,
            background: 'white', color: '#555', textDecoration: 'none',
            border: '1px solid var(--border-color)' }}>
          🛒 社交电商
        </Link>
      </div>

      {/* 搜索框 */}
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <input
          placeholder="搜索副业关键词（如：副业、兼职、赚钱）..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', fontSize: 15,
            borderRadius: 12, border: '1px solid var(--border-color)',
            background: 'var(--card-bg)', color: 'var(--text-primary)',
            outline: 'none', transition: 'border-color 0.2s',
            boxShadow: 'var(--shadow)',
          }}
          onFocus={e => { e.target.style.borderColor = '#1a73e8'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-color)'; }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              border: 'none', background: 'none', cursor: 'pointer', fontSize: 16,
              color: 'var(--text-secondary)', padding: '4px 8px',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* 导航分类标签 */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 16,
        overflowX: 'auto', paddingBottom: 4,
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }} className="no-scrollbar">
        {CATEGORIES.map(cat => {
          const isActive = category === cat.key;
          const counts = {
            all: stats.total,
            recommended: stats.recommended,
            warning: stats.scam,
            lowquality: stats.lowQuality,
          };
          return (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              style={{
                padding: '8px 16px', borderRadius: 20, fontSize: 14,
                border: `1px solid ${isActive ? '#1a73e8' : 'var(--border-color)'}`,
                background: isActive ? '#1a73e8' : 'var(--card-bg)',
                color: isActive ? '#fff' : 'var(--text-primary)',
                cursor: 'pointer', fontWeight: isActive ? 600 : 400,
                whiteSpace: 'nowrap', transition: 'all 0.2s',
                boxShadow: isActive ? '0 2px 8px rgba(26,115,232,0.3)' : 'var(--shadow)',
              }}
              title={cat.desc || ''}
            >
              {cat.icon} {cat.label}
              <span style={{
                marginLeft: 6, fontSize: 12, opacity: 0.8,
                background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--border-color)',
                padding: '1px 7px', borderRadius: 10,
              }}>
                {counts[cat.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* 数据看板 */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        <DashboardCard icon="📊" label="总条目" value={stats.total} />
        <DashboardCard icon="⚠️" label="需警惕" value={stats.scam} bg="#fff0f0" color="#c62828" />
        <DashboardCard icon="✅" label="推荐" value={stats.recommended} bg="#f0fff4" color="#2e7d32" />
        <DashboardCard
          icon="🕐"
          label="最新采集"
          value={latestTime || '-'}
          bg="var(--card-bg)"
        />
      </div>

      {/* 内容列表 */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length === 0 && (
            <div style={{
              textAlign: 'center', padding: 60, color: 'var(--text-secondary)',
              fontSize: 15,
            }}>
              {search
                ? '没有匹配的内容，试试其他关键词'
                : category === 'recommended'
                  ? '暂无推荐副业'
                  : category === 'warning'
                    ? '暂无需警惕内容'
                    : category === 'lowquality'
                      ? '暂无低质内容'
                      : '没有内容，请确认数据已加载'}
            </div>
          )}
          {filtered.map((p, i) => {
            const isScam = p.is_scam;
            const isLowQuality = p.is_low_quality;
            const bgColor = isScam ? 'rgba(255,23,68,0.04)' : isLowQuality ? 'rgba(255,145,0,0.04)' : 'var(--card-bg)';
            const borderColor = isScam ? 'rgba(255,23,68,0.25)' : isLowQuality ? 'rgba(255,145,0,0.25)' : 'var(--border-color)';
            const typeInfo = TYPE_CONFIG[p.type] || TYPE_CONFIG.other;

            return (
              <div key={i} className="post-card" style={{
                padding: 16, borderRadius: 12, border: `1px solid ${borderColor}`,
                background: bgColor, boxShadow: 'var(--shadow)',
                transition: 'all 0.25s ease',
                cursor: 'default',
              }}>
                {/* 顶栏：平台 + 类型 + 状态 */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: 8, alignItems: 'center', flexWrap: 'wrap', gap: 4,
                }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="platform-badge" style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 6,
                      background: p.platform === 'tieba' ? '#e3f2fd' : p.platform === 'zhihu' ? '#f3e5f5' : '#fce4ec',
                      color: '#555', fontWeight: 500,
                    }}>
                      {p.platform === 'tieba' ? '贴吧' : p.platform === 'zhihu' ? '知乎' : p.platform === 'xiaohongshu' ? '小红书' : p.platform}
                    </span>
                    <span className="type-badge" style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 6,
                      background: 'rgba(26,115,232,0.1)', color: '#1a73e8',
                      fontWeight: 500,
                    }}>
                      {typeInfo.icon} {typeInfo.label}
                    </span>
                    {p.forum && (
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)', opacity: 0.7 }}>
                        📌 {p.forum}
                      </span>
                    )}
                  </div>
                  {/* 状态徽章 */}
                  <span style={{
                    fontSize: 11, padding: '2px 10px', borderRadius: 6,
                    fontWeight: 600, whiteSpace: 'nowrap',
                    background: isScam ? 'rgba(255,23,68,0.1)' : isLowQuality ? 'rgba(255,145,0,0.1)' : 'rgba(0,200,83,0.1)',
                    color: isScam ? '#c62828' : isLowQuality ? '#e65100' : '#2e7d32',
                    border: `1px solid ${isScam ? 'rgba(255,23,68,0.2)' : isLowQuality ? 'rgba(255,145,0,0.2)' : 'rgba(0,200,83,0.2)'}`,
                  }}>
                    {isScam ? '⚠️ 需警惕' : isLowQuality ? '📰 低质内容' : '✅ 可信'}
                  </span>
                </div>

                {/* 标题 - 链接到详情页 */}
                <Link
                  href={`/posts/${btoa(encodeURIComponent(p.url))}`}
                  style={{
                    fontSize: 15, fontWeight: 500, color: '#1a73e8',
                    textDecoration: 'none', display: 'block', marginBottom: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {p.title}
                </Link>

                {/* 摘要 */}
                {p.snippet && (
                  <p style={{
                    fontSize: 13, color: 'var(--text-secondary)', margin: 0,
                    lineHeight: 1.7, display: '-webkit-box',
                    WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {p.snippet}
                  </p>
                )}

                {/* 骗局标记 */}
                {p.warnings && p.warnings.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {p.warnings.map((w, j) => (
                      <span key={j} style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 6,
                        background: 'rgba(255,23,68,0.08)', color: '#c62828',
                        border: '1px solid rgba(255,23,68,0.2)',
                      }}>
                        🚩 {w}
                      </span>
                    ))}
                  </div>
                )}

                {/* 可信度进度条 */}
                <TrustBar score={p.trust_score} />

                {/* 底部信息 */}
                <div style={{
                  fontSize: 12, color: 'var(--text-secondary)', marginTop: 8,
                  opacity: 0.7, display: 'flex', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 4,
                }}>
                  <span>{p.author || '匿名'}</span>
                  <span>{p.time || p.date || ''}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scoped 样式 */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .post-card {
          transition: all 0.25s ease;
        }
        .post-card:hover {
          transform: translateY(-2px);
        }
      `}</style>

      {/* 页脚 */}
      <div style={{
        textAlign: 'center', padding: '24px 0', marginTop: 24,
        fontSize: 12, color: 'var(--text-secondary)', opacity: 0.6,
        borderTop: '1px solid var(--border-color)',
      }}>
        副业侦探 · 数据仅供参考，投资有风险，参与需谨慎
      </div>
    </div>
  );
}
