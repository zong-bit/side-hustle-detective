#!/usr/bin/env python3
"""
副业侦探 - 数据采集脚本
使用 web_fetch 工具从各平台采集副业/兼职相关数据

用法: python scripts/collect_data.py

依赖: requests, beautifulsoup4
安装: pip install requests beautifulsoup4 lxml
"""

import json
import os
import re
import time
from datetime import datetime

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("请先安装依赖: pip install requests beautifulsoup4 lxml")
    print("如果无法安装，脚本会使用 urllib 作为备选")
    import urllib.request
    import urllib.error
    HAVE_REQUESTS = False
else:
    HAVE_REQUESTS = True

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_DIR, 'data')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}


def fetch_url(url, timeout=15):
    """Fetch a URL and return HTML content."""
    if HAVE_REQUESTS:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=timeout)
            resp.encoding = 'utf-8'
            if resp.status_code == 200:
                return resp.text
            else:
                print(f"  [失败] HTTP {resp.status_code}: {url}")
                return None
        except Exception as e:
            print(f"  [失败] {e}: {url}")
            return None
    else:
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read().decode('utf-8', errors='replace')
        except Exception as e:
            print(f"  [失败] {e}: {url}")
            return None


def save_data(filename, data):
    """Save data as JSON in the data directory."""
    os.makedirs(DATA_DIR, exist_ok=True)
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  ✅ 已保存 {len(data)} 条数据到 {filename}")
    return len(data)


# ===== 虎扑数据采集 =====

def collect_hupu():
    """采集虎扑副业相关帖子"""
    print("\n📊 采集虎扑数据...")
    results = []
    
    # 搜索关键词
    keywords = ['副业', '兼职']
    
    for keyword in keywords:
        url = f"https://bbs.hupu.com/search?q={urllib.request.quote(keyword) if not HAVE_REQUESTS else requests.utils.quote(keyword)}"
        print(f"  搜索: {keyword}")
        html = fetch_url(url)
        if not html:
            continue
        
        soup = BeautifulSoup(html, 'html.parser') if HAVE_REQUESTS else BeautifulSoup(html, 'html.parser')
        
        # 解析帖子列表
        # 虎扑搜索结果中帖子链接为 /XXX.html 格式
        posts = []
        for a_tag in soup.find_all('a', href=re.compile(r'/\d+\.html$')):
            title = a_tag.get_text(strip=True)
            href = a_tag.get('href', '')
            if title and href and len(title) > 4:
                full_url = f"https://bbs.hupu.com{href}" if href.startswith('/') else href
                posts.append({
                    'title': title,
                    'url': full_url
                })
        
        for post in posts[:10]:
            post_html = fetch_url(post['url'])
            if post_html:
                post_soup = BeautifulSoup(post_html, 'html.parser')
                # 提取作者、时间、内容
                content_div = post_soup.find('div', class_='main-content')
                if content_div:
                    post['snippet'] = content_div.get_text(strip=True)[:200]
        
        for i, post in enumerate(posts[:10]):
            results.append({
                'rank': i + 1,
                'title': post['title'],
                'forum': '步行街主干道',
                'author': '虎扑JR',
                'time': datetime.now().strftime('%Y-%m-%d'),
                'snippet': post.get('snippet', ''),
                'url': post['url']
            })
        
        time.sleep(1)  # 请求间隔
    
    return results


# ===== B站数据采集 =====

def collect_bilibili():
    """采集B站副业相关视频/专栏"""
    print("\n📊 采集B站数据...")
    results = []
    
    # 搜索关键词
    keywords = ['副业 赚钱', '副业推荐', '兼职 赚钱']
    search_urls = [
        "https://search.bilibili.com/all?keyword={}&search_type=video",
        "https://search.bilibili.com/all?keyword={}&search_type=article",
    ]
    
    for keyword in keywords:
        for tmpl in search_urls:
            encoded = urllib.request.quote(keyword) if not HAVE_REQUESTS else requests.utils.quote(keyword)
            url = tmpl.format(encoded)
            print(f"  搜索: {keyword}")
            
            html = fetch_url(url)
            if not html:
                continue
            
            # 从HTML中提取视频/文章信息
            # B站搜索结果中的视频链接模式: //www.bilibili.com/video/BV...
            video_pattern = re.compile(r'//www\.bilibili\.com/video/([^/\s?&]+)')
            title_pattern = re.compile(r'\[([^\]]+)\]\(//www\.bilibili\.com/video/[^)]+\)')
            
            soup = BeautifulSoup(html, 'html.parser')
            
            # Try to extract from the structured HTML
            for link in soup.find_all('a', href=re.compile(r'//www\.bilibili\.com/video/')):
                href = link.get('href', '')
                text = link.get_text(strip=True)
                if text and len(text) > 5 and '/video/' in href:
                    full_url = f"https:{href}" if href.startswith('//') else href
                    results.append({
                        'title': text,
                        'url': full_url,
                    })
            
            time.sleep(1)
    
    # Deduplicate by URL
    seen = set()
    unique = []
    for r in results:
        if r['url'] not in seen:
            seen.add(r['url'])
            unique.append(r)
    
    # Format as final output
    formatted = []
    for i, r in enumerate(unique[:25]):
        formatted.append({
            'rank': i + 1,
            'title': r['title'],
            'type': 'video',
            'author': '',
            'views': '',
            'time': '',
            'snippet': '',
            'url': r['url']
        })
    
    return formatted


# ===== 知乎数据采集 =====

def collect_zhihu():
    """采集知乎副业相关回答/文章"""
    print("\n📊 采集知乎数据...")
    results = []
    
    # 知乎对爬虫比较严格，尝试搜索页面
    urls = [
        "https://www.zhihu.com/search?type=content&q=副业赚钱",
        "https://www.zhihu.com/search?type=content&q=副业推荐",
        "https://www.zhihu.com/search?type=content&q=兼职赚钱",
    ]
    
    for url in urls:
        print(f"  尝试: {url}")
        html = fetch_url(url)
        if html:
            # 知乎搜索页面返回动态加载内容，需要解析JSON
            print(f"  ⚠️ 知乎搜索需要Cookie，建议手动采集")
        time.sleep(1)
    
    return results


# ===== 主函数 =====

def main():
    print("=" * 50)
    print("  副业侦探 - 数据采集脚本")
    print(f"  时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 50)
    
    total = 0
    
    # 1. 采集虎扑
    hupu_data = collect_hupu()
    if hupu_data:
        total += save_data('hupu_fuye.json', hupu_data)
    
    # 2. 采集B站
    bili_data = collect_bilibili()
    if bili_data:
        total += save_data('bilibili_fuye.json', bili_data)
    
    # 3. 知乎（手动补充）
    print("\n📊 知乎数据: 需要手动采集（知乎对爬虫限制严格）")
    print("   建议: 手动搜索并复制数据到 data/zhihu_fuye.json")
    
    print(f"\n{'=' * 50}")
    print(f"  采集完成! 共 {total} 条数据")
    print(f"  数据目录: {DATA_DIR}")
    print(f"{'=' * 50}")
    
    # 列出所有数据文件
    if os.path.exists(DATA_DIR):
        for f in sorted(os.listdir(DATA_DIR)):
            if f.endswith('.json'):
                fpath = os.path.join(DATA_DIR, f)
                with open(fpath, 'r', encoding='utf-8') as fh:
                    data = json.load(fh)
                print(f"  📄 {f}: {len(data)} 条")


if __name__ == '__main__':
    main()
