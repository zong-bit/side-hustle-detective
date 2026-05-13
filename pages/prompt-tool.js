import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import promptsData from '../data/prompts.json';

const CATEGORIES = ['论文摘要类', '论文改写类', '论文分析类', '写作辅助类', '效率类'];

const CATEGORY_ICONS = {
  '论文摘要类': '📝',
  '论文改写类': '✍️',
  '论文分析类': '🔍',
  '写作辅助类': '📖',
  '效率类': '⚡',
};

const CATEGORY_COLORS = {
  '论文摘要类': { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  '论文改写类': { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  '论文分析类': { bg: '#fefce8', text: '#a16207', border: '#fde68a' },
  '写作辅助类': { bg: '#fdf2f8', text: '#be185d', border: '#fbcfe8' },
  '效率类': { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' },
};

export default function PromptTool() {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'compact'

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('prompt-favorites');
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (id) => {
    const next = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(next);
    try {
      localStorage.setItem('prompt-favorites', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const copyPrompt = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }).catch(() => {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  const filteredPrompts = useMemo(() => {
    let list = promptsData;
    if (activeCategory !== '全部') {
      list = list.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q) ||
        p.id.includes(q)
      );
    }
    return list;
  }, [activeCategory, searchQuery]);

  return (
    <>
      <Head>
        <title>50个科研AI Prompt｜科研效率工具 - 副业侦探</title>
        <meta name="description" content="50个即用型科研AI Prompt工具，覆盖论文摘要、改写、分析、写作辅助、效率五大类，一键复制即用。" />
        <link rel="canonical" href="https://side-hustle-detective.vercel.app/prompt-tool" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        {/* Hero Section */}
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-subtle) 0%, var(--bg) 100%)',
          borderBottom: `1px solid var(--border)`,
          padding: '48px 24px 32px',
        }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
              🎓 50个科研AI Prompt
            </h1>
            <p style={{ fontSize: 15, color: 'var(--fg-muted)', marginBottom: 20, lineHeight: 1.6 }}>
              覆盖论文全生命周期 · 一键复制 · 即用型提示词
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
                <strong style={{ color: 'var(--fg)', fontSize: 20 }}>50</strong> 个Prompt
              </div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
                <strong style={{ color: 'var(--fg)', fontSize: 20 }}>5</strong> 大分类
              </div>
              <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>
                <strong style={{ color: 'var(--fg)', fontSize: 20 }}>{favorites.length}</strong> 个收藏
              </div>
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 16 }}>
              {['全部', ...CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    fontSize: 13,
                    fontWeight: activeCategory === cat ? 600 : 400,
                    color: activeCategory === cat ? 'var(--accent)' : 'var(--fg-muted)',
                    background: activeCategory === cat ? 'var(--accent-subtle)' : 'transparent',
                    border: `1px solid ${activeCategory === cat ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {cat !== '全部' && <span>{CATEGORY_ICONS[cat]}</span>}
                  {cat}
                  {cat === '全部' && (
                    <span style={{ fontSize: 11, opacity: 0.6 }}>
                      ({filteredPrompts.length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search + View Toggle */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: 0.4 }}>
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="搜索Prompt标题或内容..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    fontSize: 14,
                    fontFamily: 'inherit',
                    color: 'var(--fg)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    outline: 'none',
                    boxShadow: 'var(--shadow-card)',
                    transition: 'box-shadow 0.2s ease',
                  }}
                  onFocus={e => e.target.style.boxShadow = '0 0 0 1px var(--accent)'}
                  onBlur={e => e.target.style.boxShadow = 'var(--shadow-card)'}
                />
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => setViewMode('card')}
                  style={{
                    padding: '6px 10px',
                    fontSize: 13,
                    background: viewMode === 'card' ? 'var(--accent-subtle)' : 'transparent',
                    border: `1px solid ${viewMode === 'card' ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 4,
                    cursor: 'pointer',
                    color: viewMode === 'card' ? 'var(--accent)' : 'var(--fg-muted)',
                    fontFamily: 'inherit',
                  }}
                  title="卡片视图"
                >
                  ☷
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  style={{
                    padding: '6px 10px',
                    fontSize: 13,
                    background: viewMode === 'compact' ? 'var(--accent-subtle)' : 'transparent',
                    border: `1px solid ${viewMode === 'compact' ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 4,
                    cursor: 'pointer',
                    color: viewMode === 'compact' ? 'var(--accent)' : 'var(--fg-muted)',
                    fontFamily: 'inherit',
                  }}
                  title="紧凑视图"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 24px 64px' }}>
          {filteredPrompts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--fg-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔎</div>
              <p style={{ fontSize: 15 }}>没有找到匹配的Prompt</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('全部'); }}
                style={{
                  marginTop: 12,
                  padding: '6px 16px',
                  fontSize: 13,
                  color: 'var(--accent)',
                  background: 'var(--accent-subtle)',
                  border: '1px solid var(--accent)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                清除筛选
              </button>
            </div>
          ) : viewMode === 'card' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredPrompts.map((p, idx) => (
                <PromptCard
                  key={p.id}
                  prompt={p}
                  isFavorite={favorites.includes(p.id)}
                  onToggleFavorite={() => toggleFavorite(p.id)}
                  onCopy={() => copyPrompt(p.id, p.prompt)}
                  copied={copiedId === p.id}
                  idx={idx}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filteredPrompts.map((p, idx) => (
                <PromptCompact
                  key={p.id}
                  prompt={p}
                  isFavorite={favorites.includes(p.id)}
                  onToggleFavorite={() => toggleFavorite(p.id)}
                  onCopy={() => copyPrompt(p.id, p.prompt)}
                  copied={copiedId === p.id}
                  idx={idx}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* --- Card View --- */
function PromptCard({ prompt, isFavorite, onToggleFavorite, onCopy, copied, idx }) {
  const colors = CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS['论文摘要类'];

  return (
    <div
      style={{
        padding: '20px 24px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        boxShadow: 'var(--shadow-card)',
        transition: 'box-shadow 0.2s ease',
        animation: `fadeIn 0.3s ease ${idx * 0.02}s both`,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: colors.text,
            background: colors.bg,
            padding: '2px 8px',
            borderRadius: 4,
            fontFamily: 'var(--font-mono)',
          }}>
            {prompt.id}
          </span>
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            color: colors.text,
            background: colors.bg,
            padding: '2px 8px',
            borderRadius: 4,
            border: `1px solid ${colors.border}`,
          }}>
            {CATEGORY_ICONS[prompt.category]} {prompt.category}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={onToggleFavorite}
            style={{
              padding: '4px 8px',
              fontSize: 14,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              opacity: isFavorite ? 1 : 0.4,
              transition: 'opacity 0.15s',
            }}
            title={isFavorite ? '取消收藏' : '收藏'}
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
          <button
            onClick={onCopy}
            style={{
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: 500,
              color: copied ? 'var(--success)' : 'var(--accent)',
              background: copied ? 'var(--success-subtle)' : 'var(--accent-subtle)',
              border: `1px solid ${copied ? 'var(--success-border)' : 'transparent'}`,
              borderRadius: 4,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
            title="复制Prompt"
          >
            {copied ? '✓ 已复制' : '📋 复制'}
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{prompt.title}</h3>

      {/* Usage hint */}
      {prompt.usage && (
        <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 10 }}>
          💡 {prompt.usage}
        </p>
      )}

      {/* Prompt text */}
      <div style={{
        fontSize: 13,
        lineHeight: 1.7,
        color: 'var(--fg)',
        background: 'var(--bg-subtle)',
        padding: '12px 16px',
        borderRadius: 6,
        border: '1px solid var(--border)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
      }}>
        {prompt.prompt}
      </div>
    </div>
  );
}

/* --- Compact View --- */
function PromptCompact({ prompt, isFavorite, onToggleFavorite, onCopy, copied, idx }) {
  const colors = CATEGORY_COLORS[prompt.category] || CATEGORY_COLORS['论文摘要类'];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        boxShadow: 'var(--shadow-card)',
        transition: 'box-shadow 0.15s ease',
        animation: `fadeIn 0.2s ease ${idx * 0.01}s both`,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-card)'}
    >
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: colors.text,
        background: colors.bg,
        padding: '2px 6px',
        borderRadius: 4,
        fontFamily: 'var(--font-mono)',
        whiteSpace: 'nowrap',
        minWidth: 30,
        textAlign: 'center',
      }}>
        {prompt.id}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>
          {prompt.title}
        </div>
        <div style={{
          fontSize: 12,
          color: 'var(--fg-muted)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {prompt.prompt.substring(0, 120)}...
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <button
          onClick={onToggleFavorite}
          style={{
            padding: '4px 6px',
            fontSize: 13,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            opacity: isFavorite ? 1 : 0.3,
          }}
          title={isFavorite ? '取消收藏' : '收藏'}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
        <button
          onClick={onCopy}
          style={{
            padding: '4px 8px',
            fontSize: 11,
            fontWeight: 500,
            color: copied ? 'var(--success)' : 'var(--accent)',
            background: copied ? 'var(--success-subtle)' : 'var(--accent-subtle)',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
          title="复制Prompt"
        >
          {copied ? '✓' : '📋'}
        </button>
      </div>
    </div>
  );
}
