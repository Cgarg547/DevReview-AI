import { GitTreeItem, FileNode } from "@/types";

export const buildFileTree = (items: GitTreeItem[]): FileNode => {
  const root: FileNode = {
    name: "root",
    type: "folder",
    path: "",
    children: {},
  };

  // The GitHub API returns items sorted by path, which is convenient.
  items.forEach((item) => {
    const pathParts = item.path.split("/");
    let currentNode = root;

    pathParts.forEach((part, index) => {
      if (!currentNode.children) {
        currentNode.children = {};
      }

      const isLastPart = index === pathParts.length - 1;

      if (!currentNode.children[part]) {
        // If the node doesn't exist, create it.
        // It's a folder if it's not the last part of the path,
        // or if it is the last part and its type is 'tree'.
        const isFile = isLastPart && item.type === "blob";
        const currentPath = isLastPart
          ? item.path
          : pathParts.slice(0, index + 1).join("/");

        currentNode.children[part] = {
          name: part,
          type: isFile ? "file" : "folder",
          path: currentPath,
          ...(isFile ? {} : { children: {} }),
        };
      }
      currentNode = currentNode.children[part];
    });
  });

  return root;
};
