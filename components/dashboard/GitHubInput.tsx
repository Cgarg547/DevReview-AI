"use client";

import { useState } from "react";
import { GitHubIcon } from "@/icons/GitHubIcon";

import { useRouter } from "next/navigation";

export const GitHubInput = () => {
  const [url, setUrl] = useState("https://github.com/react-dnd/react-dnd");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) return;
      const [, owner, repo] = match;
      const formattedRepo = repo.replace(".git", "");
      router.push(`/review?owner=${owner}&repo=${formattedRepo}`);
      // onFetch(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <GitHubIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g., https://github.com/owner/repo"
          className="w-full pl-10 pr-4 py-3 bg-gray-700 text-gray-200 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
        />
      </div>
      <button
        type="submit"
        disabled={!url}
        className="w-[30%] flex items-center justify-center px-8 py-3 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer"
      >
        Fetch Repository
      </button>
    </form>
  );
};
