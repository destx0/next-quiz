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
import { CheckCircle, XCircle } from "lucide-react";

export default function QuestionCard({
	question,
	sectionQuestionCount,
	isSubmitted,
	tempSelectedOption,
	setTempSelectedOption,
	markCurrentQuestion,
}) {
	return (
		<Card className="w-full">
			<CardHeader className="flex justify-between items-center bg-default-100 border-b border-default-200">
				<p className="text-small text-default-500">
					Question {question.index + 1} of {sectionQuestionCount}
				</p>
				<Button
					color={question.isMarked ? "warning" : "secondary"}
					variant="flat"
					size="sm"
					onClick={markCurrentQuestion}
				>
					{question.isMarked ? "Unmark" : "Mark"} Question
				</Button>
			</CardHeader>
			<CardBody className="pt-4">
				<h2 className="text-xl font-semibold mb-4">
					{question.question}
				</h2>
				<Spacer y={2} />
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
