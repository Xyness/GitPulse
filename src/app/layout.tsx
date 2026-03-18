import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitPulse — Interactive GitHub Activity Visualizer",
  description:
    "Visualize any GitHub profile with stunning interactive charts. Constellation graphs, animated heatmaps, language timelines, and more.",
  openGraph: {
    title: "GitPulse — Interactive GitHub Activity Visualizer",
    description:
      "Visualize any GitHub profile with stunning interactive charts.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitPulse — Interactive GitHub Activity Visualizer",
    description:
      "Visualize any GitHub profile with stunning interactive charts.",
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
