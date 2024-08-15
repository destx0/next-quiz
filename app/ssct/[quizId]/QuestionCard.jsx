import React from "react";
import { Radio, RadioGroup } from "@nextui-org/react";
import { Check, X } from "lucide-react";
import LatexRenderer from "@/components/LatexRenderer";

export default function QuestionCard({
	question,
	sectionQuestionCount,
	isSubmitted,
	tempSelectedOption,
	setTempSelectedOption,
}) {
	const handleValueChange = (value) => {
		if (!isSubmitted) {
			setTempSelectedOption(value);
		}
	};

	return (
		<div className="w-full h-full flex flex-col p-4 overflow-y-auto">
			<h2 className="text-xl font-semibold mb-4">
				<LatexRenderer>{question.question}</LatexRenderer>
			</h2>

			<RadioGroup
				value={tempSelectedOption}
				onValueChange={handleValueChange}
			>
				{question.options.map((option, index) => (
					<Radio
						key={index}
						value={index.toString()}
						className={`py-2 ${
							isSubmitted
								? index === question.correctAnswer
									? "text-green-500"
									: index === parseInt(tempSelectedOption)
										? "text-red-500"
										: ""
								: ""
						}`}
					>
						<div className="flex items-center">
							<LatexRenderer>{option}</LatexRenderer>
							{isSubmitted &&
								index === question.correctAnswer && (
									<Check className="ml-2 text-green-500 w-5 h-5" />
								)}
							{isSubmitted &&
								index === parseInt(tempSelectedOption) &&
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
					<LatexRenderer>{question.explanation}</LatexRenderer>
				</div>
			)}
		</div>
	);
}
