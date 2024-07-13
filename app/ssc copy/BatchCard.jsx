import React from "react";
import { Card, CardBody, ScrollShadow } from "@nextui-org/react";
import QuizCard from "./QuizCard";

const BatchCard = ({ batch, onStartTest }) => {
	return (
		<Card className="w-full mb-4">
			<CardBody>
				<h3 className="text-lg font-semibold mb-2">{batch.title}</h3>
				<p className="text-sm mb-2">{batch.description}</p>
				<p className="text-sm mb-2">
					Topic-wise: {batch.isTopicWise ? "Yes" : "No"}
				</p>
				<ScrollShadow className="w-full" orientation="horizontal">
					<div className="flex overflow-x-auto pb-2">
						{batch.quizzes.map((quiz) => (
							<QuizCard
								key={quiz.id}
								quiz={quiz}
								onStartTest={(quizId) =>
									onStartTest(batch.id, quizId)
								}
							/>
						))}
					</div>
				</ScrollShadow>
			</CardBody>
		</Card>
	);
};

export default BatchCard;
