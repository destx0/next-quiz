import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getQuiz } from "@/lib/firestore";
import useAuthStore from "@/lib/zustand";
import QuizCard from "./QuizCard"; 

const BatchContainer = ({ batch }) => (
	<Card className="mb-8 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl">
		<CardBody className="p-6">
			<h2 className="text-2xl font-bold mb-4 transition-all duration-300 ease-in-out hover:text-primary">
				{batch.title}
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{batch.quizzes.map((quiz, index) => (
					<QuizCard key={quiz.id} quiz={quiz} index={index} />
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
							return { id: doc.id, ...batchData, quizzes: [] };
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

	if (loading)
		return (
			<div className="text-center py-8 text-xl">
				Loading quiz batches...
			</div>
		);
	if (error)
		return (
			<div className="text-center py-8 text-xl text-red-500">{error}</div>
		);
	if (!user)
		return (
			<div className="text-center py-8 text-xl">
				Please log in to view quiz batches.
			</div>
		);

	return (
		<div className="space-y-8 -mt-6 min-h-screen">
			<h2 className="text-3xl font-bold"></h2>
			{testBatches.length === 0 ? (
				<p className="text-center text-xl">
					No quiz batches available at the moment.
				</p>
			) : (
				testBatches.map((batch) => (
					<BatchContainer key={batch.id} batch={batch} />
				))
			)}
		</div>
	);
};

export default QuizBatches;
