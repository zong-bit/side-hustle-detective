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

  // Low quality / clickbait patterns
  const lowQualityRules = [
    '明星', '偶像', '粉丝', '娱乐圈', '八卦',
    '谈恋爱', '找对象', '找老婆', '找老公', '结婚',
    '游戏', '电竞', '玩梦幻', '码字',
  ];

  // Side hustle type patterns
  const typeRules = [
    { type: 'online', keywords: ['远程', '线上', '网络', '在家', '居家', '兼职', '副业'], icon: '💻', label: '线上兼职' },
    { type: 'offline', keywords: ['开店', '摆摊', '实体', '加盟', '店铺', '创业', '投资'], icon: '🏪', label: '实体创业' },
    { type: 'content', keywords: ['写作', '视频', '自媒体', '内容', '创作', '文案', '剪辑', '小说', '拍'], icon: '📝', label: '内容创作' },
    { type: 'skill', keywords: ['家教', '翻译', '设计', '编程', '修图', 'ps', '技能', '代做', '外包'], icon: '🎓', label: '技能服务' },
    { type: 'social', keywords: ['微商', '分销', '带货', '代理', '社交电商', '推广', '裂变'], icon: '🤝', label: '社交电商' },
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
        
        // Check if low quality (clickbait or irrelevant)
        const isLowQuality = lowQualityRules.some(k => text.includes(k));
        
        // Detect side hustle type
        let detectedType = 'other';
        for (const rule of typeRules) {
          if (rule.keywords.some(k => text.includes(k))) {
            detectedType = rule.type;
            break;
          }
        }
        
        // Trust score: start at 80, deduct for warnings or low quality
        const trustScore = Math.max(10, 80 - warnings.length * 20 - (isLowQuality ? 30 : 0));
        
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
          is_low_quality: isLowQuality && warnings.length === 0,
          type: detectedType,
        });
      }
    } catch (e) {}
  }
  
  // Sort: scam first, then by date
  allPosts.sort((a, b) => {
    if (a.is_scam !== b.is_scam) return a.is_scam ? -1 : 1;
    return (b.time || '').localeCompare(a.time || '');
  });
  
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
  res.status(200).json(allPosts);
}
