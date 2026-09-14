import { Spinner } from "@/components/global/Spinner";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeViewerProps {
  file: { path: string; content: string } | null;
  isLoading: boolean;
  isReviewing: boolean;
  onReview: () => void;
  canReview: boolean;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  file,
  isLoading,
  isReviewing,
  onReview,
  canReview,
}) => {
  const getFileExtension = (path: string) => {
    if (!path) return;
    const extension = path.split(".").pop()?.toLowerCase();
    // Map common extensions to what react-syntax-highlighter expects
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
    <div className="flex flex-col">
      <div className="flex-shrink-0 p-3 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold truncate">
          {file ? file.path : "Code Viewer"}
        </h2>
        {file && !isLoading && (
          <button
            onClick={onReview}
            disabled={isReviewing || !canReview}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors text-sm cursor-pointer"
          >
            {isReviewing ? (
              <div className="flex items-center space-x-2">
                <Spinner />
                <span>Analyzing...</span>
              </div>
            ) : (
              <>{!canReview ? "Upgrade to Review" : "✨ Review Code"}</>
            )}
          </button>
        )}
      </div>

      <div className="flex-grow overflow-auto relative">
        {isLoading && (
          <div className="flex flex-col justify-center items-center p-25 space-y-2">
            <Spinner />
            <span>Fetching file...</span>
          </div>
        )}
        {file?.content ? (
          <SyntaxHighlighter
            language={getFileExtension(file.path)}
            showLineNumbers
            style={okaidia}
            wrapLongLines
            customStyle={{
              padding: "1rem",
              background: "transparent",
            }}
          >
            {file.content}
          </SyntaxHighlighter>
        ) : (
          !isLoading && (
            <div className="flex justify-center items-center p-25">
              <p className="text-gray-500">
                Select a file from the repository to view its content.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
