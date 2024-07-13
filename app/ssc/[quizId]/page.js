"use client";

import { getQuizWithQuestions } from "@/lib/firestore";
import useQuizStore from "@/stores/quizStore";
import { useEffect, useState } from "react";
import { Tabs, Tab, Button, Spacer } from "@nextui-org/react";
import { RefreshCw } from "lucide-react";
import QuestionCard from "./QuestionCard";

export default function QuizPage({ params }) {
	const {
		quizData,
		setQuizData,
		setCurrentIndices,
		updateQuestionState,
		markCurrentQuestion,
		setSelectedOption,
		visitCurrentQuestion,
		nextQuestion,
		submitQuiz,
		calculateScore,
		isSubmitted,
		remainingTime,
		decrementRemainingTime,
	} = useQuizStore();

	const [tempSelectedOption, setTempSelectedOption] = useState(null);

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				const data = await getQuizWithQuestions(params.quizId);
				setQuizData(data);
				visitCurrentQuestion();
			} catch (error) {
				console.error("Error fetching quiz:", error);
			}
		};

		fetchQuizData();
	}, [params.quizId, setQuizData, visitCurrentQuestion]);

	useEffect(() => {
		if (quizData && !isSubmitted) {
			const timer = setInterval(() => {
				decrementRemainingTime();
				if (remainingTime <= 0) {
					submitQuiz();
					clearInterval(timer);
				}
			}, 1000);

			return () => clearInterval(timer);
		}
	}, [
		quizData,
		isSubmitted,
		remainingTime,
		decrementRemainingTime,
		submitQuiz,
	]);

	useEffect(() => {
		if (quizData) {
			const { currentSectionIndex, currentQuestionIndex, sections } =
				quizData;
			const currentQuestion =
				sections[currentSectionIndex].questions[currentQuestionIndex];
			setTempSelectedOption(
				currentQuestion.selectedOption?.toString() || null
			);
		}
	}, [quizData]);

	const handleNextQuestion = () => {
		if (tempSelectedOption !== null && !isSubmitted) {
			setSelectedOption(parseInt(tempSelectedOption));
		}
		nextQuestion();
		visitCurrentQuestion();
		setTempSelectedOption(null);
	};

	const handleJumpToSection = (sectionIndex) => {
		setCurrentIndices(Number(sectionIndex), 0);
		visitCurrentQuestion();
		setTempSelectedOption(null);
	};

	const handleJumpToQuestion = (questionIndex) => {
		setCurrentIndices(quizData.currentSectionIndex, questionIndex);
		visitCurrentQuestion();
		setTempSelectedOption(null);
	};

	const handleSubmitQuiz = () => {
		submitQuiz();
	};

	const handleClearResponse = () => {
		if (!isSubmitted) {
			setSelectedOption(null);
			setTempSelectedOption(null);
		}
	};

	if (!quizData) return <div>Loading...</div>;

	const { currentSectionIndex, currentQuestionIndex, sections } = quizData;
	const currentSection = sections[currentSectionIndex];
	const currentQuestion = currentSection.questions[currentQuestionIndex];

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	return (
		<div className="p-4 max-w-6xl mx-auto">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">{quizData.title}</h1>
				<div className="text-xl font-semibold">
					Time Remaining: {formatTime(remainingTime)}
				</div>
			</div>
			<Tabs
				selectedKey={currentSectionIndex.toString()}
				onSelectionChange={handleJumpToSection}
				aria-label="Quiz sections"
				color="primary"
				variant="underlined"
				classNames={{
					tabList:
						"gap-6 w-full relative rounded-none p-0 border-b border-divider",
					cursor: "w-full bg-primary",
					tab: "max-w-fit px-0 h-12",
					tabContent: "group-data-[selected=true]:text-primary",
				}}
			>
				{sections.map((section, sectionIndex) => (
					<Tab key={sectionIndex.toString()} title={section.name}>
						<div className="flex mt-4">
							{/* Vertical navigation */}
							<div className="w-16 mr-4">
								<div className="flex flex-col items-center space-y-2">
									{section.questions.map((_, index) => (
										<Button
											key={index}
											size="sm"
											isIconOnly
											className={`w-10 h-10 rounded-full ${
												index ===
													currentQuestionIndex &&
												sectionIndex ===
													currentSectionIndex
													? "bg-primary text-white"
													: "bg-default-100"
											}`}
											onClick={() =>
												handleJumpToQuestion(index)
											}
										>
											{index + 1}
										</Button>
									))}
								</div>
							</div>

							{/* Question content */}
							<div className="flex-1">
								<QuestionCard
									question={{
										...currentQuestion,
										index: currentQuestionIndex,
									}}
									sectionQuestionCount={
										section.questions.length
									}
									isSubmitted={isSubmitted}
									tempSelectedOption={tempSelectedOption}
									setTempSelectedOption={
										setTempSelectedOption
									}
									markCurrentQuestion={markCurrentQuestion}
								/>
								<Spacer y={4} />
								<div className="flex justify-between">
									<Button
										color="primary"
										onClick={handleNextQuestion}
									>
										Next
									</Button>
									{!isSubmitted && (
										<>
											<Button
												color="secondary"
												onClick={handleClearResponse}
											>
												<RefreshCw
													size={20}
													className="mr-2"
												/>
												Clear Response
											</Button>
											<Button
												color="success"
												onClick={handleSubmitQuiz}
											>
												Submit Quiz
											</Button>
										</>
									)}
									{isSubmitted && (
										<p className="text-lg font-semibold">
											Your Score: {calculateScore()}
										</p>
									)}
								</div>
							</div>
						</div>
					</Tab>
				))}
			</Tabs>
		</div>
	);
}
