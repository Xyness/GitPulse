import Link from "next/link";
import { Activity } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Activity className="h-5 w-5 text-primary" />
          <span>GitPulse</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/compare"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Compare
          </Link>
          <Link
            href="https://github.com/Xyness/GitPulse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </Link>
        </div>
      </div>
    </nav>
  );
}
