import React from "react";
import { Card, CardBody, Button } from "@nextui-org/react";

const QuizCard = ({ quiz, onStartTest }) => {
	if (quiz.error) {
		return (
			<Card className="w-64 h-40 flex-shrink-0 mr-4">
				<CardBody>
					<p className="text-red-500">{quiz.error}</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card className="w-64 h-40 flex-shrink-0 mr-4">
			<CardBody className="p-3">
				<h4 className="text-sm font-medium mb-1 truncate">
					{quiz.title || "Untitled Quiz"}
				</h4>
				<p className="text-xs mb-1 truncate">{quiz.description}</p>
				<div className="text-xs">
					<p>Duration: {quiz.duration} min</p>
					<p>Sections: {quiz.sections?.length || 0}</p>
				</div>
				<Button
					size="sm"
					color="primary"
					onClick={() => onStartTest(quiz.id)}
					className="mt-2"
				>
					Start
				</Button>
			</CardBody>
		</Card>
	);
};

export default QuizCard;
