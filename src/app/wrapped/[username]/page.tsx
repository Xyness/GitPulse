import type { Metadata } from "next";
import { fetchUserData, describeLookupError } from "@/lib/github";
import { buildWrappedStats } from "@/lib/transforms";
import { Navbar } from "@/components/ui/navbar";
import { LookupError } from "@/components/ui/lookup-error";
import { WrappedSlides } from "@/components/visualizations/WrappedSlides";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const description = `${username}'s last twelve months on GitHub, in seven slides.`;

  return {
    title: `${username}'s GitHub Wrapped | GitPulse`,
    description,
    openGraph: {
      title: `${username}'s GitHub Wrapped | GitPulse`,
      description,
      images: [`/api/og?username=${username}&wrapped=true`],
    },
  };
}

export default async function WrappedPage({ params }: PageProps) {
  const { username } = await params;

  let stats;
  let error: string | null = null;

  try {
    stats = buildWrappedStats(await fetchUserData(username));
  } catch (e) {
    error = describeLookupError(e, `No GitHub user called "${username}".`);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      {stats ? (
        <div className="mx-auto max-w-lg px-4 py-12">
          <WrappedSlides stats={stats} />
        </div>
      ) : (
        <LookupError message={error ?? "That Wrapped would not load."} />
      )}
    </div>
  );
}
