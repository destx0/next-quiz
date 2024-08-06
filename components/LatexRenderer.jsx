import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";

const LatexRenderer = ({ children }) => {
	const unescapeContent = (escapedContent) => {
		return escapedContent
			.replace(/\\n/g, "\n")
			.replace(/\\\\/g, "\\")
			.replace(/\\"/g, '"');
	};

	const isHTML = (str) => {
		return /<[a-z][\s\S]*>/i.test(str);
	};

	const content = unescapeContent(children);

	if (isHTML(content)) {
		return <div dangerouslySetInnerHTML={{ __html: content }} />;
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
					<th
						className="border border-gray-300 p-2 font-bold"
						{...props}
					/>
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
