"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Building2, Link as LinkIcon, Star, GitFork, Users } from "lucide-react";
import type { GitHubUser } from "@/lib/types";

interface ProfileHeaderProps {
  user: GitHubUser;
  totalStars: number;
}

export function ProfileHeader({ user, totalStars }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <Image
        src={user.avatarUrl}
        alt={`${user.login}'s avatar`}
        width={128}
        height={128}
        className="rounded-full border-2 border-primary/30"
        priority
      />
      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-3xl font-bold">{user.name ?? user.login}</h1>
        {user.name && (
          <p className="text-muted-foreground">@{user.login}</p>
        )}
        {user.bio && <p className="mt-2 max-w-xl text-sm">{user.bio}</p>}

        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
          {user.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {user.location}
            </span>
          )}
          {user.company && (
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {user.company}
            </span>
          )}
          {user.websiteUrl && (
            <Link
              href={user.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              {user.websiteUrl.replace(/^https?:\/\//, "")}
            </Link>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 sm:justify-start">
          <Stat icon={<Users className="h-4 w-4" />} label="Followers" value={user.followers.totalCount} />
          <Stat icon={<Users className="h-4 w-4" />} label="Following" value={user.following.totalCount} />
          <Stat icon={<Star className="h-4 w-4" />} label="Stars" value={totalStars} />
          <Stat icon={<GitFork className="h-4 w-4" />} label="Repos" value={user.repositories.totalCount} />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      {icon}
      <span className="font-semibold">{value.toLocaleString()}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
