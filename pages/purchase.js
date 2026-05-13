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

      {/* 产品预览 */}
      <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-sm font-medium text-gray-600 mb-3">📋 部分Prompt预览</div>
        <div className="space-y-2 text-xs text-gray-500 font-mono">
          <div className="p-2 bg-white rounded border">🔬 <strong>论文摘要生成：</strong>"请作为学术研究员，对以下论文生成结构化摘要..."</div>
          <div className="p-2 bg-white rounded border">🔄 <strong>改写润色：</strong>"请帮我改写以下段落，保持原意但提升学术表达..."</div>
          <div className="p-2 bg-white rounded border">📄 <strong>论文结构规划：</strong>"请为以下研究主题设计论文大纲..."</div>
        </div>
        <div className="text-xs text-gray-400 mt-2">购买后可获取全部50个Prompt 🎁</div>
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

      {/* 售后支持 */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center text-sm text-text-secondary">
          <div className="font-medium mb-2">📧 售后支持</div>
          <div>使用中遇到问题？联系 <a href="mailto:zxw@example.com" className="text-primary hover:underline">zxw@example.com</a></div>
          <div className="mt-1 text-xs">或访问 <a href="https://github.com/zxw/prompt-collection/issues" target="_blank" rel="noopener" className="text-primary hover:underline">GitHub Issues</a></div>
        </div>
      </div>
    </div></div>
  );
}
