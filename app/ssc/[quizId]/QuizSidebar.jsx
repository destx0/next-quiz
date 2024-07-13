"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { useQuizStore } from "@/stores/quizStore";

export default function QuizSidebar({
	currentSection,
	currentQuestionIndex,
	onQuestionSelect,
}) {
	const {
		userAnswers,
		visitedQuestions,
		markedQuestions,
		toggleMarkedQuestion,
	} = useQuizStore();

	const getButtonColor = (index) => {
		const key = `${currentSection.id}-${index}`;
		if (markedQuestions[key]) return "warning";
		if (userAnswers[key] !== undefined) return "success";
		if (visitedQuestions[key]) return "secondary";
		return "default";
	};

	return (
		<div className="w-64 p-4 fixed right-0 top-0 h-screen overflow-y-auto bg-gray-200 bg-opacity-10">
			<h2 className="text-xl font-bold mb-4">
				{currentSection.name || "Current Section"}
			</h2>
			<div className="grid grid-cols-5 gap-2">
				{currentSection.questions.map((_, index) => (
					<Button
						key={index}
						size="sm"
						color={getButtonColor(index)}
						onClick={() => onQuestionSelect(index)}
						className="w-10 h-10 p-0"
					>
						<svg viewBox="0 0 24 24" className="w-6 h-6">
							<rect
								width="20"
								height="20"
								x="2"
								y="2"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<text
								x="12"
								y="16"
								textAnchor="middle"
								fontSize="12"
								fill="currentColor"
							>
								{index + 1}
							</text>
						</svg>
					</Button>
				))}
			</div>
			<Button
				size="sm"
				className="mt-4 w-full"
				onClick={() =>
					toggleMarkedQuestion(
						currentSection.id,
						currentQuestionIndex
					)
				}
			>
				{markedQuestions[`${currentSection.id}-${currentQuestionIndex}`]
					? "Unmark"
					: "Mark"}{" "}
				for Review
			</Button>
		</div>
	);
}
