#!/usr/bin/env bash
# Fails if a mockup page exists that the hub (index.html) does not link to.
# Run before pushing:  scripts/check-hub.sh
cd "$(dirname "$0")/.." || exit 1
status=0
while IFS= read -r f; do
  d="${f#./}"; d="${d%/index.html}"
  [ "$d" = "_template" ] && continue
  grep -q 'http-equiv="refresh"' "$f" && continue   # a redirect left behind after a move
  if ! grep -q "href=\"$d/index.html\"" index.html; then echo "Not on the hub: $d/"; status=1; fi
done < <(find . -mindepth 2 -name index.html -not -path './.git/*' | sort)
[ $status -eq 0 ] && echo "Hub lists every mockup."
exit $status
