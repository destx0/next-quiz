import React, { useState, useEffect } from "react";
import {
	Card,
	CardBody,
	CardHeader,
	Button,
	Accordion,
	AccordionItem,
} from "@nextui-org/react";
import { collection, getDocs } from "firebase/firestore";
import { db, getTestBatch, getQuiz } from "@/lib/firebase"; // Adjust the import path as needed
import useAuthStore from "@/lib/zustand";

const QuizBatches = () => {
	const [testBatches, setTestBatches] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = useAuthStore();

	useEffect(() => {
		const fetchTestBatches = async () => {
			if (!user) {
				setLoading(false);
				return;
			}

			try {
				const querySnapshot = await getDocs(
					collection(db, "testBatches")
				);
				const batchesData = await Promise.all(
					querySnapshot.docs.map(async (doc) => {
						const batchData = doc.data();
						const topicsWithQuizzes = await Promise.all(
							batchData.topics.map(async (topic) => ({
								...topic,
								quizzes: await Promise.all(
									topic.quizzes.map(async (quizId) => ({
										id: quizId,
										...(await getQuiz(quizId)),
									}))
								),
							}))
						);
						return {
							id: doc.id,
							...batchData,
							topics: topicsWithQuizzes,
						};
					})
				);
				setTestBatches(batchesData);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching test batches:", error);
				setLoading(false);
			}
		};

		fetchTestBatches();
	}, [user]);

	const handleStartTest = (batchId, quizId) => {
		// Implement the logic to start the test
		console.log(`Starting test for batch ${batchId}, quiz ${quizId}`);
		// You might want to navigate to a test page or open a modal here
	};

	if (loading) {
		return <div>Loading quiz batches...</div>;
	}

	if (!user) {
		return <div>Please log in to view quiz batches.</div>;
	}

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold mb-4">Quiz Batches</h1>
			{testBatches.map((batch) => (
				<Accordion key={batch.id}>
					<AccordionItem
						key={batch.id}
						aria-label={`Test Batch: ${batch.name}`}
						title={batch.name}
					>
						<Card>
							<CardBody>
								<p>
									<strong>Description:</strong>{" "}
									{batch.description}
								</p>
								<p>
									<strong>Start Date:</strong>{" "}
									{new Date(
										batch.startDate.seconds * 1000
									).toLocaleString()}
								</p>
								<p>
									<strong>End Date:</strong>{" "}
									{new Date(
										batch.endDate.seconds * 1000
									).toLocaleString()}
								</p>
								{batch.topics.map((topic) => (
									<div key={topic.name} className="mt-4">
										<h3 className="text-lg font-semibold">
											{topic.name}
										</h3>
										{topic.quizzes.map((quiz) => (
											<Card
												key={quiz.id}
												className="mt-2"
											>
												<CardHeader>
													<h4 className="text-md font-medium">
														{quiz.title}
													</h4>
												</CardHeader>
												<CardBody>
													<p>
														<strong>
															Description:
														</strong>{" "}
														{quiz.description}
													</p>
													<p>
														<strong>
															Duration:
														</strong>{" "}
														{quiz.duration} minutes
													</p>
													<p>
														<strong>
															Positive Score:
														</strong>{" "}
														{quiz.positiveScore}
													</p>
													<p>
														<strong>
															Negative Score:
														</strong>{" "}
														{quiz.negativeScore}
													</p>
													<p>
														<strong>
															Number of Sections:
														</strong>{" "}
														{quiz.sections.length}
													</p>
													<Button
														color="primary"
														onClick={() =>
															handleStartTest(
																batch.id,
																quiz.id
															)
														}
														className="mt-2"
													>
														Start Test
													</Button>
												</CardBody>
											</Card>
										))}
									</div>
								))}
							</CardBody>
						</Card>
					</AccordionItem>
				</Accordion>
			))}
		</div>
	);
};

export default QuizBatches;
