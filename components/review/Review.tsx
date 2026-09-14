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

type ActiveTab = "files" | "code" | "review";

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

  const [activeTab, setActiveTab] = useState<ActiveTab>("files");

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
    hasProPlan ||
    getUser?.plan === "pro" ||
    (getUser?.lastReviewDate !== today
      ? 5
      : getUser?.reviewsRemaining ?? 0) > 0;

  const repoFullName = `${details.owner}/${details.repo}`;

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
    setActiveTab("review");

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

      const remaining = reviewsRemaining ?? 5;

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
      setHighlightedLine(null);
      setError(null);

      setSelectedFile({
        path,
        content: "",
        sha: "",
      });

      setActiveTab("code");

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

  const handleFindingSelect = (line: number) => {
    setHighlightedLine(line);
    setActiveTab("code");
  };

  const renderTabButton = (
    tab: ActiveTab,
    label: string,
    icon: string,
    badge?: string
  ) => {
    const isActive = activeTab === tab;

    return (
      <button
        type="button"
        onClick={() => setActiveTab(tab)}
        className={`flex min-w-0 flex-1 items-center justify-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold transition-all ${
          isActive
            ? "border-sky-400 bg-sky-500/10 text-sky-300"
            : "border-transparent text-gray-500 hover:bg-gray-800/60 hover:text-gray-300"
        }`}
      >
        <span className="text-sm">{icon}</span>
        <span>{label}</span>

        {badge && (
          <span
            className={`rounded-full px-1.5 py-0.5 text-[9px] ${
              isActive
                ? "bg-sky-500/20 text-sky-300"
                : "bg-gray-800 text-gray-500"
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#070b14] text-white">
      {/* Error Banner */}
      {error && (
        <div className="mx-3 mt-3 rounded-xl border border-red-900/70 bg-red-950/40 px-4 py-3 shadow-lg shadow-black/10 sm:mx-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
              <Error />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-red-300">
                Something went wrong
              </p>

              <p className="mt-0.5 truncate text-xs text-red-200/70">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError(null)}
              className="shrink-0 rounded-lg p-2 text-red-300 transition hover:bg-red-900/40 hover:text-white"
              aria-label="Close error"
            >
              <Error />
            </button>
          </div>
        </div>
      )}

      {/* Repository Header */}
      <section className="px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="overflow-hidden rounded-2xl border border-gray-800/80 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 shadow-xl shadow-black/20">
          <div className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sm">
                    ◈
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    Repository
                  </span>

                  <span className="text-gray-700">/</span>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isPrivate === "true"
                        ? "border border-amber-800/60 bg-amber-950/40 text-amber-400"
                        : "border border-emerald-800/60 bg-emerald-950/40 text-emerald-400"
                    }`}
                  >
                    {isPrivate === "true" ? "Private" : "Public"}
                  </span>
                </div>

                <h1 className="truncate text-base font-bold tracking-tight text-white sm:text-xl">
                  {details.owner}
                  <span className="mx-1.5 text-gray-600">/</span>
                  <span className="text-sky-300">{details.repo}</span>
                </h1>

                <p className="mt-1 truncate text-xs text-gray-500">
                  Analyze source code and get AI-powered engineering feedback.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-950/70 px-3 py-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      hasProPlan ? "bg-violet-400" : "bg-emerald-400"
                    } shadow-sm`}
                  />

                  <span className="text-xs font-semibold text-gray-300">
                    {hasProPlan ? "Pro Plan" : "Free Plan"}
                  </span>
                </div>

                <div className="rounded-xl border border-sky-900/60 bg-sky-950/30 px-3 py-2">
                  <span className="text-xs font-semibold text-sky-300">
                    {hasProPlan
                      ? "∞ Unlimited reviews"
                      : `${getUser?.reviewsRemaining ?? 0} reviews left`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Workspace Navigation */}
      <div className="mx-3 mt-3 overflow-hidden rounded-xl border border-gray-800 bg-gray-900 lg:hidden sm:mx-4">
        <div className="flex">
          {renderTabButton(
            "files",
            "Files",
            "📁",
            `${treeItems.length}`
          )}

          {renderTabButton(
            "code",
            "Code",
            "‹›",
            selectedFile ? "1" : undefined
          )}

          {renderTabButton(
            "review",
            "Review",
            "✨",
            existingReview?.status === "Completed"
              ? "✓"
              : existingReview?.status === "Reviewing your code..."
              ? "..."
              : undefined
          )}
        </div>
      </div>

      {/* Workspace */}
      <div className="min-h-0 flex-1 p-3 sm:p-4">
        <div className="grid min-h-[620px] grid-cols-1 gap-3 lg:h-full lg:min-h-[75vh] lg:grid-cols-[240px_minmax(0,1fr)_380px]">
          {/* FILE EXPLORER */}
          <aside
            className={`${
              activeTab === "files" ? "flex" : "hidden"
            } min-h-[620px] min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-800/80 bg-gray-900 shadow-xl shadow-black/20 lg:flex lg:min-h-0`}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900/90 px-4 py-3.5">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.7)]" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                    Explorer
                  </span>
                </div>

                <p className="mt-1.5 truncate text-xs font-medium text-gray-300">
                  {details.repo}
                </p>
              </div>

              <span className="rounded-md bg-gray-800 px-2 py-1 text-[10px] font-medium text-gray-500">
                {treeItems.length}
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
              {treeItems.length === 0 ? (
                <div className="flex h-full min-h-[300px] items-center justify-center">
                  <Spinner />
                </div>
              ) : fileTree ? (
                <FileTree
                  tree={fileTree}
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile?.path}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6">
                  <p className="text-center text-xs leading-relaxed text-gray-500">
                    Could not load the repository file tree.
                  </p>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-gray-800 px-3 py-2.5">
              <p className="truncate text-[10px] text-gray-600">
                {treeItems.length} files and folders
              </p>
            </div>
          </aside>

          {/* CODE EDITOR */}
          <main
            className={`${
              activeTab === "code" ? "flex" : "hidden"
            } min-h-[620px] min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-800/80 bg-gray-900 shadow-xl shadow-black/20 lg:flex lg:min-h-0`}
          >
            <div className="flex min-h-[52px] shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900/90 px-3 sm:px-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-xs text-sky-300">
                  ‹›
                </span>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-600">
                    Code Editor
                  </p>

                  <p className="truncate text-xs font-medium text-gray-300">
                    {selectedFile?.path || "Select a file"}
                  </p>
                </div>
              </div>

              {selectedFile && !isLoadingFile && (
                <span className="shrink-0 rounded-md bg-gray-800 px-2 py-1 text-[10px] font-medium text-gray-500">
                  {selectedFile.content.split("\n").length} lines
                </span>
              )}
            </div>

            <div className="min-h-0 flex-1">
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

          {/* AI REVIEW */}
          <aside
            className={`${
              activeTab === "review" ? "flex" : "hidden"
            } min-h-[620px] min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-800/80 bg-gray-900 shadow-xl shadow-black/20 lg:flex lg:min-h-0`}
          >
            <div className="flex min-h-[52px] shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900/90 px-3.5 sm:px-4">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-500/30 bg-gradient-to-br from-sky-500/15 to-violet-500/10 text-sm shadow-sm">
                  ✨
                </span>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gray-600">
                    Intelligence
                  </p>

                  <h2 className="truncate text-sm font-semibold text-white">
                    AI Review
                  </h2>
                </div>
              </div>

              {existingReview?.status && (
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                    existingReview.status === "Completed"
                      ? "border-emerald-800/70 bg-emerald-950/50 text-emerald-400"
                      : existingReview.status === "failed"
                      ? "border-red-800/70 bg-red-950/50 text-red-400"
                      : "border-amber-800/70 bg-amber-950/50 text-amber-400"
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

            <div className="min-h-0 flex-1 overflow-y-auto">
              <ReviewPanel
                reviews={reviewContent}
                isLoading={isReviewing}
                hasFile={!!selectedFile}
                onFindingSelect={handleFindingSelect}
                reviewStatus={existingReview?.status}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Review;