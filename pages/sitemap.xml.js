import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://fuye-seo.vercel.app';

const CATEGORIES = ['online', 'offline', 'content', 'skill', 'social'];

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function getServerSideProps({ res }) {
  // Read all posts from data files
  const dataDir = path.join(process.cwd(), 'data');
  let urls = [];

  try {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
      const posts = JSON.parse(content);
      for (const p of posts) {
        if (p.url) {
          urls.push(escapeXml(p.url));
        }
      }
    }
  } catch (e) {}

  // Deduplicate
  urls = [...new Set(urls)];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${CATEGORIES.map(cat => `
  <url>
    <loc>${BASE_URL}/category/${cat}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${urls.map(u => `
  <url>
    <loc>${BASE_URL}/posts/${Buffer.from(encodeURIComponent(u)).toString('base64')}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.write(sitemap);
  res.end();
}

export default function Sitemap() {
  return null;
}
