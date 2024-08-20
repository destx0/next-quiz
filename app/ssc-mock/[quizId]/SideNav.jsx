import React, { useState } from "react";
import { QuestionStatusIcon, Legend } from "./QuestionStatusComponents";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SideNav = ({
	questions,
	currentQuestionIndex,
	currentSectionIndex,
	handleJumpToQuestion,
	handleSubmitQuiz,
	isSubmitted,
	sections,
	handleJumpToSection,
}) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<div className="relative h-full flex">
			<button
				className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-gray-200 text-gray-600 p-1 rounded-l z-10"
				onClick={() => setIsSidebarOpen(!isSidebarOpen)}
			>
				{isSidebarOpen ? <ChevronRight /> : <ChevronLeft />}
			</button>
			<div
				className={`h-full transition-all duration-300 ${
					isSidebarOpen ? "w-64" : "w-0"
				} overflow-hidden`}
			>
				<div className="w-64 h-full bg-[#d9edf7] flex flex-col">
					<Legend isSubmitted={isSubmitted} />
					<hr className="border-t border-gray-300 my-2" />
					<div className="bg-[#b4dbed] p-2">
						Section: {sections[currentSectionIndex].name}
					</div>
					<div className="flex-grow overflow-y-auto pt-1 px-2">
						<div className="grid grid-cols-5 gap-2">
							{questions.map((question, index) => {
								const isActive = index === currentQuestionIndex;
								const isAnswered =
									question.selectedOption !== null;
								const isMarked = question.isMarked;
								const isVisited = question.isVisited;
								const isCorrect =
									isSubmitted &&
									question.selectedOption ===
										question.correctAnswer;

								return (
									<button
										key={index}
										className={`relative transition-all duration-300 hover:scale-110 ${
											isActive ? "bg-blue-100" : ""
										}`}
										onClick={() =>
											handleJumpToQuestion(index)
										}
									>
										<QuestionStatusIcon
											isActive={isActive}
											isAnswered={isAnswered}
											isVisited={isVisited}
											isMarked={isMarked}
											isSubmitted={isSubmitted}
											isCorrect={isCorrect}
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
			</div>
		</div>
	);
};

export default SideNav;
