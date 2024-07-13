// app/ssc/[quizId]/QuestionDisplay.jsx
"use client";

import React, { useState, useEffect } from "react";
import { Radio, RadioGroup, Button } from "@nextui-org/react";

export default function QuestionDisplay({
	question,
	questionNumber,
	totalQuestions,
	userAnswer,
	onSaveAndNext,
	showExplanation,
}) {
	const [selectedOption, setSelectedOption] = useState(null);

	useEffect(() => {
		// Set the selected option to the user's answer when navigating questions
		setSelectedOption(userAnswer !== undefined ? userAnswer : null);
	}, [userAnswer, question]);

	const handleAnswerChange = (value) => {
		setSelectedOption(value);
	};

	const handleSaveAndNext = () => {
		onSaveAndNext(selectedOption);
	};

	if (!question) {
		return <div>Error: Question not found</div>;
	}

	return (
		<>
			<h2 className="text-xl mb-2">
				Question {questionNumber} of {totalQuestions}
			</h2>
			<p className="mb-4">{question.question}</p>
			<RadioGroup
				value={selectedOption}
				onValueChange={handleAnswerChange}
				isDisabled={showExplanation}
			>
				{question.options.map((option, index) => (
					<Radio
						key={index}
						value={index.toString()}
						color={
							showExplanation
								? index.toString() === question.correctAnswer
									? "success"
									: index.toString() === selectedOption
										? "danger"
										: "default"
								: "default"
						}
					>
						{option}
					</Radio>
				))}
			</RadioGroup>
			{!showExplanation && (
				<Button size="sm" className="mt-4" onClick={handleSaveAndNext}>
					Save and Next
				</Button>
			)}
			{showExplanation && (
				<div className="mt-4 p-4 bg-gray-100 rounded">
					<h3 className="font-bold">Explanation:</h3>
					<p>{question.explanation}</p>
					<p className="mt-2">
						{selectedOption === question.correctAnswer
							? "Your answer is correct!"
							: `The correct answer is: ${question.options[parseInt(question.correctAnswer)]}`}
					</p>
				</div>
			)}
		</>
	);
}
