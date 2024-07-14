"use client";

import { useEffect, useState } from "react";
import { Tabs, Tab, Button, Divider } from "@nextui-org/react";
import { RefreshCw, Check, Flag, Eye } from "lucide-react";
import QuestionCard from "./QuestionCard";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import useQuizStore from "@/stores/quizStore";
import { getQuizWithQuestions } from "@/lib/firestore";

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
		incrementActiveQuestionTime,
	} = useQuizStore();

	const [tempSelectedOption, setTempSelectedOption] = useState(null);
	const [endTime, setEndTime] = useState(null);

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				const data = await getQuizWithQuestions(params.quizId);
				setQuizData(data);
				visitCurrentQuestion();
				setEndTime(new Date().getTime() + data.duration * 60 * 1000);
			} catch (error) {
				console.error("Error fetching quiz:", error);
			}
		};

		fetchQuizData();
	}, [params.quizId, setQuizData, visitCurrentQuestion]);

	useEffect(() => {
		if (quizData && !isSubmitted) {
			const timer = setInterval(() => {
				incrementActiveQuestionTime();
			}, 1000);

			return () => clearInterval(timer);
		}
	}, [quizData, isSubmitted, incrementActiveQuestionTime]);

	useEffect(() => {
		if (quizData) {
			const { currentSectionIndex, currentQuestionIndex, sections } =
				quizData;
			const currentQuestion =
				sections[currentSectionIndex].questions[currentQuestionIndex];
			console.log(currentQuestion);
		}
	}, [quizData]);

	const handleNextQuestion = () => {
		if (tempSelectedOption !== null && !isSubmitted) {
			setSelectedOption(tempSelectedOption);
		}
		nextQuestion();
		visitCurrentQuestion();
		const { currentSectionIndex, currentQuestionIndex, sections } =
			quizData;
		const nextQuestionObj =
			sections[currentSectionIndex].questions[currentQuestionIndex + 1] ||
			sections[currentSectionIndex + 1]?.questions[0];
		setTempSelectedOption(nextQuestionObj?.selectedOption || null);
	};

	const handleJumpToSection = (sectionIndex) => {
		setCurrentIndices(Number(sectionIndex), 0);
		visitCurrentQuestion();
		const { sections } = quizData;
		const firstQuestionInSection = sections[sectionIndex].questions[0];
		setTempSelectedOption(firstQuestionInSection.selectedOption);
	};

	const handleJumpToQuestion = (questionIndex) => {
		setCurrentIndices(quizData.currentSectionIndex, questionIndex);
		visitCurrentQuestion();
		const { currentSectionIndex, sections } = quizData;
		const question = sections[currentSectionIndex].questions[questionIndex];
		console.log(question);
		setTempSelectedOption(question.selectedOption);
	};

	const handleSubmitQuiz = () => {
		if (tempSelectedOption !== null && !isSubmitted) {
			setSelectedOption(tempSelectedOption);
		}
		submitQuiz();
	};

	const handleClearResponse = () => {
		if (!isSubmitted) {
			setSelectedOption(null);
			setTempSelectedOption(null);
		}
	};

	const handleComplete = () => {
		if (!isSubmitted) {
			submitQuiz();
		}
	};

	if (!quizData || !endTime) return <div>Loading...</div>;

	const { currentSectionIndex, currentQuestionIndex, sections } = quizData;
	const currentSection = sections[currentSectionIndex];
	const currentQuestion = currentSection.questions[currentQuestionIndex];

	return (
		<div className="flex flex-col h-[calc(100vh-10rem)]">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-bold">{quizData.title}</h1>
				<div className="flex items-center">
					<FlipClockCountdown
						to={endTime}
						labels={["Hours", "Minutes", "Seconds"]}
						labelStyle={{
							fontSize: 0,
							fontWeight: 500,
							color: "#4B5563",
						}}
						digitBlockStyle={{
							width: 20,
							height: 30,
							fontSize: 16,
							backgroundColor: "#3B82F6",
						}}
						separatorStyle={{ color: "#4B5563", size: "3px" }}
						duration={0.5}
						onComplete={handleComplete}
						className="flex-shrink-0"
						renderMap={[false, true, true, true]}
					/>
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
						<div className="flex mt-4 flex-grow overflow-hidden">
							{/* Updated Vertical navigation */}
							<div className="w-16  overflow-y-auto pt-1">
								<div className="flex flex-col items-center space-y-2">
									{section.questions.map(
										(question, index) => {
											const isActive =
												index ===
													currentQuestionIndex &&
												sectionIndex ===
													currentSectionIndex;
											const isAnswered =
												question.selectedOption !==
												null;
											const isMarked = question.isMarked;
											const isVisited =
												question.isVisited;

											let buttonClass =
												"w-8 h-8 rounded-full relative ";
											let ringClass = "";

											if (isActive) {
												buttonClass +=
													"bg-blue-600 w-10 h-20 ";
											} else if (isAnswered) {
												buttonClass +=
													"bg-green-500/60  ";
											} else if (isVisited) {
												buttonClass +=
													"bg-orange-500/60  ";
											} else {
												buttonClass += " ";
											}

											if (isMarked) {
												ringClass =
													"ring-2 ring-yellow-400 ring-offset-2 ";
											}

											return (
												<Button
													key={index}
													size="sm"
													variant="shadow"
													isIconOnly
													className={`${buttonClass} ${ringClass} transition-all duration-300 hover:scale-110`}
													onClick={() =>
														handleJumpToQuestion(
															index
														)
													}
												>
													<span className="text-sm font-semibold">
														{index + 1}
													</span>
												</Button>
											);
										}
									)}
								</div>
							</div>

							{/* Question content */}
							<div className="flex-1 overflow-hidden">
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
							</div>
						</div>
					</Tab>
				))}
			</Tabs>
			<div className="mt-auto pt-4">
				<Divider className="my-4" />
				<div className="flex justify-between">
					<Button color="primary" onClick={handleNextQuestion}>
						Next
					</Button>
					{!isSubmitted && (
						<>
							<Button
								color="secondary"
								onClick={handleClearResponse}
							>
								<RefreshCw size={20} className="mr-2" />
								Clear Response
							</Button>
							<Button color="success" onClick={handleSubmitQuiz}>
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
	);
}
