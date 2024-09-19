import React from "react";
import { Radio, RadioGroup } from "@nextui-org/react";
import { Check, X } from "lucide-react";
import LatexRenderer from "@/components/LatexRenderer";

export default function QuestionCard({
	question,
	selectedOption,
	onSelectOption,
	isSubmitted,
}) {
	const handleValueChange = (value) => {
		if (!isSubmitted) {
			onSelectOption(value);
		}
	};

	// Check if question is undefined
	if (!question) {
		return <div>Error: Question data is missing</div>;
	}

	return (
		<div className="w-full h-full flex flex-col p-4 overflow-y-auto">
			<span className="text-sm text-gray-500">ID: {question.id}</span>
			<h2 className="text-xl font-semibold">
				{question.question ? (
					<LatexRenderer>{question.question}</LatexRenderer>
				) : (
					"Question text is missing"
				)}
			</h2>

			<RadioGroup
				value={selectedOption}
				onValueChange={handleValueChange}
			>
				{question.options &&
					question.options.map((option, index) => (
						<Radio
							key={index}
							value={index.toString()}
							className={`py-2 ${
								isSubmitted
									? index === question.correctAnswer
										? "text-green-500"
										: index === parseInt(selectedOption)
											? "text-red-500"
											: ""
									: ""
							}`}
						>
							<div className="flex items-center">
								{option ? (
									<LatexRenderer>{option}</LatexRenderer>
								) : (
									"Option text is missing"
								)}
								{isSubmitted &&
									index === question.correctAnswer && (
										<Check className="ml-2 text-green-500 w-5 h-5" />
									)}
								{isSubmitted &&
									index === parseInt(selectedOption) &&
									index !== question.correctAnswer && (
										<X className="ml-2 text-red-500 w-5 h-5" />
									)}
							</div>
						</Radio>
					))}
			</RadioGroup>
			{isSubmitted && (
				<div className="mt-4 p-4 bg-gray-100 rounded-lg">
					<h3 className="font-semibold">Explanation:</h3>
					{question.explanation ? (
						<LatexRenderer>{question.explanation}</LatexRenderer>
					) : (
						"Explanation is missing"
					)}
				</div>
			)}
		</div>
	);
}
