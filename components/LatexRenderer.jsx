import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";

const LatexRenderer = ({ children }) => {
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
					<td className="border border-gray-300 p-2" {...props} />
				),
			}}
		>
			{children}
		</ReactMarkdown>
	);
};

export default LatexRenderer;
