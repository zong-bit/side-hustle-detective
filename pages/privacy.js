import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 48px' }}>
      <Head>
        <title>隐私政策 · 副业侦探</title>
        <meta name="description" content="副业侦探隐私政策 - 说明本站如何收集、使用和保护您的个人信息，符合 Google Adsense 隐私政策要求。" />
        <meta property="og:title" content="隐私政策 · 副业侦探" />
        <meta property="og:description" content="副业侦探隐私政策 - 说明本站如何收集、使用和保护您的个人信息。" />
        <meta property="og:type" content="website" />
      </Head>

      <Link href="/" style={{ fontSize: 13, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 32 }}>
        ← 返回首页
      </Link>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--fg-faint)', textTransform: 'uppercase', marginBottom: 12 }}>
          法律声明
        </div>
        <h1 style={{ fontSize: 28, marginBottom: 8, letterSpacing: '-0.03em' }}>
          📋 隐私政策
        </h1>
        <p style={{ fontSize: 13, color: 'var(--fg-muted)', marginBottom: 8 }}>
          最后更新日期：2026-05-11
        </p>
        <p style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.6 }}>
          副业侦探（https://fuye-seo.vercel.app）非常重视您的隐私。本隐私政策说明我们如何收集、使用和保护您的个人信息。
          访问或使用本站即表示您同意本隐私政策。
        </p>
      </div>

      {[
        {
          title: '一、我们收集的信息',
          icon: '📥',
          content: [
            '当您访问本站时，我们的服务器和第三方服务（如 Google Analytics、Google Adsense）可能会自动收集以下信息：',
            '• IP 地址（匿名化处理）',
            '• 浏览器类型和版本',
            '• 访问日期和时间',
            '• 您访问的页面 URL',
            '• 引荐来源网址（您是从哪个网站跳转到本站的）',
            '• 设备类型和操作系统',
            '我们不会主动收集您的姓名、邮箱、电话号码等个人身份信息。',
          ],
        },
        {
          title: '二、我们如何使用信息',
          icon: '📊',
          content: [
            '收集的信息仅用于以下目的：',
            '• 分析和改善网站内容和用户体验',
            '• 统计网站访问量和流量来源',
            '• 通过 Google Adsense 等第三方广告服务展示个性化广告',
            '• 检测和防止安全问题',
            '• 遵守法律法规要求',
          ],
        },
        {
          title: '三、Cookie 和追踪技术',
          icon: '🍪',
          content: [
            '本站使用 Cookie 和类似的追踪技术：',
            '• 功能性 Cookie：用于记住您的偏好设置，确保网站正常运行',
            '• 分析性 Cookie：用于统计访问数据（如 Google Analytics）',
            '• 广告 Cookie：由 Google Adsense 等第三方广告服务设置，用于展示相关广告',
            '您可以通过浏览器设置管理或禁用 Cookie，但这可能影响部分功能。',
            'Google Adsense 使用的 DART Cookie 允许其根据用户之前的访问向您展示广告。',
            '您可以访问 Google 的广告偏好管理页面来管理广告 Cookie：https://www.google.com/settings/ads',
          ],
        },
        {
          title: '四、第三方服务',
          icon: '🔗',
          content: [
            '本站可能包含以下第三方服务链接：',
            '• Google Adsense — 用于展示广告',
            '• Google Analytics — 用于网站流量分析',
            '• 各平台原始链接（贴吧、知乎、小红书、B站、虎扑等）— 点击后跳转至对应平台',
            '这些第三方服务有各自的隐私政策，我们建议您查阅其相关政策。',
            '我们对第三方服务的数据收集行为不承担责任。',
          ],
        },
        {
          title: '五、数据共享与披露',
          icon: '🔒',
          content: [
            '我们不会出售您的个人信息。',
            '我们仅在以下情况下可能共享信息：',
            '• 应法律法规要求或政府机构要求',
            '• 保护本站和用户的安全与权益',
            '• 与网站服务提供商（如 Vercel）共享必要的技术数据',
          ],
        },
        {
          title: '六、儿童隐私',
          icon: '👶',
          content: [
            '本站不面向 13 岁以下儿童。我们不会有意收集儿童的个人信息。',
            '如果您发现我们无意中收集了儿童信息，请立即联系我们删除。',
          ],
        },
        {
          title: '七、政策更新',
          icon: '📝',
          content: [
            '我们可能会不时更新本隐私政策。更新后的政策将在本页发布，建议您定期查看。',
            '重大变更时，我们会在网站上发布通知。',
          ],
        },
        {
          title: '八、联系我们',
          icon: '📬',
          content: [
            '如果您对本隐私政策有任何疑问或意见，请通过以下方式联系我们：',
            '邮箱：side.hustle.detective@proton.me',
          ],
        },
      ].map((section, i) => (
        <div key={i} className="card" style={{ padding: '24px', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>{section.icon}</span> {section.title}
          </h2>
          {section.content.map((p, j) => (
            <p key={j} style={{ fontSize: 14, color: 'var(--fg-muted)', lineHeight: 1.8, margin: `${j === 0 ? 0 : '10px 0 0'}` }}>
              {p}
            </p>
          ))}
        </div>
      ))}

      <div style={{ textAlign: 'center', padding: '40px 0', marginTop: 48, fontSize: 12, color: 'var(--fg-faint)', borderTop: '1px solid var(--border)' }}>
        副业侦探 · 数据仅供参考，投资有风险，参与需谨慎
      </div>
    </div>
  );
}
