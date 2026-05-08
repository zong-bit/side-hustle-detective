import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const dataDir = path.join(process.cwd(), 'data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  let allPosts = [];
  
  // Scam patterns
  const scamRules = [
    { keywords: ['交钱', '押金', '会费', '培训费', '保证金', '入职费'], label: '要求先交钱' },
    { keywords: ['刷单', '刷信誉', '刷流水'], label: '刷单骗局' },
    { keywords: ['日入', '日赚', '月入过万', '月入数万', '躺着赚钱'], label: '夸大收益' },
    { keywords: ['拉人头', '发展下线', '层级', '团队计酬'], label: '疑似传销' },
    { keywords: ['稳赚不赔', '包赚', '零风险', '100%赚钱'], label: '虚假承诺' },
    { keywords: ['虚拟货币', '炒币', '合约', '带单'], label: '高风险投资' },
    { keywords: ['打字员', '录入员', '挂机', '点赞赚钱'], label: '经典骗局' },
  ];

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
      const posts = JSON.parse(content);
      const platform = file.includes('tieba') ? 'tieba' : 
                       file.includes('zhihu') ? 'zhihu' : 
                       file.includes('xiaohongshu') ? 'xiaohongshu' : 'other';
      
      for (const p of posts) {
        const text = (p.title + ' ' + (p.snippet || p.content || '')).toLowerCase();
        const warnings = [];
        
        for (const rule of scamRules) {
          if (rule.keywords.some(k => text.includes(k))) {
            warnings.push(rule.label);
          }
        }
        
        // Trust score: start at 80, deduct for each warning
        const trustScore = Math.max(10, 80 - warnings.length * 20);
        
        allPosts.push({
          title: p.title,
          snippet: p.snippet || p.content,
          url: p.url,
          platform,
          author: p.author,
          time: p.time || p.date,
          forum: p.forum,
          warnings,
          trust_score: trustScore,
          is_scam: warnings.length > 0,
        });
      }
    } catch (e) {}
  }
  
  allPosts.sort((a, b) => (b.time || '').localeCompare(a.time || ''));
  res.status(200).json(allPosts);
}
