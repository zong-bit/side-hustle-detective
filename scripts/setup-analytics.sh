#!/bin/bash
# 副业侦探 — 统计系统接入脚本
# 分析当前项目状态，提供接入方案建议

PROJECT="/home/zxw/.openclaw/workspace/side-hustle-detective"
APP_JS="$PROJECT/pages/_app.js"

echo "========================================"
echo "  副业侦探 — 统计系统接入分析"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"

# ── 检查 _app.js 中是否已有 analytics ──
echo ""
echo "【1】当前 analytics 集成状态"
echo "----------------------------------------"
if [ -f "$APP_JS" ]; then
    echo "  📄 pages/_app.js 存在"
    
    # 检查 Vercel Analytics
    if grep -q "vercel/analytics\|@vercel/analytics\|VercelAnalytics\|Vercel Analytics" "$APP_JS"; then
        echo "  ✅ 已集成 Vercel Analytics"
    else
        echo "  ❌ 未集成 Vercel Analytics"
    fi
    
    # 检查百度统计
    if grep -q "hm.baidu\|baidu\|tongji" "$APP_JS"; then
        echo "  ✅ 已集成百度统计"
    else
        echo "  ❌ 未集成百度统计"
    fi
    
    # 检查 Google Analytics
    if grep -q "google-analytics\|gtag\|google tag" "$APP_JS"; then
        echo "  ✅ 已集成 Google Analytics"
    else
        echo "  ❌ 未集成 Google Analytics"
    fi
    
    # 检查 Google Tag Manager
    if grep -q "googletagmanager\|gtag.js\|gtm" "$APP_JS"; then
        echo "  ✅ 已集成 Google Tag Manager"
    else
        echo "  ❌ 未集成 Google Tag Manager"
    fi
else
    echo "  ⚠️  pages/_app.js 不存在"
fi

# ── 检查 package.json ──
echo ""
echo "【2】项目依赖检查"
echo "----------------------------------------"
if [ -f "$PROJECT/package.json" ]; then
    echo "  ✅ package.json 存在"
    deps=$(cat "$PROJECT/package.json" | grep -c "vercel/analytics" || true)
    if [ "$deps" -gt 0 ]; then
        echo "  ✅ @vercel/analytics 已在依赖中"
    else
        echo "  ❌ @vercel/analytics 未安装"
    fi
else
    echo "  ❌ package.json 不存在"
fi

# ── 检查部署状态 ──
echo ""
echo "【3】部署状态"
echo "----------------------------------------"
if [ -d "$PROJECT/.vercel" ]; then
    echo "  ✅ Vercel 配置目录存在"
else
    echo "  ⚠️  未检测到 Vercel 配置"
fi

if [ -d "$PROJECT/.next" ]; then
    echo "  ✅ .next 构建目录存在"
else
    echo "  ⚠️  未检测到构建缓存"
fi

# ── 推荐方案 ──
echo ""
echo "========================================"
echo "  推荐方案"
echo "========================================"
echo ""
echo "  🎯 方案 A：Vercel Analytics（推荐）"
echo "  ----------------------------------------"
echo "  适用：网站已部署在 Vercel"
echo "  优势：零配置，自动追踪页面浏览、点击等"
echo "  步骤："
echo "    1. npm install @vercel/analytics"
echo "    2. 在 pages/_app.js 中添加 Analytics 组件"
echo "    3. 重新部署"
echo ""
echo "  🎯 方案 B：百度统计"
echo "  ----------------------------------------"
echo "  适用：需要国内流量分析"
echo "  优势：国内访问稳定，支持百度生态"
echo "  步骤："
echo "    1. 在百度统计注册获取代码"
echo "    2. 添加到 pages/_app.js 的 <Head> 中"
echo "    3. 重新部署"
echo ""
echo "  🎯 方案 C：两者都加"
echo "  ----------------------------------------"
echo "  Vercel Analytics 用于产品分析 + 百度统计用于 SEO 流量"
echo "  互不冲突，可以同时集成"
echo ""
echo "========================================"
echo "  CEO 手动操作清单"
echo "========================================"
echo "  1. [ ] 确认网站是否部署在 Vercel"
echo "  2. [ ] 如需百度统计，去 https://tongji.baidu.com 注册"
echo "  3. [ ] 运行: npm install @vercel/analytics"
echo "  4. [ ] 修改 pages/_app.js（见下方代码示例）"
echo "  5. [ ] git commit && git push 触发重新部署"
echo "========================================"
