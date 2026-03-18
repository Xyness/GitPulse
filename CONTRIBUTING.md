# Contributing to GitPulse

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and optionally add a GitHub token
4. Start the dev server: `npm run dev`

## Code Style

- **TypeScript strict mode** — no `any` types
- **Functional React components** with hooks
- **One visualization = one file** — keep visualization components isolated and reusable
- **Tailwind CSS** for styling, with `cn()` utility for conditional classes

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code restructuring without behavior change
- `docs:` — Documentation only
- `style:` — Formatting, missing semicolons, etc.
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

Examples:
```
feat: add language pie chart visualization
fix: handle empty repo list in constellation graph
docs: update README with widget embed instructions
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear, atomic commits
3. Ensure `npm run build` passes without errors
4. Open a PR with a clear description of what changed and why

## Adding a New Visualization

1. Create a new component in `src/components/visualizations/`
2. Use the `useD3` and `useResizeObserver` hooks for D3.js integration
3. Wrap in a `<Card>` with a title and description
4. Add accessibility: `role="img"` and `aria-label` on the viz container
5. Export and use in the profile view

## Reporting Issues

Please use GitHub Issues with one of these labels:

- `bug` — Something isn't working
- `enhancement` — Feature request
- `good first issue` — Good for newcomers
- `help wanted` — Extra attention needed

## Code of Conduct

Be respectful and constructive. We're all here to build something cool.
