const products = [
  {
    id: "p1",
    title: "AI Lab Flow",
    author: "洛白_Studio",
    summary: "把实验记录、论文阅读、代码执行与知识回溯放进一个 AI 学术工作台，让研究流程从碎片变成闭环。",
    coverTag: "学术 / AI Agent",
    score: "98.2",
    cover:
      "linear-gradient(135deg, rgba(123,140,255,0.92), rgba(36,210,255,0.74)), radial-gradient(circle at bottom right, rgba(255,255,255,0.24), transparent 30%)",
    labels: ["学术", "TypeScript", "Python", "AI Agent", "知识管理"],
    likes: 1894,
    comments: 248,
    updatedAt: "5 分钟前",
    detailTitle: "从 GitHub 项目到评审可读的研究型产品介绍页",
    description:
      "平台会读取仓库结构和 README，提炼实验模块、知识流程和页面动线，再自动生成带解释感的介绍页面，让非技术评委也能快速理解项目价值。",
    architecture: ["仓库解析", "知识引擎", "工作台 UI"],
    workflow: ["导入仓库", "抽取模块关系", "生成解释页面", "发布并进入广场"],
    commentsList: [
      { author: "林风", text: "这类学术产品最难的是让外行也能看懂，你这个介绍页思路很好。" },
      { author: "七月", text: "如果后面能支持在线试玩入口，转化会更强。" }
    ]
  },
  {
    id: "p2",
    title: "Prompt Forge Plugin",
    author: "Aster_Code",
    summary: "一个把浏览器上下文、代码片段和操作目标组合成智能 Prompt 的插件系统，适合日常 vibe coding。",
    coverTag: "插件 / 自动化",
    score: "94.6",
    cover:
      "linear-gradient(135deg, rgba(157,124,255,0.9), rgba(255,111,145,0.72)), radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 30%)",
    labels: ["插件", "TypeScript", "自动化", "效率"],
    likes: 1432,
    comments: 173,
    updatedAt: "14 分钟前",
    detailTitle: "让插件类产品也能拥有完整的展示与传播页面",
    description:
      "插件产品通常难以展示，这个平台用卡片、流程图和评论区把轻量产品也变成可传播、可理解、可讨论的作品对象。",
    architecture: ["浏览器上下文", "规则模板", "输出引擎"],
    workflow: ["捕获上下文", "生成提示词", "一键发送给目标应用", "用户复盘效果"],
    commentsList: [
      { author: "Aki", text: "插件类项目过去最怕没人知道能干嘛，这个平台切中痛点。" },
      { author: "清远", text: "卡片样式很适合拿去社交传播。" }
    ]
  },
  {
    id: "p3",
    title: "Life Orbit",
    author: "河图",
    summary: "以生活任务为中心的个人效率工具，把提醒、计划、习惯和 AI 建议融合成一个循环仪表盘。",
    coverTag: "生活工具 / 效率",
    score: "91.3",
    cover:
      "linear-gradient(135deg, rgba(36,210,255,0.88), rgba(70,223,158,0.66)), radial-gradient(circle at center right, rgba(255,255,255,0.18), transparent 30%)",
    labels: ["生活工具", "Go", "效率", "自动化"],
    likes: 1160,
    comments: 102,
    updatedAt: "31 分钟前",
    detailTitle: "适合大众用户的轻应用，也能被包装成有吸引力的作品卡",
    description:
      "除了程序员产品，生活工具也能通过统一的作品结构获得高质量展示，包括价值摘要、预览图、应用路径和社区讨论。",
    architecture: ["任务中心", "AI 建议", "数据同步"],
    workflow: ["记录日程", "系统整理优先级", "AI 提供建议", "结果回写面板"],
    commentsList: [
      { author: "闻川", text: "这个产品页看起来像小型发布会页面，适合比赛展示。" },
      { author: "Sora", text: "评委会比较容易被‘可视化工作流’这一块打动。" }
    ]
  },
  {
    id: "p4",
    title: "Office Weaver",
    author: "沈砚",
    summary: "把会议纪要、任务拆解、邮件回复和资料整理编织成一个办公自动化产品，强调团队协作。",
    coverTag: "办公 / 协作",
    score: "89.5",
    cover:
      "linear-gradient(135deg, rgba(255,111,145,0.88), rgba(255,196,83,0.72)), radial-gradient(circle at bottom left, rgba(255,255,255,0.22), transparent 34%)",
    labels: ["办公", "Java", "效率", "协作"],
    likes: 972,
    comments: 88,
    updatedAt: "1 小时前",
    detailTitle: "从复杂办公流程里提炼出评委能快速理解的价值路径",
    description:
      "系统自动把项目中的关键角色、流程节点和结果面板拆出来，使产品介绍页既专业又不失观感，适合展示面向组织的产品方案。",
    architecture: ["会议输入", "任务编排", "结果触达"],
    workflow: ["上传会议材料", "模型拆解任务", "自动生成邮件与待办", "团队追踪反馈"],
    commentsList: [
      { author: "长风", text: "如果你比赛现场讲‘复杂产品如何被 AI 变得可理解’，会很有记忆点。" },
      { author: "Rin", text: "这套 DEMO 很适合路演展示。" }
    ]
  }
];

