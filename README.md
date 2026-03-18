<div align="center">

# GitPulse

**Interactive GitHub Activity Visualizer**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![D3.js](https://img.shields.io/badge/D3.js-v7-F9A03C?logo=d3.js&logoColor=white)](https://d3js.org/)

Visualize any GitHub profile with stunning interactive charts — constellation graphs, animated contribution heatmaps, language timelines, and a personalized GitHub Wrapped.

<!-- Replace with an actual screenshot of the app -->
<!-- ![GitPulse Demo](docs/demo.png) -->

</div>

## Features

- **Constellation Graph** — Your repositories as an interactive star map. Size = stars, color = language. Drag, zoom, and explore.
- **Contribution Heatmap** — Animated heatmap with drill-down per day. Click any cell to see details.
- **Language Timeline** — Streamgraph showing how your tech stack evolved over time.
- **Activity Timeline** — Chronological view of repository creation history.
- **GitHub Wrapped** — Your year in code: top language, longest streak, most active repo, and more. Shareable via URL.
- **Compare Mode** — Side-by-side comparison of two GitHub profiles.
- **Embeddable Widget** — Embed your GitHub stats anywhere with `<iframe src="gitpulse.dev/widget/username" />`.
- **Zero Login** — Works with public GitHub data, no authentication required.
- **OG Images** — Dynamic Open Graph images generated for every profile.

## Tech Stack

| Component       | Technology                        |
| --------------- | --------------------------------- |
| Framework       | Next.js 14 (App Router)           |
| Styling         | Tailwind CSS + shadcn/ui          |
| Visualizations  | D3.js v7 + Framer Motion          |
| Data Fetching   | GitHub GraphQL API (Octokit)      |
| Cache           | In-memory (server-side, 10 min TTL) |
| OG Images       | @vercel/og                        |
| Deployment      | Vercel                            |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Xyness/GitPulse.git
cd GitPulse
npm install
```

### Configuration

Copy the environment file:

```bash
cp .env.example .env.local
```

Optionally add a GitHub token for higher rate limits (60 req/h without, 5000 req/h with):

```env
GITHUB_TOKEN=ghp_your_token_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Routes

| Route                     | Description                          |
| ------------------------- | ------------------------------------ |
| `/`                       | Home page with search                |
| `/[username]`             | User profile with all visualizations |
| `/org/[name]`             | Organization profile                 |
| `/wrapped/[username]`     | GitHub Wrapped animated slides       |
| `/compare`                | Side-by-side profile comparison      |
| `/widget/[username]`      | Embeddable widget (for iframes)      |
| `/api/og?username=X`      | Dynamic OG image generation          |
| `/api/profile/[username]` | JSON API for profile data            |

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── [username]/               # Dynamic profile page
│   ├── org/[name]/               # Organization page
│   ├── wrapped/[username]/       # Wrapped animated slides
│   ├── compare/                  # Profile comparison
│   ├── widget/[username]/        # Embeddable widget
│   └── api/                      # API routes (OG images, profile data)
├── components/
│   ├── visualizations/           # D3.js + Framer Motion viz components
│   │   ├── ConstellationGraph    # Force-directed repo graph
│   │   ├── ContributionHeatmap   # Animated contribution heatmap
│   │   ├── LanguageTimeline      # Streamgraph of languages over time
│   │   ├── LanguageBreakdown     # Language distribution bar
│   │   ├── ActivityTimeline      # Repo creation timeline
│   │   └── WrappedSlides         # Animated wrapped presentation
│   └── ui/                       # Reusable UI components
├── lib/
│   ├── github.ts                 # GitHub GraphQL API client
│   ├── transforms.ts             # Data transformation for visualizations
│   ├── cache.ts                  # Server-side caching
│   ├── types.ts                  # TypeScript types
│   └── cn.ts                     # Utility for class names
└── hooks/                        # Custom React hooks
    ├── useD3.ts                  # D3.js integration hook
    └── useResizeObserver.ts      # Responsive container hook
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT
