import { useState } from "react";

import { FileNode } from "@/types";
import { FolderIcon } from "@/icons/FolderIcon";
import { FileIcon } from "@/icons/FileIcon";
import { JsIcon } from "@/icons/JsIcon";
import { TsIcon } from "@/icons/TsIcon";
import { JsonIcon } from "@/icons/JsonIcon";
import { CssIcon } from "@/icons/CssIcon";
import { HtmlIcon } from "@/icons/HtmlIcon";
import { MarkdownIcon } from "@/icons/MarkdownIcon";
import { ImageIcon } from "@/icons/ImageIcon";

interface FileTreeProps {
  tree: FileNode;
  onFileSelect: (path: string) => void;
  selectedFile?: string | null;
}

interface TreeNodeProps {
  node: FileNode;
  onFileSelect: (path: string) => void;
  selectedFile?: string | null;
}

const getFileIcon = (
  fileName: string
): React.ReactNode => {
  const extension = fileName
    .split(".")
    .pop()
    ?.toLowerCase();

  const iconClass =
    "size-4.5 mr-2 flex-shrink-0";

  switch (extension) {
    case "js":
    case "jsx":
      return <JsIcon className={iconClass} />;

    case "ts":
    case "tsx":
      return <TsIcon className={iconClass} />;

    case "json":
      return <JsonIcon className={iconClass} />;

    case "css":
    case "scss":
    case "sass":
      return <CssIcon className={iconClass} />;

    case "html":
      return <HtmlIcon className={iconClass} />;

    case "md":
    case "mdx":
      return <MarkdownIcon className={iconClass} />;

    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
    case "ico":
      return (
        <ImageIcon
          className={`${iconClass} text-gray-400`}
        />
      );

    default:
      return (
        <FileIcon
          className={`${iconClass} text-gray-400`}
        />
      );
  }
};

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onFileSelect,
  selectedFile,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const isFolder = node.type === "folder";
  const isSelected =
    !isFolder && node.path === selectedFile;

  const handleToggle = () => {
    if (isFolder) {
      setIsOpen((current) => !current);
    } else {
      onFileSelect(node.path);
    }
  };

  const children = node.children
    ? Object.values(node.children).sort(
        (a: FileNode, b: FileNode) =>
          b.type.localeCompare(a.type) ||
          a.name.localeCompare(b.name)
      )
    : [];

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className={`group flex w-full min-w-0 items-center rounded-lg px-2 py-1.5 text-left transition-all ${
          isSelected
            ? "bg-sky-500/15 text-sky-200 shadow-sm ring-1 ring-inset ring-sky-500/20"
            : "text-gray-400 hover:bg-gray-800/80 hover:text-gray-200"
        }`}
      >
        {isFolder ? (
          <span
            className={`mr-1 flex h-4 w-4 shrink-0 items-center justify-center text-[9px] text-gray-600 transition-transform ${
              isOpen ? "rotate-90" : ""
            }`}
          >
            ▶
          </span>
        ) : (
          <span className="mr-1 w-4 shrink-0" />
        )}

        {isFolder ? (
          <FolderIcon
            isOpen={isOpen}
            className="mr-2 size-4.5 shrink-0 text-sky-400"
          />
        ) : (
          getFileIcon(node.name)
        )}

        <span
          className={`min-w-0 flex-1 truncate text-xs ${
            isSelected
              ? "font-semibold text-sky-200"
              : "font-medium"
          }`}
          title={node.path}
        >
          {node.name}
        </span>

        {isFolder && (
          <span className="ml-2 shrink-0 text-[9px] text-gray-700">
            {children.length}
          </span>
        )}
      </button>

      {isFolder && isOpen && children.length > 0 && (
        <div className="ml-3 border-l border-gray-800 pl-2">
          {children.map((childNode: FileNode) => (
            <TreeNode
              key={childNode.path}
              node={childNode}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({
  tree,
  onFileSelect,
  selectedFile,
}) => {
  const nodes = tree.children
    ? Object.values(tree.children).sort(
        (a: FileNode, b: FileNode) =>
          b.type.localeCompare(a.type) ||
          a.name.localeCompare(b.name)
      )
    : [];

  return (
    <div className="space-y-0.5">
      {nodes.map((node: FileNode) => (
        <TreeNode
          key={node.path}
          node={node}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
        />
      ))}
    </div>
  );
};