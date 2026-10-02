# Kitchie mockups

Public, interactive design mockups for Kitchie, as plain HTML and CSS. The product's server code is in a separate private repository and is not here.

- `index.html`: the invite landing page, told as a short story before the sign-in button.
- `inventory/index.html`: the kitchen list, with a green up arrow on anything added in the last 24 hours (a new item or a top-up of one already there). No word in the pill.
- `inventory/today.html`: the kitchen list as it is today, with the "New" and "More" pills, for comparing.
- `inventory/collapsible.html`: the up-arrow list with each location (Fridge, Pantry, Freezer) as a section that opens and closes. Sections start open; a closed one shows its item count and how many were added.

These pages are mockups. They do not sign anyone in, store anything or load any tracking. Sample names and items are made up.

## How the inventory pages were made

The three `inventory/` pages are the app's own list page, not a redrawing. The app (version 0.12.14) was run locally with made-up items, opened at phone width as a signed-in member, and the page was saved after its scripts had run: the HTML it rendered and only the CSS rules that page uses. Scripts, form targets, item ids and hidden parts were removed. `today.html` was compared with the running app at 390 px in light and dark and matched pixel for pixel; the other two differ only in the marker and the collapsible sections.

So the tabs, sort, Recent, search, profile and bottom buttons are drawn as the app draws them but do nothing here. Only the links in the mockup strip at the top and the open/close sections on `collapsible.html` work.

The fonts in `inventory/fonts/` (DM Sans, Bricolage Grotesque) are the files the app serves, under the SIL Open Font License; the licence texts are beside them.

## View it

Open `index.html` in a browser, or serve the repository root with GitHub Pages (Settings, Pages, deploy from the `main` branch, root folder).

## Versions

- `index.html`: current page, rebuilt to the marketing review (problem, then the AI moment, then real-life moments, then shared household and privacy).
- `v1/index.html`: the page as it was before that review, kept for comparing and for backing out. Also tagged `v1-before-marketing-review`.
