// components/quiz/QuestionDisplay.js
"use client";

import React, { useState, useEffect } from "react";
import { Radio, RadioGroup } from "@nextui-org/react";

export default function QuestionDisplay({
	question,
	questionNumber,
	totalQuestions,
	userAnswer,
	onSaveAndNext,
}) {
	const [selectedOption, setSelectedOption] = useState(null);

	useEffect(() => {
		setSelectedOption(userAnswer);
	}, [userAnswer, question]);

	const handleAnswerChange = (value) => {
		setSelectedOption(value);
		onSaveAndNext(value);
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
			>
				{question.options.map((option, index) => (
					<Radio key={index} value={index.toString()}>
						{option}
					</Radio>
				))}
			</RadioGroup>
		</>
	);
}
