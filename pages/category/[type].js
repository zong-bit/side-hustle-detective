import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const CATEGORIES = {
  online: {
    name: '线上兼职',
    emoji: '💻',
    desc: '远程工作、网赚、在家办公等线上副业',
    keywords: ['线上兼职', '远程', '在家', '网络', '网赚', '网上', '线上', '居家', '线上办公']
  },
  offline: {
    name: '实体创业',
    emoji: '🏪',
    desc: '开店、摆摊、实体经营等线下创业',
    keywords: ['实体', '开店', '摆摊', '创业', '实体店', '地摊', '店铺']
  },
  content: {
    name: '内容创作',
    emoji: '✍️',
    desc: '写作、视频、自媒体等内容副业',
    keywords: ['写作', '码字', '写小说', '视频', '自媒体', '内容', '创作', '拍视频', '剪辑', '文案', '直播']
  },
  skill: {
    name: '技能服务',
    emoji: '🛠️',
    desc: '技能变现、技术服务、家教等技能副业',
    keywords: ['技能', '技术', '设计', '编程', '翻译', '家教', 'PS', '修图', 'Excel', 'PPT', '配音']
  },
  social: {
    name: '社交电商',
    emoji: '🛒',
    desc: '微商、社群团购、带货等社交类副业',
    keywords: ['社交电商', '微商', '朋友圈', '社群', '团购', '带货', '代购', '推广']
  }
};

const TYPE_NAMES = Object.keys(CATEGORIES);

export default function CategoryPage() {
  const router = useRouter();
  const { type } = router.query;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/posts');
        const allPosts = await res.json();
        setPosts(allPosts);
      } catch (e) {}
      setLoading(false);
    }
    load();
  }, []);

  if (!type || !TYPE_NAMES.includes(type)) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <Head><title>分类未找到 - 副业侦探</title></Head>
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <h1 style={{ fontSize: 28 }}>🤷 分类不存在</h1>
          <p style={{ color: '#666', marginBottom: 20 }}>请从以下分类中选择：</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <Link key={key} href={`/category/${key}`}
                style={{
                  padding: '12px 24px', borderRadius: 8, background: '#f5f5f5',
                  textDecoration: 'none', color: '#333', fontSize: 15
                }}>
                {cat.emoji} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const category = CATEGORIES[type];

  // Filter posts by category (check title and snippet for keywords)
  const filtered = posts.filter(p => {
    const text = (p.title + ' ' + (p.snippet || '')).toLowerCase();
    return category.keywords.some(k => text.includes(k));
  });

  // Sort: scam first, then by date
  filtered.sort((a, b) => {
    if (a.is_scam !== b.is_scam) return a.is_scam ? -1 : 1;
    return (b.time || '').localeCompare(a.time || '');
  });

  const paged = filtered.slice(0, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const hasMore = filtered.length > paged.length;

  const safeChar = (str) => {
    if (!str) return '';
    return str.replace(/["<>]/g, '').substring(0, 100);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <Head>
        <title>{category.name}副业推荐 - 副业侦探</title>
        <meta name="description" content={`${category.name}副业信息聚合 - ${category.desc}。自动骗局检测，安全可靠。`} />
        <meta name="keywords" content={`${category.name},副业,${category.name}副业,副业推荐,防骗`} />
      </Head>

      <Link href="/" style={{ color: '#1a73e8', textDecoration: 'none', fontSize: 14, marginBottom: 16, display: 'inline-block' }}>
        ← 返回首页
      </Link>

      {/* 分类头部 */}
      <div style={{
        background: 'white', borderRadius: 12, border: '1px solid #eee',
        padding: 20, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}>
        <h1 style={{ fontSize: 26, margin: '0 0 6px 0' }}>
          {category.emoji} {category.name}
        </h1>
        <p style={{ color: '#666', fontSize: 14, margin: 0 }}>{category.desc}</p>
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, padding: '3px 10px', background: '#e8f5e9', borderRadius: 12 }}>
            📊 共 {filtered.length} 条
          </span>
          <span style={{ fontSize: 12, padding: '3px 10px', background: '#ffebee', borderRadius: 12 }}>
            ⚠️ 需警惕 {filtered.filter(p => p.is_scam).length}
          </span>
          <span style={{ fontSize: 12, padding: '3px 10px', background: '#e8f5e9', borderRadius: 12 }}>
            ✅ 推荐 {filtered.filter(p => !p.is_scam && !p.is_low_quality).length}
          </span>
        </div>
      </div>

      {/* 所有分类导航 */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap',
        padding: '12px 16px', background: '#fafafa', borderRadius: 8
      }}>
        <span style={{ fontSize: 13, color: '#888', lineHeight: '30px' }}>其他分类：</span>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          key === type ? (
            <span key={key} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13,
              background: '#1a73e8', color: 'white', fontWeight: 500
            }}>
              {cat.emoji} {cat.name}
            </span>
          ) : (
            <Link key={key} href={`/category/${key}`} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13,
              background: 'white', color: '#555', textDecoration: 'none',
              border: '1px solid #ddd'
            }}>
              {cat.emoji} {cat.name}
            </Link>
          )
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>加载中...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          该分类暂无内容，后续会持续更新
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {paged.map((p, i) => {
            const bgColor = p.is_scam ? '#fff5f5' : p.is_low_quality ? '#fff8e1' : 'white';
            const borderColor = p.is_scam ? '#ffcdd2' : p.is_low_quality ? '#ffe082' : '#eee';

            return (
              <Link
                key={i}
                href={`/posts/${btoa(encodeURIComponent(p.url))}`}
                style={{
                  padding: 16, borderRadius: 10, border: `1px solid ${borderColor}`,
                  background: bgColor, textDecoration: 'none', color: '#333',
                  transition: 'box-shadow 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 6,
                      background: p.platform === 'tieba' ? '#e3f2fd' : p.platform === 'zhihu' ? '#f3e5f5' : '#fce4ec',
                      color: '#666'
                    }}>
                      {p.platform === 'tieba' ? '贴吧' : p.platform === 'zhihu' ? '知乎' : p.platform === 'xiaohongshu' ? '小红书' : p.platform}
                    </span>
                  </div>
                  {p.is_scam && <span style={{ fontSize: 11, color: '#c62828', fontWeight: 500 }}>⚠️ 需警惕</span>}
                  {!p.is_scam && p.is_low_quality && <span style={{ fontSize: 11, color: '#f57f17', fontWeight: 500 }}>📰 低质</span>}
                  {!p.is_scam && !p.is_low_quality && <span style={{ fontSize: 11, color: '#2e7d32', fontWeight: 500 }}>✅ 可信</span>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, color: '#1a73e8' }}>{p.title}</div>
                {p.snippet && (
                  <p style={{ fontSize: 13, color: '#555', margin: 0, lineHeight: 1.5 }}>
                    {p.snippet.length > 150 ? p.snippet.substring(0, 150) + '...' : p.snippet}
                  </p>
                )}
                {p.warnings && p.warnings.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {p.warnings.map((w, j) => (
                      <span key={j} style={{
                        fontSize: 10, padding: '2px 6px', borderRadius: 4,
                        background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2'
                      }}>
                        🚩 {w}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}

          {/* 加载更多 */}
          {hasMore && (
            <button
              onClick={() => setPage(page + 1)}
              style={{
                padding: '12px 20px', fontSize: 14, borderRadius: 8,
                border: '1px solid #ddd', background: 'white', cursor: 'pointer',
                color: '#555', marginTop: 8
              }}
            >
              加载更多（{paged.length}/{filtered.length}）
            </button>
          )}
        </div>
      )}
    </div>
  );
}
