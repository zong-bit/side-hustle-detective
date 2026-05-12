export default function handler(req, res) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="50%" style="stop-color:#16213e"/>
      <stop offset="100%" style="stop-color:#0f3460"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e94560"/>
      <stop offset="100%" style="stop-color:#f5a623"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" rx="0"/>

  <!-- Decorative circles -->
  <circle cx="150" cy="150" r="180" fill="#e94560" opacity="0.08"/>
  <circle cx="1050" cy="500" r="220" fill="#f5a623" opacity="0.06"/>
  <circle cx="600" cy="315" r="300" fill="#533483" opacity="0.05"/>

  <!-- Decorative line -->
  <line x1="100" y1="380" x2="1100" y2="380" stroke="url(#accent)" stroke-width="3" opacity="0.6"/>

  <!-- Main title -->
  <text x="600" y="240" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif" font-size="72" font-weight="700" fill="#ffffff" letter-spacing="6">
    🕵️ 副业侦探
  </text>

  <!-- Subtitle -->
  <text x="600" y="320" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif" font-size="32" font-weight="400" fill="#a0aec0" letter-spacing="3">
    副业信息聚合与防骗检测
  </text>

  <!-- English subtitle -->
  <text x="600" y="420" text-anchor="middle" font-family="'Inter','Helvetica Neue',Arial,sans-serif" font-size="28" font-weight="300" fill="#718096" letter-spacing="4">
    SIDE HUSTLE DETECTIVE
  </text>

  <!-- Tagline -->
  <text x="600" y="490" text-anchor="middle" font-family="'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif" font-size="18" fill="#4a5568" letter-spacing="2">
    发现靠谱副业 · 自动甄别骗局
  </text>

  <!-- Bottom accent bar -->
  <rect x="400" y="530" width="400" height="4" rx="2" fill="url(#accent)" opacity="0.8"/>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, immutable');
  res.status(200).send(svg);
}
