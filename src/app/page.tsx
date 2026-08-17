"use client";

import { motion } from "framer-motion";
import { Activity, Star, GitBranch, BarChart3, Sparkles } from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { Navbar } from "@/components/ui/navbar";

const features = [
  {
    icon: <Star className="h-6 w-6" />,
    title: "Constellation Graph",
    description:
      "Your repos as an interactive star map. Size by stars, color by language.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Contribution Heatmap",
    description:
      "Animated heatmap with drill-down to individual commits per day.",
  },
  {
    icon: <GitBranch className="h-6 w-6" />,
    title: "Language Timeline",
    description:
      "See how your tech stack evolved over time with a streamgraph.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "GitHub Wrapped",
    description:
      "Your year in code: top language, longest streak, most active repo.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-3 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Activity className="h-4 w-4" />
            Interactive GitHub Visualizer
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Visualize any{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              GitHub profile
            </span>{" "}
            like never before
          </h1>

          <p className="max-w-lg text-lg text-muted-foreground">
            Constellation graphs, contribution heatmaps, language timelines and
            a year-end recap. All from one username.
          </p>

          <div className="mt-4 w-full max-w-lg">
            <SearchBar size="lg" placeholder="Enter a GitHub username..." />
          </div>

          <p className="text-xs text-muted-foreground">
            No login required, works with public GitHub data
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * (i + 1) }}
              className="group rounded-lg border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <div className="mb-3 inline-flex rounded-md bg-primary/10 p-2 text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-1 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>
          Open source on{" "}
          <a
            href="https://github.com/Xyness/GitPulse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            GitHub
          </a>
          . Built with Next.js, D3.js & Framer Motion.
        </p>
      </footer>
    </div>
  );
}
