"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Radio, RadioGroup } from "@nextui-org/react";

export default function QuizContent({ quiz }) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState({});
	const [selectedOption, setSelectedOption] = useState(null);

	useEffect(() => {
		// Reset selected option when moving to a new question
		setSelectedOption(userAnswers[currentQuestionIndex] ?? null);
	}, [currentQuestionIndex, userAnswers]);

	const handleAnswerChange = (value) => {
		setSelectedOption(value);
	};

	const handleSaveAndNext = () => {
		if (selectedOption !== null) {
			setUserAnswers((prevAnswers) => ({
				...prevAnswers,
				[currentQuestionIndex]: selectedOption,
			}));
		}

		if (currentQuestionIndex < quiz.questions.length - 1) {
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
		}
	};

	const handlePreviousQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
		}
	};

	const handleSubmitQuiz = () => {
		// Save the answer for the last question if selected
		if (selectedOption !== null) {
			setUserAnswers((prevAnswers) => ({
				...prevAnswers,
				[currentQuestionIndex]: selectedOption,
			}));
		}
		console.log("Quiz submitted", userAnswers);
		// Implement quiz submission logic here
	};

	const currentQuestion = quiz.questions[currentQuestionIndex];

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
			<Card>
				<CardBody>
					<h2 className="text-xl mb-2">
						Question {currentQuestionIndex + 1} of{" "}
						{quiz.questions.length}
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
							disabled={currentQuestionIndex === 0}
						>
							Previous
						</Button>
						{currentQuestionIndex < quiz.questions.length - 1 ? (
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
