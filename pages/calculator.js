import { useState } from 'react';
import Head from 'next/head';

const RATES = {编程:[50,100,200],写作:[20,50,100],设计:[30,60,120],翻译:[25,50,80],其他:[15,30,60]};

export default function Calculator() {
  const [skill, setSkill] = useState('编程');
  const [hours, setHours] = useState(10);
  const [level, setLevel] = useState(1);
  
  const rate = RATES[skill][level];
  const monthly = rate * hours * 4;

  return (
    <div className="min-h-screen bg-bg"><div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">💰 副业收入计算器</h1>
      <div className="space-y-6">
        <div><label className="block mb-2">技能</label>
          <select value={skill} onChange={e=>setSkill(e.target.value)} className="w-full p-3 border border-border rounded-xl bg-bg">
            {Object.keys(RATES).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div><label className="block mb-2">每周投入：{hours}h</label>
          <input type="range" min={5} max={40} step={5} value={hours} onChange={e=>setHours(+e.target.value)} className="w-full" />
        </div>
        <div><label className="block mb-2">经验水平</label>
          <select value={level} onChange={e=>setLevel(+e.target.value)} className="w-full p-3 border border-border rounded-xl bg-bg">
            <option value={0}>新手</option><option value={1}>有经验</option><option value={2}>专家</option>
          </select>
        </div>
        <div className="p-6 bg-primary/10 rounded-2xl text-center">
          <p className="text-text-secondary">预估月收入</p>
          <p className="text-4xl font-bold text-primary">¥{monthly.toLocaleString()}</p>
          <p className="text-sm text-text-secondary">{rate}元/h × {hours}h/周 × 4周</p>
        </div>
      </div>
    </div></div>
  );
}
