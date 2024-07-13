import React, { useEffect } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import Link from "next/link";
const QuizCard = ({ quiz, onStartTest }) => {
	useEffect(() => {
		console.log("Quiz data:", quiz);
	}, [quiz]);

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
				</div>

				<Link href={`/ssc/${quiz.id}`} passHref>
					<Button size="sm" color="primary" className="mt-2">
						Start Test
					</Button>
				</Link>
			</CardBody>
		</Card>
	);
};

export default QuizCard;
