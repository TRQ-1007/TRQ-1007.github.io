'use strict';

const requiredKeys = ['repo', 'repo_id', 'category', 'category_id'];

function isEnabled(config) {
  if (!config || config.enable !== true) return false;
  return requiredKeys.every((k) => typeof config[k] === 'string' && config[k].trim().length > 0);
}

function toAttrValue(value) {
  if (value === undefined || value === null) return '';
  return String(value).replace(/"/g, '&quot;');
}

hexo.extend.filter.register('after_post_render', function (data) {
  const cfg = hexo.config.giscus;
  if (!isEnabled(cfg)) return data;
  if (data.layout !== 'post') return data;

  const theme = cfg.theme || 'preferred_color_scheme';
  const mapping = cfg.mapping || 'pathname';
  const inputPosition = cfg.input_position || 'bottom';
  const lang = cfg.lang || 'zh-CN';
  const strict = cfg.strict === 1 || cfg.strict === '1' ? '1' : '0';
  const reactionsEnabled =
    cfg.reactions_enabled === 0 || cfg.reactions_enabled === '0' ? '0' : '1';
  const emitMetadata = cfg.emit_metadata === 1 || cfg.emit_metadata === '1' ? '1' : '0';
  const loading = cfg.loading || 'lazy';

  const embed = [
    '<div class="giscus"></div>',
    '<script src="https://giscus.app/client.js"',
    `  data-repo="${toAttrValue(cfg.repo)}"`,
    `  data-repo-id="${toAttrValue(cfg.repo_id)}"`,
    `  data-category="${toAttrValue(cfg.category)}"`,
    `  data-category-id="${toAttrValue(cfg.category_id)}"`,
    `  data-mapping="${toAttrValue(mapping)}"`,
    `  data-strict="${toAttrValue(strict)}"`,
    `  data-reactions-enabled="${toAttrValue(reactionsEnabled)}"`,
    `  data-emit-metadata="${toAttrValue(emitMetadata)}"`,
    `  data-input-position="${toAttrValue(inputPosition)}"`,
    `  data-theme="${toAttrValue(theme)}"`,
    `  data-lang="${toAttrValue(lang)}"`,
    `  data-loading="${toAttrValue(loading)}"`,
    '  crossorigin="anonymous"',
    '  async>',
    '</script>',
  ].join('\n');

  data.content += `\n\n${embed}\n`;
  return data;
});

