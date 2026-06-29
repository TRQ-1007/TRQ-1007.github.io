(function () {
  'use strict';

  const STORAGE_KEY = 'blog_works';

  const phrases = [
    '计算机视觉爱好者',
    '独立开发者',
    '技术博客作者',
    '在校本科生',
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const typedEl = document.getElementById('typed-text');

  function typeEffect() {
    if (!typedEl) return;
    const current = phrases[phraseIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeEffect, 2000);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(typeEffect, deleting ? 50 : 120);
  }

  typeEffect();

  /* ===== 联系方式抽屉 ===== */
  const overlay = document.getElementById('contact-overlay');
  const drawer = document.getElementById('contact-drawer');
  const trigger = document.getElementById('contact-trigger');
  const closeBtn = document.getElementById('contact-close');

  function openContact() {
    overlay.classList.add('open');
    drawer.classList.add('open');
  }

  function closeContact() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
  }

  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openContact();
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeContact);
  if (overlay) overlay.addEventListener('click', closeContact);

  /* ===== 导航高亮 ===== */
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((s) => observer.observe(s));

  /* ===== 作品集轮播 ===== */
  const defaultWorks = [
    {
      title: '对于 Transformer 的一点心得',
      desc: '关于 Transformer 架构的学习笔记与思考，记录对自注意力机制的理解。',
      tags: '深度学习, Transformer, 笔记',
      github: '',
      image: 'images/banner.jpg',
    },
    {
      title: 't-SNE 数据降维与可视化',
      desc: '介绍 t-SNE 非线性降维方法的原理与使用步骤，用于高维数据可视化。',
      tags: '机器学习, 降维, 可视化',
      github: '',
      image: 'images/banner.jpg',
    },
    {
      title: 'SVD 矩阵奇异值分解',
      desc: '从特征分解出发理解 SVD，探讨其物理意义与奇异值的求解方法。',
      tags: '线性代数, SVD, 数学',
      github: '',
      image: 'images/banner.jpg',
    },
    {
      title: '变分自编码器',
      desc: '朴素编码器-解码器原理与 VAE 如何解决后验分布对齐问题。',
      tags: '深度学习, VAE, 生成模型',
      github: '',
      image: 'images/banner.jpg',
    },
  ];

  function loadWorks() {
    const fromManifest = window.WORKS_MANIFEST && window.WORKS_MANIFEST.works;
    if (fromManifest && fromManifest.length > 0) {
      return fromManifest.map((w) => ({
        title: w.title,
        desc: w.desc || '',
        tags: w.tags || '文章',
        github: w.github || '',
        htmlUrl: w.htmlUrl || '',
        image: w.image || 'images/banner.jpg',
      }));
    }

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (saved.length > 0) {
        return saved.map((w) => ({
          title: w.title,
          desc: w.desc || stripHtml(w.content).slice(0, 120) + '…',
          tags: w.tags || '文章',
          github: w.github || '',
          htmlUrl: w.htmlUrl || '',
          image: w.image || 'images/banner.jpg',
        }));
      }
    } catch { /* ignore */ }
    return defaultWorks;
  }

  function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  }

  const works = loadWorks();
  let currentIdx = 0;

  const numEl = document.getElementById('portfolio-num');
  const titleEl = document.getElementById('portfolio-title');
  const descEl = document.getElementById('portfolio-desc');
  const tagsEl = document.getElementById('portfolio-tags');
  const imgEl = document.getElementById('portfolio-img');
  const githubEl = document.getElementById('portfolio-github');
  const readEl = document.getElementById('portfolio-read');
  const prevBtn = document.getElementById('portfolio-prev');
  const nextBtn = document.getElementById('portfolio-next');

  function renderPortfolio(idx) {
    if (works.length === 0) {
      titleEl.textContent = '暂无作品';
      descEl.textContent = '请前往后台撰写文章';
      tagsEl.textContent = '';
      return;
    }
    const w = works[idx];
    numEl.textContent = String(idx + 1).padStart(2, '0');
    titleEl.textContent = w.title;
    descEl.textContent = w.desc;
    tagsEl.textContent = w.tags;
    imgEl.src = w.image;
    imgEl.alt = w.title;

    if (w.github) {
      githubEl.href = w.github;
      githubEl.classList.remove('hidden');
    } else {
      githubEl.classList.add('hidden');
    }

    if (w.htmlUrl) {
      readEl.href = w.htmlUrl;
      readEl.classList.remove('hidden');
      readEl.title = '阅读 HTML 版';
    } else {
      readEl.classList.add('hidden');
    }

    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === works.length - 1;
    prevBtn.classList.toggle('active', idx > 0);
    nextBtn.classList.toggle('active', idx < works.length - 1);
  }

  prevBtn.addEventListener('click', () => {
    if (currentIdx > 0) {
      currentIdx--;
      renderPortfolio(currentIdx);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIdx < works.length - 1) {
      currentIdx++;
      renderPortfolio(currentIdx);
    }
  });

  renderPortfolio(0);
})();
