import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";

const LatexRenderer = ({ children }) => {
	const unescapeContent = (escapedContent) => {
		return escapedContent
			.replace(/\\n/g, "\n") // Replace escaped newlines
			.replace(/\\\\/g, "\\") // Replace double backslashes with single
			.replace(/\\"/g, '"'); // Replace escaped quotes
		// Add more replacements if needed
	};

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
					<th
						className="border border-gray-300 p-2 font-bold"
						{...props}
					/>
				),
			}}
		>
			{unescapeContent(children)}
		</ReactMarkdown>
	);
};

export default LatexRenderer;
