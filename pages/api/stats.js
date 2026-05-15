import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const dataDir = path.join(process.cwd(), 'data', 'data_cleaned');
  
  // Load all data files
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
  let allPosts = [];
  let scamWarnings = [];
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
      const data = JSON.parse(content);
      const arr = Array.isArray(data) ? data : [data];
      
      if (file.includes('scam')) {
        scamWarnings = arr;
      } else {
        const platform = file.includes('tieba') ? 'tieba' :
                         file.includes('zhihu') ? 'zhihu' :
                         file.includes('xiaohongshu') ? 'xiaohongshu' :
                         file.includes('bilibili') ? 'bilibili' :
                         file.includes('hupu') ? 'hupu' : 'other';
        for (const p of arr) {
          allPosts.push({ ...p, platform });
        }
      }
    } catch (e) {}
  }

  // === Scam Analysis ===
  const scamCategories = analyzeScamCategories(scamWarnings);
  const scamTrend = analyzeScamTrend(scamWarnings);
  const scamKeywords = extractScamKeywords(scamWarnings);

  // === Platform Stats ===
  const platformStats = {};
  allPosts.forEach(p => {
    if (!platformStats[p.platform]) {
      platformStats[p.platform] = { count: 0, labels: {}, views: 0 };
    }
    platformStats[p.platform].count++;
    // Count keywords for type classification
    const text = (p.title + ' ' + (p.snippet || '')).toLowerCase();
    for (const [key, words] of Object.entries(PLATFORM_TYPES)) {
      if (words.some(w => text.includes(w))) {
        platformStats[p.platform].labels[key] = (platformStats[p.platform].labels[key] || 0) + 1;
      }
    }
  });

  // === Income Data Extraction ===
  const incomeRanges = extractIncomeRanges(allPosts);
  const incomeByType = extractIncomeByType(allPosts);

  // === Content Type Distribution ===
  const contentTypeStats = {};
  allPosts.forEach(p => {
    const type = p.type || 'other';
    contentTypeStats[type] = (contentTypeStats[type] || 0) + 1;
  });

  // === Platform Breakdown ===
  const platformBreakdown = {};
  allPosts.forEach(p => {
    if (!platformBreakdown[p.platform]) {
      platformBreakdown[p.platform] = { count: 0, types: {} };
    }
    platformBreakdown[p.platform].count++;
    const text = (p.title + ' ' + (p.snippet || '')).toLowerCase();
    for (const [key, words] of Object.entries(PLATFORM_TYPES)) {
      if (words.some(w => text.includes(w))) {
        platformBreakdown[p.platform].types[key] = (platformBreakdown[p.platform].types[key] || 0) + 1;
      }
    }
  });

  // === Most Discussed Side Hustles ===
  const sideHustleTopics = extractSideHustleTopics(allPosts);

  // === Recent Activity ===
  const recentPosts = allPosts
    .filter(p => p.time)
    .sort((a, b) => (b.time || '').localeCompare(a.time || ''))
    .slice(0, 20);

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
  res.status(200).json({
    overview: {
      totalPosts: allPosts.length,
      totalScamWarnings: scamWarnings.length,
      platforms: Object.keys(platformBreakdown),
      platformNames: {
        bilibili: 'B站',
        hupu: '虎扑',
        xiaohongshu: '小红书',
        tieba: '贴吧',
        zhihu: '知乎',
      },
    },
    scamAnalysis: {
      categories: scamCategories,
      trend: scamTrend,
      keywords: scamKeywords,
      warnings: scamWarnings.slice(0, 12),
    },
    incomeData: {
      ranges: incomeRanges,
      byType: incomeByType,
    },
    platformStats: platformBreakdown,
    contentTypeStats,
    sideHustleTopics: sideHustleTopics.slice(0, 20),
    recentPosts,
  });
}

