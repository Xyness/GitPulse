"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { GitCommit, Star, Code2 } from "lucide-react";
import type { GitHubRepo } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ActivityTimelineProps {
  repos: GitHubRepo[];
}

interface TimelineEvent {
  date: string;
  type: "repo";
  title: string;
  language: string | null;
  languageColor: string;
  stars: number;
  description: string | null;
  url: string;
}

export function ActivityTimeline({ repos }: ActivityTimelineProps) {
  const events = useMemo(() => {
    const items: TimelineEvent[] = repos
      .filter((r) => !r.isArchived && !r.isFork)
      .map((repo) => ({
        date: repo.createdAt,
        type: "repo" as const,
        title: repo.name,
        language: repo.primaryLanguage?.name ?? null,
        languageColor: repo.primaryLanguage?.color ?? "#8b8b8b",
        stars: repo.stargazerCount,
        description: repo.description,
        url: repo.url,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30);

    return items;
  }, [repos]);

  // Group by year
  const grouped = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    for (const event of events) {
      const year = new Date(event.date).getFullYear().toString();
      if (!groups[year]) groups[year] = [];
      groups[year].push(event);
    }
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [events]);

  if (events.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Timeline</CardTitle>
          <p className="text-sm text-muted-foreground">
            Repository creation history
          </p>
        </CardHeader>
        <CardContent>
          <div
            className="relative max-h-[500px] overflow-y-auto pr-2"
            role="list"
            aria-label="Timeline of repository creation events"
          >
            {grouped.map(([year, yearEvents]) => (
              <div key={year} className="mb-6">
                <div className="sticky top-0 z-10 mb-3 bg-card pb-1">
                  <span className="text-sm font-semibold text-primary">
                    {year}
                  </span>
                </div>
                <div className="space-y-3 border-l-2 border-border pl-4">
                  {yearEvents.map((event, i) => (
                    <motion.div
                      key={`${event.title}-${event.date}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative"
                      role="listitem"
                    >
                      {/* Dot on timeline */}
                      <div
                        className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background"
                        style={{ backgroundColor: event.languageColor }}
                      />
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-md p-2 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium text-sm group-hover:text-primary transition-colors">
                              {event.title}
                            </span>
                            {event.language && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span
                                  className="inline-block h-2 w-2 rounded-full"
                                  style={{ backgroundColor: event.languageColor }}
                                />
                                {event.language}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {event.stars > 0 && (
                              <span className="flex items-center gap-0.5">
                                <Star className="h-3 w-3" />
                                {event.stars}
                              </span>
                            )}
                            <span>
                              {new Date(event.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                        {event.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                            {event.description}
                          </p>
                        )}
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
