import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Converter() {
  const [rate, setRate] = useState(50);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const daily = rate * 8;
  const monthly = daily * 22;
  const yearly = monthly * 12;

  // Compare with real income data
  const realIncomes = stats?.incomeData?.byType || {};
  const closestSkill = Object.entries(realIncomes)
    .filter(([, v]) => v.avgIncome)
    .sort((a, b) => {
      const diffA = Math.abs(a[1].avgIncome - monthly);
      const diffB = Math.abs(b[1].avgIncome - monthly);
      return diffA - diffB;
    })
    .slice(0, 3);

  // Income percentile comparison
  const incomeRanges = stats?.incomeData?.ranges || [];
  const maxCount = Math.max(...incomeRanges.map(r => r.count), 1);

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <Head>
          <title>收入换算器 - 副业侦探</title>
        </Head>
        
        <h1 className="text-3xl font-bold mb-2">💰 收入换算器</h1>
        <p className="text-text-secondary mb-6">时薪 ↔ 日薪/月薪/年薪 快速换算</p>
        
        {/* Converter */}
        <div className="mb-8 p-5 bg-bg-card border border-border rounded-2xl">
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">时薪: ¥{rate}/h</label>
            <input
              type="range"
              min={15}
              max={500}
              step={5}
              value={rate}
              onChange={e => setRate(+e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>¥15/h</span><span>¥500/h</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-center">
              <p className="text-sm text-text-secondary">日薪</p>
              <p className="text-xl font-bold text-primary">¥{daily.toLocaleString()}</p>
              <p className="text-xs text-text-secondary">8小时</p>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-center">
              <p className="text-sm text-text-secondary">月薪</p>
              <p className="text-xl font-bold text-primary">¥{monthly.toLocaleString()}</p>
              <p className="text-xs text-text-secondary">22天</p>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-center">
              <p className="text-sm text-text-secondary">年薪</p>
              <p className="text-xl font-bold text-primary">¥{(yearly/10000).toFixed(1)}万</p>
              <p className="text-xs text-text-secondary">12月</p>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-center">
              <p className="text-sm text-text-secondary">年收入</p>
              <p className="text-xl font-bold text-primary">¥{yearly.toLocaleString()}</p>
              <p className="text-xs text-text-secondary">税后预估</p>
            </div>
          </div>
        </div>

        {/* Real Data Comparison */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">📊 收入对比分析</h2>
            
            {/* Comparison with real side hustle incomes */}
            <div className="mb-6 p-5 bg-bg-card border border-border rounded-2xl">
              <h3 className="font-semibold mb-4">你的月薪（¥{monthly.toLocaleString()}）vs 真实副业收入</h3>
              <div className="space-y-3">
                {Object.entries(realIncomes).map(([type, data]) => {
                  const avg = data.avgIncome;
                  if (!avg) return null;
                  const diff = monthly - avg;
                  const isHigher = monthly >= avg;
                  const barWidth = Math.min((Math.max(avg, monthly) / 15000) * 100, 100);
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">{type}</span>
                        <span className={`text-sm ${isHigher ? 'text-green-400' : 'text-red-400'}`}>
                          {isHigher ? '高于' : '低于'}平均值 ¥{avg.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-border/20 rounded-full h-4 overflow-hidden relative">
                          {/* Average bar */}
                          <div
                            className="absolute h-full rounded-full bg-blue-500/40"
                            style={{ width: `${(avg / 15000) * 100}%` }}
                          />
                          {/* Your bar */}
                          <div
                            className="absolute h-full rounded-full bg-green-500/60"
                            style={{ width: `${(monthly / 15000) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-text-secondary">
                        <span>¥0</span>
                        <span>¥{avg.toLocaleString()}</span>
                        <span>¥{monthly.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Income Distribution */}
            <div className="p-5 bg-bg-card border border-border rounded-2xl">
              <h3 className="font-semibold mb-4">📈 收入区间分布（真实数据）</h3>
              <div className="flex items-end gap-2 h-32">
                {incomeRanges.map((range, i) => {
                  const height = (range.count / maxCount) * 100;
                  const isHighlighted = monthly >= 3000 && monthly <= 5000 && range.label.includes('3000');
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-medium">{range.count}</span>
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${isHighlighted ? 'bg-yellow-500' : 'bg-blue-500/60'}`}
                        style={{
                          height: `${Math.max(height, 3)}%`,
                          minHeight: '4px',
                        }}
                      />
                      <span className="text-xs text-text-secondary text-center leading-tight" style={{ fontSize: '10px' }}>
                        {range.label.replace('月入', '').replace('+', '')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="mt-6 p-5 bg-bg-card border border-border rounded-2xl">
              <h3 className="font-semibold mb-4">📊 各平台副业活跃度</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(stats.platformStats || {}).map(([platform, data], i) => {
                  const maxCount = Math.max(...Object.values(stats.platformStats || {}).map(p => p.count));
                  const height = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
                  const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'];
                  const names = { bilibili: 'B站', hupu: '虎扑', xiaohongshu: '小红书', tieba: '贴吧', zhihu: '知乎' };
                  return (
                    <div key={platform} className="text-center">
                      <div className="relative h-24 bg-border/20 rounded-xl overflow-hidden flex items-end justify-center pb-2">
                        <div
                          className="w-3/4 rounded-t-lg transition-all duration-500"
                          style={{
                            height: `${Math.max(height, 5)}%`,
                            background: `linear-gradient(180deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`,
                          }}
                        />
                      </div>
                      <p className="text-sm font-medium mt-1">{names[platform] || platform}</p>
                      <p className="text-xs text-text-secondary">{data.count}条</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Most Popular Side Hustles */}
            <div className="mt-6 p-5 bg-bg-card border border-border rounded-2xl">
              <h3 className="font-semibold mb-4">🔥 最热副业方向</h3>
              <div className="flex flex-wrap gap-2">
                {(stats.sideHustleTopics || []).slice(0, 12).map((topic, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm"
                    style={{
                      background: `rgba(59, 130, 246, ${0.1 + (topic.count / Math.max(...stats.sideHustleTopics.map(t => t.count))) * 0.3})`,
                      color: '#93c5fd',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      fontSize: `${Math.max(12, 14 + topic.count * 0.5)}px`,
                    }}
                  >
                    {topic.name} <span className="text-xs opacity-60">×{topic.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tax Estimation */}
        <div className="p-5 bg-bg-card border border-border rounded-2xl">
          <h3 className="font-semibold mb-3">🏛️ 个税估算（中国大陆）</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-text-secondary">年应纳税所得额</p>
              <p className="text-lg font-bold">¥{(yearly - 60000).toLocaleString()}</p>
              <p className="text-xs text-text-secondary">年收入 - 6万免征额</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-text-secondary">预估个税</p>
              <p className="text-lg font-bold">¥{Math.max(0, Math.round(yearly * 0.03)).toLocaleString()}</p>
              <p className="text-xs text-text-secondary">综合税率 3% 起</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <p className="text-text-secondary">税后年收入</p>
              <p className="text-lg font-bold">¥{(yearly - Math.max(0, Math.round(yearly * 0.03))).toLocaleString()}</p>
              <p className="text-xs text-text-secondary">仅供参考</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
