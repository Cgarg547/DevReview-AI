"use server";

import { GitTreeItem, GitHubRepo, GitHubRepoInfo } from "@/types";
import { getToken } from "@/services/getToken";

const GITHUB_API_BASE = "https://api.github.com";

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = (await getToken()).token;
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `token ${token}`);
  headers.set("Accept", "application/vnd.github.v3+json");

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  // console.log(response);
  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

export const fetchUserRepos = async (): Promise<GitHubRepo[]> => {
  // Explicitly set visibility=all to fetch both public and private repos.
  // This requires the user's Personal Access Token to have the 'repo' scope.
  return apiFetch("/user/repos?visibility=all&sort=updated&per_page=100");
};

export const fetchRepoInfo = async (
  owner: string,
  repo: string
): Promise<GitHubRepoInfo> => {
  return apiFetch(`/repos/${owner}/${repo}`);
};

export const fetchRepoTree = async (
  owner: string,
  repo: string,
  branch: string
): Promise<GitTreeItem[]> => {
  const data = await apiFetch(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );
  return data.tree;
};

const decodeBase64 = (base64: string): string => {
  try {
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  } catch (e) {
    console.error("Failed to decode base64 content with Unicode support:", e);
    try {
      return atob(base64);
    } catch (e2) {
      console.error("atob fallback failed:", e2);
      return "Error: Could not decode file content.";
    }
  }
};

// export const fetchFileContent = async (
//   owner: string,
//   repo: string,
//   path: string
// ): Promise<{ content: string; sha: string }> => {
//   const data = await apiFetch(`/repos/${owner}/${repo}/contents/${path}`);

//   let content: string;

//   if (data.download_url) {
//     const token = await getToken();
//     const response = await fetch(data.download_url, {
//       headers: { Authorization: `token ${token}` },
//     });
//     if (!response.ok) {
//       throw new Error(
//         `Failed to download file content from ${data.download_url}`
//       );
//     }
//     content = await response.text();
//   } else if (data.encoding === "base64" && typeof data.content === "string") {
//     content = decodeBase64(data.content);
//   } else if (typeof data.content === "string") {
//     content = data.content;
//   } else {
//     throw new Error(
//       "Unsupported file format or missing content received from GitHub API."
//     );
//   }

//   return { content, sha: data.sha };
// };

export const fetchFileContent = async (
  owner: string,
  repo: string,
  path: string
): Promise<{ content: string; sha: string }> => {
  try {
    const data = await apiFetch(`/repos/${owner}/${repo}/contents/${path}`);
    if (!data) throw new Error("No data found");

    let content: string;

    if (data.encoding === "base64" && data.content) {
      content = Buffer.from(data.content, "base64").toString("utf-8");
    } else if (data.download_url) {
      const res = await fetch(data.download_url);

      if (!res.ok) {
        throw new Error(
          `Failed to fetch file from download URL: ${res.status} ${res.statusText}`
        );
      }
      content = await res.text();
    } else {
      throw new Error("Unsupported file encoding or missing content");
    }

    return { content, sha: data.sha };
  } catch (error) {
    console.error("Error in fetchFileContent:", error);
    throw error;
  }
};

export const inngestFetchFileContent = async (
  owner: string,
  repo: string,
  path: string,
  token: string
) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("GitHub error:", data);
    throw new Error(data.message || "Failed to fetch GitHub file");
  }

  // base64 content (most reliable)
  const content = Buffer.from(data.content, "base64").toString("utf8");

  return { content, sha: data.sha };
};
