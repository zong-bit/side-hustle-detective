import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 48px' }}>
      <Head>
        <title>关于 · 副业侦探</title>
        <meta name="description" content="副业侦探 —— 聚合贴吧、B站、知乎、小红书、虎扑各平台的副业讨论，自动甄别骗局，帮你发现靠谱副业。" />
        <meta property="og:title" content="关于 · 副业侦探" />
        <meta property="og:description" content="聚合各平台副业信息，AI 关键词辅助甄别骗局。" />
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
          🕵️ 关于我们
        </h1>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6, maxWidth: 480 }}>
          副业侦探是什么？谁在做？数据从哪来？
        </p>
      </div>

      {/* Section: 网站介绍 */}
      <div className="card fade-in" style={{ padding: '24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🔍</span> 网站介绍
        </h2>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.8, margin: 0 }}>
          副业侦探是一个<strong style={{ color: 'var(--fg)' }}>副业信息聚合平台</strong>，自动爬取各平台上的副业讨论内容，通过关键词规则对信息进行<strong style={{ color: 'var(--fg)' }}>可信度评估和骗局甄别</strong>，帮你快速筛选出值得关注的副业机会。
        </p>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.8, margin: '14px 0 0' }}>
          在这里，你可以按类别浏览副业信息、查看可信度评分和骗局预警标记，也可以搜索感兴趣的副业方向。每一条信息都标注了来源平台和原始链接，方便你溯源核实。
        </p>
      </div>

      {/* Section: 数据来源 */}
      <div className="card fade-in" style={{ padding: '24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>📡</span> 数据来源
        </h2>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.8, margin: '0 0 14px' }}>
          我们聚合以下平台的副业相关公开讨论内容：
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { icon: '📌', label: '贴吧', color: '#2563eb', bg: '#eff6ff', border: '#dbeafe' },
            { icon: '📺', label: 'B站', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
            { icon: '💡', label: '知乎', color: '#6b46c1', bg: '#faf5ff', border: '#e9d8fd' },
            { icon: '📕', label: '小红书', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
            { icon: '🏀', label: '虎扑', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
          ].map(p => (
            <span
              key={p.label}
              className="badge"
              style={{
                background: p.bg,
                color: p.color,
                boxShadow: `0 0 0 1px ${p.border}`,
                fontSize: 13,
                padding: '4px 12px',
              }}
            >
              {p.icon} {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* Section: 数据更新 */}
      <div className="card fade-in" style={{ padding: '24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🔄</span> 数据更新
        </h2>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.8, margin: 0 }}>
          数据通过自动化脚本<strong style={{ color: 'var(--fg)' }}>每日定时更新</strong>，爬取各平台最新发布的副业讨论内容，并结合关键词规则库进行可信度打分和骗局标记。如果你发现漏报或误报的情况，欢迎联系我们反馈。
        </p>
      </div>

      {/* Section: 免责声明 */}
      <div className="card fade-in" style={{ padding: '24px', marginBottom: 16, borderLeft: '3px solid var(--warning)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>⚠️</span> 免责声明
        </h2>
        <div style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.8 }}>
          <p style={{ margin: '0 0 10px' }}>
            本站所有内容均<strong>自动聚合自各平台公开讨论</strong>，仅供参考，不构成任何投资或参与建议。
          </p>
          <p style={{ margin: '0 0 10px' }}>
            骗局检测基于<strong>关键词规则自动判断</strong>，可能存在误判或遗漏。每条信息的可信度评分为机器生成，不代表真实情况。
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: 'var(--warning)' }}>投资有风险，参与需谨慎。</strong>做决定前请自行核实信息，必要时咨询专业人士。
          </p>
        </div>
      </div>

      {/* Section: 联系邮箱 */}
      <div className="card fade-in" style={{ padding: '24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>📬</span> 联系我们
        </h2>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.8, margin: '0 0 14px' }}>
          如果你有反馈、建议，或者发现了问题想告诉我们，欢迎发送邮件：
        </p>
        <a
          href="mailto:side.hustle.detective@proton.me"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: 'var(--accent)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 500,
            textDecoration: 'none',
            fontFamily: 'inherit',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.target.style.opacity = 0.85}
          onMouseLeave={e => e.target.style.opacity = 1}
        >
          ✉️ side.hustle.detective@proton.me
        </a>
      </div>

      {/* Section: 技术栈 */}
      <div className="card fade-in" style={{ padding: '24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>⚙️</span> 技术栈
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {[
            { label: 'Next.js', color: '#000', bg: '#fafafa', border: '#e5e5e5' },
            { label: 'React', color: '#087ea4', bg: '#f0f9ff', border: '#bae6fd' },
            { label: 'Python', color: '#3776ab', bg: '#f0f4ff', border: '#c7d2fe' },
            { label: 'Playwright', color: '#45ba4b', bg: '#f0fdf4', border: '#bbf7d0' },
            { label: 'Vercel', color: '#000', bg: '#fafafa', border: '#e5e5e5' },
          ].map(t => (
            <span
              key={t.label}
              className="badge"
              style={{ background: t.bg, color: t.color, boxShadow: `0 0 0 1px ${t.border}` }}
            >
              {t.label}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'var(--fg-faint)', lineHeight: 1.7, margin: 0 }}>
          前端使用 Next.js + React，爬虫使用 Python + Playwright，部署在 Vercel 上。所有代码开源于 GitHub。
        </p>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '40px 0', marginTop: 48, fontSize: 12, color: 'var(--fg-faint)', borderTop: '1px solid var(--border)' }}>
        副业侦探 · 数据仅供参考，投资有风险，参与需谨慎
      </div>
    </div>
  );
}
