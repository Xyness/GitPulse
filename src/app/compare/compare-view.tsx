"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Loader2, Star, GitFork, Users, Code2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfileData } from "@/lib/types";

interface CompareResult {
  data: ProfileData;
  totalStars: number;
  totalForks: number;
}

export function CompareView() {
  const [userA, setUserA] = useState("");
  const [userB, setUserB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<[CompareResult, CompareResult] | null>(null);

  async function handleCompare(e: FormEvent) {
    e.preventDefault();
    const a = userA.trim();
    const b = userB.trim();
    if (!a || !b) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const [resA, resB] = await Promise.all([
        fetch(`/api/profile/${encodeURIComponent(a)}`).then((r) => r.json()),
        fetch(`/api/profile/${encodeURIComponent(b)}`).then((r) => r.json()),
      ]);

      if (resA.error) throw new Error(resA.error);
      if (resB.error) throw new Error(resB.error);

      setResults([resA, resB]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profiles.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Compare Profiles</h1>
        <p className="mt-2 text-muted-foreground">
          Enter two GitHub usernames to compare them side by side
        </p>
      </div>

      <form
        onSubmit={handleCompare}
        className="mx-auto flex max-w-xl flex-col items-center gap-3 sm:flex-row"
      >
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={userA}
            onChange={(e) => setUserA(e.target.value)}
            placeholder="User A"
            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="First GitHub username"
          />
        </div>
        <span className="text-muted-foreground font-bold">vs</span>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={userB}
            onChange={(e) => setUserB(e.target.value)}
            placeholder="User B"
            className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Second GitHub username"
          />
        </div>
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          Compare
        </Button>
      </form>

      {error && (
        <p className="text-center text-sm text-destructive">{error}</p>
      )}

      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {results.map((result) => (
              <CompareCard key={result.data.user.login} result={result} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompareCard({ result }: { result: CompareResult }) {
  const { data, totalStars, totalForks } = result;
  const { user, languageBreakdown, wrapped } = data;

  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Image
            src={user.avatarUrl}
            alt={user.login}
            width={64}
            height={64}
            className="rounded-full border-2 border-primary/30"
          />
          <div>
            <h3 className="text-xl font-bold">{user.name ?? user.login}</h3>
            <p className="text-sm text-muted-foreground">@{user.login}</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatBox icon={<Code2 className="h-4 w-4" />} label="Contributions" value={wrapped.totalContributions} />
          <StatBox icon={<Star className="h-4 w-4" />} label="Stars" value={totalStars} />
          <StatBox icon={<Users className="h-4 w-4" />} label="Followers" value={user.followers.totalCount} />
          <StatBox icon={<GitFork className="h-4 w-4" />} label="Repos" value={user.repositories.totalCount} />
          <StatBox icon={<Flame className="h-4 w-4" />} label="Streak" value={wrapped.longestStreak} suffix=" days" />
          <StatBox icon={<Code2 className="h-4 w-4" />} label="Top Language" value={wrapped.topLanguage.name} isText />
        </div>

        {/* Language bar */}
        <div>
          <div className="flex h-2.5 overflow-hidden rounded-full">
            {languageBreakdown.slice(0, 6).map((lang) => (
              <div
                key={lang.name}
                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                className="h-full"
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {languageBreakdown.slice(0, 5).map((lang) => (
              <span key={lang.name} className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: lang.color }} />
                {lang.name} {lang.percentage}%
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatBox({
  icon,
  label,
  value,
  suffix,
  isText,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  suffix?: string;
  isText?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-md border bg-muted/30 p-2.5">
      <span className="text-muted-foreground">{icon}</span>
      <div>
        <p className="text-sm font-semibold">
          {isText ? value : (value as number).toLocaleString()}
          {suffix}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
