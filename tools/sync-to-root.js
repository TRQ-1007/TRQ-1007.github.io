#!/usr/bin/env node
'use strict';

/** 将 site/ 同步到仓库根目录（供 GitHub Pages 根目录发布） */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'site');

const SKIP_DIRS = new Set(['input', 'node_modules']);

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (SKIP_DIRS.has(name)) continue;
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

console.log('同步 site/ → 仓库根目录…');
copyRecursive(SITE, ROOT);
if (fs.existsSync(path.join(SITE, '.nojekyll'))) {
  fs.copyFileSync(path.join(SITE, '.nojekyll'), path.join(ROOT, '.nojekyll'));
} else {
  fs.writeFileSync(path.join(ROOT, '.nojekyll'), '');
}
console.log('完成。根目录 index.html、admin.html、css/、js/、works/ 已更新。');
