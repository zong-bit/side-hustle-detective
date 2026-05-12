import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://side-hustle-detective.vercel.app';

const CATEGORIES = ['online', 'offline', 'content', 'skill', 'social'];

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function slugify(filename) {
  return filename
    .replace(/\.md$/, '')
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

export async function getServerSideProps({ res }) {
  // Read all posts from data files
  const dataDir = path.join(process.cwd(), 'data');
  let postUrls = [];

  try {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
      const posts = JSON.parse(content);
      for (const p of posts) {
        if (p.url) {
          postUrls.push(escapeXml(p.url));
        }
      }
    }
  } catch (e) {}

  // Deduplicate
  postUrls = [...new Set(postUrls)];

  // Read blog posts from content/blog/
  const blogDir = path.join(process.cwd(), 'content/blog');
  let blogUrls = [];
  try {
    const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
    for (const file of blogFiles) {
      const filePath = path.join(blogDir, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      // Try to extract date from front matter for lastmod
      let lastmod = null;
      const dateMatch = raw.match(/^date:\s*['"]?([\d-]+)/m);
      if (dateMatch) lastmod = dateMatch[1];
      if (!lastmod) {
        const fileDateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
        if (fileDateMatch) lastmod = fileDateMatch[1];
      }
      const slug = slugify(file);
      blogUrls.push({
        loc: escapeXml(`${BASE_URL}/blog/${slug}`),
        lastmod: lastmod || '2026-05-11',
      });
    }
  } catch (e) {}

  const currentDate = '2026-05-12';
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${BASE_URL}/</loc>
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${BASE_URL}/" />
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${currentDate}</lastmod>
  </url>
  <url>
    <loc>${BASE_URL}/blog</loc>
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${BASE_URL}/blog" />
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <lastmod>${currentDate}</lastmod>
  </url>
  <url>
    <loc>${BASE_URL}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${BASE_URL}/privacy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${BASE_URL}/features</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  ${CATEGORIES.map(cat => `
  <url>
    <loc>${BASE_URL}/category/${cat}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${postUrls.map(u => `
  <url>
    <loc>${BASE_URL}/posts/${Buffer.from(encodeURIComponent(u)).toString('base64')}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  ${blogUrls.map(b => `
  <url>
    <loc>${b.loc}</loc>
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${b.loc}" />
    <lastmod>${b.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.write(sitemap);
  res.end();
}

export default function Sitemap() {
  return null;
}
