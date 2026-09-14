"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles, GitBranch, ArrowRight } from "lucide-react";

import { GitHubRepo } from "@/types";
import { GitHubInput } from "@/components/dashboard/GitHubInput";
import RepoCard from "@/components/dashboard/RepoCard";

interface DashboardProps {
  repos: GitHubRepo[];
}

export const Dashboard: React.FC<DashboardProps> = ({ repos }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRepos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return repos;

    return repos.filter((repo) =>
      repo.name.toLowerCase().includes(query)
    );
  }, [repos, searchTerm]);

  return (
    <div className="min-h-full bg-[#070b14]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0d1627] to-sky-950/20 p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-800/50 bg-sky-950/40 px-3 py-1.5 text-[11px] font-semibold text-sky-400">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered code intelligence
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Analyze your codebase
              <span className="block text-sky-400">
                with AI.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Connect a GitHub repository and get actionable feedback on
              bugs, security, performance, readability, and maintainability.
            </p>
          </div>
        </section>

        {/* PUBLIC REPOSITORY */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl shadow-black/10 sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-sky-800/60 bg-sky-950/40">
              <GitBranch className="h-5 w-5 text-sky-400" />
            </div>

            <div>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Analyze a GitHub repository
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                Paste a public GitHub URL to start exploring its source code.
              </p>
            </div>
          </div>

          <GitHubInput />
        </section>

        {/* DIVIDER */}
        <div className="my-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-800" />

          <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
            Or
          </span>

          <div className="h-px flex-1 bg-slate-800" />
        </div>

        {/* USER REPOSITORIES */}
        <section>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Your repositories
                </h2>

                <span className="rounded-full border border-slate-800 bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                  {repos.length}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Select a repository to inspect and review its code.
              </p>
            </div>

            <div className="relative w-full sm:w-72 lg:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-4 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-600 focus:border-sky-700 focus:ring-2 focus:ring-sky-500/10"
              />
            </div>
          </div>

          {filteredRepos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950">
                <Search className="h-5 w-5 text-slate-600" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-300">
                {repos.length > 0
                  ? "No repositories found"
                  : "No repositories available"}
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-600">
                {repos.length > 0
                  ? "Try a different repository name."
                  : "Connect a GitHub account or analyze a public repository using the URL above."}
              </p>
            </div>
          )}
        </section>

        {/* BOTTOM HINT */}
        {filteredRepos.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-slate-700">
            <span>Choose a repository to continue</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        )}
      </div>
    </div>
  );
};