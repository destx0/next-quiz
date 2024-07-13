import React from "react";
import { Card, CardBody, Divider } from "@nextui-org/react";
import QuizCard from "./QuizCard";

const BatchContainer = ({ batch, onStartTest }) => {
	return (
		<Card className="mb-4">
			<CardBody>
				<h3 className="text-lg font-semibold mb-2">{batch.title}</h3>
				<p className="text-sm mb-2">{batch.description}</p>
				<p className="text-xs mb-2">
					Topic-wise: {batch.isTopicWise ? "Yes" : "No"}
				</p>
				<Divider className="my-2" />
				<div className="flex overflow-x-auto py-2">
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
			</CardBody>
		</Card>
	);
};

export default BatchContainer;
