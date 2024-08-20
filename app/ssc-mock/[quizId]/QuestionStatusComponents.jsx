import React from "react";
import { QuestionStatusIcon, Legend } from "./QuestionStatusComponents";

const SideNav = ({
	questions,
	currentQuestionIndex,
	currentSectionIndex,
	handleJumpToQuestion,
	handleSubmitQuiz,
	isSubmitted,
	sections,
}) => {
	return (
		<div className="flex flex-col h-full bg-[#d9edf7]">
			<Legend />
			<hr className="border-t border-gray-300 my-2" />
			<div className="bg-[#b4dbed] p-2 ">
				Section : {sections[currentSectionIndex].name}
			</div>
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
									number={index + 1}
								/>
							</button>
						);
					})}
				</div>
			</div>
			<hr className="border-t border-gray-300 my-2" />
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
