#!/usr/bin/env python3
"""
数据整理脚本：清理副业侦探数据文件
- 检查每个数据文件是否有重复项
- 合并相同来源的数据（v1 + v2 → 去重合并）
- 输出整理后的数据到新目录 data_cleaned/

策略：
1. bilibili_fuye.json + bilibili_fuye_v2.json → bilibili_fuye_merged.json（按 title 去重，保留较新的）
2. hupu_fuye.json + hupu_fuye_v2.json → hupu_fuye_merged.json
3. xiaohongshu_fuye.json + xiaohongshu_fuye_v2.json → xiaohongshu_fuye_merged.json
4. zhihu_fuye.json + zhihu_fuye_v2.json → zhihu_fuye_merged.json
5. tieba_fuye.json 和 tieba_jianzhi.json 各自保留（不同类别），按 id 去重
6. scam_warnings.json 单独保留
"""

import json
import os
import sys
from datetime import datetime, timezone


DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
CLEANED_DIR = os.path.join(DATA_DIR, "data_cleaned")


def load_json(filepath):
    """Load a JSON file, return list of items."""
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(filepath, data):
    """Save data as JSON."""
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def dedup_by_title(items):
    """Deduplicate items by title. Keep the last occurrence (newer scrape wins)."""
    seen = {}
    for item in items:
        title = item.get("title", "")
        seen[title] = item
    return list(seen.values())


def dedup_by_id(items):
    """Deduplicate items by id."""
    seen = {}
    for item in items:
        item_id = item.get("id")
        if item_id is not None:
            seen[item_id] = item
    return list(seen.values())


def dedup_by_url(items):
    """Deduplicate items by url."""
    seen = {}
    for item in items:
        url = item.get("url", "")
        if url:
            seen[url] = item
    return list(seen.values())


def merge_v1_v2(v1_path, v2_path, output_name, dedup_func):
    """Merge v1 and v2 files, deduplicate, save to cleaned dir."""
    print(f"\n{'='*60}")
    print(f"处理: {os.path.basename(v1_path)} + {os.path.basename(v2_path)}")
    print(f"{'='*60}")

    items_v1 = load_json(v1_path)
    items_v2 = load_json(v2_path)

    # Show overlap analysis
    v1_titles = {item.get("title", "") for item in items_v1}
    v2_titles = {item.get("title", "") for item in items_v2}
    overlap = v1_titles & v2_titles

    print(f"  v1 项数: {len(items_v1)}")
    print(f"  v2 项数: {len(items_v2)}")
    print(f"  重复标题数: {len(overlap)}")
    if overlap:
        print(f"  重复标题: {', '.join(sorted(overlap)[:5])}{'...' if len(overlap) > 5 else ''}")

    # Merge: v1 first, then v2 (v2 is newer, so it wins on overlap)
    merged = dedup_func(items_v1 + items_v2)

    output_path = os.path.join(CLEANED_DIR, output_name)
    save_json(output_path, merged)

    print(f"  合并后项数: {len(merged)}")
    print(f"  输出: {output_path}")
    return merged


def copy_file(src_path, dest_name):
    """Copy a single file to cleaned dir."""
    dest_path = os.path.join(CLEANED_DIR, dest_name)
    with open(src_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    save_json(dest_path, data)
    print(f"\n  复制: {os.path.basename(src_path)} → {dest_name} ({len(data)} 项)")
    return data


def main():
    os.makedirs(CLEANED_DIR, exist_ok=True)
    print(f"数据清理输出目录: {CLEANED_DIR}")

    results = {}

    # === Merge bilibili fuye v1 + v2 ===
    v1 = os.path.join(DATA_DIR, "bilibili_fuye.json")
    v2 = os.path.join(DATA_DIR, "bilibili_fuye_v2.json")
    if os.path.exists(v1) and os.path.exists(v2):
        results["bilibili_fuye_merged.json"] = merge_v1_v2(v1, v2, "bilibili_fuye_merged.json", dedup_by_title)

    # === Merge hupu fuye v1 + v2 ===
    v1 = os.path.join(DATA_DIR, "hupu_fuye.json")
    v2 = os.path.join(DATA_DIR, "hupu_fuye_v2.json")
    if os.path.exists(v1) and os.path.exists(v2):
        results["hupu_fuye_merged.json"] = merge_v1_v2(v1, v2, "hupu_fuye_merged.json", dedup_by_title)

    # === Merge xiaohongshu fuye v1 + v2 ===
    v1 = os.path.join(DATA_DIR, "xiaohongshu_fuye.json")
    v2 = os.path.join(DATA_DIR, "xiaohongshu_fuye_v2.json")
    if os.path.exists(v1) and os.path.exists(v2):
        results["xiaohongshu_fuye_merged.json"] = merge_v1_v2(v1, v2, "xiaohongshu_fuye_merged.json", dedup_by_title)

    # === Merge zhihu fuye v1 + v2 ===
    v1 = os.path.join(DATA_DIR, "zhihu_fuye.json")
    v2 = os.path.join(DATA_DIR, "zhihu_fuye_v2.json")
    if os.path.exists(v1) and os.path.exists(v2):
        results["zhihu_fuye_merged.json"] = merge_v1_v2(v1, v2, "zhihu_fuye_merged.json", dedup_by_title)

    # === Copy tieba_fuye (dedup by id) ===
    tb_fuye = os.path.join(DATA_DIR, "tieba_fuye.json")
    if os.path.exists(tb_fuye):
        data = load_json(tb_fuye)
        deduped = dedup_by_id(data)
        dest = os.path.join(CLEANED_DIR, "tieba_fuye.json")
        save_json(dest, deduped)
        print(f"\n  tieba_fuye: {len(data)} → {len(deduped)} (按id去重)")

    # === Copy tieba_jianzhi (dedup by id) ===
    tb_jianzhi = os.path.join(DATA_DIR, "tieba_jianzhi.json")
    if os.path.exists(tb_jianzhi):
        data = load_json(tb_jianzhi)
        deduped = dedup_by_id(data)
        dest = os.path.join(CLEANED_DIR, "tieba_jianzhi.json")
        save_json(dest, deduped)
        print(f"  tieba_jianzhi: {len(data)} → {len(deduped)} (按id去重)")

    # === Copy scam_warnings ===
    scam = os.path.join(DATA_DIR, "scam_warnings.json")
    if os.path.exists(scam):
        copy_file(scam, "scam_warnings.json")

    # === Summary ===
    print(f"\n{'='*60}")
    print("数据清理完成！")
    print(f"{'='*60}")
    print(f"\n原始文件统计:")
    total_raw = 0
    for fname in sorted(os.listdir(DATA_DIR)):
        if fname.endswith(".json"):
            fpath = os.path.join(DATA_DIR, fname)
            data = load_json(fpath)
            total_raw += len(data)
            print(f"  {fname}: {len(data)} 项")
    print(f"  原始总计: {total_raw} 项")

    print(f"\n清理后文件统计:")
    total_cleaned = 0
    for fname in sorted(os.listdir(CLEANED_DIR)):
        fpath = os.path.join(CLEANED_DIR, fname)
        data = load_json(fpath)
        total_cleaned += len(data)
        print(f"  {fname}: {len(data)} 项")
    print(f"  清理后总计: {total_cleaned} 项")
    print(f"\n去重节省: {total_raw - total_cleaned} 项")

    return results


if __name__ == "__main__":
    main()
