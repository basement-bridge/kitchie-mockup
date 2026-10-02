#!/usr/bin/env bash
# Two checks on the hub (index.html). Run before pushing:  scripts/check-hub.sh
#  1. every mockup page is linked from the hub
#  2. a screen marked Production or Locked has no unresolved variation: each one must carry the "Kept" tag
cd "$(dirname "$0")/.." || exit 1
status=0
while IFS= read -r f; do
  d="${f#./}"; d="${d%/index.html}"
  [ "$d" = "_template" ] && continue
  grep -q 'http-equiv="refresh"' "$f" && continue   # a redirect left behind after a move
  if ! grep -q "href=\"$d/index.html\"" index.html; then echo "Not on the hub: $d/"; status=1; fi
done < <(find . -mindepth 2 -name index.html -not -path './.git/*' | sort)
python3 - <<'PY' || status=1
import re, sys
html = open("index.html", encoding="utf-8").read()
bad = 0
for card in re.findall(r'<article class="k-card">(.*?)</article>', html, re.S):
    if not re.search(r'k-chip[^"]*is-(production|locked)', card):
        continue
    title = re.search(r"<h2><a[^>]*>(.*?)</a>", card, re.S).group(1)
    for chip in re.findall(r'<li><span class="(k-chip[^"]*)"', card):
        if "is-kept" not in chip:
            print(f'Decide the variations of "{title}": it is Production/Locked, so each variation is either dropped or tagged Kept (with a reason).')
            bad = 1
            break
sys.exit(bad)
PY
[ $status -eq 0 ] && echo "Hub is complete and every decided screen has its variations resolved."
exit $status
