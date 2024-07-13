"use client";

import { getQuizWithQuestions } from "@/lib/firestore";
import useQuizStore from "@/stores/quizStore";
import { useEffect, useState } from "react";
import {
	Tabs,
	Tab,
	Card,
	CardHeader,
	CardBody,
	Radio,
	RadioGroup,
	Button,
	Spacer,
} from "@nextui-org/react";

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
		if (tempSelectedOption !== null) {
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

	if (!quizData) return <div>Loading...</div>;

	const { currentSectionIndex, currentQuestionIndex, sections } = quizData;
	const currentSection = sections[currentSectionIndex];
	const currentQuestion = currentSection.questions[currentQuestionIndex];

	return (
		<div className="p-4 max-w-6xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">{quizData.title}</h1>
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
								<Card className="w-full">
									<CardHeader className="flex justify-between items-center bg-default-100 border-b border-default-200">
										<p className="text-small text-default-500">
											Question {currentQuestionIndex + 1}{" "}
											of {section.questions.length}
										</p>
										<Button
											color={
												currentQuestion.isMarked
													? "warning"
													: "secondary"
											}
											variant="flat"
											size="sm"
											onClick={markCurrentQuestion}
										>
											{currentQuestion.isMarked
												? "Unmark"
												: "Mark"}{" "}
											Question
										</Button>
									</CardHeader>
									<CardBody className="pt-4">
										<h2 className="text-xl font-semibold mb-4">
											{currentQuestion.question}
										</h2>
										<Spacer y={2} />
										<RadioGroup
											value={tempSelectedOption}
											onValueChange={
												setTempSelectedOption
											}
										>
											{currentQuestion.options.map(
												(option, index) => (
													<Radio
														key={index}
														value={index.toString()}
														className="py-2"
													>
														{option}
													</Radio>
												)
											)}
										</RadioGroup>
									</CardBody>
								</Card>
								<Spacer y={4} />
								<div className="flex justify-between">
									<Button
										color="primary"
										onClick={handleNextQuestion}
									>
										Next
									</Button>
								</div>
							</div>
						</div>
					</Tab>
				))}
			</Tabs>

			<Spacer y={4} />
			<Card>
				<CardBody>
					<pre className="text-small overflow-auto">
						{JSON.stringify(quizData, null, 2)}
					</pre>
				</CardBody>
			</Card>
		</div>
	);
}
