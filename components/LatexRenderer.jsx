import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const LatexRenderer = ({ children }) => {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkMath]}
			rehypePlugins={[rehypeKatex]}
		>
			{children}
		</ReactMarkdown>
	);
};

export default LatexRenderer;
