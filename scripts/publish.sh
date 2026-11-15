#!/bin/bash
# Publishes the site: builds it, checks it and pushes the result to the branch that
# GitHub Pages serves (gh-pages). Run it from a clean, committed state.
set -euo pipefail
cd "$(dirname "$0")/.."
repo="$(pwd)"

if [ -n "$(git status --porcelain)" ]; then
  echo "There are uncommitted changes. Commit them first, so what is published matches a commit."
  exit 1
fi

npm run -s prepublish-check
npm run -s build
npm run -s check-links

sha="$(git rev-parse --short HEAD)"
branch="$(git rev-parse --abbrev-ref HEAD)"
remote="$(git remote get-url origin)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

cp -R dist/. "$tmp"
cd "$tmp"
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C "$repo" config user.name)" -c user.email="$(git -C "$repo" config user.email)" \
  commit -q -m "Publish $sha ($branch)"
git push -q -f "$remote" gh-pages
echo "Published commit $sha to gh-pages."
