import { Spinner } from "@/components/global/Spinner";
import Review from "@/components/review/Review";
import { buildFileTree } from "@/lib/formatter";
import { fetchRepoTree } from "@/services/githubService";

import Link from "next/link";

const ReviewPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ owner: string; repo: string; private: string }>;
}) => {
  const details = await searchParams;
  // console.log("Repo Details:", details);
  if (!details.owner || !details.repo) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        Invalid repository details.
      </div>
    );
  }
  const treeItems = await fetchRepoTree(details.owner, details.repo, "main");
  const fileTree = buildFileTree(treeItems);

  // console.log("Repo Tree Items:", treeItems);
  if (treeItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="px-4">
      <Link
        href="/dashboard"
        className="text-sky-400 hover:text-sky-300 transition-colors"
      >
        &larr; Back to Repositories
      </Link>
      <Review
        details={details}
        fileTree={fileTree}
        treeItems={treeItems}
        private={details.private}
      />
    </div>
  );
};

export default ReviewPage;
