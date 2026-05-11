#!/usr/bin/env python3
"""
小红书自动发帖脚本 v2 — 通过浏览器 CDP 自动发布长文笔记
用法: python3 xhs_poster.py <markdown文件路径>
"""

import sys, os, re, json, time

CDP_PORT = 9222
CDP_HOST = "127.0.0.1"

def eprint(*a, **kw):
    print(*a, file=sys.stderr, flush=True, **kw)

def parse_md(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    title = ""
    match = re.search(r'^---\s*\ntitle:\s*(.+?)\n', content)
    if match:
        title = match.group(1).strip()
    body = re.sub(r'^---.*?---\s*', '', content, flags=re.DOTALL).strip()
    body = re.sub(r'\n\n💡.*', '', body).strip()
    return title, body

def post_to_xiaohongshu(title, body):
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        eprint("[Playwright] 连接 Chrome CDP...")
        browser = p.chromium.connect_over_cdp(f"http://{CDP_HOST}:{CDP_PORT}")
        context = browser.contexts[0]
        page = context.new_page()

        # 导航到发布页
        eprint("[*] 打开小红书创作者中心...")
        page.goto("https://creator.xiaohongshu.com/publish/publish", 
                  wait_until="domcontentloaded", timeout=30000)
        time.sleep(3)

        if "login" in page.url.lower():
            eprint("[!] ❌ 未登录")
            browser.close()
            return False

        eprint("[✓] ✅ 已登录")

        # 点击"写长文"标签
        eprint("[*] 切换到写长文...")
        try:
            page.evaluate("""
                document.querySelectorAll('.creator-tab').forEach(t => {
                    if(t.innerText.includes('写长文')) t.click();
                });
            """)
            time.sleep(2)
        except Exception as e:
            eprint(f"[!] 切换标签失败: {e}")

        # 点击"新的创作"
        eprint("[*] 点击新的创作...")
        try:
            page.evaluate("""
                document.querySelectorAll('div, button').forEach(el => {
                    if(el.innerText.trim() === '新的创作') el.click();
                });
            """)
            time.sleep(3)
        except Exception as e:
            eprint(f"[!] 点击新的创作失败: {e}")

        # 找输入框 - 标题(0/64那个)
        eprint("[*] 输入标题...")
        try:
            title_escaped = title.replace("'", "\\'").replace('"', '\\"')
            js_fill_title = f'''
                (() => {{
                    const inputs = [...document.querySelectorAll('textarea, input')]
                        .filter(el => el.offsetWidth > 100 && el.offsetHeight > 20);
                    if (inputs.length > 0) {{
                        inputs[0].focus();
                        inputs[0].value = "{title_escaped}";
                        inputs[0].dispatchEvent(new Event('input', {{ bubbles: true }}));
                        inputs[0].dispatchEvent(new Event('change', {{ bubbles: true }}));
                        return true;
                    }}
                    return false;
                }})()
            '''
            title_filled = page.evaluate(js_fill_title)
            if title_filled:
                eprint("[✓] 标题已填写")
            else:
                eprint("[!] 找不到标题输入框")
        except Exception as e:
            eprint(f"[!] 填标题失败: {e}")

        # 填正文（contenteditable tiptap 编辑器）
        eprint("[*] 输入正文...")
        try:
            # 把换行转成 <br>，保留段落间距
            body_html = body.replace('\n\n', '</p><p>').replace('\n', '<br>')
            body_html = '<p>' + body_html + '</p>'
            body_js = body_html.replace('\\', '\\\\').replace('"', '\\"').replace('`', '\\`')
            js_fill_body = f'''
                (() => {{
                    const editor = document.querySelector('.tiptap.ProseMirror');
                    if (editor) {{
                        editor.innerHTML = "{body_js}";
                        editor.dispatchEvent(new Event('input', {{ bubbles: true }}));
                        editor.dispatchEvent(new Event('change', {{ bubbles: true }}));
                        return 'ok:' + editor.innerText.length;
                    }}
                    return 'no_editor';
                }})()
            '''
            result = page.evaluate(js_fill_body)
            if result and result.startswith('ok'):
                eprint(f"[✓] 正文已填写 ({result.split(':')[1]}字)")
            else:
                eprint(f"[!] 正文填充结果: {result}")
        except Exception as e:
            eprint(f"[!] 填正文失败: {e}")

        # 一键排版（排版后会出现发布按钮）
        time.sleep(2)
        eprint("[*] 一键排版...")
        try:
            formatted = page.evaluate("""
                (() => {
                    const all = [...document.querySelectorAll('div, button, span')]
                        .filter(el => el.innerText.trim() === '一键排版' 
                            && el.offsetWidth > 50 && el.offsetHeight > 20);
                    if (all.length > 0) {
                        all[0].click();
                        return 'ok';
                    }
                    return 'no_btn';
                })()
            """)
            if formatted:
                eprint("[✓] ✅ 已点击一键排版，等待页面响应...")
                time.sleep(8)  # 一键排版响应较慢，多等一会儿
            else:
                eprint(f"[!] 一键排版结果: {formatted}")
        except Exception as e:
            eprint(f"[!] 一键排版失败: {e}")

        # 下一步（排版后出现的确认页面）
        eprint("[*] 点击下一步...")
        try:
            next_step = page.evaluate("""
                (() => {
                    const all = [...document.querySelectorAll('div, button, span')]
                        .filter(el => (el.innerText.trim() === '下一步' || el.innerText.trim() === '下一步')
                            && el.offsetWidth > 50 && el.offsetHeight > 20);
                    if (all.length > 0) {
                        all[0].click();
                        return 'ok';
                    }
                    return 'no_next_btn';
                })()
            """)
            if next_step:
                eprint("[✓] ✅ 已点击下一步")
                time.sleep(3)
            else:
                eprint(f"[!] 下一步结果: {next_step}")
        except Exception as e:
            eprint(f"[!] 点击下一步失败: {e}")

        # 发布
        eprint("[*] 点击发布...")
        try:
            published = page.evaluate("""
                (() => {
                    const all = [...document.querySelectorAll('div, button, span')]
                        .filter(el => el.innerText.trim() === '发布' 
                            && el.offsetWidth > 50 && el.offsetHeight > 20);
                    if (all.length > 0) {
                        const btn = all[all.length - 1];
                        btn.click();
                        return 'ok';
                    }
                    return 'no_publish_btn';
                })()
            """)
            if published:
                eprint("[✓] ✅ 已点击发布")
                time.sleep(5)
            else:
                eprint(f"[!] 发布结果: {published}")
        except Exception as e:
            eprint(f"[!] 发布失败: {e}")

        eprint(f"[✓] ✅ 笔记发布完成: {title}")
        browser.close()
        return True

def main():
    if len(sys.argv) < 2:
        eprint("用法: python3 xhs_poster.py <markdown文件路径>")
        sys.exit(1)
    filepath = sys.argv[1]
    if not os.path.exists(filepath):
        eprint(f"[!] 文件不存在: {filepath}")
        sys.exit(1)
    title, body = parse_md(filepath)
    if not title:
        eprint(f"[!] 无法解析标题")
        sys.exit(1)
    eprint(f"[*] 准备发布: {title} ({len(body)}字)")
    success = post_to_xiaohongshu(title, body)
    if success:
        print(json.dumps({"status":"ok","title":title}, ensure_ascii=False))
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
