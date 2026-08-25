"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "./button";

interface SearchBarProps {
  size?: "default" | "lg";
  placeholder?: string;
}

export function SearchBar({
  size = "default",
  placeholder = "GitHub username",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/${encodeURIComponent(trimmed)}`);
  }

  const isLarge = size === "lg";

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
      <div className="relative flex-1">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${
            isLarge ? "h-5 w-5" : "h-4 w-4"
          }`}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
            isLarge ? "h-12 pl-11 pr-4 text-base" : "h-10 pl-10 pr-4 text-sm"
          }`}
          aria-label="GitHub username"
        />
      </div>
      <Button type="submit" size={isLarge ? "lg" : "default"}>
        Look up
      </Button>
    </form>
  );
}
