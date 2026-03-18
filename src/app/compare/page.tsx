import type { Metadata } from "next";
import { Navbar } from "@/components/ui/navbar";
import { CompareView } from "./compare-view";

export const metadata: Metadata = {
  title: "Compare Profiles — GitPulse",
  description: "Compare two GitHub profiles side by side.",
};

export default function ComparePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl p-6">
        <CompareView />
      </div>
    </div>
  );
}
