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

## When the owner is driving a design

When the owner is shaping a feature or screen, the mockup is where the work happens. It is how the owner recognises the work before it reaches the real repo. Update the mockup first; the real repo follows later and the code base takes precedence over the mockup when it is built.

1. **Ask first:** "Do you want me to capture this as issues on the kitchie repo as we go?" Do not file issues until the owner says yes.
2. **If yes, keep the issues in sync, always.** Every change to the mockup updates the matching issue in the same turn (edit the body or add a dated "Update" section). New rules go in an issue the moment they are decided. Say which issues changed.
3. **Before treating the mockup as done** (the owner says it is agreed, or asks to build it), propose a tidy-up of the issues on that feature: merge fragments, split what grew too big, close what the design made obsolete, fix titles and links. Be the smart one: list what you would merge, split, close or rename and why, and wait for a yes before closing or deleting anything.
4. Back-end rules (storage, formatting, config, validation) become issues; look and behaviour stay in the mockup.

## Add a mockup

Copy `_template/` to `<screen>/`, edit, add a hub card (Draft), run `scripts/check-hub.sh`.
