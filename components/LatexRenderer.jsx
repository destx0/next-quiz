import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import katex from "katex";

const LatexRenderer = ({ children }) => {
  const unescapeContent = (escapedContent) => {
    return escapedContent
      .replace(/(?<!\\)\\n/g, "\n")
      .replace(/\\\\/g, "\\")
      .replace(/\\"/g, '"');
  };

  const renderLatexInHTML = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const latexSpans = doc.querySelectorAll("span.math-tex");
    latexSpans.forEach((span) => {
      const latex = span.textContent.replace(/^\\\((.*)\\\)$/, "$1");
      const renderedLatex = katex.renderToString(latex, {
        throwOnError: false,
      });
      span.innerHTML = renderedLatex;
    });

    // Add CSS styles for table borders
    const style = doc.createElement("style");
    style.textContent = `
            table { border-collapse: collapse; border: 1px solid #ccc; }
            th, td { border: 1px solid #ccc; padding: 8px; }
        `;
    doc.head.appendChild(style);

    // Apply classes to tables, th, and td elements
    doc.querySelectorAll("table").forEach((table) => {
      table.className = "border-collapse border border-gray-300";
    });
    doc.querySelectorAll("th").forEach((th) => {
      th.className = "border border-gray-300 p-2 font-bold";
    });
    doc.querySelectorAll("td").forEach((td) => {
      td.className = "border border-gray-300 p-2";
    });

    return doc.body.innerHTML;
  };

  const content = unescapeContent(children);

  if (/<[a-z][\s\S]*>/i.test(content)) {
    const renderedContent = renderLatexInHTML(content);
    return <div dangerouslySetInnerHTML={{ __html: renderedContent }} />;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      components={{
        table: ({ node, ...props }) => (
          <table
            className="border-collapse border border-gray-300"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-300 p-2" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th className="border border-gray-300 p-2 font-bold" {...props} />
        ),
        sup: ({ node, ...props }) => <sup {...props} />,
        b: ({ node, ...props }) => <strong {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default LatexRenderer;
