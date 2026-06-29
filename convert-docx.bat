@echo off
chcp 65001 >nul
cd /d "%~dp0tools"
if not exist node_modules (
  echo 正在安装依赖…
  call npm install
)
echo.
echo 转换 Word 文档为 HTML（含 source/_posts 目录）…
node docx-to-html.js --all
echo.
pause
