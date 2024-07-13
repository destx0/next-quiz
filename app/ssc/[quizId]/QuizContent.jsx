// app/ssc/[quizId]/QuizContent.jsx
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
		getCurrentSectionQuestions,
		setShowExplanations,
		showExplanations,
		calculateScore,
		score,
		totalQuestions,
	} = useQuizStore();

	useEffect(() => {
		setQuiz(initialQuiz);
	}, [initialQuiz, setQuiz]);

	const handleSaveAndNext = (selectedOption) => {
		if (selectedOption !== null) {
			setUserAnswer(
				currentSectionIndex,
				currentQuestionIndex,
				selectedOption
			);
		}

		const currentSectionQuestions = getCurrentSectionQuestions();
		if (currentQuestionIndex < currentSectionQuestions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else if (currentSectionIndex < quiz.sections.length - 1) {
			setCurrentSectionIndex(currentSectionIndex + 1);
			setCurrentQuestionIndex(0);
		}
	};

	const handleSubmitQuiz = () => {
		setShowExplanations(true);
		calculateScore();
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
		<div className="flex">
			<div className="flex-1 p-4">
				<h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
				{showExplanations && score !== null && (
					<div
						className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4"
						role="alert"
					>
						<p className="font-bold">Quiz Completed</p>
						<p>
							Your score: {score} out of{" "}
							{totalQuestions * (quiz.positiveScore || 1)}
						</p>
						<p>Total questions: {totalQuestions}</p>
						<p>
							Correct answers:{" "}
							{Math.round(score / (quiz.positiveScore || 1))}
						</p>
					</div>
				)}
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
							showExplanation={showExplanations}
						/>
						<div className="flex justify-between mt-4">
							<Button
								size="sm"
								onClick={handleSubmitQuiz}
								disabled={showExplanations}
							>
								{showExplanations
									? "Quiz Submitted"
									: "Submit Quiz"}
							</Button>
						</div>
					</CardBody>
				</Card>
			</div>
			<QuizSidebar
				currentSection={currentSection}
				currentQuestionIndex={currentQuestionIndex}
				onQuestionSelect={setCurrentQuestionIndex}
			/>
		</div>
	);
}
