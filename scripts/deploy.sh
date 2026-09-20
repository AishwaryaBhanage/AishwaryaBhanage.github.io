#!/usr/bin/env bash
#
# Build the site and publish it to the gh-pages branch, which is what
# https://aishwaryabhanage.github.io/ serves.
#
#   npm run deploy
#
# main holds the source; gh-pages holds only the built output, so the served
# root stays clean and the build is never mixed in with the code.

set -euo pipefail

cd "$(dirname "$0")/.."
REMOTE="$(git remote get-url origin)"

npm run build

# Without this, GitHub Pages runs the output through Jekyll.
touch dist/.nojekyll

rm -rf dist/.git
git -C dist init -q -b gh-pages
git -C dist add -A
git -C dist commit -q -m "Deploy $(date -u '+%Y-%m-%d %H:%M UTC')"
git -C dist push -q --force "$REMOTE" gh-pages
rm -rf dist/.git

echo "Published to https://aishwaryabhanage.github.io/"
