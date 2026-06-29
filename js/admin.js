(function () {
  'use strict';

  const STORAGE_KEY = 'blog_works';

  let works = [];
  let currentId = null;

  const postList = document.getElementById('post-list');
  const postTitle = document.getElementById('post-title');
  const editor = document.getElementById('editor');
  const docStatus = document.getElementById('doc-status');
  const toast = document.getElementById('toast');

  function showToast(msg, duration) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), duration || 2800);
  }

  function loadAll() {
    try {
      works = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      works = [];
    }
  }

  function saveAll() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function formatDate(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  }

  function renderList() {
    postList.innerHTML = '';
    if (works.length === 0) {
      postList.innerHTML = '<li class="empty-hint">暂无作品，点击「新建」开始写作</li>';
      return;
    }
    works.forEach((w) => {
      const li = document.createElement('li');
      li.className = w.id === currentId ? 'active' : '';
      li.dataset.id = w.id;
      const badge = w.published ? '<span class="pub-badge">已发布</span>' : '';
      li.innerHTML = `
        <div class="post-name">${escapeHtml(w.title || '无标题')}${badge}</div>
        <div class="post-date">${w.date || ''}</div>
      `;
      li.addEventListener('click', () => openWork(w.id));
      postList.appendChild(li);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function newWork() {
    currentId = null;
    postTitle.value = '';
    editor.innerHTML = '<p>在此开始写作…</p>';
    docStatus.textContent = '新建文档';
    renderList();
    postTitle.focus();
  }

  function openWork(id) {
    const w = works.find((x) => x.id === id);
    if (!w) return;
    currentId = id;
    postTitle.value = w.title || '';
    editor.innerHTML = w.content || '<p></p>';
    docStatus.textContent = w.published ? '已加载（已发布）' : '已加载';
    renderList();
  }

  function finishWork() {
    const title = postTitle.value.trim();
    if (!title) {
      showToast('请先输入标题');
      postTitle.focus();
      return false;
    }

    const content = editor.innerHTML;
    const desc = stripHtml(content).slice(0, 150);
    const now = formatDate(new Date());

    if (currentId) {
      const idx = works.findIndex((x) => x.id === currentId);
      if (idx >= 0) {
        works[idx] = { ...works[idx], title, content, desc, updated: now };
      }
    } else {
      currentId = uid();
      works.unshift({
        id: currentId,
        title,
        content,
        desc,
        tags: '文章',
        github: '',
        image: 'images/banner.jpg',
        date: now,
        updated: now,
        slug: GitHubPublish.slugify(title),
      });
    }

    saveAll();
    renderList();
    docStatus.textContent = '已保存';
    return true;
  }

  async function publishWork() {
    if (!finishWork()) return;

    const cfg = GitHubPublish.loadConfig();
    if (!cfg.token) {
      showToast('请先配置 GitHub Token');
      openGithubModal();
      return;
    }

    const w = works.find((x) => x.id === currentId);
    if (!w) return;

    const btn = document.getElementById('btn-publish');
    btn.disabled = true;
    docStatus.textContent = '正在发布…';

    try {
      const result = await GitHubPublish.publishWork(w, (msg) => {
        docStatus.textContent = msg;
      });

      w.slug = result.slug;
      w.published = true;
      w.htmlUrl = result.htmlUrl;
      saveAll();
      renderList();

      docStatus.textContent = '发布成功';
      showToast('已提交 GitHub，约 1～3 分钟后线上可见', 4000);
    } catch (e) {
      docStatus.textContent = '发布失败';
      showToast('发布失败: ' + e.message, 4000);
      console.error(e);
    } finally {
      btn.disabled = false;
    }
  }

  function deleteWork() {
    if (!currentId) {
      showToast('没有可删除的作品');
      return;
    }
    const w = works.find((x) => x.id === currentId);
    if (!confirm(`确定删除「${w?.title || '无标题'}」？（仅删除本地草稿，不影响已发布内容）`)) return;

    works = works.filter((x) => x.id !== currentId);
    saveAll();
    newWork();
    showToast('已删除');
  }

  function insertImage() {
    const url = prompt('请输入图片地址（或相对路径）:', 'images/banner.jpg');
    if (!url) return;
    editor.focus();
    document.execCommand('insertImage', false, url);
  }

  function insertVideo() {
    const url = prompt('请输入视频地址:', 'https://');
    if (!url) return;
    editor.focus();
    const video = document.createElement('video');
    video.src = url;
    video.controls = true;
    video.style.maxWidth = '100%';
    const sel = window.getSelection();
    if (sel.rangeCount) {
      sel.getRangeAt(0).insertNode(video);
    } else {
      editor.appendChild(video);
    }
  }

  async function importWord(file) {
    if (!file || !window.mammoth) {
      showToast('无法加载 Word 转换库');
      return;
    }
    docStatus.textContent = '正在转换 Word…';
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml(
        { arrayBuffer },
        {
          convertImage: mammoth.images.imgElement((image) =>
            image.read('base64').then((buffer) => ({
              src: 'data:' + image.contentType + ';base64,' + buffer,
            }))
          ),
        }
      );
      const baseName = file.name.replace(/\.docx$/i, '');
      postTitle.value = baseName;
      editor.innerHTML = result.value || '<p></p>';
      currentId = null;
      docStatus.textContent = 'Word 已导入';
      showToast('已导入，编辑后点「发布到网站」');
    } catch (e) {
      docStatus.textContent = '导入失败';
      showToast('Word 导入失败: ' + e.message);
    }
  }

  /* ===== GitHub 设置弹窗 ===== */
  const githubModal = document.getElementById('github-modal');

  function openGithubModal() {
    const cfg = GitHubPublish.loadConfig();
    document.getElementById('gh-token').value = cfg.token || '';
    document.getElementById('gh-owner').value = cfg.owner || 'TRQ-1007';
    document.getElementById('gh-repo').value = cfg.repo || 'TRQ-1007.github.io';
    document.getElementById('gh-branch').value = cfg.branch || 'main';
    document.getElementById('gh-prefix').value = cfg.pathPrefix || '';
    document.getElementById('gh-test-result').textContent = '';
    githubModal.hidden = false;
  }

  function closeGithubModal() {
    githubModal.hidden = true;
  }

  document.getElementById('btn-github-settings').addEventListener('click', openGithubModal);
  document.getElementById('github-modal-close').addEventListener('click', closeGithubModal);
  githubModal.addEventListener('click', (e) => {
    if (e.target === githubModal) closeGithubModal();
  });

  document.getElementById('gh-save').addEventListener('click', () => {
    GitHubPublish.saveConfig({
      token: document.getElementById('gh-token').value.trim(),
      owner: document.getElementById('gh-owner').value.trim(),
      repo: document.getElementById('gh-repo').value.trim(),
      branch: document.getElementById('gh-branch').value.trim() || 'main',
      pathPrefix: document.getElementById('gh-prefix').value,
    });
    showToast('GitHub 设置已保存');
    closeGithubModal();
  });

  document.getElementById('gh-test').addEventListener('click', async () => {
    GitHubPublish.saveConfig({
      token: document.getElementById('gh-token').value.trim(),
      owner: document.getElementById('gh-owner').value.trim(),
      repo: document.getElementById('gh-repo').value.trim(),
      branch: document.getElementById('gh-branch').value.trim() || 'main',
      pathPrefix: document.getElementById('gh-prefix').value,
    });
    const el = document.getElementById('gh-test-result');
    el.textContent = '测试中…';
    el.className = 'test-result';
    try {
      await GitHubPublish.testConnection();
      el.textContent = '连接成功，可以发布';
      el.className = 'test-result ok';
    } catch (e) {
      el.textContent = '连接失败: ' + e.message;
      el.className = 'test-result err';
    }
  });

  document.getElementById('btn-import-word').addEventListener('click', () => {
    document.getElementById('word-file-input').click();
  });

  document.getElementById('word-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) importWord(file);
    e.target.value = '';
  });

  document.getElementById('btn-new').addEventListener('click', newWork);
  document.getElementById('btn-insert-image').addEventListener('click', insertImage);
  document.getElementById('btn-insert-video').addEventListener('click', insertVideo);
  document.getElementById('btn-finish').addEventListener('click', () => {
    if (finishWork()) showToast('作品已保存（本地）');
  });
  document.getElementById('btn-publish').addEventListener('click', publishWork);
  document.getElementById('btn-delete').addEventListener('click', deleteWork);

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      if (finishWork()) showToast('作品已保存（本地）');
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      e.preventDefault();
      publishWork();
    }
  });

  loadAll();
  renderList();

  if (!GitHubPublish.loadConfig().token) {
    setTimeout(() => showToast('首次使用请先点击「GitHub 设置」填写 Token', 4500), 600);
  }
})();