const feedItems = [
  {
    user: "洛白_Studio",
    time: "2 分钟前",
    content: "发布了新版本的 AI Lab Flow，并重新生成了产品介绍页，把学术流程拆成四段可视化故事。",
    productId: "p1"
  },
  {
    user: "Aster_Code",
    time: "17 分钟前",
    content: "转发了 Prompt Forge Plugin，并补充了新的插件场景预览图。",
    productId: "p2"
  },
  {
    user: "沈砚",
    time: "41 分钟前",
    content: "更新了 Office Weaver 的办公自动化流程图，新增评论区置顶说明。",
    productId: "p4"
  }
];

const contacts = [
  {
    id: "c1",
    name: "林深时见鹿",
    sub: "刚分享了一个学术产品卡片",
    active: true,
    messages: [
      { from: "other", content: "你这个平台最强的地方，是把产品讲明白这件事做成了标准流程。", time: "19:22", read: "已读" },
      { from: "self", content: "我准备在比赛现场先演示首页广场，再切到后台点一下一键生成。", time: "19:24", read: "已读" },
      { from: "other", content: "这样很好，评委先看到效果，再看到生成过程，记忆点会更强。", time: "19:26", read: "已读" },
      { from: "self", content: "我把这个 AI 学术助手产品卡片发给你，你看看有没有合作空间。", time: "19:28", read: "已送达" }
    ]
  },
  {
    id: "c2",
    name: "七月",
    sub: "想看你的后台生成流程",
    active: false,
    messages: [
      { from: "other", content: "后台如果能看到生成进度条，路演会更直观。", time: "18:05", read: "已读" }
    ]
  },
  {
    id: "c3",
    name: "Aki",
    sub: "对插件产品很感兴趣",
    active: false,
    messages: [
      { from: "other", content: "我想把 Prompt Forge Plugin 转发给导师看看。", time: "昨天", read: "已读" }
    ]
  }
];

let currentProductId = "p1";
let currentContactId = "c1";
let autoPlayTimer;

