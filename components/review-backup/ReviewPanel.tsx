import markdownit from "markdown-it";

import { Spinner } from "@/components/global/Spinner";
import { HtmlParser } from "@/components/global/ParseHTML";
import { useState } from "react";

interface ReviewPanelProps {
  reviews: string[] | null;
  isLoading: boolean;
  hasFile: boolean;
  reviewStatus?: "failed" | "Reviewing your code..." | "Completed" | undefined;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  reviews,
  isLoading,
  hasFile,
  reviewStatus,
}) => {
  const md = markdownit();
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const result = reviews ? md.render(reviews[currentReviewIndex] || "") : "";
  const onNext = () => {
    if (reviews && currentReviewIndex < reviews.length - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    }
  };
  const onPrev = () => {
    if (reviews && currentReviewIndex > 0) {
      setCurrentReviewIndex(currentReviewIndex - 1);
    }
  };
  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-3 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Code Review</h2>
        {reviews && reviews.length > 0 && !isLoading && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400 font-medium">
              Review {currentReviewIndex + 1} of {reviews.length}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={onPrev}
                disabled={currentReviewIndex === 0}
                className="px-3 py-1 text-xs font-semibold bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors cursor-pointer"
                aria-label="Previous review point"
              >
                &larr; Prev
              </button>
              <button
                onClick={onNext}
                disabled={currentReviewIndex >= reviews.length - 1}
                className="px-3 py-1 text-xs font-semibold bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors cursor-pointer"
                aria-label="Next review point"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-4 prose prose-invert prose-sm max-w-none">
        {isLoading && (
          <div className="flex flex-col justify-center items-center p-25">
            <Spinner />
            <p className="mt-4 text-gray-400">Triggering Inngest...</p>
          </div>
        )}
        {reviewStatus === "Reviewing your code..." && (
          <div className="flex flex-col justify-center items-center p-25">
            <Spinner />
            <p className="mt-4 text-gray-400">{reviewStatus}</p>
          </div>
        )}
        {reviewStatus === "failed" && (
          <div className="flex flex-col justify-center items-center p-25">
            <p className="mt-4 text-red-500">
              Failed to generate review. Please try again.
            </p>
          </div>
        )}
        {!isLoading &&
          reviews &&
          reviews.length > 0 &&
          reviewStatus === "Completed" && <HtmlParser html={result} />}
        {!isLoading && !reviews && (
          <div className="flex justify-center items-center p-25">
            <p className="text-gray-500 text-center">
              {hasFile
                ? 'Click "Review Code" to get an AI analysis.'
                : "Select a file to begin the review process."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
