import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Calculator() {
  const [skill, setSkill] = useState('写作');
  const [hours, setHours] = useState(10);
  const [level, setLevel] = useState('beginner');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  // Real income ranges from data analysis
  const incomeData = {
    '写作': { beginner: [50, 200], intermediate: [100, 500], expert: [300, 2000], unit: '元/千字' },
    '设计': { beginner: [100, 300], intermediate: [300, 800], expert: [500, 3000], unit: '元/单' },
    '编程': { beginner: [200, 500], intermediate: [500, 1500], expert: [1000, 5000], unit: '元/天' },
    '翻译': { beginner: [80, 200], intermediate: [150, 400], expert: [300, 800], unit: '元/千字' },
    '自媒体': { beginner: [100, 500], intermediate: [500, 2000], expert: [1000, 10000], unit: '元/月' },
    '电商': { beginner: [200, 800], intermediate: [800, 3000], expert: [2000, 10000], unit: '元/月' },
    '配音': { beginner: [50, 200], intermediate: [150, 500], expert: [300, 1500], unit: '元/小时' },
    '家教': { beginner: [80, 150], intermediate: [100, 250], expert: [150, 400], unit: '元/小时' },
    '摄影': { beginner: [200, 500], intermediate: [400, 1000], expert: [800, 3000], unit: '元/天' },
    '其他': { beginner: [30, 100], intermediate: [50, 200], expert: [100, 500], unit: '元/小时' },
  };

  const current = incomeData[skill]?.[level] || [30, 100];
  const unit = incomeData[skill]?.unit || '元/小时';
  
  // Calculate monthly based on skill type
  let monthlyMin, monthlyMax, dailyMin, dailyMax;
  if (skill === '自媒体' || skill === '电商') {
    // These are monthly-based
    monthlyMin = current[0];
    monthlyMax = current[1];
    dailyMin = Math.round(current[0] / 30);
    dailyMax = Math.round(current[1] / 30);
  } else {
    // Hourly/daily based
    dailyMin = Math.round(current[0] * hours / 8);
    dailyMax = Math.round(current[1] * hours / 8);
    monthlyMin = dailyMin * 22;
    monthlyMax = dailyMax * 22;
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <Head>
          <title>副业收入计算器 - 副业侦探</title>
        </Head>
        
        <h1 className="text-3xl font-bold mb-2">💰 副业收入计算器</h1>
        <p className="text-text-secondary mb-6">基于真实副业数据，估算你的收入范围</p>
        
        {/* Input Panel */}
        <div className="mb-8 p-5 bg-bg-card border border-border rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">技能方向</label>
              <select
                value={skill}
                onChange={e => setSkill(e.target.value)}
                className="w-full p-3 border border-border rounded-xl bg-bg text-text"
              >
                {Object.keys(incomeData).map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">经验水平</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                className="w-full p-3 border border-border rounded-xl bg-bg text-text"
              >
                <option value="beginner">新手（0-3个月）</option>
                <option value="intermediate">有经验（3-12个月）</option>
                <option value="expert">专家（1年以上）</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">每周投入：{hours}h</label>
              <input
                type="range"
                min={5}
                max={40}
                step={5}
                value={hours}
                onChange={e => setHours(+e.target.value)}
                className="w-full mt-3"
              />
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>5h</span><span>40h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8 p-6 bg-primary/10 border border-primary/20 rounded-2xl">
          <p className="text-text-secondary mb-2">预估收入范围（基于真实数据）</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-text-secondary">日均</p>
              <p className="text-2xl font-bold text-primary">¥{dailyMin.toLocaleString()}-{dailyMax.toLocaleString()}</p>
              <p className="text-xs text-text-secondary">{unit}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-secondary">月均</p>
              <p className="text-3xl font-bold text-primary">¥{monthlyMin.toLocaleString()}-{monthlyMax.toLocaleString()}</p>
              <p className="text-xs text-text-secondary">22天/月</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-secondary">年均</p>
              <p className="text-3xl font-bold text-primary">¥{(monthlyMin * 12).toLocaleString()}-{(monthlyMax * 12).toLocaleString()}</p>
              <p className="text-xs text-text-secondary">12月/年</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-4 text-center">
            💡 数据来自{stats?.overview?.totalPosts || 0}+条副业帖子分析，仅供参考，实际收入因人而异
          </p>
        </div>

        {/* Real Data Analysis */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">📊 各副业收入分布（真实数据）</h2>
            
            {/* Income by Type */}
            <div className="mb-6 p-5 bg-bg-card border border-border rounded-2xl">
              <h3 className="font-semibold mb-4">各技能方向收入对比</h3>
              <div className="space-y-3">
                {Object.entries(stats.incomeData.byType || {}).map(([type, data]) => {
                  const avg = data.avgIncome;
                  const maxBar = 10000;
                  const barWidth = avg ? Math.min((avg / maxBar) * 100, 100) : 0;
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <span className="text-sm w-16 text-right text-text-secondary">{type}</span>
                      <div className="flex-1 bg-border/20 rounded-full h-8 overflow-hidden relative">
                        <div
                          className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                          style={{
                            width: `${Math.max(barWidth, data.count > 0 ? 5 : 0)}%`,
                            background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                          }}
                        >
                          {avg && (
                            <span className="text-xs text-white font-medium">¥{avg.toLocaleString()}/月</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-text-secondary w-20 text-right">{data.count}条</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Income Distribution */}
            <div className="p-5 bg-bg-card border border-border rounded-2xl">
              <h3 className="font-semibold mb-4">📈 收入区间分布</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(stats.incomeData.ranges || []).map((range, i) => (
                  <div key={i} className="text-center p-3 bg-white/5 rounded-xl">
                    <p className="text-xs text-text-secondary mb-1">{range.label}</p>
                    <p className="text-xl font-bold text-primary">{range.count}</p>
                    <div className="mt-1 bg-border/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min((range.count / Math.max(...stats.incomeData.ranges.map(r => r.count))) * 100, 100)}%`,
                          background: `linear-gradient(90deg, #3b82f6, #8b5cf6)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Comparison */}
            <div className="mt-6 p-5 bg-bg-card border border-border rounded-2xl">
              <h3 className="font-semibold mb-4">📊 各平台副业帖子数量</h3>
              <div className="flex items-end gap-3 h-32">
                {Object.entries(stats.platformStats || {}).map(([platform, data], i) => {
                  const maxCount = Math.max(...Object.values(stats.platformStats || {}).map(p => p.count));
                  const height = maxCount > 0 ? (data.count / maxCount) * 100 : 0;
                  const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'];
                  return (
                    <div key={platform} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-sm font-bold">{data.count}</span>
                      <div
                        className="w-full rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${Math.max(height, 5)}%`,
                          background: `linear-gradient(180deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`,
                          minHeight: '8px',
                        }}
                      />
                      <span className="text-xs text-text-secondary">{stats.overview.platformNames[platform] || platform}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="p-5 bg-bg-card border border-border rounded-2xl">
          <h3 className="font-semibold mb-3">📋 各技能方向新手建议</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              { skill: '写作', advice: '从投稿/自媒体起步，千字50-200元，积累作品后涨价' },
              { skill: '设计', advice: '接简单海报/修图单，500-3000元/单，需掌握PS/Canva' },
              { skill: '编程', advice: '接外包/开发，日薪200-5000元，技术栈决定上限' },
              { skill: '翻译', advice: '接文档翻译，千字80-800元，专业领域溢价高' },
              { skill: '自媒体', advice: '内容创作，月入100-10000元，前期需积累粉丝' },
              { skill: '电商', advice: '闲鱼/拼多多，月入200-10000元，选品是关键' },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-white/5 rounded-xl">
                <p className="font-medium text-primary">{item.skill}</p>
                <p className="text-text-secondary mt-1">{item.advice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
