import React from "react";
import { Radio, RadioGroup } from "@nextui-org/react";
import { Check, X, Minus } from "lucide-react";
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

	const getQuestionStatus = () => {
		if (!isSubmitted) return null;
		if (parseInt(tempSelectedOption) === question.correctAnswer) return "Correct";
		if (tempSelectedOption !== null) return "Wrong";
		return "Not Attempted";
	};

	const getStatusStyle = (status) => {
		switch (status) {
			case "Correct":
				return "bg-green-100 text-green-800 border-green-300";
			case "Wrong":
				return "bg-red-100 text-red-800 border-red-300";
			case "Not Attempted":
				return "bg-gray-100 text-gray-800 border-gray-300";
			default:
				return "";
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "Correct":
				return <Check className="w-5 h-5" />;
			case "Wrong":
				return <X className="w-5 h-5" />;
			case "Not Attempted":
				return <Minus className="w-5 h-5" />;
			default:
				return null;
		}
	};

	const questionStatus = getQuestionStatus();

	return (
		<div className="w-full h-full flex flex-col p-4 overflow-y-auto">
			<h2 className="text-xl font-semibold mb-4">
				<LatexRenderer>{question.question}</LatexRenderer>
			</h2>

			{isSubmitted && (
				<div className={`mb-4 p-2 rounded-md border ${getStatusStyle(questionStatus)} flex items-center`}>
					{getStatusIcon(questionStatus)}
					<span className="ml-2 font-semibold">{questionStatus}</span>
				</div>
			)}

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
									? "bg-green-100 border-2 border-green-500 rounded-md"
									: index === parseInt(tempSelectedOption)
										? "bg-red-100 border-2 border-red-500 rounded-md"
										: ""
								: ""
						}`}
					>
						<div className="flex items-center p-2">
							<LatexRenderer>{option}</LatexRenderer>
							{isSubmitted && index === question.correctAnswer && (
								<Check className="ml-2 text-green-500 w-5 h-5 flex-shrink-0" />
							)}
							{isSubmitted &&
								index === parseInt(tempSelectedOption) &&
								index !== question.correctAnswer && (
									<X className="ml-2 text-red-500 w-5 h-5 flex-shrink-0" />
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
