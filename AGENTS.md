# AGENTS.md: kitchie-mockup

Interactive mockups of Kitchie screens. Plain static HTML/CSS/JS, served by GitHub Pages from `main`. **This repo is public.**

## Layout

- `index.html`: the hub. The only place a screen's status is written.
- `theme.css`: the shared look (tokens, fonts, `k-` components). Every page links it.
- `fonts/`: self-hosted fonts. No external font or script links.
- `<screen>/index.html`: one folder per screen.
- `<screen>/<variation>/index.html`: a variation, nested under its parent. Nests to any depth.
- `_template/`: starter for a new screen.
- `scripts/check-hub.sh`: run before every push.

## Rules

1. **Theme.** Never copy colours or fonts into a page. Use the variables in `theme.css`. A page may only override `--page-width` and `--head`. Look changes go in `theme.css`, once.
2. **Hub.** Every page must be linked on the hub as `<dir>/index.html`. Variations go in a `<ul class="vars">` under their parent, nested to match the folders.
3. **Sample data only.** Made-up names and items. No real people, addresses, tokens or credentials. Check staged changes before pushing.
4. **Mirror the app.** Behaviour follows Kitchie `main` (e.g. reduceQuantity, shopping list derived from minimum/staple). Don't invent rules.
5. **Visual check.** Before pushing a page change, screenshot every touched page at 390 and 360 px, light and dark, at scroll points. No horizontal scroll.
6. **Push.** Straight to `main`, no PRs. `git fetch` and merge `origin/main` first; other sessions edit `inventory/`.

## Status (written on the hub card)

| Chip | Meaning |
|---|---|
| Production | Live in the app; the mockup matches it |
| Locked | Decided, not built yet |
| Draft (no chip) | Still being explored |
| Earlier | A variation or older version, under its screen |
| Kept | A variation the owner chose to keep after the screen was decided |

## When a screen becomes Production or Locked

Do not quietly leave the alternatives behind. As soon as you set a screen to Production or Locked:

1. **Ask the user** (AskUserQuestion, or plain text): "`<screen>` is now `<status>`. Drop its variations (`<list>`), or keep any?"
2. **Dropped:** delete the folder and its hub entry.
3. **Kept:** change its chip from `Earlier` to `Kept` (`<span class="k-chip is-kept">Kept</span>`) and put the reason in the `why` span, in the user's words. Apply to each kept variation, including nested ones.
4. Run `scripts/check-hub.sh`. It fails while any variation under a Production/Locked screen is still `Earlier`.

`Kept` means the user decided. `Earlier` under a decided screen means it was missed. Never add `Kept` without the user's answer.

## Add a mockup

Copy `_template/` to `<screen>/`, edit, add a hub card (Draft), run `scripts/check-hub.sh`.
