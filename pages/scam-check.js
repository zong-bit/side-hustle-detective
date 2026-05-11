import { useState } from 'react';
import Head from 'next/head';

const RED_FLAGS = ['先交钱','保证金','押金','培训费','入会费','会员费','拉人头','发展下线','提成','日赚','月入过万','稳赚','包赚钱','零风险','高回报','躺赚'];

export default function ScamCheck() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  function check() {
    const flags = RED_FLAGS.filter(f => text.includes(f));
    const score = flags.length / RED_FLAGS.length;
    if (score > 0.3) setResult({ level: 'danger', msg: '⚠️ 很可能是骗局，建议远离', flags });
    else if (score > 0.1) setResult({ level: 'warning', msg: '⚡ 存在可疑特征，建议进一步核实', flags });
    else setResult({ level: 'safe', msg: '✅ 暂未发现明显骗局特征，但仍需谨慎', flags });
  }
  return (
    <div className="min-h-screen bg-bg"><div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">🔍 副业骗局检测器</h1>
      <p className="text-text-secondary mb-6">输入副业描述，自动检测骗局特征</p>
      <textarea value={text} onChange={e=>setText(e.target.value)}
        className="w-full h-32 p-4 border border-border rounded-xl bg-bg mb-4" placeholder="粘贴副业描述..." />
      <button onClick={check} className="px-6 py-3 bg-primary text-white rounded-xl w-full">检测</button>
      {result && (
        <div className={`mt-6 p-6 rounded-2xl ${result.level === 'danger' ? 'bg-red-500/10 border border-red-500/30' : result.level === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-green-500/10 border border-green-500/30'}`}>
          <p className="text-lg font-semibold">{result.msg}</p>
          {result.flags.length > 0 && (
            <div className="mt-3"><p className="text-sm text-text-secondary">检测到：</p>
              <div className="flex flex-wrap gap-2 mt-2">{result.flags.map(f => <span key={f} className="px-2 py-1 bg-red-500/20 text-red-500 text-sm rounded">{f}</span>)}</div>
            </div>)}
        </div>
      )}
    </div></div>
  );
}
