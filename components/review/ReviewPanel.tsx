"use client";

import { Spinner } from "@/components/global/Spinner";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Code2,
  Copy,
  FileWarning,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  XCircle,
} from "lucide-react";
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
    text: "text-red-400",
    border: "border-red-800/70",
    bg: "bg-red-950/20",
    badge: "bg-red-950/60 text-red-300 border-red-800",
    glow: "shadow-red-950/20",
  },
  high: {
    label: "High",
    icon: "🟠",
    text: "text-orange-400",
    border: "border-orange-800/70",
    bg: "bg-orange-950/20",
    badge: "bg-orange-950/60 text-orange-300 border-orange-800",
    glow: "shadow-orange-950/20",
  },
  medium: {
    label: "Medium",
    icon: "🟡",
    text: "text-yellow-400",
    border: "border-yellow-800/70",
    bg: "bg-yellow-950/20",
    badge: "bg-yellow-950/60 text-yellow-300 border-yellow-800",
    glow: "shadow-yellow-950/20",
  },
  low: {
    label: "Low",
    icon: "🔵",
    text: "text-sky-400",
    border: "border-sky-800/70",
    bg: "bg-sky-950/20",
    badge: "bg-sky-950/60 text-sky-300 border-sky-800",
    glow: "shadow-sky-950/20",
  },
} as const;

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  reviews,
  isLoading,
  hasFile,
  onFindingSelect,
  reviewStatus,
}) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [copiedFinding, setCopiedFinding] = useState<number | null>(null);

  const reviewData = useMemo<ReviewData | null>(() => {
    if (!reviews?.length) return null;

    try {
      const parsed = JSON.parse(
        reviews[currentReviewIndex] || "{}"
      ) as ReviewData;

      if (
        typeof parsed.score !== "number" ||
        typeof parsed.summary !== "string" ||
        !Array.isArray(parsed.findings)
      ) {
        return null;
      }

      return parsed;
    } catch (error) {
      console.error("Failed to parse review data:", error);
      return null;
    }
  }, [reviews, currentReviewIndex]);

  useEffect(() => {
    setCurrentReviewIndex(0);
    setCopiedFinding(null);
  }, [reviews]);

  const findings = reviewData?.findings ?? [];

  const counts = {
    critical: findings.filter((item) => item.severity === "critical").length,
    high: findings.filter((item) => item.severity === "high").length,
    medium: findings.filter((item) => item.severity === "medium").length,
    low: findings.filter((item) => item.severity === "low").length,
  };

  const score = Math.max(0, Math.min(100, reviewData?.score ?? 0));

  const getScoreLabel = () => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Needs improvement";
    if (score >= 50) return "Needs attention";
    return "Poor";
  };

  const getScoreColor = () => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-sky-400";
    if (score >= 70) return "text-yellow-400";
    if (score >= 50) return "text-orange-400";
    return "text-red-400";
  };

  const copySuggestion = async (
    suggestion: string,
    index: number
  ) => {
    if (!suggestion) return;

    try {
      await navigator.clipboard.writeText(suggestion);
      setCopiedFinding(index);

      window.setTimeout(() => {
        setCopiedFinding(null);
      }, 1800);
    } catch (error) {
      console.error("Failed to copy suggestion:", error);
    }
  };

  const isReviewing =
    isLoading || reviewStatus === "Reviewing your code...";

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#0b1220] text-white">
      {/* ===================================== */}
      {/* PANEL HEADER */}
      {/* ===================================== */}
      <div className="flex-shrink-0 border-b border-slate-800/80 bg-[#0f1728] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 shadow-lg shadow-sky-950/20">
              <Sparkles className="h-4 w-4 text-sky-400" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-sm font-bold text-white">
                  AI Code Review
                </h2>
              </div>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                <p className="text-[11px] text-slate-500">
                  Powered by Gemini
                </p>
              </div>
            </div>
          </div>

          {reviewStatus === "Completed" && (
            <span className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-emerald-800/70 bg-emerald-950/50 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
              <Check className="h-3 w-3" />
              Complete
            </span>
          )}

          {reviewStatus === "Reviewing your code..." && (
            <span className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-amber-800/70 bg-amber-950/50 px-2.5 py-1 text-[10px] font-semibold text-amber-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              Reviewing
            </span>
          )}

          {reviewStatus === "failed" && (
            <span className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-red-800/70 bg-red-950/50 px-2.5 py-1 text-[10px] font-semibold text-red-400">
              <XCircle className="h-3 w-3" />
              Failed
            </span>
          )}
        </div>
      </div>

      {/* ===================================== */}
      {/* NO FILE */}
      {/* ===================================== */}
      {!hasFile && !isReviewing && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl">
            <Code2 className="h-7 w-7 text-slate-600" />
          </div>

          <h3 className="text-sm font-semibold text-slate-200">
            Select a file to begin
          </h3>

          <p className="mt-2 max-w-[250px] text-xs leading-relaxed text-slate-500">
            Choose a source file from the explorer and DevReview AI will
            analyze it for bugs, security issues and code quality.
          </p>
        </div>
      )}

      {/* ===================================== */}
      {/* LOADING */}
      {/* ===================================== */}
      {isReviewing && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-sky-500/10" />

            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 shadow-xl shadow-sky-950/30">
              <Sparkles className="h-7 w-7 animate-pulse text-sky-400" />
            </div>
          </div>

          <Spinner />

          <h3 className="mt-5 text-sm font-bold text-white">
            AI is reviewing your code
          </h3>

          <p className="mt-2 max-w-[270px] text-xs leading-relaxed text-slate-500">
            Analyzing bugs, security, performance, readability and
            maintainability.
          </p>

          <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" />
            <span>Gemini is analyzing the selected file</span>
          </div>
        </div>
      )}

      {/* ===================================== */}
      {/* FAILED */}
      {/* ===================================== */}
      {!isReviewing && reviewStatus === "failed" && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-800/60 bg-red-950/30 shadow-xl shadow-red-950/20">
            <XCircle className="h-7 w-7 text-red-400" />
          </div>

          <h3 className="text-sm font-bold text-red-300">
            Review failed
          </h3>

          <p className="mt-2 max-w-[260px] text-xs leading-relaxed text-slate-500">
            We couldn't generate an AI review for this file. Please try
            running the review again.
          </p>
        </div>
      )}

      {/* ===================================== */}
      {/* COMPLETED REVIEW */}
      {/* ===================================== */}
      {!isReviewing &&
        reviewStatus === "Completed" &&
        reviewData && (
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="space-y-4 p-3 sm:p-4">
              {/* SCORE CARD */}
              <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/20 p-4 shadow-xl shadow-black/10">
                <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-sky-500/10 blur-3xl" />

                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-sky-400" />

                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Code Quality
                      </p>
                    </div>

                    <p className="mt-1 text-[11px] text-slate-600">
                      Overall AI assessment
                    </p>
                  </div>

                  <div className="relative h-[78px] w-[78px] flex-shrink-0">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(rgb(14 165 233) ${score * 3.6}deg, rgb(30 41 59) ${score * 3.6}deg)`,
                      }}
                    />

                    <div className="absolute inset-[5px] flex flex-col items-center justify-center rounded-full bg-[#0b1220]">
                      <div className="text-xl font-black leading-none text-white">
                        {score}
                      </div>

                      <div className="mt-0.5 text-[9px] text-slate-600">
                        / 100
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${getScoreColor()}`}
                  >
                    {getScoreLabel()}
                  </span>

                  <span className="text-[10px] text-slate-600">
                    AI quality score
                  </span>
                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-700"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </section>

              {/* SUMMARY */}
              <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
                    <Lightbulb className="h-3.5 w-3.5 text-violet-400" />
                  </div>

                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Review Summary
                    </h3>

                    <p className="text-[10px] text-slate-600">
                      AI-generated assessment
                    </p>
                  </div>
                </div>

                <p className="text-xs leading-6 text-slate-300">
                  {reviewData.summary}
                </p>
              </section>

              {/* FINDINGS OVERVIEW */}
              <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileWarning className="h-4 w-4 text-sky-400" />

                    <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Findings
                    </h3>
                  </div>

                  <span className="rounded-full border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] font-semibold text-slate-500">
                    {findings.length}{" "}
                    {findings.length === 1 ? "issue" : "issues"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(
                    ["critical", "high", "medium", "low"] as const
                  ).map((severity) => {
                    const config = severityConfig[severity];

                    return (
                      <div
                        key={severity}
                        className={`rounded-xl border px-3 py-2.5 transition-colors ${config.border} ${config.bg}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">
                              {config.icon}
                            </span>

                            <span
                              className={`text-[10px] font-semibold ${config.text}`}
                            >
                              {config.label}
                            </span>
                          </div>

                          <span
                            className={`text-sm font-black ${config.text}`}
                          >
                            {counts[severity]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* DETAILED FINDINGS */}
              {findings.length > 0 && (
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Detailed Findings
                      </h3>

                      <p className="mt-1 text-[10px] text-slate-600">
                        Review each recommendation below
                      </p>
                    </div>

                    {reviews && reviews.length > 1 && (
                      <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-950 p-1">
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentReviewIndex((prev) =>
                              Math.max(0, prev - 1)
                            )
                          }
                          disabled={currentReviewIndex === 0}
                          aria-label="Previous review"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </button>

                        <span className="min-w-[38px] text-center text-[10px] font-semibold text-slate-500">
                          {currentReviewIndex + 1} / {reviews.length}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setCurrentReviewIndex((prev) =>
                              Math.min(reviews.length - 1, prev + 1)
                            )
                          }
                          disabled={
                            currentReviewIndex >= reviews.length - 1
                          }
                          aria-label="Next review"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {findings.map((finding, index) => {
                      const config =
                        severityConfig[finding.severity] ??
                        severityConfig.medium;

                      return (
                        <article
                          key={`${finding.title}-${index}`}
                          className={`group overflow-hidden rounded-2xl border ${config.border} ${config.bg} shadow-lg ${config.glow}`}
                        >
                          {/* Finding top accent */}
                          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-40" />

                          <div className="p-4">
                            {/* Finding header */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex min-w-0 items-start gap-3">
                                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-slate-700/70 bg-slate-950/70 text-sm">
                                  {config.icon}
                                </div>

                                <div className="min-w-0">
                                  <h4 className="text-sm font-bold leading-5 text-slate-100">
                                    {finding.title}
                                  </h4>

                                  <div className="mt-1 flex items-center gap-2">
                                    <span className="text-[10px] font-medium text-slate-500">
                                      {finding.category}
                                    </span>

                                    {finding.line > 0 && (
                                      <>
                                        <span className="h-1 w-1 rounded-full bg-slate-700" />

                                        <span className="font-mono text-[10px] text-slate-600">
                                          L{finding.line}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <span
                                className={`flex-shrink-0 rounded-md border px-2 py-1 text-[9px] font-bold uppercase tracking-wider ${config.badge}`}
                              >
                                {config.label}
                              </span>
                            </div>

                            {/* Description */}
                            <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
                              <p className="text-xs leading-5 text-slate-400">
                                {finding.description}
                              </p>
                            </div>

                            {/* View in code */}
                            {finding.line > 0 && onFindingSelect && (
                              <button
                                type="button"
                                onClick={() =>
                                  onFindingSelect(finding.line)
                                }
                                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-sky-800/60 bg-sky-950/30 px-3 py-2 text-[10px] font-semibold text-sky-400 transition-all hover:border-sky-600 hover:bg-sky-950/60 hover:text-sky-300"
                              >
                                <Code2 className="h-3.5 w-3.5" />
                                View in Code
                              </button>
                            )}

                            {/* Recommendation */}
                            <div className="mt-4 rounded-xl border border-sky-900/50 bg-sky-950/20 p-3">
                              <div className="mb-2 flex items-center gap-2">
                                <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />

                                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-sky-500">
                                  Recommendation
                                </p>
                              </div>

                              <p className="text-xs leading-5 text-slate-300">
                                {finding.recommendation}
                              </p>
                            </div>

                            {/* Suggested fix */}
                            {finding.suggestion && (
                              <div className="mt-3">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <Clipboard className="h-3.5 w-3.5 text-violet-400" />

                                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                      Suggested Fix
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      copySuggestion(
                                        finding.suggestion,
                                        index
                                      )
                                    }
                                    className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-400 transition-colors hover:text-sky-300"
                                  >
                                    {copiedFinding === index ? (
                                      <>
                                        <Check className="h-3 w-3" />
                                        Copied
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="h-3 w-3" />
                                        Copy Fix
                                      </>
                                    )}
                                  </button>
                                </div>

                                <pre className="max-h-64 overflow-auto rounded-xl border border-slate-800 bg-[#070b12] p-3 shadow-inner">
                                  <code className="whitespace-pre-wrap break-words font-mono text-[10px] leading-5 text-slate-300">
                                    {finding.suggestion}
                                  </code>
                                </pre>
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* NO FINDINGS */}
              {findings.length === 0 && (
                <section className="rounded-2xl border border-emerald-800/50 bg-emerald-950/20 p-5 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-800/60 bg-emerald-950/50">
                    <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-emerald-300">
                    No issues found
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    The AI reviewer didn't identify any significant issues
                    in this file.
                  </p>
                </section>
              )}

              {/* FOOTER */}
              <div className="flex items-center justify-center gap-2 py-2 text-[9px] text-slate-700">
                <Sparkles className="h-3 w-3" />
                <span>Analysis generated by DevReview AI</span>
              </div>
            </div>
          </div>
        )}

      {/* ===================================== */}
      {/* COMPLETED BUT INVALID DATA */}
      {/* ===================================== */}
      {!isReviewing &&
        reviewStatus === "Completed" &&
        !reviewData && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-800/60 bg-amber-950/30">
              <TriangleAlert className="h-6 w-6 text-amber-400" />
            </div>

            <h3 className="text-sm font-bold text-slate-200">
              Review data unavailable
            </h3>

            <p className="mt-2 max-w-[260px] text-xs leading-relaxed text-slate-500">
              The review completed, but the returned result couldn't be
              displayed.
            </p>
          </div>
        )}
    </div>
  );
};
