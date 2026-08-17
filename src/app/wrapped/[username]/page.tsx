import type { Metadata } from "next";
import { fetchUserData } from "@/lib/github";
import { buildWrappedStats } from "@/lib/transforms";
import { Navbar } from "@/components/ui/navbar";
import { WrappedSlides } from "@/components/visualizations/WrappedSlides";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username}'s GitHub Wrapped | GitPulse`,
    description: `${username}'s year in code: top languages, contributions, streaks, and more.`,
    openGraph: {
      title: `${username}'s GitHub Wrapped | GitPulse`,
      description: `${username}'s year in code.`,
      images: [`/api/og?username=${username}&wrapped=true`],
    },
  };
}

export default async function WrappedPage({ params }: PageProps) {
  const { username } = await params;

  let stats;
  let error: string | null = null;

  try {
    const user = await fetchUserData(username);
    stats = buildWrappedStats(user);
  } catch (e) {
    error =
      e instanceof Error
        ? e.message.includes("Could not resolve")
          ? `User "${username}" not found.`
          : e.message
        : "Failed to load data.";
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      {error ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-2xl font-bold">Oops!</h1>
          <p className="text-muted-foreground">{error}</p>
          <a href="/" className="text-primary underline underline-offset-4">
            Go back home
          </a>
        </div>
      ) : stats ? (
        <div className="mx-auto max-w-lg px-4 py-12">
          <WrappedSlides stats={stats} />
        </div>
      ) : null}
    </div>
  );
}
