// app/ssc/[quizId]/QuizSidebar.js
"use client";

import React from "react";
import { Button } from "@nextui-org/react";

export default function QuizSidebar({
	currentSection,
	currentQuestionIndex,
	onQuestionSelect,
}) {
	return (
		<div className="w-64 p-4 h-screen overflow-y-auto border-l">
			<h2 className="text-xl font-bold mb-4">
				{currentSection.name || "Current Section"}
			</h2>
			<div className="space-y-2">
				{currentSection.questions.map((question, index) => (
					<Button
						key={index}
						className={`w-full justify-start ${currentQuestionIndex === index ? "font-bold" : ""}`}
						onClick={() => onQuestionSelect(index)}
						variant={
							currentQuestionIndex === index ? "solid" : "light"
						}
					>
						Question {index + 1}
					</Button>
				))}
			</div>
		</div>
	);
}
