#!/usr/bin/env node
'use strict';

/**
 * Word (.docx) → HTML 转换器
 * 输出 arXiv 风格的可读页面，并更新作品集索引
 *
 * 用法:
 *   node docx-to-html.js                    转换 site/input/ 下全部 docx
 *   node docx-to-html.js --all              额外扫描 source/_posts/*.docx
 *   node docx-to-html.js 路径/文件.docx      转换指定文件
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'site');
const INPUT_DIR = path.join(SITE, 'input');
const WORKS_DIR = path.join(SITE, 'works');
const POSTS_DIR = path.join(ROOT, 'source', '_posts');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function slugFromFilename(filename) {
  const base = path.basename(filename, path.extname(filename));
  return base
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '-')
    .trim() || 'untitled';
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function extractTitle(html, fallback) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return stripHtml(h1[1]);
  const p = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (p) {
    const text = stripHtml(p[1]);
    if (text.length <= 80) return text;
  }
  return fallback;
}

function extractAbstract(html) {
  const text = stripHtml(html);
  return text.slice(0, 200) + (text.length > 200 ? '…' : '');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return escapeHtml(str);
}

function buildArticlePage({ title, htmlBody, date, sourceFile }) {
  const docxName = path.basename(sourceFile);
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeAttr(title)} · 唐睿谦</title>
  <link rel="stylesheet" href="../../css/main.css">
  <link rel="stylesheet" href="../../css/article.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css">
</head>
<body class="article-page">
  <header class="navbar">
    <a href="../../index.html" class="logo">唐睿谦</a>
    <ul class="nav-links">
      <li><a href="../../index.html#home">主页</a></li>
      <li><a href="../../admin.html">后台</a></li>
      <li><a href="../../index.html#resume">简历</a></li>
      <li><a href="../../index.html#portfolio">作品集</a></li>
    </ul>
  </header>

  <main class="article-shell">
    <div class="article-meta-bar">
      <div class="format-tabs">
        <span class="format-tab active">HTML</span>
        <a class="format-tab" href="source.docx" download="${escapeAttr(docxName)}">Word 源文件</a>
      </div>
      <a class="back-link" href="../../index.html#portfolio"><i class="fa fa-arrow-left"></i> 返回作品集</a>
    </div>

    <article class="article-paper">
      <header class="paper-header">
        <p class="paper-type">作品 · HTML 版</p>
        <h1 class="paper-title">${escapeHtml(title)}</h1>
        <div class="paper-authors">唐睿谦</div>
        <div class="paper-date">${escapeHtml(date)}</div>
        <div class="paper-abstract">
          <strong>摘要：</strong><span id="paper-abstract-text"></span>
        </div>
      </header>
      <div class="paper-body ltx_page_content">
        ${htmlBody}
      </div>
    </article>
  </main>

  <script>
    (function () {
      var body = document.querySelector('.paper-body');
      var abs = document.getElementById('paper-abstract-text');
      if (body && abs) {
        var t = body.innerText.replace(/\\s+/g, ' ').trim().slice(0, 220);
        abs.textContent = t + (body.innerText.length > 220 ? '…' : '');
      }
    })();
  </script>
</body>
</html>`;
}

async function convertOne(docxPath) {
  const slug = slugFromFilename(docxPath);
  const outDir = path.join(WORKS_DIR, slug);
  const imagesDir = path.join(outDir, 'images');

  ensureDir(outDir);
  ensureDir(imagesDir);

  let imageIndex = 0;
  const options = {
    convertImage: mammoth.images.imgElement((image) =>
      image.read('base64').then((buffer) => {
        const ext = (image.contentType || 'image/png').split('/')[1] || 'png';
        const filename = `img-${++imageIndex}.${ext}`;
        fs.writeFileSync(path.join(imagesDir, filename), Buffer.from(buffer, 'base64'));
        return { src: `images/${filename}` };
      })
    ),
  };

  const result = await mammoth.convertToHtml({ path: docxPath }, options);
  const warnings = result.messages.filter((m) => m.type === 'warning');

  const fallbackTitle = slugFromFilename(docxPath);
  const title = extractTitle(result.value, fallbackTitle);
  const desc = extractAbstract(result.value);
  const stat = fs.statSync(docxPath);
  const date = stat.mtime.toISOString().slice(0, 10);

  fs.copyFileSync(docxPath, path.join(outDir, 'source.docx'));

  const pageHtml = buildArticlePage({
    title,
    htmlBody: result.value,
    date,
    sourceFile: docxPath,
  });

  fs.writeFileSync(path.join(outDir, 'index.html'), pageHtml, 'utf8');
  fs.writeFileSync(
    path.join(outDir, 'meta.json'),
    JSON.stringify(
      { title, slug, desc, date, htmlUrl: `works/${slug}/index.html`, sourceDocx: 'source.docx' },
      null,
      2
    ),
    'utf8'
  );

  return { title, slug, desc, date, warnings, htmlUrl: `works/${slug}/index.html` };
}

function collectDocxFiles(args) {
  const files = new Set();

  if (args.length === 0 || args.includes('--all') || !args.some((a) => a.toLowerCase().endsWith('.docx'))) {
    if (fs.existsSync(INPUT_DIR)) {
      fs.readdirSync(INPUT_DIR)
        .filter((f) => f.toLowerCase().endsWith('.docx'))
        .forEach((f) => files.add(path.join(INPUT_DIR, f)));
    }
  }

  if (args.includes('--all') && fs.existsSync(POSTS_DIR)) {
    fs.readdirSync(POSTS_DIR)
      .filter((f) => f.toLowerCase().endsWith('.docx'))
      .forEach((f) => files.add(path.join(POSTS_DIR, f)));
  }

  args
    .filter((a) => a.toLowerCase().endsWith('.docx'))
    .forEach((a) => files.add(path.resolve(a)));

  return [...files];
}

function writeManifest(entries) {
  ensureDir(WORKS_DIR);
  const manifest = {
    updated: new Date().toISOString(),
    works: entries.sort((a, b) => (b.date || '').localeCompare(a.date || '')),
  };
  fs.writeFileSync(path.join(WORKS_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

  const js = `// 自动生成 — 运行 npm run convert 后更新\nwindow.WORKS_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`;
  fs.writeFileSync(path.join(SITE, 'js', 'works-data.js'), js, 'utf8');
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--');
  ensureDir(INPUT_DIR);

  const docxFiles = collectDocxFiles(args);
  if (docxFiles.length === 0) {
    console.log('未找到 .docx 文件。');
    console.log('请将 Word 文档放入: site/input/');
    console.log('或运行: node docx-to-html.js --all  （扫描 source/_posts/）');
    process.exit(0);
  }

  const existingManifest = fs.existsSync(path.join(WORKS_DIR, 'manifest.json'))
    ? JSON.parse(fs.readFileSync(path.join(WORKS_DIR, 'manifest.json'), 'utf8'))
    : { works: [] };

  const bySlug = new Map(existingManifest.works.map((w) => [w.slug, w]));

  console.log(`找到 ${docxFiles.length} 个 Word 文档，开始转换…\n`);

  for (const file of docxFiles) {
    try {
      const entry = await convertOne(file);
      bySlug.set(entry.slug, {
        title: entry.title,
        slug: entry.slug,
        desc: entry.desc,
        date: entry.date,
        tags: 'Word 导入',
        github: '',
        htmlUrl: entry.htmlUrl,
        image: 'images/banner.jpg',
      });
      console.log(`✓ ${path.basename(file)} → works/${entry.slug}/index.html`);
      entry.warnings.forEach((w) => console.log(`  ⚠ ${w.message}`));
    } catch (err) {
      console.error(`✗ ${path.basename(file)}: ${err.message}`);
    }
  }

  writeManifest([...bySlug.values()]);
  console.log('\n已更新 site/works/manifest.json 与 site/js/works-data.js');
  console.log('在浏览器打开 site/index.html 作品集即可查看。');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
