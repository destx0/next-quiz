"use client";

import React, { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import useQuizStore from "@/stores/quizStore";
import { getQuizWithQuestions } from "@/lib/firestore";
import SideNav from "./SideNav";
import AnalysisModal from "./AnalysisModal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TermsAndConditions from "./TermsAndConditions";
import LanguageSelection from "./LanguageSelection";
import { updateUserQuizData } from "@/lib/userData";

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
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [currentStep, setCurrentStep] = useState("terms");
	const [selectedLanguage, setSelectedLanguage] = useState("");

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
		if (quizData && !isSubmitted && currentStep === "quiz") {
			const timer = setInterval(() => {
				incrementActiveQuestionTime();
			}, 1000);

			return () => clearInterval(timer);
		}
	}, [quizData, isSubmitted, incrementActiveQuestionTime, currentStep]);

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

	const handleMarkCurrentQuestion = () => {
		if (tempSelectedOption !== null && !isSubmitted) {
			setSelectedOption(tempSelectedOption);
		}
		markCurrentQuestion();
		nextQuestion();
		visitCurrentQuestion();
		const { currentSectionIndex, currentQuestionIndex, sections } =
			quizData;
		const nextQuestionObj =
			sections[currentSectionIndex].questions[currentQuestionIndex + 1] ||
			sections[currentSectionIndex + 1]?.questions[0];
		setTempSelectedOption(nextQuestionObj?.selectedOption || null);
	};

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
		setTempSelectedOption(question.selectedOption);
	};

	const handleSubmitQuiz = async () => {
		if (tempSelectedOption !== null && !isSubmitted) {
			setSelectedOption(tempSelectedOption);
		}
		submitQuiz();
		const score = calculateScore();
		setIsAnalysisOpen(true);

		// Prepare the user's submission data
		const userSubmission = quizData.sections.map((section) => ({
			sectionName: section.name,
			questions: section.questions.map((question) => ({
				questionId: question.id,
				selectedOption: question.selectedOption,
				isCorrect: question.selectedOption === question.correctAnswer,
			})),
		}));

		try {
			const submissionId = await updateUserQuizData(
				params.quizId,
				score,
				userSubmission
			);
			console.log(
				"User quiz data and submission updated successfully. Submission ID:",
				submissionId
			);
		} catch (error) {
			console.error(
				"Error updating user quiz data and submission:",
				error
			);
			// Handle the error appropriately (e.g., show an error message to the user)
		}
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
			setIsAnalysisOpen(true);
		}
	};

	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
			.toString()
			.padStart(2, "0")}`;
	};

	if (!quizData) return <div>Loading...</div>;

	if (currentStep === "terms") {
		return (
			<TermsAndConditions
				onAccept={handleAcceptTerms}
				onNext={handleAcceptTerms}
			/>
		);
	}

	if (currentStep === "language") {
		return (
			<LanguageSelection
				onPrevious={handlePreviousToTerms}
				onStart={handleStartQuiz}
				testName={quizData.title}
				duration={quizData.duration}
			/>
		);
	}

	const { currentSectionIndex, currentQuestionIndex, sections } = quizData;
	const currentSection = sections[currentSectionIndex];
	const currentQuestion = currentSection.questions[currentQuestionIndex];

	return (
		<div className="flex flex-col h-screen">
			{/* Top Bar */}
			<div
				className="bg-white border-b p-5 flex justify-between items-center sticky top-0 z-10"
				style={{ fontSize: "125%" }}
			>
				<h1 className="text-2xl font-bold">{quizData.title}</h1>
				<div className="flex items-center">
					{!isSubmitted && (
						<FlipClockCountdown
							to={endTime}
							labels={["Hours", "Minutes", "Seconds"]}
							labelStyle={{
								fontSize: 0,
								fontWeight: 500,
								color: "#4B5563",
							}}
							digitBlockStyle={{
								width: 22,
								height: 32,
								fontSize: 25,
								backgroundColor: "#27272a",
							}}
							separatorStyle={{ color: "#4B5563", size: "4px" }}
							duration={0.5}
							onComplete={handleComplete}
							className="flex-shrink-0"
							renderMap={[false, true, true, true]}
						/>
					)}
				</div>
			</div>

			{/* Body Section - Full width and height */}
			<div
				className="flex flex-grow overflow-hidden"
				style={{ fontSize: "125%" }}
			>
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
									className={`px-5 py-2.5 ${
										currentSectionIndex === sectionIndex
											? "border-b-2 border-blue-500"
											: ""
									}`}
								>
									{section.name}
								</button>
							))}
						</div>
						<div className="flex justify-between items-center p-5 border-b">
							<div className="flex items-center">
								<p className="text-sm text-gray-600 mr-5">
									Question {currentQuestionIndex + 1} of{" "}
									{currentSection.questions.length}
								</p>
								<div className="flex items-center text-sm text-gray-600">
									<span className="mr-1.5">⏱</span>
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
					<div
						className="bg-white border-t p-5 sticky bottom-0 mt-auto"
						style={{ fontSize: "75%" }}
					>
						<div className="flex justify-between items-center">
							<div className="flex gap-2.5">
								<button
									className="px-5 py-2.5 rounded bg-[#92c4f2] text-black"
									onClick={handleMarkCurrentQuestion}
								>
									{currentQuestion.isMarked
										? "Unmark"
										: "Mark for review & next"}
								</button>
								{!isSubmitted && (
									<button
										className="px-5 py-2.5 bg-[#92c4f2] text-black rounded"
										onClick={handleClearResponse}
									>
										Clear Response
									</button>
								)}
							</div>

							<div className="flex items-center gap-5">
								{isSubmitted && (
									<>
										<p className="text-lg font-semibold">
											Your Score: {calculateScore()}
										</p>
										<AnalysisModal
											quizData={quizData}
											score={calculateScore()}
											isOpen={isAnalysisOpen}
											onOpenChange={setIsAnalysisOpen}
										/>
									</>
								)}
								{
									<button
										className="px-5 py-2.5 bg-[#1ca7c0] text-white rounded"
										onClick={handleNextQuestion}
									>
										Save & Next
									</button>
								}
							</div>
						</div>
					</div>
				</div>

				{/* Toggleable Sidebar - Fixed width, full height */}
				<div className="relative" style={{ fontSize: "80%" }}>
					<button
						className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-gray-200 text-gray-600 p-1 rounded-l"
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					>
						{isSidebarOpen ? <ChevronRight /> : <ChevronLeft />}
					</button>
					{isSidebarOpen && (
						<div className="w-64 bg-gray-100 overflow-auto border-l h-full">
							<SideNav
								questions={currentSection.questions}
								currentQuestionIndex={currentQuestionIndex}
								currentSectionIndex={currentSectionIndex}
								handleJumpToQuestion={handleJumpToQuestion}
								handleSubmitQuiz={handleSubmitQuiz}
								isSubmitted={isSubmitted}
								sections={sections}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
