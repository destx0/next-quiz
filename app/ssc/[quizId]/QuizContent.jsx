// app/ssc/[quizId]/QuizContent.js
"use client";

import React, { useEffect } from "react";
import { Card, CardBody, Button, Tabs, Tab } from "@nextui-org/react";
import QuizSidebar from "./QuizSidebar";
import QuestionDisplay from "./QuestionDisplay";
import { useQuizStore } from "@/stores/quizStore";

export default function QuizContent({ initialQuiz }) {
	const {
		quiz,
		setQuiz,
		currentSectionIndex,
		setCurrentSectionIndex,
		currentQuestionIndex,
		setCurrentQuestionIndex,
		userAnswers,
		setUserAnswer,
	} = useQuizStore();

	useEffect(() => {
		setQuiz(initialQuiz);
	}, [initialQuiz, setQuiz]);

	useEffect(() => {
		setCurrentQuestionIndex(0);
	}, [currentSectionIndex, setCurrentQuestionIndex]);

	const handleSaveAndNext = (selectedOption) => {
		if (selectedOption !== null) {
			setUserAnswer(
				currentSectionIndex,
				currentQuestionIndex,
				selectedOption
			);
		}

		const currentSection = quiz.sections[currentSectionIndex];
		if (currentQuestionIndex < currentSection.questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else if (currentSectionIndex < quiz.sections.length - 1) {
			setCurrentSectionIndex(currentSectionIndex + 1);
			setCurrentQuestionIndex(0);
		}
	};

	const handlePreviousQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		} else if (currentSectionIndex > 0) {
			setCurrentSectionIndex(currentSectionIndex - 1);
			setCurrentQuestionIndex(
				quiz.sections[currentSectionIndex - 1].questions.length - 1
			);
		}
	};

	const handleSubmitQuiz = () => {
		console.log("Quiz submitted", userAnswers);
		// Implement quiz submission logic here
	};

	if (!quiz) {
		return <div>Loading...</div>;
	}

	const currentSection = quiz.sections[currentSectionIndex];
	const currentQuestionId =
		currentSection?.questions[currentQuestionIndex]?.id;
	const currentQuestion = quiz.questions.find(
		(q) => q.id === currentQuestionId
	);

	if (!currentSection || !currentQuestion) {
		return <div>Error: Question not found</div>;
	}

	return (
		<div className="flex flex-row-reverse">
			<QuizSidebar
				currentSection={currentSection}
				currentQuestionIndex={currentQuestionIndex}
				onQuestionSelect={setCurrentQuestionIndex}
			/>
			<div className="flex-1 p-4">
				<h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
				<Tabs
					aria-label="Quiz sections"
					selectedKey={currentSectionIndex.toString()}
					onSelectionChange={(key) =>
						setCurrentSectionIndex(Number(key))
					}
				>
					{quiz.sections.map((section, index) => (
						<Tab
							key={index}
							title={section.name || `Section ${index + 1}`}
						/>
					))}
				</Tabs>
				<Card className="mt-4">
					<CardBody>
						<QuestionDisplay
							question={currentQuestion}
							questionNumber={currentQuestionIndex + 1}
							totalQuestions={currentSection.questions.length}
							userAnswer={
								userAnswers[
									`${currentSectionIndex}-${currentQuestionIndex}`
								]
							}
							onSaveAndNext={handleSaveAndNext}
						/>
						<div className="flex justify-between mt-4">
							<Button
								onClick={handlePreviousQuestion}
								disabled={
									currentSectionIndex === 0 &&
									currentQuestionIndex === 0
								}
							>
								Previous
							</Button>
							{currentSectionIndex < quiz.sections.length - 1 ||
							currentQuestionIndex <
								currentSection.questions.length - 1 ? (
								<Button onClick={() => handleSaveAndNext(null)}>
									Next
								</Button>
							) : (
								<Button onClick={handleSubmitQuiz}>
									Submit Quiz
								</Button>
							)}
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
