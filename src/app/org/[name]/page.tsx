import type { Metadata } from "next";
import Image from "next/image";
import { fetchOrgData } from "@/lib/github";
import { buildConstellationNodes, buildConstellationLinks, buildLanguageBreakdown } from "@/lib/transforms";
import { Navbar } from "@/components/ui/navbar";
import { OrgView } from "./org-view";

interface PageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  return {
    title: `${name} — GitPulse`,
    description: `Interactive visualization of the ${name} organization on GitHub.`,
  };
}

export default async function OrgPage({ params }: PageProps) {
  const { name } = await params;

  let orgData;
  let error: string | null = null;

  try {
    const org = await fetchOrgData(name);
    const repos = org.repositories.nodes;
    orgData = {
      org,
      constellation: {
        nodes: buildConstellationNodes(repos),
        links: buildConstellationLinks(repos),
      },
      languageBreakdown: buildLanguageBreakdown(repos),
    };
  } catch (e) {
    error =
      e instanceof Error
        ? e.message.includes("Could not resolve")
          ? `Organization "${name}" not found on GitHub.`
          : e.message
        : "Failed to load organization data.";
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
      ) : orgData ? (
        <OrgView data={orgData} />
      ) : null}
    </div>
  );
}
