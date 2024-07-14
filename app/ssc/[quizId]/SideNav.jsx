// SideNav.js
import React from "react";
import { Button } from "@nextui-org/react";

const SideNav = ({
	questions,
	currentQuestionIndex,
	currentSectionIndex,
	handleJumpToQuestion,
}) => {
	return (
		<div className="w-16 overflow-y-auto pt-1">
			<div className="flex flex-col items-center space-y-2">
				{questions.map((question, index) => {
					const isActive = index === currentQuestionIndex;
					const isAnswered = question.selectedOption !== null;
					const isMarked = question.isMarked;
					const isVisited = question.isVisited;

					let buttonClass = "w-8 h-8 rounded-full relative ";
					let ringClass = "";

					if (isActive) {
						buttonClass += "bg-blue-600 w-10 h-20 ";
					} else if (isAnswered) {
						buttonClass += "bg-green-500/60 ";
					} else if (isVisited) {
						buttonClass += "bg-orange-500/60 ";
					}

					if (isMarked) {
						ringClass = "ring-2 ring-yellow-400  ";
					}

					return (
						<Button
							key={index}
							size="sm"
							variant="shadow"
							isIconOnly
							className={`${buttonClass} ${ringClass} transition-all duration-300 hover:scale-110`}
							onClick={() => handleJumpToQuestion(index)}
						>
							<span className="text-sm font-semibold">
								{index + 1}
							</span>
						</Button>
					);
				})}
			</div>
		</div>
	);
};

export default SideNav;
