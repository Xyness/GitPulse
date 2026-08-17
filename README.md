<div align="center">

# GitPulse

**Interactive GitHub activity visualizer**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![D3.js](https://img.shields.io/badge/D3.js-v7-F9A03C?logo=d3.js&logoColor=white)](https://d3js.org/)

Type in a GitHub username and get their public activity back as something worth looking at.

[**Live demo**](https://git-pulse-virid.vercel.app)

![Home](docs/home.png)

</div>

## What's in it

The centrepiece is the **constellation**: every repo is a star, sized by stargazers and
coloured by language, laid out by a force simulation that pulls repos sharing a language
towards each other. You can drag stars around and zoom in.

Alongside that there's a **contribution heatmap** you can click into day by day, a
**streamgraph** of how someone's languages shifted year over year, and a plain chronological
timeline of when repos appeared.

**Wrapped** is the Spotify-Wrapped-style thing: seven animated slides covering the year's
totals, top language, longest streak, busiest repo. It has its own URL so it's shareable.

**Compare** puts two profiles side by side, and `/widget/[username]` is a stripped-down page
meant to be dropped into an iframe:

```html
<iframe src="https://git-pulse-virid.vercel.app/widget/torvalds" />
```

No login anywhere — it only ever reads public data.

![Profile](docs/profile.png)

![Wrapped](docs/wrapped.png)

## Running it locally

```bash
git clone https://github.com/Xyness/GitPulse.git
cd GitPulse
npm install
cp .env.example .env.local
npm run dev
```

It works with no configuration, but you'll hit GitHub's unauthenticated rate limit (60
requests an hour) after a handful of profiles. Drop a token in `.env.local` and that becomes
5000:

```env
GITHUB_TOKEN=ghp_your_token_here
```

The token needs no scopes — public data only.

## Routes

| Route | |
| --- | --- |
| `/` | Search |
| `/[username]` | Full profile, every visualization |
| `/org/[name]` | Organization view |
| `/wrapped/[username]` | Animated Wrapped slides |
| `/compare` | Two profiles side by side |
| `/widget/[username]` | Embeddable, no chrome |
| `/api/profile/[username]` | The JSON behind the pages |
| `/api/og?username=X` | Generated OG image |

## Notes on the build

Data comes from GitHub's GraphQL API via `@octokit/graphql`, one query per profile instead of
a fan-out of REST calls. Contribution calendars are only exposed over GraphQL anyway.

Responses are cached in a `Map` in module scope for ten minutes. That's per serverless
instance and evaporates on cold start, which is the right trade for this: it costs nothing,
and the failure mode is just a slower page.

Every D3 component tears its SVG down and redraws on resize rather than doing a proper
enter/update/exit. With a few hundred nodes it's not worth the complexity.

Layout is Next.js 14 App Router, Tailwind and shadcn/ui for the shell, Framer Motion for
page-level animation, D3 for anything with an axis. OG images are generated at request time
by `@vercel/og`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
