"use client";

import React, { useState } from "react";
import { Textarea } from "@nextui-org/react";
import LatexRenderer from "@/components/LatexRenderer";

const LatexPage = () => {
	const [userInput, setUserInput] = useState("");

	const existingContent =
		"The logic followed here is :\n\n$$\\text{(First number } \\times 2) - 4$$\n\n- $$19 : 34 \\to (19 \\times 2) - 4 = 38 - 4 = 34$$\n\nand\n\n- $$5 : 6 \\to (5 \\times 2) - 4 = 10 - 4 = 6$$\n\nSimilarly,\n\n- **$$27 : ? \\to (27 \\times 2) - 4 = 54 - 4 = 50$$**\n\nHence, the correct answer is **50**.";

	const handleInputChange = (e) => {
		const inputValue = e.target.value;
		const processedInput = inputValue.replace(/\/\//g, "/");
		setUserInput(processedInput);
	};

	return (
		<div className="p-4">
			<Textarea
				label="Enter LaTeX content"
				placeholder="Type your LaTeX here..."
				value={userInput}
				onChange={handleInputChange}
				className="mb-4"
				minRows={3}
			/>

			<h2 className="text-xl font-bold mb-2">User Input:</h2>
			<LatexRenderer>{`Your input: ${userInput}`}</LatexRenderer>

			<h2 className="text-xl font-bold mt-6 mb-2">Existing Content:</h2>
			<LatexRenderer>{existingContent}</LatexRenderer>
		</div>
	);
};

export default LatexPage;
