"use client";

import Image from "next/image";
import { Users, BookMarked, Link as LinkIcon } from "lucide-react";
import { ConstellationGraph } from "@/components/visualizations/ConstellationGraph";
import { LanguageBreakdown } from "@/components/visualizations/LanguageBreakdown";
import type { GitHubOrg, ConstellationNode, ConstellationLink } from "@/lib/types";

interface OrgViewProps {
  data: {
    org: GitHubOrg;
    constellation: { nodes: ConstellationNode[]; links: ConstellationLink[] };
    languageBreakdown: Array<{ name: string; color: string; percentage: number; bytes: number }>;
  };
}

export function OrgView({ data }: OrgViewProps) {
  const { org, constellation, languageBreakdown } = data;

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <Image
          src={org.avatarUrl}
          alt=""
          width={96}
          height={96}
          className="rounded-md border border-border"
        />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{org.name ?? org.login}</h1>
          {org.description && (
            <p className="mt-1 text-muted-foreground">{org.description}</p>
          )}
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {org.membersWithRole.totalCount} members
            </span>
            <span className="flex items-center gap-1">
              <BookMarked className="h-4 w-4" />
              {org.repositories.totalCount} repos
            </span>
            {org.websiteUrl && (
              <a
                href={org.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground"
              >
                <LinkIcon className="h-4 w-4" />
                {org.websiteUrl.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LanguageBreakdown languages={languageBreakdown} />
        <ConstellationGraph
          nodes={constellation.nodes}
          links={constellation.links}
        />
      </div>
    </div>
  );
}
