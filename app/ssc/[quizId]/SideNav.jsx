import React from "react";

const QuestionStatusIcon = ({ isActive, isAnswered, isVisited, isMarked }) => {
	let fillColor = "white";
	if (isActive)
		fillColor = "#2563EB"; // blue-600
	else if (isAnswered)
		fillColor = "#22C55E"; // green-500
	else if (isVisited) fillColor = "#F97316"; // orange-500

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width="24"
			height="24"
			fill={fillColor}
			stroke={isMarked ? "#FBBF24" : "none"}
			strokeWidth="2"
		>
			{isActive ? (
				<rect x="4" y="4" width="16" height="16" rx="2" />
			) : (
				<circle cx="12" cy="12" r="10" />
			)}
		</svg>
	);
};
const SideNav = ({
	questions,
	currentQuestionIndex,
	currentSectionIndex,
	handleJumpToQuestion,
	handleSubmitQuiz,
	isSubmitted,
}) => {
	return (
		<div className="flex flex-col h-full">
			<div className="flex-grow overflow-y-auto pt-1 px-2">
				<div className="grid grid-cols-5 gap-2">
					{questions.map((question, index) => {
						const isActive = index === currentQuestionIndex;
						const isAnswered = question.selectedOption !== null;
						const isMarked = question.isMarked;
						const isVisited = question.isVisited;

						return (
							<button
								key={index}
								className={`relative transition-all duration-300 hover:scale-110 ${
									isActive ? "bg-blue-100" : ""
								}`}
								onClick={() => handleJumpToQuestion(index)}
							>
								<QuestionStatusIcon
									isActive={isActive}
									isAnswered={isAnswered}
									isVisited={isVisited}
									isMarked={isMarked}
								/>
								<span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
									{index + 1}
								</span>
							</button>
						);
					})}
				</div>
			</div>
			{!isSubmitted && (
				<div className="p-4">
					<button
						className="w-full py-2 bg-[#1ca7c0] text-white font-semibold rounded hover:bg-[#1a96ad] transition-colors duration-300"
						onClick={handleSubmitQuiz}
					>
						Submit Quiz
					</button>
				</div>
			)}
		</div>
	);
};

export default SideNav;
