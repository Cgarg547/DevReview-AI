"use client";

import { useState } from "react";
import { ArrowRight, Github } from "lucide-react";
import { useRouter } from "next/navigation";

export const GitHubInput = () => {
  const [url, setUrl] = useState(
    "https://github.com/react-dnd/react-dnd"
  );

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) return;

    const match = url.match(
      /github\.com\/([^/]+)\/([^/]+)/
    );

    if (!match) return;

    const [, owner, repo] = match;
    const formattedRepo = repo.replace(".git", "");

    router.push(
      `/review?owner=${owner}&repo=${formattedRepo}`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <div className="relative min-w-0 flex-1">
        <Github className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repository"
          className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-600 focus:border-sky-700 focus:ring-2 focus:ring-sky-500/10 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={!url.trim()}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 text-xs font-bold text-white shadow-lg shadow-sky-950/30 transition-all hover:bg-sky-500 hover:shadow-sky-900/30 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-600 sm:w-auto sm:min-w-[150px]"
      >
        Analyze Repository
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
};