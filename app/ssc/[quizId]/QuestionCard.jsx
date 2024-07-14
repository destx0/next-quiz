import React from "react";
import { Radio, RadioGroup, Divider } from "@nextui-org/react";
import { Clock } from "lucide-react";

export default function QuestionCard({
	question,
	sectionQuestionCount,
	isSubmitted,
	tempSelectedOption,
	setTempSelectedOption,
}) {
	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	return (
		<div className="w-full h-full flex flex-col">
			<div className="flex-grow overflow-y-auto p-4">
				<h2 className="text-xl font-semibold mb-4">
					{question.question}
				</h2>
				<RadioGroup
					value={tempSelectedOption}
					onValueChange={setTempSelectedOption}
					isDisabled={isSubmitted}
				>
					{question.options.map((option, index) => (
						<Radio
							key={index}
							value={index.toString()}
							className={`py-2 ${
								isSubmitted
									? index === question.correctAnswer
										? "text-success"
										: index === question.selectedOption
											? "text-danger"
											: ""
									: ""
							}`}
						>
							{option}
							{isSubmitted &&
								index === question.correctAnswer && (
									<span className="ml-2 text-success">✓</span>
								)}
							{isSubmitted &&
								index === question.selectedOption &&
								index !== question.correctAnswer && (
									<span className="ml-2 text-danger">✗</span>
								)}
						</Radio>
					))}
				</RadioGroup>
				{isSubmitted && (
					<div className="mt-4 p-4 bg-default-100 rounded-lg">
						<h3 className="font-semibold">Explanation:</h3>
						<p>{question.explanation}</p>
					</div>
				)}
			</div>
		</div>
	);
}
