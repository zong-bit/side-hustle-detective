import { useState } from 'react';
import Head from 'next/head';

export default function Converter() {
  const [rate, setRate] = useState(50);
  const daily = rate * 8;
  const monthly = daily * 22;
  const yearly = monthly * 12;
  return (
    <div className="min-h-screen bg-bg"><div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">💰 收入换算器</h1>
      <p className="text-text-secondary mb-6">时薪 → 日薪/月薪/年薪</p>
      <div className="mb-8">
        <label className="block mb-2">时薪: ¥{rate}/h</label>
        <input type="range" min={15} max={500} step={5} value={rate} onChange={e=>setRate(+e.target.value)} className="w-full" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-6 bg-bg-card border border-border rounded-2xl text-center">
          <p className="text-sm text-text-secondary">日薪 (8h)</p>
          <p className="text-2xl font-bold">¥{daily.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-bg-card border border-border rounded-2xl text-center">
          <p className="text-sm text-text-secondary">月薪 (22天)</p>
          <p className="text-2xl font-bold">¥{monthly.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-bg-card border border-border rounded-2xl text-center">
          <p className="text-sm text-text-secondary">年薪 (12月)</p>
          <p className="text-2xl font-bold">¥{yearly.toLocaleString()}</p>
        </div>
      </div>
    </div></div>
  );
}
