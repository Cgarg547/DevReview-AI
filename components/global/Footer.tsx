import { GitHubIcon } from "@/icons/GitHubIcon";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800/50 border-t border-gray-700 text-center p-4">
      <Link
        href="https://github.com/cgarg547"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
      >
        <GitHubIcon className="size-5" />
        <span>View on GitHub</span>
      </Link>
    </footer>
  );
};

export default Footer;
