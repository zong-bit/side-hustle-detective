import { useState } from 'react';
import Head from 'next/head';

export default function Download() {
  const [orderId, setOrderId] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  function verify() {
    if (orderId.length > 5) {
      setVerified(true);
      setError('');
    } else {
      setError('请输入有效订单号');
    }
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-bg"><div className="max-w-xl mx-auto p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-4">下载成功！</h1>
        <p className="text-text-secondary mb-6">你的50个科研AI Prompt合集</p>
        <a href="/prompts/科研Prompt合集.md" 
           className="inline-block px-8 py-4 bg-primary text-white rounded-xl text-lg font-bold"
           download>📥 下载文件</a>
        <p className="text-xs text-text-secondary mt-4">购买后永久可用，支持所有主流AI工具</p>
      </div></div>
    );
  }

  return (
    <div className="min-h-screen bg-bg"><div className="max-w-xl mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">📥 订单验证</h1>
      <p className="text-text-secondary mb-6">输入你在爱发电的订单号即可下载</p>
      <input value={orderId} onChange={e=>setOrderId(e.target.value)}
        className="w-full p-3 border border-border rounded-xl bg-bg mb-4 text-center"
        placeholder="粘贴爱发电订单号" />
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button onClick={verify} className="w-full px-6 py-3 bg-primary text-white rounded-xl">验证并下载</button>
      <p className="text-xs text-text-secondary mt-4">在爱发电支付成功后，订单号会显示在支付成功页面</p>
    </div></div>
  );
}
