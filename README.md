# Kitchie mockups

Public, interactive design mockups for Kitchie, as plain HTML and CSS. The product's server code is in a separate private repository and is not here.

Start at the hub, `index.html`: it lists every mockup with a line on what it shows.

## How it is laid out

```
index.html     the hub: one card per mockup
theme.css      the shared theme: colours (light and dark), fonts, base rules, a few small pieces
fonts/         the font files theme.css loads (SIL Open Font License; licences beside them)
join/          the invite landing page            (join/v1/ is the earlier version)
inventory/     the kitchen list
home/          the home screen, clickable
_template/     a starter page for the next mockup
scripts/       check-hub.sh
```

One folder per screen, with its own `index.html`. A different version of the same screen goes in a subfolder of that screen (`join/v1/`), not at the top level.

## Status and variations

Every screen on the hub carries one label:

- **Production**: live in the app; the mockup matches it.
- **Locked**: decided, not built yet.
- **Draft**: still being explored (no other label).

A variation or an older version lives in a subfolder of the screen it came from (`join/v1/`) and is listed under that screen's card on the hub, not as a card of its own. The hub is the one place the status is written, so changing a screen's status is one edit to its card.

## Change the look once

Colours, fonts and base rules live in `theme.css`. Every page links it and adds only its own layout, so changing the accent colour or a font is one edit there and every page follows. The pages use the theme's variables (`var(--accent)`, `var(--bg)`, ...) and do not carry their own copies.

A page may set `--page-width` or `--head` in its own `:root` when it genuinely differs (the join pages are narrower and use Nunito for headings).

## Add a mockup

1. Copy `_template/` to a new folder named for the screen.
2. Edit the page; use the theme's variables for colour.
3. Add a card for it to `index.html`.
4. Run `scripts/check-hub.sh`. It fails if a page is not on the hub.

These pages are mockups. They do not sign anyone in, store anything or load any tracking. Sample names and items are made up.

## How the inventory page was made

`inventory/index.html` starts from the app's own list page, not a redrawing. The app (version 0.12.14) was run locally with made-up items, opened at phone width as a signed-in member, and the page was saved after its scripts had run: the HTML it rendered and only the CSS rules that page uses. Scripts, form targets, item ids and hidden parts were removed. That unchanged capture matched the running app pixel for pixel at 390 px in light and dark. The mockup's changes were then made on top of it: the "New" and "More" pills became the green arrow, the locations became open/close sections, and the item counts (top of the list, each location, the footer) were removed.

So the tabs, sort, Recent, search, profile and bottom buttons are drawn as the app draws them but do nothing here. Only the open/close sections work.

Earlier variations that were looked at and dropped (the arrow inside a pill, the list without collapsible sections, and a copy of the list as it is today) are in the Git history up to commit `3acf03f`.

`inventory/screenshots/` holds the before and after pictures of this page (phone width) that the Kitchie issues for these changes link to: the added marker, the item counts, and the collapsible locations.

The fonts in `fonts/` (DM Sans, Bricolage Grotesque, Nunito) are the files the app serves, under the SIL Open Font License; the licence texts are beside them.

## View it

Open `index.html` in a browser (the pages find `theme.css` and `fonts/` by relative path, so open them from the repository), or serve the repository root with GitHub Pages (Settings, Pages, deploy from the `main` branch, root folder).

## Versions

- `join/index.html`: current invite page, rebuilt to the marketing review (problem, then the AI moment, then real-life moments, then shared household and privacy).
- `join/v1/index.html`: the page as it was before that review, kept for comparing and for backing out. Also tagged `v1-before-marketing-review`. The old `v1/` address redirects here.

The invite page used to be the repository's front page; it is now `join/`, and the front page is the hub.
