import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchUserData } from "@/lib/github";
import { transformUserData } from "@/lib/transforms";
import { getCachedProfile, setCachedProfile } from "@/lib/cache";
import { ProfileView } from "./profile-view";
import { LoadingProfile } from "@/components/ui/loading-profile";
import { Navbar } from "@/components/ui/navbar";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} | GitPulse`,
    description: `Interactive visualization of ${username}'s GitHub activity. Contributions, languages, repositories, and more.`,
    openGraph: {
      title: `${username} | GitPulse`,
      description: `Interactive visualization of ${username}'s GitHub activity.`,
      images: [`/api/og?username=${username}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${username} | GitPulse`,
      images: [`/api/og?username=${username}`],
    },
  };
}

async function getProfileData(username: string) {
  const cached = getCachedProfile(username);
  if (cached) return cached;

  const user = await fetchUserData(username);
  const data = transformUserData(user);
  setCachedProfile(username, data);
  return data;
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  let data;
  let error: string | null = null;

  try {
    data = await getProfileData(username);
  } catch (e) {
    error =
      e instanceof Error
        ? e.message.includes("Could not resolve")
          ? `User "${username}" not found on GitHub.`
          : e.message
        : "Failed to load profile data.";
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      {error ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-2xl font-bold">Oops!</h1>
          <p className="text-muted-foreground">{error}</p>
          <a
            href="/"
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Go back home
          </a>
        </div>
      ) : data ? (
        <Suspense fallback={<LoadingProfile />}>
          <ProfileView data={data} />
        </Suspense>
      ) : null}
    </div>
  );
}