// Side hustle topic keywords for extraction
const TOPIC_KEYWORDS = {
  'AI写作': ['AI写作', 'ai写作', 'ai代写', 'chatgpt'],
  '短视频': ['短视频', '抖音', '快手', '视频号'],
  '自媒体': ['自媒体', '公众号', '小红书', '知乎'],
  '设计接单': ['设计', 'PS', '修图', '海报', 'UI'],
  '编程接单': ['编程', '开发', '外包', '接私活', '代码'],
  '翻译': ['翻译', '翻译兼职', '外语'],
  '写作': ['写作', '投稿', '稿费', '网文', '小说'],
  '摆摊': ['摆摊', '夜市', '地摊'],
  '电商': ['电商', '淘宝', '拼多多', '闲鱼', '带货'],
  '家教': ['家教', '辅导', '补课'],
  '配音': ['配音', '语音', '声音'],
  '数据标注': ['数据标注', '标注员'],
  '摄影': ['摄影', '拍照', '写真'],
  '宠物': ['宠物', '遛狗', '宠物寄养'],
  '理财': ['理财', '基金', '股票', '投资'],
  '知识付费': ['知识付费', '课程', '网课'],
  '直播': ['直播', '带货直播', '主播'],
  '手工': ['手工', 'DIY', '手作'],
  '跑腿': ['跑腿', '代取', '外卖'],
  '游戏': ['游戏', '代练', '电竞'],
};

function extractSideHustleTopics(posts) {
  const counts = {};
  posts.forEach(p => {
    const text = (p.title + ' ' + (p.snippet || '')).toLowerCase();
    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
      if (keywords.some(k => text.includes(k))) {
        counts[topic] = (counts[topic] || 0) + 1;
      }
    }
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

function extractScamKeywords(warnings) {
  const allText = warnings.map(w => (w.title + ' ' + (w.snippet || '')).toLowerCase()).join(' ');
  const scamKeywords = [
    { name: '刷单返利', keywords: ['刷单', '返利', '押金', '佣金'], icon: '🔄' },
    { name: '培训费骗局', keywords: ['培训费', '学费', '课程', '8800', '15800'], icon: '📚' },
    { name: '代理费骗局', keywords: ['代理费', '3980', '成为代理', '加盟费'], icon: '🤝' },
    { name: '打字员骗局', keywords: ['打字员', '录入员', '日赚200'], icon: '⌨️' },
    { name: '语音厅骗局', keywords: ['语音厅', '语音主播', '月入过万'], icon: '🎙️' },
    { name: '光伏骗局', keywords: ['光伏', '屋顶', '太阳能'], icon: '☀️' },
    { name: '考证骗局', keywords: ['考证', '无人机', '考证培训'], icon: '📜' },
    { name: '挂机赚钱', keywords: ['挂机', '搬砖', '闲置手机'], icon: '📱' },
    { name: '招聘骗局', keywords: ['招聘', '保安', '体检费', '服装费'], icon: '👔' },
    { name: 'AI赚钱套路', keywords: ['AI赚钱', 'AI套路', '卖课', '割韭菜'], icon: '🤖' },
  ];
  return scamKeywords.map(sk => ({
    ...sk,
    matchCount: sk.keywords.filter(k => allText.includes(k)).length,
  }));
}

function analyzeScamCategories(warnings) {
  const categories = {};
  const allText = warnings.map(w => (w.title + ' ' + (w.snippet || '')).toLowerCase()).join(' ');
  
  // Categorize by primary scam type
  const catMap = [
    { name: '刷单返利', keywords: ['刷单', '返利'] },
    { name: '培训费割韭菜', keywords: ['培训费', '学费', '8800', '15800'] },
    { name: '代理费骗局', keywords: ['代理费', '3980', '代理'] },
    { name: '虚假兼职', keywords: ['打字员', '录入员', '挂机', '兼职骗局'] },
    { name: '语音厅骗局', keywords: ['语音厅', '语音主播'] },
    { name: '光伏骗局', keywords: ['光伏', '屋顶'] },
    { name: '考证骗局', keywords: ['考证', '无人机'] },
    { name: '招聘骗局', keywords: ['招聘', '保安'] },
    { name: 'AI赚钱套路', keywords: ['AI赚钱', 'AI套路'] },
    { name: '其他骗局', keywords: [] },
  ];
  
  catMap.forEach(cat => {
    if (cat.keywords.length === 0) return;
    const count = cat.keywords.filter(k => allText.includes(k)).length;
    if (count > 0) {
      categories[cat.name] = count;
    }
  });

  // Calculate percentages
  const total = Object.values(categories).reduce((a, b) => a + b, 0);
  return Object.entries(categories).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / total) * 100),
  })).sort((a, b) => b.count - a.count);
}

function analyzeScamTrend(warnings) {
  const months = {};
  warnings.forEach(w => {
    if (w.time) {
      const month = w.time.substring(0, 7);
      months[month] = (months[month] || 0) + 1;
    }
  });
  return Object.entries(months)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => ({ month, count }));
}

