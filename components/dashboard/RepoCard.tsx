import { ForkIcon } from "@/icons/ForkIcon";
import { timeAgo } from "@/lib/utils";
import { GitHubRepo } from "@/types";

import Link from "next/link";

const RepoCard = ({ repo }: { repo: GitHubRepo }) => {
  return (
    <Link
      href={`/review?owner=${repo.full_name.slice(
        0,
        repo.full_name.indexOf("/")
      )}&repo=${repo.name}&private=${repo.private}`}
      className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-sky-500 cursor-pointer transition-all flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-sky-400 truncate">
            {repo.name}
          </h3>
          {repo.fork && (
            <ForkIcon className="size-5 text-gray-400 flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-gray-400 mt-2 h-10 overflow-hidden">
          {repo.description || "No description"}
        </p>
      </div>
      <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>{repo.language || "N/A"}</span>
          <span>{repo.private ? "Private" : "Public"}</span>
        </div>
        <span>Updated {timeAgo(repo.updated_at)}</span>
      </div>
    </Link>
  );
};

export default RepoCard;
