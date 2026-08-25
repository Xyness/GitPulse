"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WrappedStats } from "@/lib/types";

interface WrappedSlidesProps {
  stats: WrappedStats;
}

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 240 : -240, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 240 : -240, opacity: 0 }),
};

// Every slide reveals its pieces in the same way, so the props live here
// rather than on a dozen separate motion elements.
const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

const label = "text-xs uppercase tracking-widest text-muted-foreground";
const bigNumber = "font-mono text-6xl font-semibold tabular-nums";

export function WrappedSlides({ stats }: WrappedSlidesProps) {
  const [[currentSlide, direction], setSlide] = useState([0, 0]);
  const [copied, setCopied] = useState(false);

  const slides = buildSlides(stats);
  const totalSlides = slides.length;

  function paginate(step: number) {
    const next = currentSlide + step;
    if (next < 0 || next >= totalSlides) return;
    setSlide([next, step]);
  }

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${stats.username}'s GitHub Wrapped`,
          url,
        });
      } catch {
        // Sheet dismissed. Nothing to say about it.
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-[520px] w-full max-w-md overflow-hidden rounded-lg border bg-card">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>

        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
          GitPulse
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => paginate(-1)}
          disabled={currentSlide === 0}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide([i, i > currentSlide ? 1 : -1])}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide ? "w-6 bg-primary" : "w-2 bg-muted-foreground/40"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => paginate(1)}
          disabled={currentSlide === totalSlides - 1}
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <Button variant="outline" onClick={handleShare}>
        {copied ? "Link copied" : "Share"}
      </Button>
    </div>
  );
}

function buildSlides(stats: WrappedStats): React.ReactNode[] {
  return [
    <div key="intro" className="space-y-4 text-center">
      <Image
        src={stats.avatarUrl}
        alt=""
        width={80}
        height={80}
        className="mx-auto rounded-full border border-border"
      />
      <motion.h2 {...reveal(0.1)} className="text-xl font-medium">
        {stats.username}
      </motion.h2>
      <motion.p {...reveal(0.2)} className="text-4xl font-semibold tracking-tight">
        GitHub Wrapped
      </motion.p>
      <motion.p {...reveal(0.3)} className="text-muted-foreground">
        The last twelve months
      </motion.p>
    </div>,

    <div key="contributions" className="space-y-6 text-center">
      <p className={label}>Contributions</p>
      <motion.p {...reveal(0.1)} className={bigNumber}>
        {stats.totalContributions.toLocaleString()}
      </motion.p>
      <p className="text-muted-foreground">
        commits, pull requests, issues and reviews
      </p>
    </div>,

    <div key="language" className="space-y-6 text-center">
      <p className={label}>Most of the code</p>
      <motion.div
        {...reveal(0.1)}
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full"
        style={{
          backgroundColor: stats.topLanguage.color + "30",
          border: `2px solid ${stats.topLanguage.color}`,
        }}
      >
        <span className="text-2xl font-semibold">
          {stats.topLanguage.name.slice(0, 2)}
        </span>
      </motion.div>
      <motion.p {...reveal(0.2)} className="text-3xl font-semibold">
        {stats.topLanguage.name}
      </motion.p>
      <p className="text-muted-foreground tabular-nums">
        {stats.topLanguage.percentage}% of the bytes
      </p>
    </div>,

    <div key="busiest-repo" className="space-y-6 text-center">
      <p className={label}>Busiest repo</p>
      <motion.p {...reveal(0.1)} className="text-3xl font-semibold text-primary">
        {stats.mostActiveRepo.name}
      </motion.p>
      <motion.p {...reveal(0.2)} className={bigNumber}>
        {stats.mostActiveRepo.commits.toLocaleString()}
      </motion.p>
      <p className="text-muted-foreground">commits went into it</p>
    </div>,

    <div key="streak" className="space-y-6 text-center">
      <p className={label}>Longest streak</p>
      <motion.p {...reveal(0.1)} className={bigNumber}>
        {stats.longestStreak}
      </motion.p>
      <p className="text-muted-foreground">days in a row with something on the board</p>
    </div>,

    <div key="top-repos" className="w-full space-y-4 text-center">
      <p className={label}>Most starred</p>
      <div className="space-y-2">
        {stats.topRepos.map((repo, i) => (
          <motion.div
            key={repo.name}
            {...reveal(0.05 * i)}
            className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
          >
            <span className="truncate text-sm font-medium">{repo.name}</span>
            <span className="flex items-center gap-2 whitespace-nowrap text-xs text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: repo.color }}
              />
              {repo.language}
              <span className="tabular-nums">★ {repo.stars}</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>,

    <div key="summary" className="w-full space-y-4 text-center">
      <p className={label}>The whole year</p>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Contributions", value: stats.totalContributions.toLocaleString() },
          { label: "Repos", value: stats.totalRepos.toLocaleString() },
          { label: "Stars earned", value: stats.totalStars.toLocaleString() },
          { label: "Day streak", value: stats.longestStreak.toString() },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            {...reveal(0.05 * i)}
            className="rounded-md border bg-muted/30 p-3"
          >
            <p className="font-mono text-2xl font-semibold tabular-nums">
              {item.value}
            </p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </div>,
  ];
}
