import { useState } from 'react';
import Head from 'next/head';

export default function Report() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ title: '', desc: '', platform: '', url: '' });

  function submit() {
    if (!form.title.trim() || !form.desc.trim()) {
      alert('请填写骗局名称和描述');
      return;
    }
    const reports = JSON.parse(localStorage.getItem('scam_reports') || '[]');
    reports.push({ ...form, date: new Date().toISOString(), id: Date.now() });
    localStorage.setItem('scam_reports', JSON.stringify(reports));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg"><div className="max-w-xl mx-auto p-8 text-center">
        <Head>
          <title>举报成功 - 副业侦探</title>
        </Head>
        <div className="text-6xl mb-4">🙏</div>
        <h1 className="text-2xl font-bold mb-4">感谢举报！</h1>
        <p className="text-text-secondary">我们会审核你的信息，帮助更多人避开骗局。</p>
        <a href="/" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-xl">返回首页</a>
      </div></div>
    );
  }

  return (
    <div className="min-h-screen bg-bg"><div className="max-w-xl mx-auto p-8">
      <Head>
        <title>举报骗局 - 副业侦探</title>
      </Head>
      <h1 className="text-2xl font-bold mb-2">⚠️ 举报骗局</h1>
      <p className="text-text-secondary mb-6">遇到副业骗局？告诉我们，帮更多人避坑</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">骗局名称</label>
          <input className="w-full p-3 border border-border rounded-xl bg-bg" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="例如：XX平台刷单骗局" />
        </div>
        <div>
          <label className="block text-sm mb-1">骗局描述</label>
          <textarea className="w-full p-3 border border-border rounded-xl bg-bg h-24" value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} placeholder="描述骗局的套路和手法" />
        </div>
        <div>
          <label className="block text-sm mb-1">涉及平台</label>
          <input className="w-full p-3 border border-border rounded-xl bg-bg" value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})} placeholder="闲鱼/猪八戒/微信等" />
        </div>
        <div>
          <label className="block text-sm mb-1">相关链接（可选）</label>
          <input className="w-full p-3 border border-border rounded-xl bg-bg" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://..." />
        </div>
        <button onClick={submit} className="w-full px-6 py-3 bg-primary text-white rounded-xl">提交举报</button>
      </div>
    </div></div>
  );
}
