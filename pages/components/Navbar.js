import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setToolsOpen(false);
      }
    }
    if (toolsOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [toolsOpen]);

  return (
    <nav
      ref={dropdownRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🕵️</span>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--fg)' }}>副业侦探</span>
        </Link>

        {/* Nav items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: 56 }}>
          {/* 首页 */}
          <Link href="/" style={navLinkStyle}>
            首页
          </Link>

          {/* 分类 */}
          <Link href="/category/online" style={navLinkStyle}>
            分类
          </Link>

          {/* 工具 Dropdown */}
          <div style={{ position: 'relative', height: 56 }}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              onMouseEnter={() => setToolsOpen(true)}
              style={{
                ...navLinkStyle,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                paddingRight: 8,
              }}
            >
              工具
              <span style={{
                fontSize: 10,
                transition: 'transform 0.2s',
                transform: toolsOpen ? 'rotate(180deg)' : 'rotate(0)',
                display: 'inline-block',
              }}>
                ▾
              </span>
            </button>

            {toolsOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#fff',
                border: '1px solid var(--border)',
                borderRadius: 8,
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                padding: '6px 0',
                minWidth: 180,
                zIndex: 200,
              }}>
                {[
                  { href: '/quiz', label: '🎯 副业匹配', desc: 'AI 推荐最适合你的副业' },
                  { href: '/calculator', label: '💰 收入计算', desc: '估算你的副业收入' },
                  { href: '/scam-check', label: '🛡️ 骗局检测', desc: '检测副业链接是否安全' },
                  { href: '/converter', label: '📊 收入换算', desc: '时薪自动换算日/月/年薪' },
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseLeave={() => setToolsOpen(false)}
                    style={{
                      display: 'block',
                      padding: '8px 16px',
                      fontSize: 13,
                      color: 'var(--fg)',
                      textDecoration: 'none',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{item.desc}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 博客 */}
          <Link href="/blog" style={navLinkStyle}>
            博客
          </Link>

          {/* 关于 */}
          <Link href="/about" style={navLinkStyle}>
            关于
          </Link>

          {/* 购买 - 数字产品入口 */}
          <Link href="/purchase" style={{
            ...navLinkStyle,
            color: 'var(--accent)',
            fontWeight: 600,
          }}>
            🛒 购买
          </Link>
        </div>
      </div>
    </nav>
  );
}

const navLinkStyle = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--fg-muted)',
  textDecoration: 'none',
  padding: '0 12px',
  height: 56,
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.15s',
  whiteSpace: 'nowrap',
};
