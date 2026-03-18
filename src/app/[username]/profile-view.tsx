"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/ui/profile-header";
import { ConstellationGraph } from "@/components/visualizations/ConstellationGraph";
import { ContributionHeatmap } from "@/components/visualizations/ContributionHeatmap";
import { LanguageTimeline } from "@/components/visualizations/LanguageTimeline";
import { LanguageBreakdown } from "@/components/visualizations/LanguageBreakdown";
import { ActivityTimeline } from "@/components/visualizations/ActivityTimeline";
import type { ProfileData } from "@/lib/types";

interface ProfileViewProps {
  data: ProfileData;
}

export function ProfileView({ data }: ProfileViewProps) {
  const { user, constellation, heatmap, languageTimeline, languageBreakdown, wrapped } = data;
  const totalStars = user.repositories.nodes.reduce((s, r) => s + r.stargazerCount, 0);

  // Build language color map
  const languageColors: Record<string, string> = {};
  for (const lang of languageBreakdown) {
    languageColors[lang.name] = lang.color;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <ProfileHeader user={user} totalStars={totalStars} />
        <Link href={`/wrapped/${user.login}`}>
          <Button variant="outline" className="gap-2">
            <Sparkles className="h-4 w-4" />
            View Wrapped
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="repos">Repos</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <ContributionHeatmap data={heatmap} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <LanguageBreakdown languages={languageBreakdown} />
            <ConstellationGraph
              nodes={constellation.nodes}
              links={constellation.links}
            />
          </div>
        </TabsContent>

        <TabsContent value="repos" className="mt-6">
          <ConstellationGraph
            nodes={constellation.nodes}
            links={constellation.links}
          />
        </TabsContent>

        <TabsContent value="languages" className="mt-6 space-y-6">
          <LanguageBreakdown languages={languageBreakdown} />
          {languageTimeline.length >= 2 && (
            <LanguageTimeline data={languageTimeline} languageColors={languageColors} />
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityTimeline repos={user.repositories.nodes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
