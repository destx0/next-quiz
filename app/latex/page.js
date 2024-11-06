"use client";

import React, { useState } from "react";
import { Textarea } from "@nextui-org/react";
import LatexRenderer from "@/components/LatexRenderer";

const LatexPage = () => {
  const [userInput, setUserInput] = useState("");
  const existingContent = `
The logic followed here is:\\n\\nBy using BODMAS RULE:\\n\\n**Option 1)** : \\(\\times\\) and \\(-\\)\\n\\nGiven equation is: $$171 \\div 3 - 16 + 72 \\times 412 = 572$$\\n\\nAfter interchanging the two signs, the equation is as follows: $$171 \\div 3 \\times 16 + 72 - 412 = 572$$\\n\\n$$\\Rightarrow \\mathbf{171 \\div 3} \\times 16 + 72 - 412 = 572$$\\n\\n$$\\Rightarrow \\mathbf{57 \\times 16} + 72 - 412 = 572$$\\n\\n$$\\Rightarrow \\mathbf{912 + 72} - 412 = 572$$\\n\\n$$\\Rightarrow \\mathbf{984 - 412} = 572$$\\n\\n$$\\Rightarrow \\mathbf{572 = 572}$$\\n\\n$$\\mathbf{LHS = RHS}$$\\n\\n**Option 2)** : \\(\\div\\) and \\(-\\)\\n\\nGiven equation is: $$171 \\div 3 - 16 + 72 \\times 412 = 572$$\\n\\nAfter interchanging the two signs, the equation is as follows: $$171 - 3 \\div 16 + 72 \\times 412 = 572$$\\n\\n$$\\Rightarrow 171 - \\mathbf{3 \\div 16} + 72 \\times 412 = 572$$\\n\\n$$\\Rightarrow 171 - 0.1875 + \\mathbf{72 \\times 412} = 572$$\\n\\n$$\\Rightarrow \\mathbf{171} - 0.1875 + \\mathbf{29664} = 572$$\\n\\n$$\\Rightarrow \\mathbf{29835 - 0.1875} = 572$$\\n\\n$$\\Rightarrow 29834.1875 \\neq 572$$\\n\\n$$\\mathbf{LHS \\neq RHS}$$\\n\\n**Option 3)** : \\(\\div\\) and \\(\\+\\)\\n\\nGiven equation is: $$171 \\div 3 - 16 + 72 \\times 412 = 572$$\\n\\nAfter interchanging the two signs, the equation is as follows: $$171 + 3 - 16 \\div 72 \\times 412 = 572$$\\n\\n$$\\Rightarrow 171 + 3 - \\mathbf{16 \\div 72} \\times 412 = 572$$\\n\\n$$\\Rightarrow 171 + 3 - \\mathbf{0.22 \\times 412} = 572$$\\n\\n$$\\Rightarrow \\mathbf{171 + 3} - 91.55 = 572$$\\n\\n$$\\Rightarrow \\mathbf{174 - 91.55} = 572$$\\n\\n$$\\Rightarrow 82.44 \\neq 572$$\\n\\n$$\\mathbf{LHS \\neq RHS}$$\\n\\n**Option 4)** : \\(-\\) and \\(\\+\\)\\n\\nGiven equation is: $$171 \\div 3 - 16 + 72 \\times 412 = 572$$\\n\\nAfter interchanging the two signs, the equation is as follows: $$171 \\div 3 + 16 - 72 \\times 412 = 572$$\\n\\n$$\\Rightarrow \\mathbf{171 \\div 3} + 16 - 72 \\times 412 = 572$$\\n\\n$$\\Rightarrow 57 + 16 - \\mathbf{72 \\times 412} = 572$$\\n\\n$$\\Rightarrow \\mathbf{57 + 16} - 29664 = 572$$\\n\\n$$\\Rightarrow \\mathbf{73 - 29664} = 572$$\\n\\n$$\\Rightarrow -29591 \\neq 572$$\\n\\n$$\\mathbf{LHS \\neq RHS}$$\\n\\nHence, the correct answer is **"$\\times$ and $-$"**.
`;

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
