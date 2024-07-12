"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getQuiz } from "@/lib/firestore";
import useAuthStore from "@/lib/zustand";
import Link from "next/link";

const QuizCard = ({ quiz, batchId }) => (
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
			<Link href={`/ssc/${quiz.id}?batchId=${batchId}`} passHref>
				<Button size="sm" color="primary" className="mt-2">
					Start Test
				</Button>
			</Link>
		</CardBody>
	</Card>
);

const BatchContainer = ({ batch }) => (
	<Card className="mb-4">
		<CardBody>
			<h3 className="text-lg font-semibold mb-2">{batch.title}</h3>
			<p className="text-sm mb-2">{batch.description}</p>
			<p className="text-xs mb-2">
				Topic-wise: {batch.isTopicWise ? "Yes" : "No"}
			</p>
			<div className="flex overflow-x-auto py-2">
				{batch.quizzes.map((quiz) => (
					<QuizCard key={quiz.id} quiz={quiz} batchId={batch.id} />
				))}
			</div>
		</CardBody>
	</Card>
);

const QuizBatches = () => {
	const [testBatches, setTestBatches] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
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
						if (
							!batchData.quizzes ||
							!Array.isArray(batchData.quizzes)
						) {
							console.warn(
								`Batch ${doc.id} has no quizzes or quizzes is not an array`
							);
							return {
								id: doc.id,
								...batchData,
								quizzes: [],
							};
						}
						const quizzesWithDetails = await Promise.all(
							batchData.quizzes.map(async (quizId) => {
								try {
									const quizData = await getQuiz(quizId);
									return { id: quizId, ...quizData };
								} catch (error) {
									console.error(
										`Error fetching quiz ${quizId}:`,
										error
									);
									return {
										id: quizId,
										error: "Failed to load quiz",
									};
								}
							})
						);
						return {
							id: doc.id,
							...batchData,
							quizzes: quizzesWithDetails,
						};
					})
				);
				setTestBatches(batchesData);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching test batches:", error);
				setError(
					"Failed to load quiz batches. Please try again later."
				);
				setLoading(false);
			}
		};

		fetchTestBatches();
	}, [user]);

	if (loading) return <div>Loading quiz batches...</div>;
	if (error) return <div className="text-red-500">{error}</div>;
	if (!user) return <div>Please log in to view quiz batches.</div>;

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold mb-4">Available Quiz Batches</h2>
			{testBatches.length === 0 ? (
				<p>No quiz batches available at the moment.</p>
			) : (
				testBatches.map((batch) => (
					<BatchContainer key={batch.id} batch={batch} />
				))
			)}
		</div>
	);
};

export default QuizBatches;
