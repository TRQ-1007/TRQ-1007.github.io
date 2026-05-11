# Hexo 日记式博客（带浏览器写作后台）

这个仓库是一个 Hexo 博客站点：你在自己电脑上写内容、生成静态页面，然后把生成出来的静态文件发布到一个可访问的地方（GitHub Pages / 服务器 / Netlify 等），别人就能像访问网站一样浏览；只有你能写内容。

## 1. 环境准备

- 安装 Node.js（建议 LTS 版本）

## 2. 安装依赖

在本仓库目录执行：

```bash
npm install
```

## 3. 以“记事本/日记”方式写博客（浏览器后台）

本项目已加入 `hexo-admin`，会在本机启动一个写作后台。

```bash
npm run server
```

- 预览首页：`http://localhost:4000/`
- 写作后台：`http://localhost:4000/admin/`

安全说明：
- 已在 `_config.yml` 把本地服务绑定到 `127.0.0.1`，只能本机访问
- 不要把这个带 `/admin/` 的服务直接暴露到公网

## 4. 新建/编辑文章

两种方式都可以：

- 浏览器后台：在 `/admin/` 里新建、编辑、发布
- 命令行新建（可选）：

```bash
npx hexo new "我的新日记"
```

文章会生成在 `source/_posts/` 下（Markdown）。

## 5. 生成静态站点

```bash
npm run build
```

生成结果在 `public/` 目录。把 `public/` 整个目录发布出去，别人就能访问你的“网站”。

## 6. 评论/点赞（Giscus）

本项目已内置 Giscus 注入逻辑，但默认不开启（需要你先创建配置）。

开启步骤：

1. 准备一个 GitHub 仓库（可以就是这个博客仓库），并启用 Discussions
2. 打开 https://giscus.app/ 按页面指引生成配置参数
3. 把生成出来的值填到 `_config.yml` 里的 `giscus`：

- `enable: true`
- `repo` / `repo_id`
- `category` / `category_id`

填完后重新生成或重启服务即可看到评论区；访客用 GitHub 登录后可评论，也可以用表情反应当作“点赞”。

