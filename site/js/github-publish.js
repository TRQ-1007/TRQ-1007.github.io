/**
 * GitHub Pages 发布模块
 * 通过 GitHub Contents API 提交 HTML 与索引文件
 */
(function (global) {
  'use strict';

  const CONFIG_KEY = 'github_publish_config';
  const DEFAULT_CONFIG = {
    owner: 'TRQ-1007',
    repo: 'TRQ-1007.github.io',
    branch: 'main',
    pathPrefix: '', // 空 = 仓库根目录（推荐，对应 trq-1007.github.io/）
  };

  function loadConfig() {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}') };
    } catch {
      return { ...DEFAULT_CONFIG };
    }
  }

  function saveConfig(cfg) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify({ ...loadConfig(), ...cfg }));
  }

  function repoPath(relative) {
    const prefix = (loadConfig().pathPrefix || '').replace(/^\/|\/$/g, '');
    const rel = relative.replace(/^\/+/, '');
    return prefix ? `${prefix}/${rel}` : rel;
  }

  function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function slugify(title) {
    return (
      title
        .replace(/[<>:"/\\|?*]/g, '')
        .replace(/\s+/g, '-')
        .trim() || 'untitled-' + Date.now()
    );
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

  function buildArticlePage({ title, htmlBody, date }) {
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
      </div>
      <a class="back-link" href="../../index.html#portfolio"><i class="fa fa-arrow-left"></i> 返回作品集</a>
    </div>
    <article class="article-paper">
      <header class="paper-header">
        <p class="paper-type">作品 · HTML 版</p>
        <h1 class="paper-title">${escapeHtml(title)}</h1>
        <div class="paper-authors">唐睿谦</div>
        <div class="paper-date">${escapeHtml(date)}</div>
        <div class="paper-abstract"><strong>摘要：</strong><span id="paper-abstract-text"></span></div>
      </header>
      <div class="paper-body ltx_page_content">${htmlBody}</div>
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

  function buildWorksDataJs(manifest) {
    return `// 由后台自动发布更新\nwindow.WORKS_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`;
  }

  async function ghRequest(method, apiPath, body) {
    const cfg = loadConfig();
    if (!cfg.token) throw new Error('请先在 GitHub 设置中填写 Token');

    const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}${apiPath}`;
    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${cfg.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (body) headers['Content-Type'] = 'application/json';

    const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data.message || `GitHub API 错误 (${res.status})`;
      throw new Error(msg);
    }
    return data;
  }

  async function getFileSha(relativePath) {
    const cfg = loadConfig();
    const path = repoPath(relativePath);
    try {
      const data = await ghRequest(
        'GET',
        `/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${cfg.branch}`
      );
      return data.sha;
    } catch {
      return null;
    }
  }

  async function putFile(relativePath, content, message) {
    const path = repoPath(relativePath);
    const sha = await getFileSha(relativePath);
    const body = {
      message,
      content: utf8ToBase64(content),
      branch: loadConfig().branch,
    };
    if (sha) body.sha = sha;

    return ghRequest(
      'PUT',
      `/contents/${path.split('/').map(encodeURIComponent).join('/')}`,
      body
    );
  }

  async function fetchManifest() {
    const cfg = loadConfig();
    const path = repoPath('works/manifest.json');
    const url = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${cfg.branch}`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${cfg.token}`,
      },
    });
    if (!res.ok) return { updated: new Date().toISOString(), works: [] };
    const meta = await res.json();
    const json = JSON.parse(atob(meta.content.replace(/\n/g, '')));
    return json;
  }

  async function testConnection() {
    const cfg = loadConfig();
    await ghRequest('GET', '');
    return cfg;
  }

  /**
   * 发布单篇作品到 GitHub Pages
   * @param {object} work - { title, content, desc, tags, date, slug? }
   */
  async function publishWork(work, onProgress) {
    const slug = work.slug || slugify(work.title);
    const date = work.date || new Date().toISOString().slice(0, 10);
    const desc = work.desc || '';
    const htmlUrl = `works/${slug}/index.html`;

    onProgress && onProgress('生成 HTML 页面…');
    const articleHtml = buildArticlePage({ title: work.title, htmlBody: work.content, date });
    const metaJson = JSON.stringify(
      { title: work.title, slug, desc, date, htmlUrl, tags: work.tags || '文章' },
      null,
      2
    );

    onProgress && onProgress('读取线上作品集索引…');
    let manifest;
    try {
      manifest = await fetchManifest();
    } catch {
      manifest = { updated: '', works: [] };
    }

    const entry = {
      title: work.title,
      slug,
      desc,
      date,
      tags: work.tags || '文章',
      github: work.github || '',
      htmlUrl,
      image: work.image || 'images/banner.jpg',
    };

    const idx = manifest.works.findIndex((w) => w.slug === slug);
    if (idx >= 0) manifest.works[idx] = entry;
    else manifest.works.unshift(entry);
    manifest.updated = new Date().toISOString();
    manifest.works.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const manifestJson = JSON.stringify(manifest, null, 2);
    const worksDataJs = buildWorksDataJs(manifest);

    onProgress && onProgress('上传到 GitHub…');
    await putFile(`works/${slug}/index.html`, articleHtml, `发布作品: ${work.title}`);
    await putFile(`works/${slug}/meta.json`, metaJson, `更新元信息: ${work.title}`);
    await putFile('works/manifest.json', manifestJson, `更新作品集索引: ${work.title}`);
    await putFile('js/works-data.js', worksDataJs, `更新作品集数据: ${work.title}`);

    return { slug, htmlUrl, manifest };
  }

  global.GitHubPublish = {
    loadConfig,
    saveConfig,
    testConnection,
    publishWork,
    slugify,
    repoPath,
    putFile,
  };
})(window);
