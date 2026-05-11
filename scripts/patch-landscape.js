const fs = require('fs');
const path = require('path');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function appendIfMissing(filePath, marker, appendix) {
  const base = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  if (base.includes(marker)) return;
  writeFile(filePath, base.replace(/\s*$/, '') + appendix);
}

function main() {
  const themeRoot = path.join(__dirname, '..', 'node_modules', 'hexo-theme-landscape');

  if (!fs.existsSync(themeRoot)) {
    return;
  }

  writeFile(
    path.join(themeRoot, '_config.yml'),
    [
      '# ===============',
      '# Header',
      '# ===============',
      '# Navigation menu',
      'menu: {}',
      '# RSS link',
      'rss: /atom.xml',
      '# Path of title banner image of page top',
      'banner: "/images/banner.jpg"',
      '# Subtitle of page top',
      'subtitle:',
      '# Header links with icon, specified links will appear at the top right corner of the page',
      '# Each name must correspond to the icon name of Fork Awesome',
      '# https://forkaweso.me/Fork-Awesome/icons/',
      'links:',
      '# ===============',
      '# Content',
      '# ===============',
      '# "Read More" link at the bottom of excerpted articles. `false` to hide the link.',
      'excerpt_link: Read More',
      '# Enable fancybox',
      'fancybox: true',
      '# ===============',
      '# Footer',
      '# ===============',
      'copyright:',
      '# ===============',
      '# Sidebar',
      '# ===============',
      '# Sidebar style. You can choose `left`, `right`, `bottom` or `false`.',
      'sidebar: right',
      '# Widgets displaying in sidebar',
      'widgets: []',
      '# ===============',
      '# Widget behavior',
      '# ===============',
      "archive_type: 'monthly'",
      'show_count: false',
      '# How many posts display in Home page.',
      'recent_posts_limits: 5',
      '# ===============',
      '# Miscellaneous',
      '# ===============',
      'google_analytics:',
      'gauges_analytics:',
      '# Favicon path',
      'favicon: /favicon.png',
      '# Twitter ID',
      'twitter:',
      'fb_admins:',
      'fb_app_id:',
      '# ===============',
      '# Comment system',
      '# ===============',
      'disqus_shortname:',
      '# valine comment system. https://valine.js.org',
      'valine:',
      '  enable: false',
      '  appId:',
      '  appKey:',
      '  notify: false',
      '  verify: false',
      '  pageSize: 10',
      '  avatar: mm',
      '  lang: zh-cn',
      '  placeholder: Just go go',
      '  guest_info: nick,mail,link',
      '',
    ].join('\n'),
  );

  writeFile(
    path.join(themeRoot, 'layout', '_partial', 'sidebar.ejs'),
    [
      '<aside id="sidebar"<% if (theme.sidebar === \'bottom\'){ %> class="outer"<% } %>>',
      '  <div class="widget-wrap">',
      '    <h3 class="widget-title">关注我</h3>',
      '    <div class="widget">',
      '      <div class="sidebar-links">',
      '        <% if (theme.links) { %>',
      '          <% for (const i in theme.links) {%>',
      '            <% if (i === \'envelope\') { %>',
      '              <a target="_blank" rel="noopener" href="<%- url_for(theme.links[i]) %>" title="邮箱"><span class="fa fa-envelope"></span></a>',
      '            <% } else { %>',
      '              <a target="_blank" rel="noopener" href="<%- url_for(theme.links[i]) %>" title="<%= i %>"><span class="fa fa-<%= i %>"></span></a>',
      '            <% } %>',
      '          <% } %>',
      '        <% } %>',
      '      </div>',
      '      <div class="sidebar-contact">',
      '        <div><a href="mailto:261408652@qq.com">261408652@qq.com</a></div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '',
      '  <% theme.widgets.forEach(function(widget){ %>',
      '    <%- partial(\'_widget/\' + widget) %>',
      '  <% }) %>',
      '</aside>',
      '',
    ].join('\n'),
  );

  appendIfMissing(
    path.join(themeRoot, 'source', 'css', '_partial', 'sidebar-aside.styl'),
    '\n.sidebar-links\n',
    [
      '',
      '.sidebar-links',
      '  display: flex',
      '  gap: 10px',
      '  margin-bottom: 10px',
      '  a',
      '    display: inline-flex',
      '    align-items: center',
      '    justify-content: center',
      '    width: 28px',
      '    height: 28px',
      '    border: 1px solid color-widget-border',
      '    border-radius: 6px',
      '    background: #fff',
      '    text-decoration: none',
      '    span',
      '      font-size: 16px',
      '',
      '.sidebar-contact',
      '  line-height: 1.6',
      '',
      '.widget',
      '  background: #fff',
      '  box-shadow: none',
      '  border: 1px solid rgba(0, 0, 0, 0.08)',
      '  text-shadow: none',
      '',
    ].join('\n'),
  );

  appendIfMissing(
    path.join(themeRoot, 'source', 'css', '_partial', 'header.styl'),
    '\n#header-inner\n  position: absolute\n',
    [
      '',
      '#header-inner',
      '  position: absolute',
      '  left: 0',
      '  right: 0',
      '  bottom: 0',
      '  background: rgba(255, 255, 255, 0.96)',
      '  border-top: 1px solid rgba(0, 0, 0, 0.08)',
      '',
      '#header-inner .main-nav-link,',
      '#header-inner .nav-icon',
      '  color: #444',
      '  text-shadow: none',
      '  opacity: 0.9',
      '',
      '#header-inner .main-nav-link:hover,',
      '#header-inner .nav-icon:hover',
      '  opacity: 1',
      '  color: #111',
      '',
      '#logo,',
      '#subtitle',
      '  font-weight: 200',
      '',
      '#logo',
      '  font-size: logo-size * 1.15',
      '  line-height: logo-size * 1.15',
      '',
    ].join('\n'),
  );
}

main();
