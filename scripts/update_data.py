#!/usr/bin/env python3
"""
副业侦探 - 数据自动更新脚本
从贴吧、知乎等平台抓取副业/兼职相关讨论，更新 data/*.json 文件。
"""

import os
import sys
import json
import time
import hashlib
import shutil
from datetime import datetime, timezone, timedelta
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ── 配置 ──
PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_DIR / "data"
ARCHIVE_DIR = DATA_DIR / "archive"
LAST_UPDATE_FILE = DATA_DIR / "last_update.txt"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
}

REQUEST_TIMEOUT = 20
TZ = timezone(timedelta(hours=8))  # Asia/Shanghai


def log(msg: str):
    ts = datetime.now(TZ).strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}")


# ── 辅助函数 ──

def safe_fetch(url: str, params: dict = None) -> requests.Response | None:
    """安全地请求 URL，失败时返回 None"""
    try:
        resp = requests.get(url, headers=HEADERS, params=params, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        return resp
    except requests.RequestException as e:
        log(f"⚠️  请求失败: {url} — {e}")
        return None


def archive_old_data():
    """将旧的 data/*.json 文件移到 archive/"""
    ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now(TZ).strftime("%Y%m%d_%H%M%S")
    for f in DATA_DIR.glob("*.json"):
        if f.name == "last_update.txt":
            continue
        # compute content hash to avoid archiving identical data
        content = f.read_bytes()
        sig = hashlib.md5(content).hexdigest()[:8]
        archive_name = f"{f.stem}_{ts}_{sig}{f.suffix}"
        shutil.copy2(f, ARCHIVE_DIR / archive_name)
        log(f"📦 已归档: {f.name} → archive/{archive_name}")


def write_json(filename: str, data: list) -> bool:
    """写入 JSON 文件（格式化输出）"""
    path = DATA_DIR / filename
    try:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        log(f"✅ 已写入 {filename} ({len(data)} 条)")
        return True
    except Exception as e:
        log(f"❌ 写入失败 {filename}: {e}")
        return False


def update_last_update():
    """记录上次更新时间"""
    now = datetime.now(TZ).strftime("%Y-%m-%d %H:%M:%S")
    LAST_UPDATE_FILE.write_text(f"{now}\n", encoding="utf-8")
    log(f"🕐 更新时间已记录: {now}")


# ── 贴吧数据采集 ──

def fetch_tieba_posts(keyword: str, max_pages: int = 3) -> list:
    """
    从贴吧搜索指定关键词的帖子
    使用 tieba.baidu.com 的 HTML 页面进行解析
    """
    results = []
    seen_ids = set()

    for page in range(1, max_pages + 1):
        url = "https://tieba.baidu.com/f"
        params = {"kw": keyword, "ie": "utf-8", "pn": (page - 1) * 50}
        resp = safe_fetch(url, params)
        if not resp:
            break

        soup = BeautifulSoup(resp.text, "lxml")
        thread_list = soup.select("li.j_thread_list")

        for thread in thread_list:
            try:
                # 提取帖子ID
                a_tag = thread.select_one("a.j_th_tit")
                if not a_tag:
                    continue
                href = a_tag.get("href", "")
                post_id = ""
                if "pn=" in href:
                    post_id = href.split("/")[-1].split("?")[0].replace("p/", "")
                if not post_id:
                    continue
                if post_id in seen_ids:
                    continue
                seen_ids.add(post_id)

                title = a_tag.get_text(strip=True)
                url_full = f"https://tieba.baidu.com/p/{post_id}"

                # 提取所属吧名
                forum_el = thread.select_one("a.frs_kl")
                forum = forum_el.get_text(strip=True) if forum_el else keyword + "吧"

                # 提取作者
                author_el = thread.select_one("span.tb_icon_author .tb_icon_author_title")
                author = author_el.get_text(strip=True) if author_el else "匿名"

                # 提取时间（贴吧时间格式复杂，取不到就用当前日期）
                time_el = thread.select_one("span.tb_icon_author .tb_icon_author_date")
                time_text = time_el.get_text(strip=True) if time_el else ""

                # 提取摘要（取前60字）
                snippet_el = thread.select_one("div.threadlist_abs")
                snippet = snippet_el.get_text(strip=True) if snippet_el else ""
                snippet = snippet[:300]

                results.append({
                    "rank": len(results) + 1,
                    "title": title,
                    "forum": forum,
                    "author": author,
                    "time": time_text,
                    "snippet": snippet,
                    "id": post_id,
                    "url": url_full,
                })
            except Exception as e:
                log(f"  ⚠️  解析帖子时出错: {e}")
                continue

        log(f"📄 贴吧 [{keyword}] 第{page}页: {len(thread_list)} 个帖子")
        time.sleep(1)  # 礼貌性延迟

    return results


# ── 知乎数据采集 ──

def fetch_zhihu_posts(keyword: str, max_items: int = 30) -> list:
    """
    从知乎搜索获取副业相关内容
    使用 zhihu.com 搜索页 + 知乎 API
    """
    results = []
    seen_urls = set()

    # 尝试使用 zhihu search API
    url = "https://www.zhihu.com/search"
    params = {"type": "content", "q": keyword}
    resp = safe_fetch(url, params)
    if not resp:
        log("⚠️  知乎搜索页请求失败，尝试备用方式")
        return results

    soup = BeautifulSoup(resp.text, "lxml")

    # 知乎搜索结果列表
    items = soup.select("div.SearchResult-card") or soup.select("li[data-za-module]")
    
    # 如果 HTML 解析结果太少，说明 JS 渲染的页面可能抓不到内容
    # 尝试使用知乎的 Search API
    if len(items) < 3:
        log("📡 HTML 解析结果有限，尝试知乎搜索 API...")
        api_url = "https://www.zhihu.com/api/v4/search_v3"
        api_params = {
            "t": "general",
            "q": keyword,
            "correction": 1,
            "offset": 0,
            "limit": max_items,
            "show_all_topics": 0,
        }
        api_resp = safe_fetch(api_url, api_params)
        if api_resp:
            try:
                data = api_resp.json()
                for item in data.get("data", []):
                    obj = item.get("object", {})
                    question = obj.get("question", {})
                    title = question.get("title") or obj.get("title", "")
                    url_str = obj.get("url", "")
                    # convert API URLs to web URLs
                    url_str = url_str.replace("api.zhihu.com", "www.zhihu.com")
                    if "answer" in url_str:
                        url_str = url_str.replace("/answers/", "/answer/")
                    
                    if not title or url_str in seen_urls:
                        continue
                    seen_urls.add(url_str)

                    item_type = "answer"
                    if "/pin/" in url_str:
                        item_type = "pin"
                    elif "/zhuanlan/" in url_str or "zhuanlan.zhihu.com" in url_str:
                        item_type = "article"

                    results.append({
                        "rank": len(results) + 1,
                        "title": title.strip(),
                        "type": item_type,
                        "author": obj.get("author", {}).get("name", "匿名"),
                        "votes": obj.get("voteup_count", obj.get("comment_count", 0)),
                        "url": url_str,
                    })

                    if len(results) >= max_items:
                        break
            except Exception as e:
                log(f"⚠️  解析知乎 API 响应失败: {e}")

    if results:
        log(f"📄 知乎 [{keyword}]: 搜索到 {len(results)} 条")
    else:
        log(f"📄 知乎 [{keyword}]: HTML 搜索页结果 {len(items)} 条")
        # 即使少也尝试解析 HTML
        rank = 0
        for item in items:
            try:
                a_tag = item.select_one("a[href*='zhihu.com']")
                if not a_tag:
                    continue
                url_str = a_tag.get("href", "")
                if url_str in seen_urls:
                    continue
                seen_urls.add(url_str)

                title_el = item.select_one("h2") or item.select_one('[class*="title"]')
                title = title_el.get_text(strip=True) if title_el else ""

                rank += 1
                results.append({
                    "rank": rank,
                    "title": title or "未获取到标题",
                    "type": "search_result",
                    "author": "",
                    "votes": 0,
                    "url": url_str,
                })
            except Exception:
                continue

    return results


# ── 主流程 ──

def main():
    log("=" * 50)
    log("🚀 副业侦探 - 数据更新开始")
    log("=" * 50)

    # 1. 归档旧数据
    log("📦 正在归档旧数据...")
    archive_old_data()

    # 2. 抓取贴吧数据
    log("🔍 正在抓取贴吧数据...")
    tieba_fuye = fetch_tieba_posts("副业", max_pages=3)
    tieba_jianzhi = fetch_tieba_posts("兼职", max_pages=2)

    # 3. 抓取知乎数据
    log("🔍 正在抓取知乎数据...")
    zhihu_fuye = fetch_zhihu_posts("副业 赚钱", max_items=20)

    # 4. 写入 JSON 文件
    log("💾 正在写入数据文件...")
    write_json("tieba_fuye.json", tieba_fuye)
    write_json("tieba_jianzhi.json", tieba_jianzhi)
    write_json("zhihu_fuye.json", zhihu_fuye)

    # 5. 记录时间
    update_last_update()

    total = len(tieba_fuye) + len(tieba_jianzhi) + len(zhihu_fuye)
    log("=" * 50)
    log(f"✅ 数据更新完成！共更新 {total} 条数据")
    log("=" * 50)


if __name__ == "__main__":
    main()
