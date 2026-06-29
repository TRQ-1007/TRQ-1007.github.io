@echo off
chcp 65001 >nul
cd /d "%~dp0tools"
if not exist node_modules npm install
echo.
echo 请输入 GitHub Token（粘贴后回车）:
set /p GITHUB_TOKEN=
set GITHUB_TOKEN=%GITHUB_TOKEN%
node deploy-site.js
pause
