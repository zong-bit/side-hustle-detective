import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadData() {
      const responses = await Promise.all([
        fetch('/api/posts').then(r => r.json()).catch(() => []),
      ]);
      setPosts(responses.flat());
    }
    loadData();
  }, []);

  const filtered = posts.filter(p => {
    if (search && !p.title?.includes(search) && !p.snippet?.includes(search)) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <Head><title>副业侦探</title></Head>
      <h1 style={{ fontSize: 28 }}>🕵️ 副业侦探</h1>
      <p style={{ color: '#666' }}>聚合贴吧/知乎/小红书的副业信息，帮你筛掉骗局</p>
      
      <input 
        placeholder="搜索副业关键词..." 
        value={search} 
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: 10, fontSize: 16, marginBottom: 20, borderRadius: 8, border: '1px solid #ddd' }}
      />
      
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <span style={{ padding: '4px 12px', background: '#e8f5e9', borderRadius: 12, fontSize: 14 }}>
          共 {posts.length} 条
        </span>
        <span style={{ padding: '4px 12px', background: '#fff3e0', borderRadius: 12, fontSize: 14 }}>
          ✅ 可信 {posts.filter(p => !p.is_scam).length}
        </span>
        <span style={{ padding: '4px 12px', background: '#ffebee', borderRadius: 12, fontSize: 14 }}>
          ⚠️ 需警惕 {posts.filter(p => p.is_scam).length}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((p, i) => (
          <div key={i} style={{
            padding: 16, borderRadius: 12, border: '1px solid #eee',
            background: p.is_scam ? '#fff5f5' : 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{
                fontSize: 12, padding: '2px 8px', borderRadius: 8,
                background: p.platform === 'tieba' ? '#e3f2fd' : '#f3e5f5',
                color: '#666'
              }}>
                {p.platform === 'tieba' ? '贴吧' : p.platform === 'zhihu' ? '知乎' : '小红书'}
              </span>
              {p.is_scam !== undefined && (
                <span style={{ fontSize: 12, color: p.is_scam ? '#d32f2f' : '#388e3c' }}>
                  {p.is_scam ? '⚠️ 需警惕' : '✅ 可信'}
                </span>
              )}
            </div>
            <a href={p.url} target="_blank" style={{ fontSize: 16, fontWeight: 500, color: '#1a73e8', textDecoration: 'none' }}>
              {p.title}
            </a>
            {p.snippet && <p style={{ fontSize: 14, color: '#555', marginTop: 8, lineHeight: 1.5 }}>{p.snippet.substring(0, 200)}</p>}
            <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
              {p.author} · {p.time || p.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
