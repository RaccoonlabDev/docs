#!/usr/bin/env sh

set -e
npm run docs:build
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:InnopolisAero/inno_uavcan_node_binaries.git master:gh-pages

cd -