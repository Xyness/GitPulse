"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import {
  Search,
  Loader2,
  Star,
  BookMarked,
  Users,
  Code2,
  Activity,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProfileData } from "@/lib/types";

interface CompareResult {
  data: ProfileData;
  totalStars: number;
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
      setError(err instanceof Error ? err.message : "One of those would not load.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Compare</h1>
        <p className="mt-2 text-muted-foreground">
          Two usernames, the same numbers next to each other.
        </p>
      </div>

      <form
        onSubmit={handleCompare}
        className="flex max-w-2xl flex-col items-center gap-3 sm:flex-row"
      >
        <UsernameInput
          value={userA}
          onChange={setUserA}
          placeholder="torvalds"
          label="First GitHub username"
        />
        <span className="text-sm text-muted-foreground">vs</span>
        <UsernameInput
          value={userB}
          onChange={setUserB}
          placeholder="sindresorhus"
          label="Second GitHub username"
        />
        <Button type="submit" disabled={loading} className="gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Compare
        </Button>
      </form>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {results && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {results.map((result) => (
            <CompareCard key={result.data.user.login} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}

function UsernameInput({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <div className="relative w-full flex-1">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function CompareCard({ result }: { result: CompareResult }) {
  const { data, totalStars } = result;
  const { user, languageBreakdown, wrapped } = data;

  return (
    <Card>
      <CardContent className="space-y-5 p-6">
        <div className="flex items-center gap-4">
          <Image
            src={user.avatarUrl}
            alt=""
            width={64}
            height={64}
            className="rounded-full border border-border"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.name ?? user.login}</h2>
            <p className="text-sm text-muted-foreground">@{user.login}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatBox icon={<Activity className="h-4 w-4" />} label="Contributions" value={wrapped.totalContributions} />
          <StatBox icon={<Star className="h-4 w-4" />} label="Stars" value={totalStars} />
          <StatBox icon={<Users className="h-4 w-4" />} label="Followers" value={user.followers.totalCount} />
          <StatBox icon={<BookMarked className="h-4 w-4" />} label="Repos" value={user.repositories.totalCount} />
          <StatBox icon={<Flame className="h-4 w-4" />} label="Longest streak" value={wrapped.longestStreak} suffix=" days" />
          <StatBox icon={<Code2 className="h-4 w-4" />} label="Top language" value={wrapped.topLanguage.name} />
        </div>

        <div>
          <div className="flex h-2.5 overflow-hidden rounded-full">
            {languageBreakdown.slice(0, 6).map((lang) => (
              <div
                key={lang.name}
                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {languageBreakdown.slice(0, 5).map((lang) => (
              <span
                key={lang.name}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                {lang.name} <span className="tabular-nums">{lang.percentage}%</span>
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
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-md border bg-muted/30 p-2.5">
      <span className="text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
