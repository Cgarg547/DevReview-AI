"use client";

import { Spinner } from "@/components/global/Spinner";
import { useEffect, useMemo, useState } from "react";

interface Finding {
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  line: number;
  recommendation: string;
  suggestion: string;
}

interface ReviewData {
  score: number;
  summary: string;
  findings: Finding[];
}

interface ReviewPanelProps {
  reviews: string[] | null;
  isLoading: boolean;
  hasFile: boolean;
  onFindingSelect?: (line: number) => void;
  reviewStatus?:
    | "failed"
    | "Reviewing your code..."
    | "Completed"
    | undefined;
}

const severityConfig = {
  critical: {
    label: "Critical",
    icon: "🔴",
    badge:
      "bg-red-950/60 border-red-800 text-red-400",
    card:
      "border-red-900/70 bg-red-950/20",
  },
  high: {
    label: "High",
    icon: "🟠",
    badge:
      "bg-orange-950/60 border-orange-800 text-orange-400",
    card:
      "border-orange-900/70 bg-orange-950/20",
  },
  medium: {
    label: "Medium",
    icon: "🟡",
    badge:
      "bg-yellow-950/60 border-yellow-800 text-yellow-400",
    card:
      "border-yellow-900/70 bg-yellow-950/20",
  },
  low: {
    label: "Low",
    icon: "🔵",
    badge:
      "bg-blue-950/60 border-blue-800 text-blue-400",
    card:
      "border-blue-900/70 bg-blue-950/20",
  },
};

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  reviews,
  isLoading,
  hasFile,
  onFindingSelect,
  reviewStatus,
}) => {
  const [currentReviewIndex, setCurrentReviewIndex] =
    useState(0);

  const reviewData = useMemo<ReviewData | null>(() => {
    if (!reviews?.length) return null;

    try {
      const parsed = JSON.parse(
        reviews[currentReviewIndex] || "{}"
      );

      if (
        typeof parsed.score !== "number" ||
        typeof parsed.summary !== "string" ||
        !Array.isArray(parsed.findings)
      ) {
        return null;
      }

      return parsed;
    } catch (error) {
      console.error(
        "Failed to parse review data:",
        error
      );

      return null;
    }
  }, [reviews, currentReviewIndex]);

  useEffect(() => {
    setCurrentReviewIndex(0);
  }, [reviews]);

  const findings = reviewData?.findings ?? [];

  const counts = {
    critical: findings.filter(
      (item) => item.severity === "critical"
    ).length,
    high: findings.filter(
      (item) => item.severity === "high"
    ).length,
    medium: findings.filter(
      (item) => item.severity === "medium"
    ).length,
    low: findings.filter(
      (item) => item.severity === "low"
    ).length,
  };

  const score = Math.max(
    0,
    Math.min(100, reviewData?.score ?? 0)
  );

  const getScoreLabel = () => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Needs improvement";
    if (score >= 50) return "Needs attention";

    return "Poor";
  };

  const copySuggestion = async (
    suggestion: string
  ) => {
    if (!suggestion) return;

    try {
      await navigator.clipboard.writeText(
        suggestion
      );
    } catch (error) {
      console.error(
        "Failed to copy suggestion:",
        error
      );
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-950 border border-sky-800 flex items-center justify-center">
              <span className="text-sm">✨</span>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                AI Code Review
              </h2>

              <p className="text-xs text-gray-500">
                Powered by Gemini
              </p>
            </div>
          </div>

          {reviewStatus === "Completed" && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Completed
            </span>
          )}

          {reviewStatus ===
            "Reviewing your code..." && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-800 text-amber-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Reviewing
            </span>
          )}

          {reviewStatus === "failed" && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/60 border border-red-800 text-red-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              Failed
            </span>
          )}
        </div>
      </div>

      {/* Loading */}
      {(isLoading ||
        reviewStatus ===
          "Reviewing your code...") && (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-sky-950/60 border border-sky-800 flex items-center justify-center mb-5">
            <span className="text-2xl animate-pulse">
              ✨
            </span>
          </div>

          <Spinner />

          <h3 className="text-sm font-semibold text-white mt-5">
            AI is reviewing your code
          </h3>

          <p className="text-xs text-gray-500 text-center mt-2 max-w-[260px] leading-relaxed">
            Analyzing bugs, security, performance,
            readability and maintainability.
          </p>
        </div>
      )}

      {/* Failed */}
      {!isLoading &&
        reviewStatus === "failed" && (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-red-950/50 border border-red-800 flex items-center justify-center mb-5">
              <span className="text-xl text-red-400">
                !
              </span>
            </div>

            <h3 className="text-sm font-semibold text-red-300">
              Review failed
            </h3>

            <p className="text-xs text-gray-500 text-center mt-2 max-w-[260px]">
              We couldn't generate an AI review.
              Please try again.
            </p>
          </div>
        )}

      {/* Completed */}
      {!isLoading &&
        reviewStatus === "Completed" &&
        reviewData && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Score */}
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Code Quality
                  </p>

                  <p className="text-xs text-gray-600 mt-1">
                    Overall AI assessment
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {score}
                    <span className="text-sm text-gray-600">
                      /100
                    </span>
                  </div>

                  <span className="text-xs text-sky-400">
                    {getScoreLabel()}
                  </span>
                </div>
              </div>

              <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-700"
                  style={{
                    width: `${score}%`,
                  }}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>🤖</span>

                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Review Summary
                </h3>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {reviewData.summary}
              </p>
            </div>

            {/* Severity Overview */}
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Findings
                </h3>

                <span className="text-xs text-gray-600">
                  {findings.length} total
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    "critical",
                    "high",
                    "medium",
                    "low",
                  ] as const
                ).map((severity) => {
                  const config =
                    severityConfig[severity];

                  return (
                    <div
                      key={severity}
                      className={`rounded-lg border px-3 py-2 ${config.badge}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">
                          {config.icon}{" "}
                          {config.label}
                        </span>

                        <span className="font-bold text-sm">
                          {counts[severity]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Findings */}
            {findings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Detailed Findings
                  </h3>

                  {reviews &&
                    reviews.length > 1 && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            setCurrentReviewIndex(
                              (prev) =>
                                Math.max(
                                  0,
                                  prev - 1
                                )
                            )
                          }
                          disabled={
                            currentReviewIndex === 0
                          }
                          className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-xs text-gray-300 hover:bg-gray-700 disabled:opacity-30"
                        >
                          ←
                        </button>

                        <span className="text-xs text-gray-600 px-1">
                          {currentReviewIndex + 1}/
                          {reviews.length}
                        </span>

                        <button
                          onClick={() =>
                            setCurrentReviewIndex(
                              (prev) =>
                                Math.min(
                                  reviews.length - 1,
                                  prev + 1
                                )
                            )
                          }
                          disabled={
                            currentReviewIndex >=
                            reviews.length - 1
                          }
                          className="px-2 py-1 rounded bg-gray-800 border border-gray-700 text-xs text-gray-300 hover:bg-gray-700"
                        >
                          →
                        </button>
                      </div>
                    )}
                </div>

                <div className="space-y-3">
                  {findings.map(
                    (finding, index) => {
                      const config =
                        severityConfig[
                          finding.severity
                        ] ??
                        severityConfig.medium;

                      return (
                        <div
                          key={`${finding.title}-${index}`}
                          className={`rounded-xl border p-4 ${config.card}`}
                        >
                          {/* Finding Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2 min-w-0">
                              <span className="text-sm mt-0.5">
                                {config.icon}
                              </span>

                              <div className="min-w-0">
                                <h4 className="text-sm font-semibold text-gray-100">
                                  {finding.title}
                                </h4>

                                <p className="text-xs text-gray-500 mt-1">
                                  {finding.category}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`flex-shrink-0 px-2 py-1 rounded-md border text-[10px] uppercase tracking-wider font-semibold ${config.badge}`}
                            >
                              {config.label}
                            </span>
                          </div>

                          {/* Line */}
                          {finding.line > 0 && (
                            <div className="mt-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-950 border border-gray-800 text-[11px] text-gray-500 font-mono">
                                Line {finding.line}
                              </span>
                            </div>
                          )}

                          {/* Description */}
                          <p className="text-xs text-gray-400 leading-relaxed mt-3">
                            {finding.description}
                          </p>

                          {/* View in Code */}
                          {finding.line > 0 &&
                            onFindingSelect && (
                              <button
                                onClick={() =>
                                  onFindingSelect(
                                    finding.line
                                  )
                                }
                                className="mt-3 inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-gray-900 border border-gray-700 text-xs text-sky-400 hover:text-sky-300 hover:border-sky-700 transition-colors"
                              >
                                <span>⌖</span>
                                View in Code
                              </button>
                            )}

                          {/* Recommendation */}
                          <div className="mt-4 p-3 rounded-lg bg-gray-950/80 border border-gray-800">
                            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-600 mb-1.5">
                              Recommendation
                            </p>

                            <p className="text-xs text-gray-300 leading-relaxed">
                              {finding.recommendation}
                            </p>
                          </div>

                          {/* Suggestion */}
                          {finding.suggestion && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1.5">
                                <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-600">
                                  Suggested Fix
                                </p>

                                <button
                                  onClick={() =>
                                    copySuggestion(
                                      finding.suggestion
                                    )
                                  }
                                  className="text-[10px] text-sky-400 hover:text-sky-300 transition-colors"
                                >
                                  Copy Fix
                                </button>
                              </div>

                              <pre className="overflow-x-auto rounded-lg bg-black border border-gray-800 p-3 text-[11px] leading-relaxed text-gray-300 font-mono">
                                <code>
                                  {
                                    finding.suggestion
                                  }
                                </code>
                              </pre>
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}

            {/* No Findings */}
            {findings.length === 0 && (
              <div className="rounded-xl border border-emerald-900 bg-emerald-950/20 p-5 text-center">
                <div className="text-2xl mb-2">
                  🎉
                </div>

                <h3 className="text-sm font-semibold text-emerald-400">
                  No significant issues found
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  The AI reviewer didn't identify any
                  major problems in this file.
                </p>
              </div>
            )}
          </div>
        )}

      {/* Empty State */}
      {!isLoading &&
        !reviewData &&
        reviewStatus !== "failed" &&
        reviewStatus !==
          "Reviewing your code..." && (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-5">
              <span className="text-2xl">✨</span>
            </div>

            <h3 className="text-sm font-semibold text-gray-200">
              Ready for AI review
            </h3>

            <p className="text-xs text-gray-500 text-center mt-2 max-w-[260px] leading-relaxed">
              {hasFile
                ? 'Click "Review Code" to analyze this file with AI.'
                : "Select a file from the repository to begin."}
            </p>
          </div>
        )}
    </div>
  );
};