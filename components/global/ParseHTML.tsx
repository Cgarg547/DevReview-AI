"use client";

import parse, { HTMLReactParserOptions } from "html-react-parser";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

type HtmlParserProps = {
  html: string;
};

export const HtmlParser = ({ html }: HtmlParserProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Customize how <code> tags are rendered
  const options: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      if (domNode.name === "pre" && domNode.children?.[0]?.name === "code") {
        const codeNode = domNode.children[0];
        const languageClass = codeNode.attribs?.class || "";
        const match = languageClass.match(/language-(\w+)/);
        const language = match ? match[1] : "html";

        const codeText = codeNode.children
          .map((child: any) => child.data || "")
          .join("");

        return (
          <SyntaxHighlighter
            language={language}
            style={okaidia}
            // wrapLongLines
            showLineNumbers
            wrapLines
            customStyle={{ borderRadius: "0.5rem", padding: "1rem" }}
          >
            {codeText.trim()}
          </SyntaxHighlighter>
        );
      }
    },
  };

  return (
    <div className="p-3 [&_h1]:text-4xl [&_h2]:text-3xl [&_blockqoute]:italic [&_iframe]:aspect-video [&_h3]:text-2xl text-themeTextGray flex flex-col gap-y-3">
      {mounted && parse(html, options)}
    </div>
  );
};
