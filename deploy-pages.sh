#!/usr/bin/env bash
# 一键重新部署演示版到 GitHub Pages（固定网址不变）
# 用法：GH_TOKEN=<你的PAT> bash deploy-pages.sh
set -e
cd "$(dirname "$0")"
if [ -z "$GH_TOKEN" ]; then
  echo "请先设置 GH_TOKEN 环境变量（GitHub PAT，需要 repo 权限）"
  exit 1
fi
npm run build
rm -rf deploy-tmp
mkdir deploy-tmp
cp dist/index.html deploy-tmp/
cd deploy-tmp
git init -q
git config user.email "demo@local"
git config user.name "demo"
git add .
git commit -qm "deploy: e-banking demo $(date +%F_%H%M)"
git remote add origin "https://x-access-token:${GH_TOKEN}@github.com/Menhden/siaofong-ebank-demo.git"
git push -q --force origin HEAD:main
cd ..
rm -rf deploy-tmp
echo "部署完成：https://menhden.github.io/siaofong-ebank-demo/ （约 1 分钟后生效）"
