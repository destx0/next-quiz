"use client";
import React, { useState, useEffect } from "react";
import {
	Card,
	CardBody,
	Button,
	Radio,
	RadioGroup,
	Tabs,
	Tab,
} from "@nextui-org/react";

export default function QuizContent({ quiz }) {
	const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState({});
	const [selectedOption, setSelectedOption] = useState(null);

	useEffect(() => {
		// Reset selected option when moving to a new question
		setSelectedOption(
			userAnswers[`${currentSectionIndex}-${currentQuestionIndex}`] ??
				null
		);
	}, [currentSectionIndex, currentQuestionIndex, userAnswers]);

	const handleAnswerChange = (value) => {
		setSelectedOption(value);
	};

	const handleSaveAndNext = () => {
		if (selectedOption !== null) {
			setUserAnswers((prevAnswers) => ({
				...prevAnswers,
				[`${currentSectionIndex}-${currentQuestionIndex}`]:
					selectedOption,
			}));
		}

		const currentSection = quiz.sections[currentSectionIndex];
		if (currentQuestionIndex < currentSection.questions.length - 1) {
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
		} else if (currentSectionIndex < quiz.sections.length - 1) {
			setCurrentSectionIndex((prevIndex) => prevIndex + 1);
			setCurrentQuestionIndex(0);
		}
	};

	const handlePreviousQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
		} else if (currentSectionIndex > 0) {
			setCurrentSectionIndex((prevIndex) => prevIndex - 1);
			setCurrentQuestionIndex(
				quiz.sections[currentSectionIndex - 1].questions.length - 1
			);
		}
	};

	const handleSubmitQuiz = () => {
		// Save the answer for the last question if selected
		if (selectedOption !== null) {
			setUserAnswers((prevAnswers) => ({
				...prevAnswers,
				[`${currentSectionIndex}-${currentQuestionIndex}`]:
					selectedOption,
			}));
		}
		console.log("Quiz submitted", userAnswers);
		// Implement quiz submission logic here
	};

	const currentSection = quiz.sections[currentSectionIndex];
	const currentQuestion = quiz.questions.find(
		(q) => q.id === currentSection.questions[currentQuestionIndex].id
	);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
			<Tabs
				aria-label="Quiz sections"
				selectedKey={currentSectionIndex.toString()}
				onSelectionChange={(key) => {
					setCurrentSectionIndex(Number(key));
					setCurrentQuestionIndex(0);
				}}
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
					<h2 className="text-xl mb-2">
						Question {currentQuestionIndex + 1} of{" "}
						{currentSection.questions.length}
					</h2>
					<p className="mb-4">{currentQuestion.question}</p>
					<RadioGroup
						value={selectedOption}
						onValueChange={handleAnswerChange}
					>
						{currentQuestion.options.map((option, index) => (
							<Radio key={index} value={index.toString()}>
								{option}
							</Radio>
						))}
					</RadioGroup>
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
							<Button onClick={handleSaveAndNext}>
								Save and Next
							</Button>
						) : (
							<Button onClick={handleSubmitQuiz} color="success">
								Submit Quiz
							</Button>
						)}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
