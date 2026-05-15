import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function ScamCheck() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  function check() {
    if (!text.trim()) return;
    
    const textLower = text.toLowerCase();
    
    // Real scam patterns from scam_warnings.json
    const scamPatterns = [
      { name: '刷单返利', icon: '🔄', keywords: ['刷单', '返利', '押金', '佣金', '先交钱', '保证金'], severity: 'high' },
      { name: '培训费割韭菜', icon: '📚', keywords: ['培训费', '学费', '课程', '8800', '15800', '交钱学'], severity: 'high' },
      { name: '代理费骗局', icon: '🤝', keywords: ['代理费', '加盟费', '3980', '成为代理', '授权费'], severity: 'high' },
      { name: '虚假兼职', icon: '⌨️', keywords: ['打字员', '录入员', '挂机', '日赚200', '零投入'], severity: 'high' },
      { name: '语音厅骗局', icon: '🎙️', keywords: ['语音厅', '语音主播', '月入过万', '语音兼职'], severity: 'medium' },
      { name: '光伏骗局', icon: '☀️', keywords: ['光伏', '屋顶', '太阳能', '零成本'], severity: 'medium' },
      { name: '考证骗局', icon: '📜', keywords: ['考证', '无人机', '考证培训', '包过'], severity: 'medium' },
      { name: '招聘骗局', icon: '👔', keywords: ['招聘', '保安', '体检费', '服装费', '入职费'], severity: 'high' },
      { name: 'AI赚钱套路', icon: '🤖', keywords: ['AI赚钱', 'AI副业', '卖课', '割韭菜', 'AI培训'], severity: 'medium' },
      { name: '夸大收益', icon: '💰', keywords: ['日赚', '月入过万', '躺赚', '稳赚', '包赚钱', '零风险', '高回报'], severity: 'high' },
      { name: '拉人头传销', icon: '🔗', keywords: ['拉人头', '发展下线', '层级', '团队计酬', '分销'], severity: 'high' },
      { name: '虚假投资', icon: '📈', keywords: ['虚拟货币', '炒币', '合约', '带单', '理财'], severity: 'high' },
    ];

    const matched = [];
    scamPatterns.forEach(pattern => {
      const found = pattern.keywords.filter(k => textLower.includes(k));
      if (found.length > 0) {
        matched.push({ ...pattern, foundKeywords: found });
      }
    });

    // Calculate risk score
    let score = 0;
    matched.forEach(m => {
      score += m.severity === 'high' ? 25 : 15;
    });
    score = Math.min(score, 100);

    // Determine level
    let level, msg;
    if (score >= 70) {
      level = 'danger';
      msg = '🚨 高风险！检测到多个骗局特征，建议立即远离';
    } else if (score >= 40) {
      level = 'warning';
      msg = '⚠️ 中等风险！存在可疑特征，建议进一步核实';
    } else if (score > 0) {
      level = 'caution';
      msg = '🔍 低风险预警！发现少量可疑词，请保持警惕';
    } else {
      level = 'safe';
      msg = '✅ 暂未发现明显骗局特征，但仍需谨慎判断';
    }

    setResult({ matched, score, level, msg });
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <Head>
          <title>副业骗局检测器 - 副业侦探</title>
        </Head>
        
        <h1 className="text-3xl font-bold mb-2">🔍 副业骗局检测器</h1>
        <p className="text-text-secondary mb-6">基于真实副业骗局数据，自动检测骗局特征</p>
        
        {/* Input */}
        <div className="mb-6">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full h-36 p-4 border border-border rounded-xl bg-bg text-text resize-none"
            placeholder="粘贴副业描述、广告文案或招聘信息，自动检测骗局特征..."
          />
          <button
            onClick={check}
            className="mt-4 px-8 py-3 bg-primary text-white rounded-xl w-full font-semibold hover:bg-primary/90 transition"
          >
            开始检测
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className={`mb-8 p-6 rounded-2xl border ${
            result.level === 'danger' ? 'bg-red-500/10 border-red-500/30' :
            result.level === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
            result.level === 'caution' ? 'bg-orange-500/10 border-orange-500/30' :
            'bg-green-500/10 border-green-500/30'
          }`}>
            {/* Risk Score */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2" className="text-border/30" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeDasharray={`${result.score} 100`}
                    className={`${result.score >= 70 ? 'text-red-500' : result.score >= 40 ? 'text-yellow-500' : result.score > 0 ? 'text-orange-500' : 'text-green-500'}`}
                    strokeLinecap="round" />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${
                  result.score >= 70 ? 'text-red-500' : result.score >= 40 ? 'text-yellow-500' : 'text-green-500'
                }`}>{result.score}%</span>
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold">{result.msg}</p>
                <p className="text-sm text-text-secondary mt-1">检测到 {result.matched.length} 类可疑特征</p>
              </div>
            </div>

            {/* Matched Patterns */}
            {result.matched.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-text-secondary mb-2">匹配到的骗局特征：</p>
                <div className="space-y-3">
                  {result.matched.map((m, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{m.icon}</span>
                        <span className="font-semibold">{m.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          m.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {m.severity === 'high' ? '高危' : '中危'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.foundKeywords.map(k => (
                          <span key={k} className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Data Analysis Section */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">📊 骗局数据分析</h2>
            
            {/* Category Distribution - CSS Bar Chart */}
            <div className="mb-6 p-5 bg-bg-card border border-border rounded-2xl">
              <h3 className="font-semibold mb-4">各类骗局占比</h3>
              <div className="space-y-2">
                {stats.scamAnalysis.categories.map((cat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm w-28 text-right text-text-secondary truncate" title={cat.name}>{cat.name}</span>
                    <div className="flex-1 bg-border/20 rounded-full h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                        style={{
                          width: `${Math.max(cat.percentage, 8)}%`,
                          background: `linear-gradient(90deg, ${['#ef4444','#f97316','#eab308','#3b82f6','#8b5cf6','#06b6d4','#10b981','#6366f1','#ec4899','#f43f5e'][i % 10]}, ${['#dc2626','#ea580c','#ca8a04','#2563eb','#7c3aed','#0891b2','#059669','#4f46e5','#db2777','#e11d48'][i % 10]})`,
                        }}
                      >
                        <span className="text-xs text-white font-medium">{cat.percentage}%</span>
                      </div>
                    </div>
                    <span className="text-sm w-8 text-text-secondary">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Risk Keywords */}
            <div className="mb-6 p-5 bg-bg-card border border-border rounded-2xl">
              <h3 className="font-semibold mb-4">🔑 高危关键词</h3>
              <div className="flex flex-wrap gap-2">
                {stats.scamAnalysis.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      background: `rgba(239, 68, 68, ${0.1 + kw.matchCount * 0.1})`,
                      color: '#fca5a5',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    {kw.icon} {kw.name} ({kw.matchCount}次)
                  </span>
                ))}
              </div>
            </div>

            {/* Scam Warning Cases */}
            <div className="p-5 bg-bg-card border border-border rounded-2xl">
              <h3 className="font-semibold mb-4">⚠️ 真实骗局案例</h3>
              <div className="space-y-3">
                {stats.scamAnalysis.warnings.slice(0, 6).map((w, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-xl">
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 font-bold text-sm flex-shrink-0">#{w.rank}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{w.title}</p>
                        <p className="text-xs text-text-secondary mt-1 line-clamp-2">{w.snippet}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-text-secondary">{w.author}</span>
                          <span className="text-xs text-text-secondary">{w.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference */}
        <div className="p-5 bg-bg-card border border-border rounded-2xl">
          <h3 className="font-semibold mb-3">💡 常见骗局特征速查</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {[
              { icon: '💰', text: '要求先交钱（押金/培训费/代理费）' },
              { icon: '📈', text: '承诺高回报（日赚/月入过万/躺赚）' },
              { icon: '🔒', text: '零风险/稳赚不赔/100%赚钱' },
              { icon: '👥', text: '拉人头/发展下线/层级计酬' },
              { icon: '🤫', text: '不让告诉别人/保密协议' },
              { icon: '⏰', text: '限时优惠/名额有限/最后机会' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-2">
                <span className="text-lg">{item.icon}</span>
                <span className="text-text-secondary">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
