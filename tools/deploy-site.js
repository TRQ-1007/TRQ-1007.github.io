#!/usr/bin/env node
'use strict';

/**
 * 一次性将 site/ 整站部署到 GitHub Pages
 * 用法: node deploy-site.js
 * 需设置环境变量 GITHUB_TOKEN，或在 tools/.env 中配置（勿提交）
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const SITE = path.join(ROOT, 'site');

const CONFIG = {
  owner: process.env.GITHUB_OWNER || 'TRQ-1007',
  repo: process.env.GITHUB_REPO || 'TRQ-1007.github.io',
  branch: process.env.GITHUB_BRANCH || 'main',
  pathPrefix: process.env.GITHUB_PREFIX || '', // 空 = 根目录
  token: process.env.GITHUB_TOKEN || '',
};

function repoPath(rel) {
  const p = (CONFIG.pathPrefix || '').replace(/^\/|\/$/g, '');
  return p ? `${p}/${rel.replace(/^\/+/, '')}` : rel.replace(/^\/+/, '');
}

function utf8ToBase64(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

function apiRequest(method, apiPath, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: 'api.github.com',
        path: `/repos/${CONFIG.owner}/${CONFIG.repo}${apiPath}`,
        method,
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${CONFIG.token}`,
          'User-Agent': 'blog-deploy',
          'X-GitHub-Api-Version': '2022-11-28',
          ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          try {
            const json = raw ? JSON.parse(raw) : {};
            if (res.statusCode >= 400) reject(new Error(json.message || `HTTP ${res.statusCode}`));
            else resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function getSha(relativePath) {
  const p = repoPath(relativePath);
  try {
    const enc = p.split('/').map(encodeURIComponent).join('/');
    const data = await apiRequest('GET', `/contents/${enc}?ref=${CONFIG.branch}`);
    return data.sha;
  } catch {
    return null;
  }
}

async function putFile(relativePath, content, message) {
  const p = repoPath(relativePath);
  const enc = p.split('/').map(encodeURIComponent).join('/');
  const sha = await getSha(relativePath);
  const body = { message, content: utf8ToBase64(content), branch: CONFIG.branch };
  if (sha) body.sha = sha;
  await apiRequest('PUT', `/contents/${enc}`, body);
  console.log(`  ✓ ${p}`);
}

function collectFiles(dir, base) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    if (name === 'input' || name === 'node_modules') continue;
    const full = path.join(dir, name);
    const rel = path.join(base, name).replace(/\\/g, '/');
    if (fs.statSync(full).isDirectory()) {
      out.push(...collectFiles(full, rel));
    } else if (!name.endsWith('.bat')) {
      out.push({ full, rel });
    }
  }
  return out;
}

async function main() {
  if (!CONFIG.token) {
    console.error('请设置环境变量 GITHUB_TOKEN');
    console.error('PowerShell: $env:GITHUB_TOKEN="你的token"; node deploy-site.js');
    process.exit(1);
  }

  const files = collectFiles(SITE, '');
  console.log(`部署 ${files.length} 个文件到 ${CONFIG.owner}/${CONFIG.repo} (${CONFIG.pathPrefix || '根目录'})…\n`);

  for (const { full, rel } of files) {
    const content = fs.readFileSync(full);
    const isText = /\.(html|css|js|json|svg|txt|md)$/i.test(rel);
    if (isText) {
      await putFile(rel, content.toString('utf8'), `Deploy site: ${rel}`);
    } else {
      const sha = await getSha(rel);
      const p = repoPath(rel);
      const enc = p.split('/').map(encodeURIComponent).join('/');
      const body = {
        message: `Deploy site: ${rel}`,
        content: content.toString('base64'),
        branch: CONFIG.branch,
      };
      if (sha) body.sha = sha;
      await apiRequest('PUT', `/contents/${enc}`, body);
      console.log(`  ✓ ${p} (binary)`);
    }
  }

  console.log('\n部署完成，约 1～3 分钟后访问:');
  console.log(CONFIG.pathPrefix
    ? `https://${CONFIG.owner.toLowerCase()}.github.io/${CONFIG.pathPrefix}/`
    : `https://${CONFIG.owner.toLowerCase()}.github.io/`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
