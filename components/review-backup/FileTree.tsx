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

const getFileIcon = (fileName: string): React.ReactNode => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const iconClass = "size-5 mr-2 flex-shrink-0";

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
      return <ImageIcon className={`${iconClass} text-gray-400`} />;
    default:
      return <FileIcon className={`${iconClass} text-gray-400`} />;
  }
};

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onFileSelect,
  selectedFile,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === "folder";
  const isSelected = !isFolder && node.path === selectedFile;

  const handleToggle = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node.path);
    }
  };

  return (
    <div className="my-1">
      <div
        onClick={handleToggle}
        className={`flex items-center cursor-pointer p-1 rounded-md transition-colors ${
          isSelected ? "bg-sky-700 text-white" : "hover:bg-gray-700"
        }`}
      >
        {isFolder ? (
          <FolderIcon
            isOpen={isOpen}
            className="size-5 mr-2 text-sky-400 flex-shrink-0"
          />
        ) : (
          getFileIcon(node.name)
        )}
        <span
          className={`text-sm truncate ${isSelected ? "font-semibold" : ""}`}
        >
          {node.name}
        </span>
      </div>
      {isFolder && isOpen && (
        <div className="pl-5 border-l border-gray-700">
          {node.children &&
            Object.values(node.children)
              // Sort folders before files, then alphabetically by name.
              .sort(
                (a: FileNode, b: FileNode) =>
                  b.type.localeCompare(a.type) || a.name.localeCompare(b.name)
              )
              .map((childNode: FileNode) => (
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
  return (
    <div>
      {tree.children &&
        Object.values(tree.children)
          // Sort folders before files, then alphabetically by name.
          .sort(
            (a: FileNode, b: FileNode) =>
              b.type.localeCompare(a.type) || a.name.localeCompare(b.name)
          )
          .map((node: FileNode) => (
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
