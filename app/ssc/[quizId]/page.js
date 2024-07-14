// QuizPage.js
"use client";

import { useEffect, useState } from "react";
import { Tabs, Tab, Button, Divider } from "@nextui-org/react";
import { RefreshCw } from "lucide-react";
import QuestionCard from "./QuestionCard";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import useQuizStore from "@/stores/quizStore";
import { getQuizWithQuestions } from "@/lib/firestore";
import SideNav from "./SideNav";
import AnalysisModal from "./AnalysisModal";

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
			<div className="flex justify-between items-center -mt-16 pl-4">
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
								width: 18,
								height: 26,
								fontSize: 20,
								backgroundColor: "#27272a",
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
			<Tabs
				selectedKey={currentSectionIndex.toString()}
				onSelectionChange={handleJumpToSection}
				aria-label="Quiz sections"
				color="primary"
				variant="underlined"
				classNames={{}}
			>
				{sections.map((section, sectionIndex) => (
					<Tab key={sectionIndex.toString()} title={section.name}>
						<div className="flex pt-4 -mt-2 flex-grow overflow-hidden">
							<SideNav
								questions={section.questions}
								currentQuestionIndex={currentQuestionIndex}
								currentSectionIndex={currentSectionIndex}
								handleJumpToQuestion={handleJumpToQuestion}
							/>
							<div className="flex-1 overflow-hidden p-16 -ml-16 -mt-16">
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
			<div className="mt-auto pt-4 mx-12">
				<Divider className="my-4" />
				<div className="flex justify-between items-center">
					<div className="flex gap-2">
						<Button
							color="primary"
							variant="shadow"
							size="sm"
							onClick={handleNextQuestion}
						>
							Next
						</Button>
						{!isSubmitted && (
							<Button
								color="danger"
								variant="shadow"
								size="sm"
								onClick={handleClearResponse}
							>
								Clear Response
							</Button>
						)}
					</div>

					<div>
						{!isSubmitted ? (
							<Button
								color="success"
								variant="shadow"
								size="sm"
								onClick={handleSubmitQuiz}
							>
								Submit Quiz
							</Button>
						) : (
							<div className="flex items-center gap-4">
								<p className="text-lg font-semibold">
									Your Score: {calculateScore()}
								</p>
								<AnalysisModal
									quizData={quizData}
									score={calculateScore()}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
