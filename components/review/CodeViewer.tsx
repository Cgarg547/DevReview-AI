"use client";

import { Spinner } from "@/components/global/Spinner";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeViewerProps {
  file: { path: string; content: string } | null;
  isLoading: boolean;
  isReviewing: boolean;
  onReview: () => void;
  canReview: boolean;
  highlightedLine?: number | null;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  file,
  isLoading,
  isReviewing,
  onReview,
  canReview,
  highlightedLine,
}) => {
  const getFileExtension = (path: string) => {
    if (!path) return "text";

    const extension = path.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "ts":
        return "typescript";
      case "js":
        return "javascript";
      case "tsx":
        return "tsx";
      case "jsx":
        return "jsx";
      case "json":
        return "json";
      case "md":
        return "markdown";
      case "css":
        return "css";
      case "html":
        return "html";
      case "py":
        return "python";
      case "java":
        return "java";
      case "go":
        return "go";
      case "sh":
        return "bash";
      default:
        return extension || "text";
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#111318]">
      {/* Editor Toolbar */}
      <div className="flex min-h-[58px] shrink-0 items-center justify-between gap-3 border-b border-gray-800/80 bg-[#151922] px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Traffic lights */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 shadow-sm" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 shadow-sm" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 shadow-sm" />
          </div>

          <div className="hidden h-5 w-px bg-gray-800 sm:block" />

          <div className="flex min-w-0 items-center gap-2">
            <span className="hidden text-xs text-gray-600 sm:inline">
              src
            </span>

            <span className="text-gray-700 sm:inline">/</span>

            <div className="min-w-0">
              <h2
                className="max-w-[170px] truncate text-xs font-medium text-gray-300 sm:max-w-[340px] sm:text-sm"
                title={file?.path}
              >
                {file ? file.path : "Code Viewer"}
              </h2>

              {file && (
                <p className="mt-0.5 text-[9px] text-gray-600">
                  Source code
                </p>
              )}
            </div>
          </div>
        </div>

        {file && !isLoading && (
          <button
            type="button"
            onClick={onReview}
            disabled={isReviewing || !canReview}
            className={`group flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold transition-all sm:gap-2 sm:px-4 sm:text-xs ${
              canReview
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 hover:bg-sky-400 hover:shadow-sky-500/30 active:translate-y-0"
                : "cursor-not-allowed bg-gray-800 text-gray-500"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {isReviewing ? (
              <>
                <Spinner />
                <span className="hidden sm:inline">
                  Analyzing...
                </span>
                <span className="sm:hidden">
                  Analyzing
                </span>
              </>
            ) : (
              <>
                <span className="transition-transform group-hover:scale-110">
                  ✨
                </span>

                <span className="hidden sm:inline">
                  {canReview
                    ? "Review Code"
                    : "Upgrade to Review"}
                </span>

                <span className="sm:hidden">
                  {canReview ? "Review" : "Upgrade"}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Code Area */}
      <div className="min-h-0 flex-1 overflow-auto [scrollbar-color:#374151_transparent] [scrollbar-width:thin]">
        {isLoading && (
          <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 px-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 shadow-lg shadow-sky-500/5">
              <Spinner />
            </div>

            <div className="text-center">
              <p className="text-sm font-semibold text-gray-300">
                Loading source code
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Fetching the file from GitHub...
              </p>
            </div>
          </div>
        )}

        {file?.content ? (
          <SyntaxHighlighter
            language={getFileExtension(file.path)}
            showLineNumbers
            style={okaidia}
            wrapLongLines={false}
            customStyle={{
              margin: 0,
              padding: "1rem 0 2rem",
              background: "transparent",
              minHeight: "100%",
              fontSize: "12px",
              lineHeight: "1.7",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            }}
            lineNumberStyle={{
              minWidth: "3.5em",
              paddingRight: "1.2em",
              paddingLeft: "0.8em",
              textAlign: "right",
              userSelect: "none",
              color: "#4b5563",
              fontSize: "11px",
            }}
            lineProps={(lineNumber) => {
              const isHighlighted =
                highlightedLine === lineNumber;

              return {
                "data-highlight-line": lineNumber,
                style: {
                  display: "block",
                  width: "100%",
                  backgroundColor: isHighlighted
                    ? "rgba(14, 165, 233, 0.14)"
                    : undefined,
                  borderLeft: isHighlighted
                    ? "3px solid rgb(14, 165, 233)"
                    : "3px solid transparent",
                  boxSizing: "border-box",
                  transition:
                    "background-color 0.2s ease",
                  minHeight: "1.7em",
                },
              };
            }}
          >
            {file.content}
          </SyntaxHighlighter>
        ) : (
          !isLoading && (
            <div className="flex h-full min-h-[400px] items-center justify-center px-6">
              <div className="max-w-sm text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-800 bg-gray-900 text-2xl shadow-xl">
                  ‹›
                </div>

                <p className="text-sm font-semibold text-gray-300">
                  No file selected
                </p>

                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  Select a file from the Explorer to inspect
                  its source code.
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Editor Footer */}
      {file?.content && !isLoading && (
        <div className="flex shrink-0 items-center justify-between border-t border-gray-800/80 bg-[#151922] px-3 py-2 sm:px-4">
          <span className="text-[9px] font-medium uppercase tracking-wider text-gray-600">
            Read only
          </span>

          <span className="text-[9px] text-gray-600">
            GitHub source
          </span>
        </div>
      )}
    </div>
  );
};