const productGrid = document.getElementById("productGrid");
const detailPanel = document.getElementById("detailPanel");
const feedList = document.getElementById("feedList");
const contactList = document.getElementById("contactList");
const chatMessages = document.getElementById("chatMessages");
const chatTitle = document.getElementById("chatTitle");
const sharedCard = document.getElementById("sharedCard");
const generateBtn = document.getElementById("generateBtn");
const pipeline = document.getElementById("pipeline");
const generatedBoard = document.getElementById("generatedBoard");

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-cover" style="background:${product.cover}">
          <span class="cover-badge badge hot">${product.coverTag}</span>
          <div class="cover-score">
            <span>热度分</span>
            <strong>${product.score}</strong>
          </div>
        </div>
        <div class="product-body">
          <div class="product-author">
            <div>
              <strong>${product.title}</strong>
              <p class="product-summary">作者 ID：${product.author}</p>
            </div>
            <span class="badge">${product.updatedAt}</span>
          </div>
          <p class="product-summary">${product.summary}</p>
          <div class="label-cluster">
            ${product.labels.map((label) => `<span class="label-block"><span>标签</span><strong>${label}</strong></span>`).join("")}
          </div>
          <div class="stats-row">
            <span>点赞 ${formatNumber(product.likes)}</span>
            <span>评论 ${formatNumber(product.comments)}</span>
          </div>
        </div>
      </article>
    `
    )
    .join("");

  productGrid.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      currentProductId = card.dataset.productId;
      renderDetail();
      renderSharedCard();
    });
  });
}

function renderDetail() {
  const product = products.find((item) => item.id === currentProductId);
  detailPanel.innerHTML = `
    <div class="detail-cover" style="background:${product.cover}">
      <p class="eyebrow">作品介绍页</p>
      <h3>${product.title}</h3>
      <p class="detail-desc">${product.detailTitle}</p>
    </div>
    <div class="detail-head">
      <div>
        <strong>${product.author}</strong>
        <p class="detail-desc">${product.summary}</p>
      </div>
      <span class="badge hot">${product.updatedAt}</span>
    </div>

    <section class="detail-section">
      <div class="detail-section-title">
        <strong>架构图</strong>
        <a class="muted-link" href="javascript:void(0)">查看原始仓库</a>
      </div>
      <div class="diagram-grid">
        ${product.architecture.map((item) => `<div class="diagram-node"><strong>${item}</strong><p class="detail-desc">自动分析得到的核心模块</p></div>`).join("")}
      </div>
    </section>

    <section class="detail-section">
      <div class="detail-section-title">
        <strong>工作流程图</strong>
        <span class="badge">作者可重排</span>
      </div>
      <div class="flow-track">
        ${product.workflow.map((item, index) => `<div class="flow-step"><strong>${index + 1}. ${item}</strong></div>`).join("")}
      </div>
    </section>

    <section class="detail-section">
      <div class="detail-section-title">
        <strong>评论区</strong>
        <span class="badge">${formatNumber(product.comments)} 条评论</span>
      </div>
      <div class="comment-list">
        ${product.commentsList.map((comment) => `<div class="comment-item"><strong>${comment.author}</strong><p>${comment.text}</p></div>`).join("")}
      </div>
    </section>
  `;
}

function renderFeed() {
  feedList.innerHTML = feedItems
    .map((item) => {
      const product = products.find((productItem) => productItem.id === item.productId);
      return `
        <article class="feed-card">
          <div class="feed-top">
            <div>
              <p class="eyebrow">关注动态</p>
              <h2>${item.user}</h2>
            </div>
            <span class="badge">${item.time}</span>
          </div>
          <p class="feed-copy">${item.content}</p>
          <div class="feed-product">
            <strong>${product.title}</strong>
            <p class="feed-copy">${product.summary}</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderContacts() {
  contactList.innerHTML = contacts
    .map(
      (contact) => `
      <article class="contact ${contact.id === currentContactId ? "active" : ""}" data-contact-id="${contact.id}">
        <div class="contact-name">
          <strong>${contact.name}</strong>
          <span class="badge">${contact.id === "c1" ? "在线" : "最近"}</span>
        </div>
        <p class="contact-sub">${contact.sub}</p>
      </article>
    `
    )
    .join("");

  contactList.querySelectorAll(".contact").forEach((contactNode) => {
    contactNode.addEventListener("click", () => {
      currentContactId = contactNode.dataset.contactId;
      renderContacts();
      renderChat();
    });
  });
}

