"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import LatexRenderer from "@/components/LatexRenderer";

const LatexPage = () => {
	const [userInput, setUserInput] = useState("");

	const existingContent = `
**Given:**

The area enclosed between the circumferences of two concentric circles = $16\\pi \\text{ cm}^2$.

The ratio of their radii = $5 : 3$.

**Formula used:**

Area of circle = $\\pi r^2$.

**Calculation:**

![Image](https://storage.googleapis.com/tb-img/production/22/12/F1_Madhuri_Defence_02.12.2022_D8.png)

Let the radius be $R = 5x$ and $r = 3x$.

According to the question:

$$\\pi R^2 - \\pi r^2 = 16\\pi$$

$$\\pi (R^2 - r^2) = 16\\pi$$

$$R^2 - r^2 = 16$$

$$(5x)^2 - (3x)^2 = 16$$

$$25x^2 - 9x^2 = 16$$

$$16x^2 = 16$$

$$x = 1$$

Now, outer circle $R = 5x = (5 \\times 1) = 5 \\text{ cm}$.

The area of the outer circle = $\\pi (5)^2 = 25\\pi \\text{ cm}^2$.

**∴ The required area is $25\\pi \\text{ cm}^2$.**
`;

	return (
		<div className="p-4">
			<Input
				label="Enter LaTeX content"
				placeholder="Type your LaTeX here..."
				value={userInput}
				onChange={(e) => setUserInput(e.target.value)}
				className="mb-4"
			/>

			<h2 className="text-xl font-bold mb-2">User Input:</h2>
			<LatexRenderer>{userInput}</LatexRenderer>

			<h2 className="text-xl font-bold mt-6 mb-2">Existing Content:</h2>
			<LatexRenderer>{existingContent}</LatexRenderer>
		</div>
	);
};

export default LatexPage;
