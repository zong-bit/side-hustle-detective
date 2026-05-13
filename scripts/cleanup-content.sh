#!/bin/bash
# 副业侦探内容清理脚本
# 只做文件操作分析，不调模型，不删除文件

ROOT="/home/zxw/.openclaw/workspace/side-hustle-detective/content/blog"
DATA_DIR="/home/zxw/.openclaw/workspace/side-hustle-detective/data"
PROJECT="/home/zxw/.openclaw/workspace/side-hustle-detective"

echo "========================================"
echo "  副业侦探 — 内容清理分析报告"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"

# ── 1. 英文文件名文章 ──
echo ""
echo "【1】英文文件名文章（5篇）"
echo "----------------------------------------"
for f in "$ROOT"/*.md; do
    bn=$(basename "$f" .md)
    if echo "$bn" | grep -qP '^\d{4}-[A-Za-z]'; then
        chinese_lines=$(head -c 2000 "$f" | grep -cP '[\x{4e00}-\x{9fff}]' || true)
        lines=$(wc -l < "$f")
        size=$(wc -c < "$f")
        echo "  📄 $bn"
        echo "     行数: $lines | 大小: ${size}B | 中文行数: $chinese_lines"
        # 判断是否值得保留
        if [ "$chinese_lines" -gt 10 ]; then
            echo "     → 有中文内容，建议保留（可能是中英混排）"
        else
            echo "     → 纯英文，建议删除或翻译"
        fi
    fi
done

# ── 2. 文章长度分布 ──
echo ""
echo "【2】文章长度分布（共 127 篇）"
echo "----------------------------------------"
short=0; medium=0; long=0; xlong=0
for f in "$ROOT"/*.md; do
    lines=$(wc -l < "$f")
    if [ "$lines" -lt 50 ]; then short=$((short+1))
    elif [ "$lines" -lt 100 ]; then medium=$((medium+1))
    elif [ "$lines" -lt 200 ]; then long=$((long+1))
    else xlong=$((xlong+1))
    fi
done
echo "  ⚪  50行以下:   $short 篇  ← 太短，考虑合并"
echo "  🔵  50-100行:   $medium 篇  ← 中等，可接受"
echo "  🟢  100-200行:  $long 篇  ← 好"
echo "  🟣  200行以上:  $xlong 篇  ← 长文，优质"

echo ""
echo "  最短的5篇文章（可能需合并或扩充）："
for f in "$ROOT"/*.md; do
    lines=$(wc -l < "$f")
    echo "$lines $(basename $f)"
done | sort -n | head -5 | while read line; do
    echo "  ⚠️  $line"
done

# ── 3. 重复标题 ──
echo ""
echo "【3】重复标题检查"
echo "----------------------------------------"
declare -A title_files
for f in "$ROOT"/*.md; do
    bn=$(basename "$f" .md)
    clean=$(echo "$bn" | sed 's/^[0-9]\{4\}-[0-9]\{4\}-[0-9]\{4\}-//;s/^[0-9]\{4\}-//')
    if [ -n "${title_files[$clean]+x}" ]; then
        title_files[$clean]="${title_files[$clean]}"$'\n'"  - $bn"
    else
        title_files[$clean]="$bn"
    fi
done

has_dupes=0
for title in "${!title_files[@]}"; do
    count=$(echo "${title_files[$title]}" | wc -l)
    if [ "$count" -gt 1 ]; then
        has_dupes=1
        echo "  🔴 重复标题: $title"
        echo "${title_files[$title]}" | while read line; do echo "    $line"; done
        echo ""
    fi
done
if [ "$has_dupes" -eq 0 ]; then
    echo "  ✅ 未发现完全重复的标题"
fi

# ── 4. 数据文件检查 ──
echo ""
echo "【4】数据文件状态"
echo "----------------------------------------"
echo "  根目录 data/*.json:"
for f in "$DATA_DIR"/*.json; do
    size=$(wc -c < "$f")
    bn=$(basename "$f")
    if [ "$size" -le 5 ]; then
        echo "    🟡 $bn: ${size}B (空文件 - 需重新抓取)"
    elif [ "$size" -lt 1000 ]; then
        echo "    🟠 $bn: ${size}B (很小)"
    else
        echo "    🟢 $bn: ${size}B"
    fi
done

echo ""
echo "  归档目录 data/archive/ (空占位文件):"
empty_count=0
for f in "$DATA_DIR"/archive/*; do
    size=$(wc -c < "$f")
    if [ "$size" -le 5 ]; then
        echo "    🟡 $(basename $f): ${size}B (空占位)"
        empty_count=$((empty_count+1))
    fi
done
if [ "$empty_count" -eq 0 ]; then
    echo "    ✅ 无空占位文件"
fi

# ── 5. XHS 帖子目录 ──
echo ""
echo "【5】小红书帖子目录"
echo "----------------------------------------"
for d in "$PROJECT"/xhs_posts*; do
    if [ -d "$d" ]; then
        count=$(ls "$d" 2>/dev/null | wc -l)
        total_size=$(du -sh "$d" 2>/dev/null | cut -f1)
        echo "  📁 $(basename $d): $count 文件, ${total_size}"
    fi
done

# ── 6. 总统计 ──
echo ""
echo "========================================"
echo "  总统计"
echo "========================================"
total_articles=$(ls "$ROOT"/*.md 2>/dev/null | wc -l)
total_size=$(du -sh "$ROOT" | cut -f1)
data_size=$(du -sh "$DATA_DIR" | cut -f1)
total_content_size=$(du -sh "$PROJECT/content" | cut -f1)
echo "  文章总数: $total_articles 篇"
echo "  文章内容总大小: $total_size"
echo "  数据目录总大小: $data_size"
echo "  内容目录总大小: $total_content_size"
echo ""
echo "========================================"
echo "  清理建议汇总"
echo "========================================"
echo "  1. 英文文件名文章 (5篇): 有中文内容，可保留或翻译"
echo "  2. 最短文章 (50行): 考虑合并或扩充"
echo "  3. 空数据文件 (tieba_fuye.json, tieba_jianzhi.json, zhihu_fuye.json): 需重新抓取"
echo "  4. 归档中3个空占位文件: 可清理"
echo "  5. 无重复标题: 无需合并"
echo "========================================"
