"use client";

import { useState, useMemo } from "react";

import { GitHubRepo } from "@/types";
import { GitHubInput } from "@/components/dashboard/GitHubInput";
import RepoCard from "@/components/dashboard/RepoCard";

interface DashboardProps {
  repos: GitHubRepo[];
}

export const Dashboard: React.FC<DashboardProps> = ({ repos }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRepos = useMemo(() => {
    if (!searchTerm) return repos;
    return repos.filter((repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [repos, searchTerm]);

  return (
    <div className="container mx-auto px-2 md:px-0">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Select a Repository
      </h1>

      <div className="max-w-5xl mx-auto mb-10">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-300">
          Analyze from a Public GitHub URL
        </h2>
        <GitHubInput />
      </div>

      <div className="flex items-center text-center my-12">
        <div className="flex-grow border-t border-gray-700" />
        <span className="flex-shrink mx-4 text-gray-500 uppercase text-sm font-semibold">
          Or
        </span>
        <div className="flex-grow border-t border-gray-700" />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-300">
          Select from Your Repositories
        </h2>
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search your repositories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg mb-8 px-4 py-3 bg-gray-800 text-gray-200 border border-gray-700 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
          />
        </div>
        {filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRepos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-12">
            {repos.length > 0
              ? "No repositories match your search."
              : "You have no repositories."}
          </p>
        )}
      </div>
    </div>
  );
};
