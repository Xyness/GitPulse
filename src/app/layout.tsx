import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitPulse: Interactive GitHub Activity Visualizer",
  description:
    "Any GitHub profile as constellation graphs, contribution heatmaps, language timelines and a year-end recap.",
  openGraph: {
    title: "GitPulse: Interactive GitHub Activity Visualizer",
    description:
      "Any GitHub profile, turned into something worth looking at.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitPulse: Interactive GitHub Activity Visualizer",
    description:
      "Any GitHub profile, turned into something worth looking at.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
