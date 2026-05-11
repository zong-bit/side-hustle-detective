// Daily recommendation API — picks a random post from all data files
import fs from 'fs';
import path from 'path';

// Data files to include in random selection
const DATA_FILES = [
  'tieba_fuye.json',
  'bilibili_fuye_v2.json',
  'zhihu_fuye_v2.json',
  'xiaohongshu_fuye_v2.json',
  'hupu_fuye_v2.json',
  'scam_warnings.json',
];

function loadAllPosts() {
  const baseDir = path.join(process.cwd(), 'data');
  const allPosts = [];

  for (const file of DATA_FILES) {
    const filePath = path.join(baseDir, file);
    if (!fs.existsSync(filePath)) continue;
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (Array.isArray(data)) {
        for (const item of data) {
          allPosts.push(item);
        }
      }
    } catch {
      // skip corrupt files
    }
  }

  return allPosts;
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const allPosts = loadAllPosts();
  if (allPosts.length === 0) {
    return res.status(500).json({ error: 'No data available' });
  }

  // Seeded random for consistency per request
  const randomIndex = Math.floor(Math.random() * allPosts.length);
  const post = allPosts[randomIndex];

  // Determine platform from the file it came from
  let platform = 'unknown';
  const fileName = DATA_FILES[randomIndex];
  if (fileName.includes('tieba')) platform = 'tieba';
  else if (fileName.includes('bilibili')) platform = 'bilibili';
  else if (fileName.includes('zhihu')) platform = 'zhihu';
  else if (fileName.includes('xiaohongshu')) platform = 'xiaohongshu';
  else if (fileName.includes('hupu')) platform = 'hupu';
  else if (fileName.includes('scam')) platform = 'warning';

  res.status(200).json({
    ...post,
    platform,
    _source: fileName,
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
