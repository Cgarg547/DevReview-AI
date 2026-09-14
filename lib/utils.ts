import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30.44); // Average month length
  const years = Math.round(days / 365);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}min ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
};

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const processParts = (parts: string[]): string[] => {
  return parts.map((part, index) => {
    // It's a code block
    if (index % 2 === 1) {
      const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
      if (!match) return `<pre>${escapeHtml(part)}</pre>`;

      const lang = match[1] || "text";
      const code = match[2].trim();

      // Wrapper div helps control styles in a `prose` container
      return `<div class="code-block-wrapper my-4 rounded-md overflow-hidden bg-gray-800 not-prose"><pre class="language-${lang} !m-0 !p-4 !bg-gray-800"><code class="language-${lang}">${escapeHtml(
        code
      )}</code></pre></div>`;
    }

    // It's regular markdown content
    return (
      part
        .replace(
          /^### (.*$)/gim,
          '<h3 class="text-lg font-semibold mt-4 mb-2 text-sky-300">$1</h3>'
        )
        .replace(
          /^## (.*$)/gim,
          '<h2 class="text-xl font-bold mt-6 mb-3 border-b border-gray-600 pb-2 text-sky-200">$1</h2>'
        )
        .replace(
          /^# (.*$)/gim,
          '<h1 class="text-2xl font-bold mt-8 mb-4 border-b-2 border-gray-500 pb-2 text-sky-100">$1</h1>'
        )
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold text-white">$1</strong>'
        )
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(
          /`([^`]+)`/g,
          '<code class="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded-md text-sm">$1</code>'
        )
        // Process lists
        .replace(/((?:^\s*[-*] .*(?:\n|$))+)/gm, (listBlock) => {
          const items = listBlock
            .trim()
            .split("\n")
            .map((item) => {
              return `<li class="my-1">${item.replace(/^\s*[-*] /, "")}</li>`;
            })
            .join("");
          return `<ul class="list-disc pl-8">${items}</ul>`;
        })
        .replace(/\n/g, "<br />")
        // Clean up extra breaks around lists and headings
        .replace(/<br \/>(\s*<ul>)/g, "$1")
        .replace(/(<\/ul>)<br \/>/g, "$1")
        .replace(/<br \/>(\s*<h[1-6])/g, "$1")
        .replace(/(<\/h[1-6]>)<br \/>/g, "$1")
    );
  });
};
