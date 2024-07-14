import React from "react";
import {
	Card,
	CardHeader,
	CardBody,
	Radio,
	RadioGroup,
	Button,
	Spacer,
} from "@nextui-org/react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function QuestionCard({
	question,
	sectionQuestionCount,
	isSubmitted,
	tempSelectedOption,
	setTempSelectedOption,
	markCurrentQuestion,
}) {
	const formatTime = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};
	const handleOptionChange = (value) => {
		setTempSelectedOption(value);
	};
	return (
		<Card
			shadow="lg"
			isBlurred="true"
			className="w-full h-full flex flex-col "
		>
			<CardHeader className="flex-shrink-0 flex flex-col bg-default-100 border-b border-default-200 p-4">
				<div className="flex justify-between items-center w-full mb-4">
					<div className="flex items-center">
						<p className="text-small text-default-500 mr-4">
							Question {question.index + 1} of{" "}
							{sectionQuestionCount}
						</p>
						<div className="flex items-center text-small text-default-500">
							<Clock size={16} className="mr-1" />
							{formatTime(question.timeSpent)}
						</div>
					</div>
					<Button
						color={question.isMarked ? "warning" : "secondary"}
						variant="flat"
						size="sm"
						onClick={markCurrentQuestion}
					>
						{question.isMarked ? "Unmark" : "Mark"} Question
					</Button>
				</div>
				<div className="w-full">
					<h2 className="text-xl font-semibold">
						{question.question}
					</h2>
				</div>
			</CardHeader>
			<CardBody className="flex-grow overflow-y-auto pt-4">
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
									<CheckCircle
										className="inline-block ml-2 text-success"
										size={20}
									/>
								)}
							{isSubmitted &&
								index === question.selectedOption &&
								index !== question.correctAnswer && (
									<XCircle
										className="inline-block ml-2 text-danger"
										size={20}
									/>
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
			</CardBody>
		</Card>
	);
}
