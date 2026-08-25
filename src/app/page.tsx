import Link from "next/link";
import { SearchBar } from "@/components/ui/search-bar";
import { Navbar } from "@/components/ui/navbar";

const EXAMPLES = ["torvalds", "sindresorhus", "antfu"];

const views = [
  {
    name: "Constellation",
    body: "One circle per repo, sized by stargazers and coloured by language. A force simulation pulls repos sharing a language towards each other. Drag them about, scroll to zoom.",
  },
  {
    name: "Contributions",
    body: "The last twelve months day by day, in the green everybody already knows how to read. Click a square for that day's count.",
  },
  {
    name: "Languages",
    body: "Share of bytes across every public repo, and a streamgraph of when each language first turned up.",
  },
  {
    name: "Wrapped",
    body: "Seven slides of year-end numbers: contributions, top language, longest streak, busiest repo. It gets its own URL, so it travels.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6">
        <section className="pb-16 pt-20">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            GitPulse
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Type in a GitHub username and get their public activity back as
            something worth looking at.
          </p>

          <div className="mt-8 max-w-lg">
            <SearchBar size="lg" />
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            Try{" "}
            {EXAMPLES.map((name, i) => (
              <span key={name}>
                {i > 0 && ", "}
                <Link
                  href={`/${name}`}
                  className="text-foreground underline underline-offset-4 hover:text-primary"
                >
                  {name}
                </Link>
              </span>
            ))}
            .
          </p>
        </section>

        <section className="border-t pb-20 pt-10">
          <dl className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {views.map((view) => (
              <div key={view.name}>
                <dt className="font-medium">{view.name}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {view.body}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      <footer className="border-t">
        <p className="mx-auto max-w-3xl px-6 py-6 text-sm text-muted-foreground">
          No login anywhere, it only ever reads public data.{" "}
          <a
            href="https://github.com/Xyness/GitPulse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 hover:text-primary"
          >
            Source on GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