function extractIncomeRanges(posts) {
  const incomePatterns = [
    { label: '日赚100以下', min: 0, max: 100, pattern: /日?\s*(\d+)\s*元?/g },
    { label: '日赚100-300', min: 100, max: 300, pattern: null },
    { label: '日赚300-500', min: 300, max: 500, pattern: null },
    { label: '月入3000以下', min: 0, max: 3000, period: '月' },
    { label: '月入3000-5000', min: 3000, max: 5000, period: '月' },
    { label: '月入5000-10000', min: 5000, max: 10000, period: '月' },
    { label: '月入10000+', min: 10000, max: Infinity, period: '月' },
  ];
  
  const results = {};
  posts.forEach(p => {
    const text = p.title + ' ' + (p.snippet || '');
    // Extract income mentions
    const incomeMatches = text.match(/(\d+)\s*(万|千|元|块)/g);
    if (incomeMatches) {
      incomeMatches.forEach(m => {
        const numMatch = m.match(/(\d+)/);
        if (numMatch) {
          const num = parseInt(numMatch[1]);
          if (m.includes('万')) {
            results['月入10000+'] = (results['月入10000+'] || 0) + 1;
          } else if (m.includes('千')) {
            if (num >= 10) {
              results['月入10000+'] = (results['月入10000+'] || 0) + 1;
            } else {
              results['月入3000-5000'] = (results['月入3000-5000'] || 0) + 1;
            }
          } else {
            // 元 - could be daily or monthly
            if (num >= 500) {
              results['月入5000-10000'] = (results['月入5000-10000'] || 0) + 1;
            } else if (num >= 200) {
              results['月入3000-5000'] = (results['月入3000-5000'] || 0) + 1;
            } else {
              results['月入3000以下'] = (results['月入3000以下'] || 0) + 1;
            }
          }
        }
      });
    }
  });
  
  return Object.entries(results)
    .sort((a, b) => {
      const order = ['月入3000以下', '月入3000-5000', '月入5000-10000', '月入10000+'];
      return order.indexOf(a[0]) - order.indexOf(b[0]);
    })
    .map(([label, count]) => ({ label, count }));
}

function extractIncomeByType(posts) {
  const types = ['写作', '设计', '编程', '翻译', '自媒体', '电商', '配音', '其他'];
  const result = {};
  
  types.forEach(type => {
    const typePosts = posts.filter(p => {
      const text = (p.title + ' ' + (p.snippet || '')).toLowerCase();
      const typeKeywords = {
        '写作': ['写作', '稿费', '投稿', '网文', '小说', '代写'],
        '设计': ['设计', 'PS', '修图', '海报', 'UI'],
        '编程': ['编程', '开发', '代码', '外包', '接私活'],
        '翻译': ['翻译', '外语'],
        '自媒体': ['自媒体', '公众号', '小红书', '知乎'],
        '电商': ['电商', '淘宝', '拼多多', '闲鱼', '带货'],
        '配音': ['配音', '语音', '声音'],
        '其他': [],
      };
      return typeKeywords[type].some(k => text.includes(k));
    });
    
    // Extract income from these posts
    let totalIncome = 0;
    let incomeCount = 0;
    typePosts.forEach(p => {
      const text = p.title + ' ' + (p.snippet || '');
      const match = text.match(/月?\s*(\d+)\s*(万|千)/);
      if (match) {
        const num = parseInt(match[1]);
        const unit = match[2];
        const income = unit === '万' ? num * 10000 : num * 1000;
        totalIncome += income;
        incomeCount++;
      }
    });
    
    result[type] = {
      count: typePosts.length,
      avgIncome: incomeCount > 0 ? Math.round(totalIncome / incomeCount) : null,
      hasIncomeData: incomeCount > 0,
    };
  });
  
  return result;
}

const PLATFORM_TYPES = {
  '写作': ['写作', '稿费', '投稿', '网文', '小说', '代写', '文案'],
  '设计': ['设计', 'PS', '修图', '海报', 'UI', '排版'],
  '编程': ['编程', '开发', '代码', '外包', '接私活', '技术'],
  '翻译': ['翻译', '外语', '中英'],
  '自媒体': ['自媒体', '公众号', '小红书', '知乎', '内容创作'],
  '电商': ['电商', '淘宝', '拼多多', '闲鱼', '带货', '摆摊'],
  '配音': ['配音', '语音', '声音', '录音'],
  '家教': ['家教', '辅导', '补课', '教师'],
  '摄影': ['摄影', '拍照', '写真'],
  '其他': [],
};
