import { useState } from 'react';

export default function Purchase() {
  const [showDownload, setShowDownload] = useState(false);

  return (
    <div className="min-h-screen bg-bg"><div className="max-w-xl mx-auto p-8">
      <a href="/" className="text-sm text-primary mb-4 inline-block">← 返回首页</a>
      <h1 className="text-3xl font-bold mb-2">📝 50个科研AI Prompt合集</h1>
      <p className="text-text-secondary mb-6">论文摘要·改写润色·深度分析·论文写作·效率提升</p>
      
      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-primary mb-2">¥19.9</div>
        <p className="text-sm text-text-secondary">一次性购买，永久使用</p>
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl text-sm">✅ 即买即用，无需配置</div>
        <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl text-sm">✅ 适配ChatGPT/DeepSeek/Claude</div>
        <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-xl text-sm">✅ 50个Prompt覆盖全部科研场景</div>
      </div>

      {!showDownload ? (
        <>
          <a href="https://ifdian.net/item/566dd4464d3111f1bd1352540025c377" target="_blank"
             className="block text-center w-full px-6 py-4 bg-primary text-white rounded-xl text-lg font-bold mb-4"
             rel="noopener noreferrer">
            💳 去爱发电支付 ¥19.9
          </a>
          <div className="text-center">
            <p className="text-xs text-text-secondary mb-3">或支付后直接下载</p>
            <button onClick={() => setShowDownload(true)}
              className="px-6 py-2 text-sm text-primary border border-primary rounded-xl hover:bg-primary/10 transition">
              我已支付，直接下载
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-lg font-medium mb-2">感谢购买！</p>
          <p className="text-sm text-text-secondary mb-4">点击下方按钮下载文件</p>
          <a href="/prompts/科研Prompt合集.md" download
             className="inline-block px-8 py-4 bg-primary text-white rounded-xl text-lg font-bold mb-4">
            📥 下载文件
          </a>
          <p className="text-xs text-text-secondary">购买后永久可用，支持所有主流AI工具</p>
        </div>
      )}
    </div></div>
  );
}
