/**
 * Generate static sitemap.xml at public/sitemap.xml
 * Run: node scripts/generate-sitemap.js
 */
const fs = require('fs');
const path = require('path');

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

// Collect all URLs
const urls = [];

// 1. Static pages
urls.push({ loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0', lastmod: new Date().toISOString().slice(0, 10) });
urls.push({ loc: `${BASE_URL}/about`, changefreq: 'monthly', priority: '0.5' });
urls.push({ loc: `${BASE_URL}/privacy`, changefreq: 'monthly', priority: '0.3' });
urls.push({ loc: `${BASE_URL}/blog`, changefreq: 'daily', priority: '0.9' });
urls.push({ loc: `${BASE_URL}/features`, changefreq: 'weekly', priority: '0.6' });
urls.push({ loc: `${BASE_URL}/quiz`, changefreq: 'monthly', priority: '0.5' });
urls.push({ loc: `${BASE_URL}/calculator`, changefreq: 'monthly', priority: '0.5' });
urls.push({ loc: `${BASE_URL}/scam-check`, changefreq: 'monthly', priority: '0.5' });
urls.push({ loc: `${BASE_URL}/purchase`, changefreq: 'monthly', priority: '0.5' });
urls.push({ loc: `${BASE_URL}/download`, changefreq: 'monthly', priority: '0.4' });
urls.push({ loc: `${BASE_URL}/report`, changefreq: 'monthly', priority: '0.4' });
urls.push({ loc: `${BASE_URL}/converter`, changefreq: 'monthly', priority: '0.4' });

// 2. Category pages
CATEGORIES.forEach(cat => {
  urls.push({ loc: `${BASE_URL}/category/${cat}`, changefreq: 'weekly', priority: '0.8' });
});

// 3. Blog posts from content/blog/
const blogDir = path.join(__dirname, '..', 'content/blog');
try {
  const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  blogFiles.forEach(file => {
    const filePath = path.join(blogDir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');

    // Extract date from front matter or filename
    let lastmod = null;
    const dateMatch = raw.match(/^date:\s*['"]?([\d-]+)/m);
    if (dateMatch) lastmod = dateMatch[1];
    if (!lastmod) {
      const fileDateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
      if (fileDateMatch) lastmod = fileDateMatch[1];
    }

    const slug = slugify(file);
    urls.push({
      loc: `${BASE_URL}/blog/${slug}`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: lastmod || '',
    });
  });
} catch (e) {
  console.error('Error reading blog posts:', e.message);
}

// console.log(`   Blog articles: ${blogFiles ? blogFiles.length : 0}`);

// 4. Data posts from data/ directory
const dataDir = path.join(__dirname, '..', 'data');
try {
  const dataFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  const handledUrls = new Set();
  dataFiles.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
      const posts = JSON.parse(content);
      const items = Array.isArray(posts) ? posts : (posts.posts || []);
      items.forEach(p => {
        if (p.url && !handledUrls.has(p.url)) {
          handledUrls.add(p.url);
          urls.push({
            loc: `${BASE_URL}/posts/${Buffer.from(encodeURIComponent(p.url)).toString('base64')}`,
            changefreq: 'weekly',
            priority: '0.6',
          });
        }
      });
    } catch (e) {
      // Skip problematic files (e.g. archive/history files)
    }
  });
} catch (e) {
  console.error('Error reading data directory:', e.message);
}

// Build XML
const urlElements = urls.map(u => {
  let xml = '  <url>\n';
  xml += `    <loc>${escapeXml(u.loc)}</loc>\n`;
  if (u.lastmod) xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
  if (u.changefreq) xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
  if (u.priority) xml += `    <priority>${u.priority}</priority>\n`;
  xml += '  </url>';
  return xml;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

// Note: The actual sitemap is served dynamically via pages/sitemap.xml.js
// This script is for verification / offline audit purposes only.
const outPath = path.join(__dirname, '..', 'sitemap-audit.xml');
fs.writeFileSync(outPath, sitemap, 'utf-8');
console.log(`✅ sitemap audit generated with ${urls.length} URLs`);
console.log(`   Output: ${outPath}`);