function renderChat() {
  const contact = contacts.find((item) => item.id === currentContactId);
  chatTitle.textContent = contact.name;
  chatMessages.innerHTML = contact.messages
    .map(
      (message) => `
      <div class="message-row ${message.from === "self" ? "self" : ""}">
        <div class="message-bubble">
          <div>${message.content}</div>
          <div class="message-meta">
            <span>${message.time}</span>
            <span>${message.read}</span>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function renderSharedCard() {
  const product = products.find((item) => item.id === currentProductId);
  sharedCard.innerHTML = `
    <p class="eyebrow">会话内共享作品</p>
    <h3>${product.title}</h3>
    <p class="detail-desc">${product.summary}</p>
    <div class="label-cluster">
      ${product.labels.slice(0, 4).map((label) => `<span class="badge">${label}</span>`).join("")}
    </div>
    <div class="stats-row">
      <span>点赞 ${formatNumber(product.likes)}</span>
      <span>评论 ${formatNumber(product.comments)}</span>
    </div>
  `;
}

function switchView(view) {
  document.body.dataset.view = view;
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.toggle("active", section.id === `view-${view}`);
  });
}

function resetPipeline() {
  generatedBoard.innerHTML = `
    <div class="board-empty">
      <h4>等待生成</h4>
      <p>点击左侧按钮后，这里会展示架构图、工作流、预览图和介绍页模块。</p>
    </div>
  `;

  pipeline.querySelectorAll(".pipeline-step").forEach((step) => {
    step.classList.remove("running", "done");
    step.classList.add("pending");
  });
}

function runPipeline() {
  resetPipeline();
  const steps = [...pipeline.querySelectorAll(".pipeline-step")];
  let currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep > 0) {
      steps[currentStep - 1].classList.remove("running");
      steps[currentStep - 1].classList.add("done");
    }

    if (currentStep === steps.length) {
      clearInterval(interval);
      generatedBoard.innerHTML = `
        <div class="generated-grid">
          <div class="generated-item wide">
            <div class="result-stats">
              <div>
                <span>识别模块</span>
                <strong>18 个</strong>
              </div>
              <div>
                <span>生成图片</span>
                <strong>3 张</strong>
              </div>
              <div>
                <span>HTML 模块</span>
                <strong>6 块</strong>
              </div>
              <div>
                <span>生成状态</span>
                <strong>可发布草稿</strong>
              </div>
            </div>
            <strong>介绍页整体预览</strong>
            <p>这一块用来直接告诉评委：平台不是只分析代码，而是把代码转译成一个完整、可读、可传播的作品介绍页。</p>
            <div class="page-preview">
              <div class="page-flow">
                <div class="page-flow-row">
                  <div class="page-box">封面区</div>
                  <div class="page-arrow">→</div>
                  <div class="page-box">一句话价值</div>
                  <div class="page-arrow">→</div>
                  <div class="page-box">作者信息</div>
                </div>
                <div class="page-flow-row">
                  <div class="page-box">架构图</div>
                  <div class="page-arrow">→</div>
                  <div class="page-box">工作流程图</div>
                  <div class="page-arrow">→</div>
                  <div class="page-box">应用案例</div>
                </div>
                <div class="page-flow-row">
                  <div class="page-box">预览图</div>
                  <div class="page-arrow">→</div>
                  <div class="page-box">评论区</div>
                  <div class="page-arrow">→</div>
                  <div class="page-box">仓库链接</div>
                </div>
              </div>
            </div>
          </div>
          <div class="generated-item">
            <strong>代码架构图</strong>
            <p>自动拆出仓库解析层、工作流引擎、展示端三大结构，让评委快速理解系统构成。</p>
            <div class="mini-diagram">
              <span></span><span></span><span></span>
            </div>
          </div>
          <div class="generated-item">
            <strong>产品工作流程图</strong>
            <p>围绕“提交链接 -> 分析代码 -> 生成内容 -> 发布到广场”的核心路径生成说明。</p>
            <div class="mini-diagram">
              <span></span><span></span><span></span><span></span>
            </div>
          </div>
          <div class="generated-item">
            <strong>AI 预览图建议</strong>
            <p>深色科技风、左侧工作台、中间知识流、右侧生成面板，突出研究型产品场景。</p>
            <div class="preview-gallery">
              <div class="gallery-shot"></div>
              <div class="gallery-shot"></div>
              <div class="gallery-shot"></div>
            </div>
          </div>
          <div class="generated-item">
            <strong>HTML 介绍页草稿</strong>
            <p>作者可继续调整布局块、颜色、大小和顺序，再决定是直接发布还是先存草稿。</p>
            <div class="html-preview">
              Hero 区展示价值摘要，随后放架构图和工作流，再展示应用案例与评论区。
            </div>
          </div>
        </div>
      `;
      return;
    }

    steps[currentStep].classList.remove("pending");
    steps[currentStep].classList.add("running");
    currentStep += 1;
  }, 700);
}

function initTabs() {
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      stopAutoPlay();
      switchView(button.dataset.view);
    });
  });
}

function playAutoDemo() {
  stopAutoPlay();
  const sequence = [
    () => switchView("home"),
    () => {
      currentProductId = "p2";
      renderDetail();
      renderSharedCard();
    },
    () => switchView("feed"),
    () => switchView("message"),
    () => switchView("studio"),
    () => runPipeline(),
    () => switchView("profile")
  ];

  let index = 0;
  sequence[index]();
  autoPlayTimer = setInterval(() => {
    index += 1;
    if (index >= sequence.length) {
      stopAutoPlay();
      return;
    }
    sequence[index]();
  }, 1800);
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
}

document.getElementById("autoPlayBtn").addEventListener("click", playAutoDemo);
generateBtn.addEventListener("click", runPipeline);

renderProducts();
renderDetail();
renderFeed();
renderContacts();
renderChat();
renderSharedCard();
initTabs();
switchView("home");
