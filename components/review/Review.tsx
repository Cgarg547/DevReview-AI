"use client";

import { FileNode, GitTreeItem } from "@/types";
import { Spinner } from "@/components/global/Spinner";
import { FileTree } from "@/components/review/FileTree";
import { CodeViewer } from "@/components/review/CodeViewer";
import { ReviewPanel } from "@/components/review/ReviewPanel";
import { fetchFileContent } from "@/services/githubService";
import Error from "@/icons/Error";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { triggerInngest } from "@/services/triggerInngest";

const Review = ({
  details,
  treeItems,
  fileTree,
  private: isPrivate,
}: {
  details: {
    owner: string;
    repo: string;
  };
  treeItems: GitTreeItem[];
  fileTree: FileNode;
  private: string;
}) => {
  const { isLoaded, isSignedIn, has } = useAuth();
  const user = useUser();

  const getUser = useQuery(api.users.current);
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    if (getUser === null) {
      ensureCurrentUser().catch((error) => {
        console.error("Failed to ensure current user:", error);
      });
    }
  }, [isLoaded, isSignedIn, getUser, ensureCurrentUser]);

  const today = new Date().toISOString().split("T")[0];
  const hasProPlan = has ? has({ plan: "pro_user" }) : false;

  const canReview =
    getUser?.plan === "pro" ||
    (getUser?.lastReviewDate !== today
      ? 5
      : getUser?.reviewsRemaining ?? 0) > 0;

  const [selectedFile, setSelectedFile] = useState<{
    path: string;
    content: string;
    sha: string;
  } | null>(null);

  const [isReviewing, setIsReviewing] = useState(false);
  const [highlightedLine, setHighlightedLine] =
  useState<number | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repoFullName = details
    ? `${details.owner}/${details.repo}`
    : "";

  const existingReview = useQuery(
    api.review.getReviewForFile,
    !repoFullName || !selectedFile?.sha
      ? "skip"
      : {
          repoFullName,
          fileSha: selectedFile.sha,
        }
  );

  const reviewContent = existingReview
    ? existingReview.reviewContent
    : null;

  const handleReviewRequest = async () => {
    if (!selectedFile) return;

    if (!selectedFile.sha && !selectedFile.path) return;

    setIsReviewing(true);
    setError(null);

    try {
      if (!user.user) {
        toast.error("User not loaded, cannot save review.");
        setError("User not loaded, cannot save review.");
        setIsReviewing(false);
        return;
      }

      if (getUser === undefined) {
        toast.error("Loading user data...");
        setIsReviewing(false);
        return;
      }

      if (getUser === null) {
        toast.error("Creating your user profile...");
        setIsReviewing(false);
        return;
      }

      const { reviewsRemaining } = getUser;

      if (hasProPlan) {
        await triggerInngest({
          repoFullName,
          filePath: selectedFile.path,
          owner: details.owner,
          hasProPlan,
          repo: details.repo,
          sha: selectedFile.sha,
        });

        toast.success("AI code review started.");
        return;
      }

      let remaining = reviewsRemaining ?? 5;

      if (remaining <= 0) {
        toast.error(
          "You have reached your daily free review limit (5 per day)."
        );

        setError(
          "You have reached your daily free review limit (5 per day)."
        );

        setIsReviewing(false);
        return;
      }

      await triggerInngest({
        repoFullName,
        filePath: selectedFile.path,
        owner: details.owner,
        hasProPlan,
        repo: details.repo,
        sha: selectedFile.sha,
      });

      toast.success("AI code review started.");
    } catch (err) {
      console.error("Review request failed:", err);

      setError("Failed to get code review from AI.");

      toast.error("Failed to start AI code review.");
    } finally {
      setIsReviewing(false);
    }
  };

  const handleFileSelect = useCallback(
    async (path: string) => {
      if (!details) return;

      setIsLoadingFile(true);

      setSelectedFile({
        path,
        content: "",
        sha: "",
      });

      setError(null);

      try {
        const { content, sha } = await fetchFileContent(
          details.owner,
          details.repo,
          path
        );

        setSelectedFile({
          path,
          content,
          sha,
        });
      } catch (err) {
        console.error("Failed to fetch file:", err);

        setError(`Failed to fetch file content for: ${path}`);

        setSelectedFile(null);
      } finally {
        setIsLoadingFile(false);
      }
    },
    [details]
  );

  return (
    <div className="flex flex-col flex-grow min-h-0 bg-gray-950">
      {/* Error Banner */}
      {error && (
        <div
          className="mx-4 mt-4 bg-red-950/60 border border-red-800/60 text-red-200 px-4 py-3 rounded-xl relative"
          role="alert"
        >
          <div className="flex items-center gap-2 pr-8">
            <strong className="font-semibold">Error:</strong>

            <span className="text-sm">{error}</span>
          </div>

          <button
            onClick={() => setError(null)}
            className="absolute top-1/2 -translate-y-1/2 right-3 p-2 rounded-lg hover:bg-red-900/50 transition"
            aria-label="Close error"
          >
            <Error />
          </button>
        </div>
      )}

      {/* Repository Header */}
      <div className="px-4 pt-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Repository Information */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Repository
                </span>

                <span className="text-gray-700">•</span>

                <span className="text-xs text-gray-500">
                  {isPrivate === "true" ? "Private" : "Public"}
                </span>
              </div>

              <h1 className="text-lg font-semibold text-white truncate">
                {details.owner}/{details.repo}
              </h1>
            </div>

            {/* Review Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700">
                <span
                  className={`w-2 h-2 rounded-full ${
                    hasProPlan
                      ? "bg-purple-400"
                      : "bg-emerald-400"
                  }`}
                />

                <span className="text-sm text-gray-300">
                  {hasProPlan ? "Pro Plan" : "Free Plan"}
                </span>
              </div>

              <div className="px-3 py-2 rounded-lg bg-sky-950/50 border border-sky-900">
                <span className="text-sm text-sky-300">
                  {hasProPlan
                    ? "Unlimited Reviews"
                    : `${getUser?.reviewsRemaining ?? 0} Reviews Left`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IDE Workspace */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_380px] gap-3 p-4 flex-grow min-h-0"
        style={{ minHeight: "75vh" }}
      >
        {/* ========================= */}
        {/* FILE EXPLORER */}
        {/* ========================= */}

        <aside className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden flex flex-col min-h-[350px] lg:min-h-0">
          {/* Explorer Header */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Explorer
              </span>

              <span className="text-xs text-gray-600">
                {treeItems.length} items
              </span>
            </div>

            <div className="text-sm text-gray-300 mt-2 truncate">
              {details.repo}
            </div>
          </div>

          {/* File Tree */}
          <div className="flex-1 overflow-y-auto p-3 hide-scrollbar">
            {treeItems.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <Spinner />
              </div>
            ) : fileTree ? (
              <FileTree
                tree={fileTree}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile?.path}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center text-sm">
                  Could not load file tree.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* ========================= */}
        {/* CODE EDITOR */}
        {/* ========================= */}

        <main className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden min-w-0 flex flex-col">
          {/* Editor Header */}
          <div className="h-12 px-4 border-b border-gray-800 flex items-center justify-between bg-gray-900">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-2 h-2 rounded-full bg-sky-400" />

              <span className="text-sm font-medium text-gray-300 truncate">
                {selectedFile?.path || "Select a file"}
              </span>
            </div>

            {selectedFile && (
              <span className="text-xs text-gray-600 hidden sm:block">
                {selectedFile.content.split("\n").length} lines
              </span>
            )}
          </div>

          {/* Code */}
          <div className="flex-1 min-h-0">
            <CodeViewer
              file={selectedFile}
              isLoading={isLoadingFile}
              onReview={handleReviewRequest}
              isReviewing={isReviewing}
              canReview={canReview}
              highlightedLine={highlightedLine}
            />
          </div>
        </main>

        {/* ========================= */}
        {/* AI REVIEW */}
        {/* ========================= */}

        <aside className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden min-w-0 flex flex-col">
          {/* Review Header */}
          <div className="h-12 px-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center">
                <span className="text-sm">✨</span>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  AI Review
                </h2>
              </div>
            </div>

            {existingReview?.status && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  existingReview.status === "Completed"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : existingReview.status === "failed"
                    ? "bg-red-950 text-red-400 border border-red-800"
                    : "bg-amber-950 text-amber-400 border border-amber-800"
                }`}
              >
                {existingReview.status === "Completed"
                  ? "Completed"
                  : existingReview.status === "failed"
                  ? "Failed"
                  : "Reviewing"}
              </span>
            )}
          </div>

          {/* Review Content */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ReviewPanel
              reviews={reviewContent}
              isLoading={isReviewing}
              hasFile={!!selectedFile}
              reviewStatus={existingReview?.status}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Review;