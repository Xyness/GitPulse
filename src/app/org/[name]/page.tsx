import type { Metadata } from "next";
import { fetchOrgData, describeLookupError } from "@/lib/github";
import {
  buildConstellationNodes,
  buildConstellationLinks,
  buildLanguageBreakdown,
} from "@/lib/transforms";
import { Navbar } from "@/components/ui/navbar";
import { LookupError } from "@/components/ui/lookup-error";
import { OrgView } from "./org-view";

interface PageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  return {
    title: `${name} | GitPulse`,
    description: `The ${name} organisation on GitHub: repos, languages and how they cluster.`,
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
    error = describeLookupError(e, `No GitHub organisation called "${name}".`);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      {orgData ? (
        <OrgView data={orgData} />
      ) : (
        <LookupError message={error ?? "That organisation would not load."} />
      )}
    </div>
  );
}
