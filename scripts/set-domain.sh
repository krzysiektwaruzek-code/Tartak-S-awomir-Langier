#!/usr/bin/env bash
# Podmienia znacznik {{DOMAIN}} na docelowy adres strony (canonical, Open Graph, JSON-LD, sitemap, robots).
# Użycie: ./scripts/set-domain.sh https://twoja-domena.pl
set -euo pipefail
if [[ $# -ne 1 || ! "$1" =~ ^https://[^/]+$ ]]; then
  echo "Użycie: $0 https://twoja-domena.pl  (bez końcowego ukośnika)" >&2
  exit 1
fi
cd "$(dirname "$0")/.."
grep -rl '{{DOMAIN}}' --include='*.html' --include='*.xml' --include='*.txt' . | grep -v '^./README' | while read -r f; do
  sed -i "s#{{DOMAIN}}#$1#g" "$f"
  echo "zaktualizowano: $f"
done
