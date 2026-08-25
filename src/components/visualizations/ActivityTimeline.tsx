"use client";

import { useMemo } from "react";
import { Star } from "lucide-react";
import type { GitHubRepo } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ActivityTimelineProps {
  repos: GitHubRepo[];
}

interface TimelineEvent {
  date: string;
  title: string;
  language: string | null;
  languageColor: string;
  stars: number;
  description: string | null;
  url: string;
}

const MAX_EVENTS = 30;

export function ActivityTimeline({ repos }: ActivityTimelineProps) {
  const events = useMemo<TimelineEvent[]>(
    () =>
      repos
        .filter((r) => !r.isArchived && !r.isFork)
        .map((repo) => ({
          date: repo.createdAt,
          title: repo.name,
          language: repo.primaryLanguage?.name ?? null,
          languageColor: repo.primaryLanguage?.color ?? "#8b8b8b",
          stars: repo.stargazerCount,
          description: repo.description,
          url: repo.url,
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, MAX_EVENTS),
    [repos]
  );

  const byYear = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    for (const event of events) {
      const year = new Date(event.date).getFullYear().toString();
      if (!groups[year]) groups[year] = [];
      groups[year].push(event);
    }
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [events]);

  if (events.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Repositories</CardTitle>
        <p className="text-sm text-muted-foreground">
          The {MAX_EVENTS} most recent, newest first. Forks and archived repos
          are left out.
        </p>
      </CardHeader>
      <CardContent>
        <div
          className="relative max-h-[500px] overflow-y-auto pr-2"
          role="list"
          aria-label="Repositories by creation date"
        >
          {byYear.map(([year, yearEvents]) => (
            <div key={year} className="mb-6">
              <div className="sticky top-0 z-10 mb-3 bg-card pb-1">
                <span className="text-sm font-semibold tabular-nums">
                  {year}
                </span>
              </div>
              <div className="space-y-1 border-l border-border pl-4">
                {yearEvents.map((event) => (
                  <div key={`${event.title}-${event.date}`} className="relative" role="listitem">
                    <span
                      className="absolute -left-[21px] top-3 h-2.5 w-2.5 rounded-full border-2 border-card"
                      style={{ backgroundColor: event.languageColor }}
                    />
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-md p-2 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium transition-colors group-hover:text-primary">
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
                        <div className="flex items-center gap-2 whitespace-nowrap text-xs text-muted-foreground">
                          {event.stars > 0 && (
                            <span className="flex items-center gap-0.5 tabular-nums">
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
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                          {event.description}
                        </p>
                      )}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
