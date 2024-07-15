// QuizPage.js
"use client";

import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import useQuizStore from "@/stores/quizStore";
import { getQuizWithQuestions } from "@/lib/firestore";
import SideNav from "./SideNav";
import AnalysisModal from "./AnalysisModal";
import TermsAndConditions from "./TermsAndConditions";
import LanguageSelection from "./LanguageSelection";

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
	const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [currentStep, setCurrentStep] = useState("terms"); // 'terms', 'language', or 'quiz'
	const [selectedLanguage, setSelectedLanguage] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				const data = await getQuizWithQuestions(params.quizId);
				setQuizData(data);
				visitCurrentQuestion();
				setEndTime(new Date().getTime() + data.duration * 60 * 1000);
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching quiz:", error);
				setIsLoading(false);
			}
		};

		fetchQuizData();
	}, [params.quizId, setQuizData, visitCurrentQuestion]);

	const handleAcceptTerms = () => {
		setCurrentStep("language");
	};

	const handlePreviousToTerms = () => {
		setCurrentStep("terms");
	};

	const handleStartQuiz = (language) => {
		setSelectedLanguage(language);
		setCurrentStep("quiz");
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (currentStep === "terms") {
		return (
			<TermsAndConditions
				onAccept={handleAcceptTerms}
				onNext={handleAcceptTerms}
			/>
		);
	}
	if (!quizData) return <div>Loading...</div>;
	if (currentStep === "language") {
		return (
			<LanguageSelection
				onPrevious={handlePreviousToTerms}
				onStart={handleStartQuiz}
				testName={quizData.title}
			/>
		);
	}

	if (!quizData || !endTime) return <div>Loading...</div>;

	const { currentSectionIndex, currentQuestionIndex, sections } = quizData;
	const currentSection = sections[currentSectionIndex];
	const currentQuestion = currentSection.questions[currentQuestionIndex];

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	return (
		<div className="flex flex-col h-screen">
			{/* Top Bar */}
			<div className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
				<h1 className="text-2xl font-bold">{quizData.title}</h1>
				<div className="flex items-center">
					{!isSubmitted && (
						<FlipClockCountdown
							to={endTime}
							labels={["Hours", "Minutes", "Seconds"]}
							labelStyle={{
								fontSize: 0,
								fontWeight: 500,
								color: "#777777",
							}}
							digitBlockStyle={{
								width: 18,
								height: 26,
								fontSize: 20,
								backgroundColor: "#777777",
							}}
							separatorStyle={{ color: "#4B5563", size: "3px" }}
							duration={0.5}
							onComplete={handleComplete}
							className="flex-shrink-0"
							renderMap={[false, true, true, true]}
						/>
					)}
				</div>
			</div>

			{/* Body Section - Full width and height */}
			<div className="flex flex-grow overflow-hidden">
				{/* Main Content - Takes up all available space */}
				<div className="flex-grow overflow-auto flex flex-col">
					{/* Sticky section tabs and question header */}
					<div className="sticky top-0 bg-white z-10">
						<div className="flex border-b">
							{sections.map((section, sectionIndex) => (
								<button
									key={sectionIndex}
									onClick={() =>
										handleJumpToSection(sectionIndex)
									}
									className={`px-4 py-2 ${
										currentSectionIndex === sectionIndex
											? "border-b-2 border-blue-500"
											: ""
									}`}
								>
									{section.name}
								</button>
							))}
						</div>
						<div className="flex justify-between items-center p-4 border-b">
							<div className="flex items-center">
								<p className="text-sm text-gray-600 mr-4">
									Question {currentQuestionIndex + 1}
								</p>
								<div className="flex items-center text-sm text-gray-600">
									<span className="mr-1">⏱</span>
									{formatTime(currentQuestion.timeSpent)}
								</div>
							</div>
						</div>
					</div>

					{/* Question Card */}
					<QuestionCard
						question={{
							...currentQuestion,
							index: currentQuestionIndex,
						}}
						sectionQuestionCount={currentSection.questions.length}
						isSubmitted={isSubmitted}
						tempSelectedOption={tempSelectedOption}
						setTempSelectedOption={setTempSelectedOption}
					/>

					{/* Bottom Bar */}
					{/* Bottom Bar */}
					<div className="bg-white border-t p-4 sticky bottom-0 mt-auto">
						<div className="flex justify-between items-center">
							<div className="flex gap-2">
								<button
									className={`px-4 py-2 rounded bg-[#92c4f2] text-black`}
									onClick={markCurrentQuestion}
								>
									{currentQuestion.isMarked
										? "Unmark"
										: "Mark"}{" "}
									for Review
								</button>
								{!isSubmitted && (
									<button
										className="px-4 py-2 bg-[#92c4f2] text-black rounded"
										onClick={handleClearResponse}
									>
										Clear Response
									</button>
								)}
							</div>

							<div className="flex items-center gap-4">
								{isSubmitted && (
									<>
										<p className="text-lg font-semibold">
											Your Score: {calculateScore()}
										</p>
										<AnalysisModal
											quizData={quizData}
											score={calculateScore()}
										/>
									</>
								)}
								{!isSubmitted && (
									<button
										className="px-4 py-2 bg-[#1ca7c0] text-white rounded"
										onClick={handleNextQuestion}
									>
										Save & Next
									</button>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Toggleable Sidebar - Fixed width, full height */}
				<div className="relative">
					<button
						className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-[#333333] text-gray-100 p-1 "
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					>
						{isSidebarOpen ? ">" : "<"}
					</button>
					{isSidebarOpen && (
						<div className="w-80 bg-gray-100 overflow-auto border-l h-full">
							<SideNav
								questions={currentSection.questions}
								currentQuestionIndex={currentQuestionIndex}
								currentSectionIndex={currentSectionIndex}
								handleJumpToQuestion={handleJumpToQuestion}
								handleSubmitQuiz={handleSubmitQuiz}
								isSubmitted={isSubmitted}
								sections={quizData.sections}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
