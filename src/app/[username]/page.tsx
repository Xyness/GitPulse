import type { Metadata } from "next";
import { describeLookupError } from "@/lib/github";
import { loadProfile } from "@/lib/profile";
import { ProfileView } from "./profile-view";
import { LookupError } from "@/components/ui/lookup-error";
import { Navbar } from "@/components/ui/navbar";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const description = `${username}'s public GitHub activity: contributions, languages and every repo on one page.`;

  return {
    title: `${username} | GitPulse`,
    description,
    openGraph: {
      title: `${username} | GitPulse`,
      description,
      images: [`/api/og?username=${username}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${username} | GitPulse`,
      images: [`/api/og?username=${username}`],
    },
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;

  let data;
  let error: string | null = null;

  try {
    data = await loadProfile(username);
  } catch (e) {
    error = describeLookupError(e, `No GitHub user called "${username}".`);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      {data ? (
        <ProfileView data={data} />
      ) : (
        <LookupError message={error ?? "That profile would not load."} />
      )}
    </div>
  );
}
