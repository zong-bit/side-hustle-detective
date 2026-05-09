#!/bin/bash
# 副业侦探 - 部署脚本
# 更新数据 → 构建 → 提交 → 推送 → Vercel 自动部署

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

echo "========================================="
echo "🚀 副业侦探 - 部署流程开始"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

# 1. 确认在 main 分支
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
    echo "⚠️  当前分支: $BRANCH，期望 main 分支"
    echo "自动切换到 main..."
    git checkout main
fi

# 2. 拉取最新代码
echo ""
echo "📡 拉取最新代码..."
git pull origin main --ff-only

# 3. 更新数据
echo ""
echo "🔄 更新数据..."
python3 "$SCRIPT_DIR/update_data.py"

# 4. 本地构建测试
echo ""
echo "🏗️  本地构建测试..."
npm run build

# 5. 提交并推送
echo ""
echo "📤 提交并推送..."
git add .
git commit -m "auto: update data $(date +%Y-%m-%d)" || echo "ℹ️  没有新的变更需要提交"
git push origin main

echo ""
echo "========================================="
echo "✅ 部署完成！Vercel 将自动构建部署。"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="
