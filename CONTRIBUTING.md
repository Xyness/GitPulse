# Contributing

Happy to take patches. Nothing here is heavy process.

## Setup

Fork, clone, then:

```bash
npm install
cp .env.example .env.local   # add a GITHUB_TOKEN if you don't want to fight the rate limit
npm run dev
```

## Before you open a PR

Branch off `main`, keep the commits reasonably atomic, and make sure `npm run build` is
clean: the build runs the type checker, and strict mode is on, so a passing build catches
most of what a review would flag anyway.

Then describe what changed and why. The why is the part that's actually useful.

## Style

TypeScript is in strict mode and `any` isn't welcome. Components are functions with hooks.
Styling is Tailwind, with `cn()` when classes are conditional.

Colours come from the CSS variables in `globals.css`, which track GitHub's dark palette.
Tailwind's own `purple-500` and friends have no business in here. The one exception is
language colours, which come straight off the API and belong in inline styles.

Charts don't fade in. Having the data on screen at first paint beats a staggered reveal,
and the only choreography left in the project is the Wrapped slide transition.

Keep one visualization per file under `src/components/visualizations/`. They tend to grow,
and mixing two of them in a file makes both harder to touch.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
The ones that come up are `feat:`, `fix:`, `refactor:`, `docs:` and `chore:`.

```
feat: add language pie chart
fix: handle empty repo list in the constellation
```

## Adding a visualization

Drop the component in `src/components/visualizations/`, hang the render off
`useResizeObserver` so it redraws when the card changes width, wrap it in a `<Card>` with a
title and a line saying what the reader is looking at, and put `role="img"` plus an
`aria-label` on the container, because an SVG full of circles is nothing to a screen reader
otherwise. Then wire it into the profile view.

## Issues

GitHub Issues, with `bug` or `enhancement` on it. Screenshots help a lot for anything
visual.
