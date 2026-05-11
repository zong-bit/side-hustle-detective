import Head from 'next/head';
import Link from 'next/link';

const FEATURES = [
  {
    icon: '🔍',
    title: '副业搜索',
    description: '聚合贴吧、B站、知乎、小红书、虎扑等多平台副业信息，一键搜索 186+ 条真实副业数据。',
    link: '/',
    linkLabel: '去搜索',
  },
  {
    icon: '📂',
    title: '分类浏览',
    description: '按类型筛选副业信息，快速找到你感兴趣的副业方向。',
    link: '/',
    linkLabel: '浏览分类',
  },
  {
    icon: '⚠️',
    title: '骗局识别',
    description: '自动标记骗局和低质内容，可信度评分帮你快速甄别风险。',
    link: '/',
    linkLabel: '查看预警',
  },
  {
    icon: '📝',
    title: '每日推荐',
    description: '每天一条精选副业推荐，不错过任何靠谱机会。',
    link: '/',
    linkLabel: '今日推荐',
  },
  {
    icon: '📖',
    title: '知识文章',
    description: '58 篇副业指南，从零开始了解副业，少走弯路。',
    link: '/blog',
    linkLabel: '阅读文章',
  },
  {
    icon: '🎯',
    title: '副业匹配',
    description: '回答简单问卷，AI 为你推荐最适合你的副业方向。',
    link: '/match',
    linkLabel: '开始匹配',
  },
  {
    icon: '💰',
    title: '收入计算',
    description: '估算你的副业收入，合理规划时间和收益。',
    link: '/calculator',
    linkLabel: '计算收入',
  },
  {
    icon: '📊',
    title: '分类统计',
    description: '了解市场分布，数据驱动决策，找到最有潜力的副业方向。',
    link: '/stats',
    linkLabel: '查看统计',
  },
];

export default function Features() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 64px' }}>
      <Head>
        <title>功能介绍 · 副业侦探</title>
        <meta name="description" content="副业侦探提供副业搜索、骗局识别、每日推荐、知识文章、副业匹配等全方位副业工具。" />
        <meta property="og:title" content="功能介绍 · 副业侦探" />
        <meta property="og:description" content="副业侦探提供副业搜索、骗局识别、每日推荐、知识文章、副业匹配等全方位副业工具。" />
        <meta property="og:type" content="website" />
      </Head>

      {/* Back link */}
      <Link href="/" style={{ fontSize: 13, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 32 }}>
        ← 返回首页
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--fg-faint)', textTransform: 'uppercase', marginBottom: 12 }}>
          功能介绍
        </div>
        <h1 style={{ fontSize: 32, marginBottom: 12, letterSpacing: '-0.03em' }}>
          副业侦探有哪些功能？
        </h1>
        <p style={{ fontSize: 15, color: 'var(--fg-muted)', lineHeight: 1.7, maxWidth: 560 }}>
          一站式副业工具，从发现到决策，帮你高效筛选靠谱副业。
        </p>
      </div>

      {/* Feature grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="card fade-in"
            style={{
              padding: '24px',
              animationDelay: `${i * 0.05}s`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.02em' }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.7, margin: 0 }}>
                {f.description}
              </p>
            </div>
            <Link
              href={f.link}
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--accent)',
                marginTop: 16,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {f.linkLabel} →
            </Link>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className="card fade-in"
        style={{
          padding: '32px',
          marginTop: 48,
          background: 'var(--accent-subtle)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.02em' }}>
          开始探索你的副业机会
        </h2>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          搜索、筛选、匹配，找到最适合你的副业方向。
        </p>
        <Link href="/">
          <span className="btn-primary" style={{ fontSize: 14, padding: '10px 24px' }}>
            去首页 →
          </span>
        </Link>
      </div>
    </div>
  );
}
