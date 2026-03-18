"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Share2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WrappedStats } from "@/lib/types";

interface WrappedSlidesProps {
  stats: WrappedStats;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
};

export function WrappedSlides({ stats }: WrappedSlidesProps) {
  const [[currentSlide, direction], setSlide] = useState([0, 0]);

  const slides = buildSlides(stats);
  const totalSlides = slides.length;

  function paginate(newDirection: number) {
    const nextSlide = currentSlide + newDirection;
    if (nextSlide < 0 || nextSlide >= totalSlides) return;
    setSlide([nextSlide, newDirection]);
  }

  function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `${stats.username}'s GitHub Wrapped`, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Slide container */}
      <div className="relative h-[520px] w-full max-w-md overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-card to-background">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8"
          >
            {slides[currentSlide]}
          </motion.div>
        </AnimatePresence>

        {/* GitPulse branding */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Activity className="h-3 w-3" />
          GitPulse Wrapped
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => paginate(-1)}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide([i, i > currentSlide ? 1 : -1])}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => paginate(1)}
          disabled={currentSlide === totalSlides - 1}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Share */}
      <Button variant="outline" className="gap-2" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
        Share your Wrapped
      </Button>
    </div>
  );
}

function buildSlides(stats: WrappedStats): React.ReactNode[] {
  return [
    // Slide 1: Intro
    <div key="intro" className="text-center space-y-4">
      <Image
        src={stats.avatarUrl}
        alt={stats.username}
        width={80}
        height={80}
        className="mx-auto rounded-full border-2 border-primary"
      />
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold"
      >
        {stats.username}&apos;s
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
      >
        GitHub Wrapped
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-muted-foreground"
      >
        Your year in code
      </motion.p>
    </div>,

    // Slide 2: Total Contributions
    <div key="contributions" className="text-center space-y-6">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        Total Contributions
      </p>
      <motion.p
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="text-7xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
      >
        {stats.totalContributions.toLocaleString()}
      </motion.p>
      <p className="text-muted-foreground">
        commits, PRs, issues & reviews
      </p>
    </div>,

    // Slide 3: Top Language
    <div key="language" className="text-center space-y-6">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        Your #1 Language
      </p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="mx-auto h-24 w-24 rounded-full flex items-center justify-center"
        style={{ backgroundColor: stats.topLanguage.color + "30", border: `3px solid ${stats.topLanguage.color}` }}
      >
        <span className="text-3xl font-bold">{stats.topLanguage.name.slice(0, 2)}</span>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold"
      >
        {stats.topLanguage.name}
      </motion.p>
      <p className="text-muted-foreground">
        {stats.topLanguage.percentage}% of your code
      </p>
    </div>,

    // Slide 4: Most Active Repo
    <div key="active-repo" className="text-center space-y-6">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        Most Active Repository
      </p>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-primary"
      >
        {stats.mostActiveRepo.name}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-5xl font-bold"
      >
        {stats.mostActiveRepo.commits.toLocaleString()}
      </motion.p>
      <p className="text-muted-foreground">commits this year</p>
    </div>,

    // Slide 5: Longest Streak
    <div key="streak" className="text-center space-y-6">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        Longest Streak
      </p>
      <motion.p
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="text-7xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"
      >
        {stats.longestStreak}
      </motion.p>
      <p className="text-muted-foreground">consecutive days of contributions</p>
    </div>,

    // Slide 6: Top Repos
    <div key="top-repos" className="text-center space-y-4 w-full">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        Top Repositories
      </p>
      <div className="space-y-3">
        {stats.topRepos.map((repo, i) => (
          <motion.div
            key={repo.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-2.5"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-muted-foreground">
                #{i + 1}
              </span>
              <span className="font-medium text-sm">{repo.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: repo.color }}
              />
              <span>{repo.language}</span>
              <span>★ {repo.stars}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>,

    // Slide 7: Summary
    <div key="summary" className="text-center space-y-4">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold"
      >
        What a year!
      </motion.p>
      <div className="grid grid-cols-2 gap-4 text-center">
        {[
          { label: "Contributions", value: stats.totalContributions.toLocaleString() },
          { label: "Repos", value: stats.totalRepos.toLocaleString() },
          { label: "Stars earned", value: stats.totalStars.toLocaleString() },
          { label: "Day streak", value: stats.longestStreak.toString() },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
            className="rounded-lg border bg-muted/30 p-3"
          >
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-sm text-muted-foreground pt-2"
      >
        Share your Wrapped and keep shipping!
      </motion.p>
    </div>,
  ];
}
