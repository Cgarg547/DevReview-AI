export interface GitTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url?: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  sha?: string;
  children?: {
    [key: string]: FileNode;
  };
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  fork: boolean;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export interface GitHubRepoInfo {
  owner: string;
  repo: string;
  private: boolean;
}