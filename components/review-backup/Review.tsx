"use client";

import { FileNode, GitTreeItem } from "@/types";
import { Spinner } from "@/components/global/Spinner";
import { FileTree } from "@/components/review/FileTree";
import { CodeViewer } from "@/components/review/CodeViewer";
import { ReviewPanel } from "@/components/review/ReviewPanel";
import { fetchFileContent } from "@/services/githubService";
import Error from "@/icons/Error";
import { useCallback, useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
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
  const user = useUser();
  const getUser = useQuery(api.users.current);
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);

  useEffect(() => {
  if (getUser === null) {
    ensureCurrentUser().catch((error) => {
      console.error("Failed to ensure current user:", error);
    });
  }
}, [getUser, ensureCurrentUser]); 


  const today = new Date().toISOString().split("T")[0];
  const { has } = useAuth();
  const hasProPlan = has ? has({ plan: "pro_user" }) : false;

  const canReview =
    getUser?.plan === "pro" ||
    (getUser?.lastReviewDate !== today ? 5 : (getUser?.reviewsRemaining ?? 0)) >
      0;

  const [selectedFile, setSelectedFile] = useState<{
    path: string;
    content: string;
    sha: string;
  } | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  // const [review, setReview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Convex integration
  const repoFullName = details ? `${details.owner}/${details.repo}` : "";
  const existingReview = useQuery(
    api.review.getReviewForFile,
    !repoFullName || !selectedFile?.sha
      ? "skip"
      : { repoFullName, fileSha: selectedFile.sha }
  );
  const reviewContent = existingReview ? existingReview.reviewContent : null;

  const handleReviewRequest = async () => {
    if (!selectedFile) return;
    if (!selectedFile.sha && !selectedFile.path) return;
    setIsReviewing(true);
    // setReview(null);
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

      // Extract fields
      const { reviewsRemaining } = getUser;

      // If pro/unlimited → no limits
      if (hasProPlan) {
        await triggerInngest({
          repoFullName,
          filePath: selectedFile.path,
          owner: details.owner,
          hasProPlan,
          repo: details.repo,
          sha: selectedFile.sha,
        });
        return;
      }

      // Free users → reset if new day
      let remaining = reviewsRemaining ?? 5;

      // Check quota
      if (remaining <= 0) {
        toast.error(
          "You have reached your daily free review limit (5 per day)."
        );
        setError("You have reached your daily free review limit (5 per day).");
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
    } catch (err) {
      setError("Failed to get code review from AI.");
      console.error(err);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleFileSelect = useCallback(
    async (path: string) => {
      if (!details) return;

      setIsLoadingFile(true);
      setSelectedFile({ path, content: "", sha: "" });
      // setReview(null);
      setError(null);

      try {
        const { content, sha } = await fetchFileContent(
          details.owner,
          details.repo,
          path
        );

        setSelectedFile({ path, content, sha });
      } catch (err) {
        setError(`Failed to fetch file content for: ${path}`);
        console.error(err);
        setSelectedFile(null);
      } finally {
        setIsLoadingFile(false);
      }
    },
    [setIsLoadingFile, setSelectedFile, setError]
  );

  return (
    <div className="flex flex-col flex-grow">
      {error && (
        <div
          className="my-4 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            aria-label="Close"
          >
            <Error />
          </button>
        </div>
      )}

      <div
        className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-grow min-h-0 mt-4"
        style={{ minHeight: "80vh" }}
      >
        <div className="md:col-span-1 lg:col-span-1 bg-gray-800 rounded-lg overflow-auto p-4 border border-gray-700">
          <div className="p-0.5 border-b border-gray-700 truncate">
            <p className="mb-2 text-lg font-semibold">
              {details.owner}/{details.repo}
            </p>
          </div>
          <div className="flex-grow overflow-y-auto p-3">
            {treeItems.length === 0 && (
              <div className="flex justify-center items-center h-full">
                <Spinner />
              </div>
            )}
            {fileTree ? (
              <FileTree
                tree={fileTree}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile?.path}
              />
            ) : (
              !fileTree && (
                <p className="text-gray-500 text-center mt-8">
                  Could not load file tree.
                </p>
              )
            )}
          </div>
        </div>
        <div className="md:col-span-3 lg:col-span-4 space-y-4">
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <CodeViewer
              file={selectedFile}
              isLoading={isLoadingFile}
              onReview={handleReviewRequest}
              isReviewing={isReviewing}
              canReview={canReview}
            />
          </div>
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <ReviewPanel
              reviews={reviewContent}
              isLoading={isReviewing}
              hasFile={!!selectedFile}
              reviewStatus={existingReview?.status}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
