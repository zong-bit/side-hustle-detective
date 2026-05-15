import { useState, useEffect } from 'react';
import Head from 'next/head';

const questions = [
  { id: 'skill', label: '你有哪些技能？', options: ['编程','写作','设计','翻译','自媒体','电商','配音','其他'] },
  { id: 'time', label: '每天能投入多少时间？', options: ['1小时','2-3小时','4-5小时','5小时+'] },
  { id: 'income', label: '期望月收入？', options: ['¥1000','¥3000','¥5000','¥10000+'] },
  { id: 'face', label: '愿意露脸吗？', options: ['愿意','不愿意'] },
];

function recommend(answers, stats) {
  const { skill, time, income, face } = answers;
  const recommendations = [];
  
  // Base recommendations on skill
  const skillRecs = {
    '编程': [
      { name: '接外包开发', icon: '💻', reason: '技术栈决定上限，日薪200-5000元', difficulty: '高', income: '高' },
      { name: 'AI工具开发', icon: '🤖', reason: 'AI时代需求大，可远程接单', difficulty: '高', income: '高' },
      { name: 'WordPress定制', icon: '🌐', reason: '门槛适中，闲鱼/淘宝有需求', difficulty: '中', income: '中' },
    ],
    '写作': [
      { name: '自媒体写作', icon: '✍️', reason: '千字50-200元，积累作品后涨价', difficulty: '中', income: '中' },
      { name: '投稿赚稿费', icon: '📝', reason: '公众号/杂志投稿，千字100-500元', difficulty: '中', income: '中' },
      { name: 'AI辅助写作', icon: '🤖', reason: '用AI提效，日更多篇', difficulty: '低', income: '低' },
    ],
    '设计': [
      { name: '海报/LOGO设计', icon: '🎨', reason: '500-3000元/单，闲鱼/淘宝接单', difficulty: '中', income: '中' },
      { name: '卖设计模板', icon: '📦', reason: '一次制作，多次销售', difficulty: '低', income: '中' },
      { name: '修图/精修', icon: '📷', reason: '每单30-200元，需求量大', difficulty: '低', income: '低' },
    ],
    '翻译': [
      { name: '文档翻译', icon: '📄', reason: '千字80-800元，专业领域溢价高', difficulty: '中', income: '中' },
      { name: '字幕翻译', icon: '🎬', reason: '视频时代需求大，千字50-200元', difficulty: '中', income: '低' },
      { name: 'AI辅助翻译', icon: '🤖', reason: '用AI提效，人工校对', difficulty: '低', income: '低' },
    ],
    '自媒体': [
      { name: '短视频创作', icon: '📹', reason: '月入100-10000元，需积累粉丝', difficulty: '高', income: '高' },
      { name: '公众号运营', icon: '📱', reason: '广告+带货，月入500-5000元', difficulty: '中', income: '中' },
      { name: '知识付费', icon: '📚', reason: '课程/社群，一次制作多次销售', difficulty: '中', income: '高' },
    ],
    '电商': [
      { name: '闲鱼卖货', icon: '🛒', reason: '零成本起步，月入200-10000元', difficulty: '低', income: '中' },
      { name: '拼多多无货源', icon: '📦', reason: '无需囤货，赚差价', difficulty: '低', income: '中' },
      { name: '直播带货', icon: '🎥', reason: '门槛低，需选品能力', difficulty: '中', income: '高' },
    ],
    '配音': [
      { name: '有声书配音', icon: '🎙️', reason: '千字30-300元，需求稳定', difficulty: '中', income: '中' },
      { name: '广告配音', icon: '📢', reason: '每条500-5000元，门槛较高', difficulty: '高', income: '高' },
      { name: 'AI语音合成', icon: '🤖', reason: '用AI生成语音，批量制作', difficulty: '低', income: '低' },
    ],
    '其他': [
      { name: '数据标注', icon: '🏷️', reason: '门槛最低，日赚50-200元', difficulty: '低', income: '低' },
      { name: 'AI辅助创业', icon: '🤖', reason: '用AI工具降低创业门槛', difficulty: '中', income: '中' },
      { name: '摆摊/夜市', icon: '🏪', reason: '零成本起步，日赚100-500元', difficulty: '低', income: '低' },
    ],
  };

  const recs = skillRecs[skill] || skillRecs['其他'];
  
  // Filter based on face preference
  const filtered = recs.filter(r => {
    if (face === '不愿意' && (r.icon === '📹' || r.icon === '🎥')) return false;
    return true;
  });
  
  // Filter based on time commitment
  const timeFilter = {
    '1小时': ['低'],
    '2-3小时': ['低', '中'],
    '4-5小时': ['低', '中', '高'],
    '5小时+': ['低', '中', '高'],
  };
  
  return filtered.filter(r => timeFilter[time]?.includes(r.difficulty)).slice(0, 3);
}

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  function handleAnswer(option) {
    const q = questions[step];
    const newAnswers = { ...answers, [q.id]: option };
    setAnswers(newAnswers);
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const recs = recommend(newAnswers, stats);
      setResult({ recs, answers: newAnswers });
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setResult(null);
  }

  // Find which side hustle topics are trending
  const trendingTopics = stats?.sideHustleTopics?.slice(0, 8) || [];
  const maxTopicCount = Math.max(...trendingTopics.map(t => t.count), 1);

  if (result) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
          <Head>
            <title>副业方向测试 - 副业侦探</title>
          </Head>
          
          <h1 className="text-3xl font-bold mb-2">🎯 推荐结果</h1>
          <p className="text-text-secondary mb-6">根据你的情况，推荐以下副业方向</p>
          
          {/* Summary */}
          <div className="mb-6 p-4 bg-bg-card border border-border rounded-2xl">
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">技能: {result.answers.skill}</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">时间: {result.answers.time}</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">期望: {result.answers.income}</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">露脸: {result.answers.face}</span>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4 mb-8">
            {result.recs.map((rec, i) => (
              <div key={i} className="p-5 bg-bg-card border border-border rounded-2xl">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{rec.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{rec.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        rec.difficulty === '高' ? 'bg-red-500/20 text-red-400' :
                        rec.difficulty === '中' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {rec.difficulty}难度
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        rec.income === '高' ? 'bg-blue-500/20 text-blue-400' :
                        rec.income === '中' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {rec.income}收益
                      </span>
                    </div>
                    <p className="text-text-secondary">{rec.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Data Insight */}
          {stats && trendingTopics.length > 0 && (
            <div className="mb-8 p-5 bg-bg-card border border-border rounded-2xl">
              <h3 className="font-semibold mb-3">📊 当前热门副业方向（基于真实数据）</h3>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-sm"
                    style={{
                      background: `rgba(59, 130, 246, ${0.1 + (topic.count / maxTopicCount) * 0.3})`,
                      color: '#93c5fd',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      fontSize: `${Math.max(12, 13 + topic.count * 0.3)}px`,
                    }}
                  >
                    {topic.name} <span className="text-xs opacity-60">×{topic.count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={reset}
            className="px-8 py-3 bg-primary text-white rounded-xl w-full font-semibold hover:bg-primary/90 transition"
          >
            重新测试
          </button>
        </div>
      </div>
    );
  }

  const q = questions[step];
  if (!q) return null;

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <Head>
          <title>副业方向测试 - 副业侦探</title>
        </Head>
        
        <h1 className="text-3xl font-bold mb-6">🎯 副业方向测试</h1>
        
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-text-secondary">第 {step + 1}/{questions.length} 题</span>
            <div className="flex-1 bg-border/20 rounded-full h-2">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">{q.label}</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {q.options.map(o => (
            <button
              key={o}
              onClick={() => handleAnswer(o)}
              className="p-4 border border-border rounded-xl hover:bg-bg-hover hover:border-primary/30 transition text-left"
            >
              <span className="text-lg">{o}</span>
            </button>
          ))}
        </div>

        {/* Trending Topics Preview */}
        {stats && trendingTopics.length > 0 && (
          <div className="mt-12 p-5 bg-bg-card border border-border rounded-2xl">
            <h3 className="font-semibold mb-3 text-sm">🔥 当前热门副业方向</h3>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.slice(0, 6).map((topic, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full text-xs"
                  style={{
                    background: `rgba(59, 130, 246, ${0.1 + (topic.count / maxTopicCount) * 0.2})`,
                    color: '#93c5fd',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  {topic.name} ×{topic.count}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
