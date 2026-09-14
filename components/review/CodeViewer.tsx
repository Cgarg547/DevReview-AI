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
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#1e1e1e]">
      {/* Editor Header */}
      <div className="flex min-h-[58px] flex-shrink-0 items-center justify-between gap-3 border-b border-gray-800 bg-gray-900 px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* Traffic lights */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>

          <div className="hidden h-4 w-px bg-gray-700 sm:block" />

          <div className="min-w-0">
            <h2
              className="max-w-[180px] truncate text-xs font-medium text-gray-300 sm:max-w-[300px] sm:text-sm"
              title={file?.path}
            >
              {file ? file.path : "Code Viewer"}
            </h2>

            {file && (
              <p className="mt-0.5 text-[10px] text-gray-600 sm:hidden">
                Source code
              </p>
            )}
          </div>
        </div>

        {file && !isLoading && (
          <button
            type="button"
            onClick={onReview}
            disabled={isReviewing || !canReview}
            className="flex flex-shrink-0 items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-2.5 py-2 text-[11px] font-semibold text-white shadow-sm transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500 sm:gap-2 sm:px-3.5 sm:text-xs"
          >
            {isReviewing ? (
              <>
                <Spinner />
                <span className="hidden sm:inline">Analyzing...</span>
                <span className="sm:hidden">Analyzing</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span className="hidden sm:inline">
                  {canReview ? "Review Code" : "Upgrade to Review"}
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
      <div className="min-h-0 flex-1 overflow-auto">
        {isLoading && (
          <div className="flex min-h-[400px] h-full flex-col items-center justify-center gap-3 px-4">
            <Spinner />

            <span className="text-center text-sm text-gray-500">
              Fetching file...
            </span>
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
              padding: "1rem 0",
              background: "transparent",
              minHeight: "100%",
              fontSize: "12px",
              lineHeight: "1.65",
            }}
            lineNumberStyle={{
              minWidth: "3.5em",
              paddingRight: "1em",
              paddingLeft: "0.5em",
              textAlign: "right",
              userSelect: "none",
              color: "#4b5563",
            }}
            lineProps={(lineNumber) => {
              const isHighlighted = highlightedLine === lineNumber;

              return {
                "data-highlight-line": lineNumber,
                style: {
                  display: "block",
                  width: "100%",
                  backgroundColor: isHighlighted
                    ? "rgba(245, 158, 11, 0.15)"
                    : undefined,
                  borderLeft: isHighlighted
                    ? "3px solid rgb(245, 158, 11)"
                    : "3px solid transparent",
                  boxSizing: "border-box",
                  transition: "background-color 0.2s ease",
                },
              };
            }}
          >
            {file.content}
          </SyntaxHighlighter>
        ) : (
          !isLoading && (
            <div className="flex min-h-[400px] h-full items-center justify-center px-6">
              <div className="max-w-sm text-center">
                <div className="mb-3 text-3xl">📄</div>

                <p className="text-sm leading-relaxed text-gray-500">
                  Select a file from the repository to view its content.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};