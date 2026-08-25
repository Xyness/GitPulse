import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const tagline =
  "Type in a GitHub username and get their public activity back as something worth looking at.";

export const metadata: Metadata = {
  title: "GitPulse",
  description:
    "Type in a GitHub username and get back a repo constellation, a contribution year, a language streamgraph and a year-end Wrapped.",
  openGraph: {
    title: "GitPulse",
    description: tagline,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitPulse",
    description: tagline,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
